import {
  getPackage,
  packagesForGuests,
  slotItemName,
  slotsForPackage,
} from './party-packages'

export type ServiceId = 'delivery' | 'buffet' | 'live'
export type BudgetId = 'intimate' | 'signature'

export type Plan = {
  occasion?: string
  guests: number
  service?: ServiceId
  budget?: BudgetId
  packageId?: string
  slots: { slotId: string; itemId: string }[]
  date?: string
  dateFlexible?: boolean
  note?: string
  name?: string
  area?: string
}

export const emptyPlan: Plan = { guests: 25, slots: [] }

export const occasions = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'house-party', label: 'House party', emoji: '🥂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍' },
  { id: 'festive', label: 'Festive / Puja', emoji: '🪔' },
  { id: 'office', label: 'Office party', emoji: '💼' },
  { id: 'grazing', label: 'Grazing table', emoji: '🧀' },
  { id: 'other', label: 'Something else', emoji: '✨' },
] as const

export const services = [
  { id: 'delivery' as const, label: 'Delivery', detail: 'We deliver hot, you plate up', fromPlate: 749 },
  { id: 'buffet' as const, label: 'Buffet', detail: 'Warmers, kitchen & serving staff', fromPlate: 849 },
  { id: 'live' as const, label: 'Live', detail: 'One live counter at the venue', fromPlate: 999 },
]

export const budgets = [
  { id: 'intimate' as const, label: 'Intimate', blurb: 'Our classic plate — same dishes, the lower rate.' },
  { id: 'signature' as const, label: 'Signature', blurb: 'Richer hosting, not more courses. Same menu shape.' },
]

const PRICE: Record<ServiceId, Record<BudgetId, number>> = {
  delivery: { intimate: 749, signature: 849 },
  buffet: { intimate: 849, signature: 949 },
  live: { intimate: 999, signature: 1199 },
}

export const CELEBRATION_MIN_GUESTS = 25
export const GRAZING_MIN_GUESTS = 15

export const ALL_STEPS = ['occasion', 'guests', 'service', 'budget', 'package', 'customise', 'summary'] as const
export type Step = (typeof ALL_STEPS)[number]

export function stepsFor(guests: number): readonly Step[] {
  if (guests < GRAZING_MIN_GUESTS) return ['occasion', 'guests', 'summary']
  return ALL_STEPS
}

export function billedGuests(guests: number): number {
  return guests >= 100 ? 100 : guests
}

export function perGuestPrice(service: ServiceId, budget: BudgetId): number {
  return PRICE[service][budget]
}

export type Estimate = { perGuest: number; total: number }

export function estimatePlan(plan: Plan): Estimate | null {
  if (plan.guests < GRAZING_MIN_GUESTS) return null
  if (!plan.service || !plan.budget || !plan.packageId) return null
  if (!packagesForGuests(plan.guests).some((p) => p.id === plan.packageId)) return null
  const perGuest = perGuestPrice(plan.service, plan.budget)
  return { perGuest, total: perGuest * billedGuests(plan.guests) }
}

export function canSendPlan(plan: Plan): boolean {
  if (!plan.occasion) return false
  if (plan.guests < GRAZING_MIN_GUESTS) return true
  if (!plan.service || !plan.budget || !plan.packageId) return false
  if (!packagesForGuests(plan.guests).some((p) => p.id === plan.packageId)) return false
  const pkg = getPackage(plan.packageId)
  if (!pkg) return false
  const expected = slotsForPackage(pkg, plan.service)
  if (expected.length === 0) return false
  return expected.every((slot) => plan.slots.some((s) => s.slotId === slot.slotId && s.itemId))
}

export function applyGuests(plan: Plan, guests: number): { plan: Plan; cleared: boolean } {
  const next = Math.min(500, Math.max(5, guests))
  if (next < GRAZING_MIN_GUESTS) {
    const cleared = Boolean(plan.packageId || plan.slots.length)
    return {
      plan: {
        ...plan,
        guests: next,
        service: undefined,
        budget: undefined,
        packageId: undefined,
        slots: [],
      },
      cleared,
    }
  }
  const stillOk = !plan.packageId || packagesForGuests(next).some((p) => p.id === plan.packageId)
  if (stillOk) return { plan: { ...plan, guests: next }, cleared: false }
  return { plan: { ...plan, guests: next, packageId: undefined, slots: [] }, cleared: true }
}

export function applyService(plan: Plan, service: ServiceId): Plan {
  const pkg = getPackage(plan.packageId)
  if (!pkg) return { ...plan, service }
  const food = plan.slots.filter((s) => s.slotId !== 'live')
  if (service !== 'live') return { ...plan, service, slots: food }
  const existing = plan.slots.find((s) => s.slotId === 'live')
  return {
    ...plan,
    service,
    slots: [...food, { slotId: 'live', itemId: existing?.itemId ?? pkg.defaultLiveId }],
  }
}

