import { NextResponse } from 'next/server'
import { isValidOrderPayload, prepWindowFor } from '@/lib/rakhi-orders'

/**
 * Records a Raksha Bandhan order into the operations sheet.
 *
 * This is deliberately best-effort. The customer's real order is the WhatsApp
 * message they send a moment later, so a sheet outage must never cost them the
 * order — every failure here returns 200 with no id, and the page carries on.
 * A missing id simply means Varun matches that WhatsApp message by name.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SHEET_TIMEOUT_MS = 6000

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad-json' }, { status: 400 })
  }

  if (!isValidOrderPayload(payload)) {
    return NextResponse.json({ ok: false, error: 'bad-payload' }, { status: 400 })
  }

  const endpoint = process.env.RAKHI_SHEET_WEBHOOK_URL
  if (!endpoint) {
    // Not wired up yet — say so plainly rather than pretending it was saved.
    console.warn('[rakhi] RAKHI_SHEET_WEBHOOK_URL is not set; order not recorded')
    return NextResponse.json({ ok: false, error: 'not-configured' })
  }

  // Recompute the prep wave server-side; never trust the client for the field
  // the kitchen actually cooks against.
  const record = {
    ...payload,
    prepWindow: prepWindowFor(payload.pickupSlot),
    placedAt: new Date().toISOString(),
    secret: process.env.RAKHI_SHEET_SECRET ?? '',
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
      // Apps Script answers a POST with a redirect to its result payload.
      redirect: 'follow',
    })

    if (!response.ok) {
      console.error('[rakhi] sheet responded', response.status)
      return NextResponse.json({ ok: false, error: 'sheet-error' })
    }

    const result = (await response.json().catch(() => null)) as { orderId?: string } | null
    return NextResponse.json({ ok: true, orderId: result?.orderId ?? null })
  } catch (error) {
    console.error('[rakhi] could not reach sheet', error)
    return NextResponse.json({ ok: false, error: 'unreachable' })
  }
}
