import { PICKUP_TIME_SLOTS } from '@/lib/rakhi-menu'

/**
 * Order capture for the Raksha Bandhan pickup day.
 *
 * Everything is collected on one date, so the axis that matters for the
 * kitchen is time of day. Guests pick a precise half-hour slot — that keeps
 * collection orderly — but nobody cooks in half-hour steps, so each slot is
 * folded into the prep wave it belongs to.
 */

export const PREP_WINDOWS = [
  { id: '10:00 AM', covers: '10:00 – 11:30' },
  { id: '12:00 PM', covers: '12:00 – 1:30' },
  { id: '02:00 PM', covers: '2:00 – 3:30' },
  { id: '04:00 PM', covers: '4:00 – 5:30' },
  { id: '06:00 PM', covers: '6:00 – 7:00' },
] as const

export type PrepWindowId = (typeof PREP_WINDOWS)[number]['id']

/** "02:30 PM" -> minutes since midnight. Returns null on anything unexpected. */
function slotToMinutes(slot: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim())
  if (!match) return null
  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hours += 12
  return hours * 60 + Number(match[2])
}

const WINDOW_STARTS = PREP_WINDOWS.map((w) => ({ id: w.id, start: slotToMinutes(w.id)! }))

/**
 * The wave a pickup belongs to: the latest window that opens at or before the
 * slot. An 11:30 collection is cooked with the 10:00 wave.
 */
export function prepWindowFor(slot: string): PrepWindowId {
  const minutes = slotToMinutes(slot)
  if (minutes == null) return PREP_WINDOWS[0].id
  let current: PrepWindowId = PREP_WINDOWS[0].id
  for (const window of WINDOW_STARTS) {
    if (minutes >= window.start) current = window.id as PrepWindowId
  }
  return current
}

/** Every slot the form offers, with the wave it rolls into. */
export const SLOT_TO_WINDOW: Record<string, PrepWindowId> = Object.fromEntries(
  PICKUP_TIME_SLOTS.map((slot) => [slot, prepWindowFor(slot)]),
)

export type RakhiOrderLine = {
  id: string
  name: string
  section: string
  unit: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export type RakhiOrderPayload = {
  customer: string
  phone: string
  pickupSlot: string
  prepWindow: string
  note: string
  lines: RakhiOrderLine[]
  pieces: number
  itemTotal: number
  discount: number
  toPay: number
  placedAt: string
  source: string
}

/** Shape check for the payload arriving at the API route. */
export function isValidOrderPayload(value: unknown): value is RakhiOrderPayload {
  if (typeof value !== 'object' || value === null) return false
  const order = value as Partial<RakhiOrderPayload>
  return (
    typeof order.customer === 'string' &&
    order.customer.trim().length > 0 &&
    typeof order.pickupSlot === 'string' &&
    Array.isArray(order.lines) &&
    order.lines.length > 0 &&
    order.lines.every(
      (line) =>
        typeof line?.name === 'string' &&
        Number.isFinite(line?.qty) &&
        Number.isFinite(line?.lineTotal),
    ) &&
    Number.isFinite(order.itemTotal) &&
    Number.isFinite(order.toPay)
  )
}
