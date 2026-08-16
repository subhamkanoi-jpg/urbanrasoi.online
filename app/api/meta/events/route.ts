import { NextRequest, NextResponse } from 'next/server'
import { isAllowedCapiEvent, isAllowedCapiRequest, sanitizeCustomData } from '@/lib/meta-capi'

const GRAPH_VERSION = 'v21.0'
const hits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 40
const WINDOW_MS = 60_000

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const current = hits.get(ip)
  if (!current || now > current.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > RATE_LIMIT
}

/**
 * Forwards browser events to the Meta Conversions API so campaigns keep
 * receiving signal when the browser pixel is blocked or throttled (iOS,
 * ad blockers). Deduplicated against the pixel via the shared event ID.
 *
 * Requires META_CONVERSIONS_API_TOKEN (and a pixel ID) in the environment;
 * without them the route is a silent no-op so the site works unchanged.
 */
export async function POST(request: NextRequest) {
  if (
    !isAllowedCapiRequest({
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      secFetchSite: request.headers.get('sec-fetch-site'),
    })
  ) {
    return NextResponse.json({ forwarded: false }, { status: 403 })
  }

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(clientIp)) {
    return NextResponse.json({ forwarded: false }, { status: 429 })
  }

  const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN
  if (!pixelId || !accessToken) return NextResponse.json({ forwarded: false })

  let body: {
    eventName?: string
    eventId?: string
    sourceUrl?: string
    fbclid?: string
    customData?: Record<string, unknown>
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ forwarded: false }, { status: 400 })
  }

  const eventName = body.eventName ?? ''
  if (!isAllowedCapiEvent(eventName)) {
    return NextResponse.json({ forwarded: false }, { status: 400 })
  }

  const fbp = request.cookies.get('_fbp')?.value
  const fbcCookie = request.cookies.get('_fbc')?.value
  const fbc =
    fbcCookie ?? (typeof body.fbclid === 'string' && body.fbclid ? `fb.1.${Date.now()}.${body.fbclid}` : undefined)
  const userAgent = request.headers.get('user-agent') ?? undefined
  const customData = sanitizeCustomData(body.customData)

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: typeof body.eventId === 'string' ? body.eventId.slice(0, 80) : undefined,
        action_source: 'website',
        event_source_url: typeof body.sourceUrl === 'string' ? body.sourceUrl.slice(0, 500) : undefined,
        user_data: {
          client_ip_address: clientIp === 'unknown' ? undefined : clientIp,
          client_user_agent: userAgent,
          fbp,
          fbc,
        },
        custom_data: customData,
      },
    ],
  }
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )
    return NextResponse.json({ forwarded: response.ok })
  } catch {
    return NextResponse.json({ forwarded: false })
  }
}