export function selectPackage(plan: Plan, packageId: string): Plan {
  const pkg = getPackage(packageId)
  if (!pkg) return plan
  if (!packagesForGuests(plan.guests).some((p) => p.id === packageId)) return plan
  const service = plan.service ?? 'delivery'
  const defaults = slotsForPackage(pkg, service).map((s) => ({ slotId: s.slotId, itemId: s.itemId }))
  if (plan.packageId !== packageId) return { ...plan, packageId, slots: defaults }
  const kept = new Map(plan.slots.map((s) => [s.slotId, s.itemId]))
  return {
    ...plan,
    packageId,
    slots: defaults.map((s) => ({ slotId: s.slotId, itemId: kept.get(s.slotId) ?? s.itemId })),
  }
}

export function swapSlot(plan: Plan, slotId: string, itemId: string): Plan {
  return {
    ...plan,
    slots: plan.slots.map((s) => (s.slotId === slotId ? { ...s, itemId } : s)),
  }
}

export function guestNote(guests: number): string {
  if (guests < GRAZING_MIN_GUESTS) return 'Under 15 — we will tailor a custom menu on WhatsApp. No package price yet.'
  if (guests < CELEBRATION_MIN_GUESTS) return 'Grazing and live-led menus. Plated combos open from 25 guests.'
  if (guests >= 100) return 'A big one! We have fed 200+ without breaking a sweat.'
  return `Plated menus are open — from ${formatINR(PRICE.delivery.intimate)} a guest.`
}

export function getOccasion(idOrLabel: string | undefined) {
  if (!idOrLabel) return undefined
  const needle = idOrLabel.trim().toLowerCase()
  return occasions.find((o) => o.id === needle || o.label.toLowerCase() === needle)
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN')
}

export function daysUntil(iso: string): number {
  const target = new Date(iso + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function dateNote(iso: string): string | null {
  const days = daysUntil(iso)
  if (Number.isNaN(days)) return null
  if (days < 0) return 'That date has passed — pick another?'
  if (days === 0) return 'Today?! Call us right now and we will see what magic is possible.'
  if (days <= 2) return 'That is really soon — send your plan and we will jump on it.'
  const day = new Date(iso + 'T00:00:00').getDay()
  if (day === 6 || day === 0) return 'A weekend — prime party time. Dates fill fast.'
  if (days > 60) return 'Lovely and early — you get first pick of our calendar.'
  return null
}

export function nextWeekendISO(weeksAhead = 0): string {
  const d = new Date()
  const daysToSaturday = ((6 - d.getDay()) + 7) % 7 || 7
  d.setDate(d.getDate() + daysToSaturday + weeksAhead * 7)
  return d.toISOString().slice(0, 10)
}

export function prettyDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function composeWhatsappMessage(plan: Plan): string {
  const occasion = getOccasion(plan.occasion)
  const service = services.find((s) => s.id === plan.service)
  const budget = budgets.find((b) => b.id === plan.budget)
  const pkg = getPackage(plan.packageId)
  const estimate = estimatePlan(plan)

  const lines = ['Hi Urban Rasoi! 🧡 Here is my party plan:', '']
  if (plan.name) lines.push(`🙋 Name: ${plan.name}`)
  lines.push(`🎉 Occasion: ${occasion?.label ?? 'Celebration'}`)
  if (plan.dateFlexible) lines.push('🗓️ Date: Still deciding')
  else if (plan.date) lines.push(`🗓️ Date: ${prettyDate(plan.date)}`)
  lines.push(`👥 Guests: ${plan.guests}${plan.guests >= 100 ? '+' : ''}`)
  if (plan.guests >= GRAZING_MIN_GUESTS) {
    if (service) lines.push(`🍽️ Service: ${service.label} — ${service.detail}`)
    if (budget) lines.push(`✨ Budget: ${budget.label}`)
    if (pkg) lines.push(`🥘 Package: ${pkg.name}`)
  }
  if (plan.guests >= GRAZING_MIN_GUESTS && plan.slots.length) {
    lines.push('📋 Menu:')
    for (const slot of plan.slots) {
      lines.push(`- ${slotItemName(slot.itemId)}`)
    }
  }
  if (plan.note) lines.push(`📝 Note: ${plan.note}`)
  if (plan.area) lines.push(`📍 Area: ${plan.area}`)
  if (estimate) {
    lines.push(
      '',
      `Package price: ${formatINR(estimate.total)} (${formatINR(estimate.perGuest)}/guest)`,
    )
  }
  lines.push('', 'Please confirm date and delivery. We will take payment on WhatsApp.')
  return lines.join('\n')
}
