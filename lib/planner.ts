export type ServiceId = 'delivery' | 'semi' | 'full' | 'unsure'

export type Plan = {
  occasion?: string
  guests: number
  date?: string
  dateFlexible?: boolean
  service?: ServiceId
  cuisines: string[]
  pureVeg: boolean
  note?: string
  name?: string
  area?: string
}

export const emptyPlan: Plan = {
  guests: 25,
  cuisines: [],
  pureVeg: false,
}

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
  { id: 'semi' as const, label: 'Semi service', detail: 'Plus kitchen & serving staff', fromPlate: 849 },
  { id: 'full' as const, label: 'Full service', detail: 'Staff, crockery, setup — everything', fromPlate: 999 },
  { id: 'unsure' as const, label: 'Help me choose', detail: 'We will suggest what fits', fromPlate: null },
]

export const cuisineOptions = [
  'Homestyle Indian',
  'Bengali',
  'South Indian',
  'Indo-Chinese',
  'Continental',
  'Finger food & grazing',
  'Desserts',
]

/* Per-guest price bands from the Celebration Menu builder (menu.html):
   Intimate 749/849/999, Signature 849/949/1199 for delivery/semi/full. */
const plateBands: Record<ServiceId, [number, number]> = {
  delivery: [749, 849],
  semi: [849, 949],
  full: [999, 1199],
  unsure: [749, 1199],
}

export const CELEBRATION_MIN_GUESTS = 25
export const GRAZING_MIN_GUESTS = 15

export function getOccasion(idOrLabel: string | undefined) {
  if (!idOrLabel) return undefined
  const needle = idOrLabel.trim().toLowerCase()
  return occasions.find((o) => o.id === needle || o.label.toLowerCase() === needle)
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN')
}

export type Estimate = { perGuest: [number, number]; total: [number, number] }

export function estimatePlan(plan: Plan): Estimate | null {
  if (plan.guests < CELEBRATION_MIN_GUESTS) return null
  const band = plateBands[plan.service ?? 'unsure']
  return {
    perGuest: band,
    total: [band[0] * plan.guests, band[1] * plan.guests],
  }
}

export function guestNote(guests: number): string {
  if (guests < GRAZING_MIN_GUESTS) return 'An intimate one — we will tailor a custom menu.'
  if (guests < CELEBRATION_MIN_GUESTS) return 'Perfect size for a grazing table.'
  if (guests >= 100) return 'A big one! We have fed 200+ without breaking a sweat.'
  return `Celebration menus unlock — from ${formatINR(plateBands.delivery[0])} a guest.`
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
  const estimate = estimatePlan(plan)

  const lines = ['Hi Urban Rasoi! 🧡 Here is my party plan:', '']
  if (plan.name) lines.push(`🙋 Name: ${plan.name}`)
  lines.push(`🎉 Occasion: ${occasion?.label ?? 'Celebration'}`)
  lines.push(`🗓️ Date: ${plan.dateFlexible || !plan.date ? 'Still deciding' : prettyDate(plan.date)}`)
  lines.push(`👥 Guests: ${plan.guests}${plan.guests >= 100 ? '+' : ''}`)
  if (service) lines.push(`🍽️ Service: ${service.id === 'unsure' ? 'Open to suggestions' : `${service.label} — ${service.detail}`}`)
  if (plan.cuisines.length) lines.push(`🥘 Food mood: ${plan.cuisines.join(', ')}`)
  if (plan.pureVeg) lines.push('🌱 Pure veg')
  if (plan.note) lines.push(`📝 Note: ${plan.note}`)
  if (plan.area) lines.push(`📍 Area: ${plan.area}`)
  if (estimate) {
    lines.push('', `Estimate shown on site: ${formatINR(estimate.total[0])}–${formatINR(estimate.total[1])} (${formatINR(estimate.perGuest[0])}–${formatINR(estimate.perGuest[1])}/guest)`)
  }
  lines.push('', 'Please share menus and availability!')
  return lines.join('\n')
}
