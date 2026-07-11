import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_EVENTS = new Set(['Lead', 'Contact', 'ViewContent'])
const GRAPH_VERSION = 'v21.0'

/**
 * Forwards browser events to the Meta Conversions API so campaigns keep
 * receiving signal when the browser pixel is blocked or throttled (iOS,
 * ad blockers). Deduplicated against the pixel via the shared event ID.
 *
 * Requires META_CONVERSIONS_API_TOKEN (and a pixel ID) in the environment;
 * without them the route is a silent no-op so the site works unchanged.
 */
export async function POST(request: NextRequest) {
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
  if (!ALLOWED_EVENTS.has(eventName)) {
    return NextResponse.json({ forwarded: false }, { status: 400 })
  }

  const fbp = request.cookies.get('_fbp')?.value
  const fbcCookie = request.cookies.get('_fbc')?.value
  const fbc =
    fbcCookie ?? (typeof body.fbclid === 'string' && body.fbclid ? `fb.1.${Date.now()}.${body.fbclid}` : undefined)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const userAgent = request.headers.get('user-agent') ?? undefined

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.eventId,
        action_source: 'website',
        event_source_url: body.sourceUrl,
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fbp,
          fbc,
        },
        custom_data: body.customData,
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
