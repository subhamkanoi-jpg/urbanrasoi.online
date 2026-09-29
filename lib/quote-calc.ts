import { findQuoteMenuItem, QUOTE_COURSES, type QuoteCourse, type QuoteUnit } from './quote-menu'

/**
 * Quote arithmetic, shared by the builder, the API (which stores the final
 * figure it computes itself) and the tests.
 *
 * The discount is one line on the whole quote. It never appears against a
 * dish: hosts compare dish prices with the menu, so those stay at list price.
 */

export type QuoteLine = {
  id: string
  name: string
  course: QuoteCourse
  per: number
  unit: QuoteUnit
  /** Rupees per portion, or per person for service staff. */
  rate: number
  /** Portions, or people for service staff. */
  portions: number
  /** False for dishes typed in by hand rather than picked from the menu. */
  onMenu: boolean
}

export type Rounding = 'none' | 'n10' | 'n50' | 'n100' | 'd100'

export type QuoteData = {
  client: string
  eventDate: string
  guests: string
  venue: string
  quoteDate: string
  discountPct: number
  discountOn: 'food' | 'all'
  rounding: Rounding
  showPrices: boolean
  notes: string
  lines: QuoteLine[]
}

export type QuoteTotals = {
  food: number
  service: number
  subtotal: number
  discount: number
  total: number
  final: number
}

const num = (value: unknown) => {
  const n = typeof value === 'number' ? value : parseFloat(String(value))
  return Number.isFinite(n) ? n : 0
}

export const lineAmount = (line: Pick<QuoteLine, 'rate' | 'portions'>) => num(line.rate) * num(line.portions)

export function roundQuote(total: number, rounding: Rounding): number {
  switch (rounding) {
    case 'n10':
      return Math.round(total / 10) * 10
    case 'n50':
      return Math.round(total / 50) * 50
    case 'n100':
      return Math.round(total / 100) * 100
    case 'd100':
      return Math.floor(total / 100) * 100
    default:
      return Math.round(total)
  }
}

export function quoteTotals(data: Pick<QuoteData, 'lines' | 'discountPct' | 'discountOn' | 'rounding'>): QuoteTotals {
  let food = 0
  let service = 0
  for (const line of data.lines) {
    if (line.course === 'Service') service += lineAmount(line)
    else food += lineAmount(line)
  }
  const subtotal = food + service
  const pct = Math.min(100, Math.max(0, num(data.discountPct)))
  const base = data.discountOn === 'all' ? subtotal : food
  const discount = Math.round(base * pct) / 100
  const total = subtotal - discount
  return { food, service, subtotal, discount, total, final: roundQuote(total, data.rounding) }
}

/** "48 pcs", "4 L", "750 ml", "2 people". */
export function quantityLabel(line: Pick<QuoteLine, 'per' | 'unit' | 'portions'>): string {
  const q = num(line.per) * num(line.portions)
  switch (line.unit) {
    case 'ml':
      return q >= 1000 ? `${(Math.round(q / 100) / 10).toLocaleString('en-IN')} L` : `${q} ml`
    case 'person':
      return `${q} ${q === 1 ? 'person' : 'people'}`
    case 'portion':
      return `${q} ${q === 1 ? 'portion' : 'portions'}`
    default:
      return `${q.toLocaleString('en-IN')} pcs`
  }
}

export function portionLabel(line: Pick<QuoteLine, 'per' | 'unit'>): string {
  if (line.unit === 'person') return '3–4 hrs each'
  if (line.unit === 'portion') return 'per portion'
  return `${line.per} ${line.unit} / portion`
}

export const formatInr = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`

export function discountLabel(data: Pick<QuoteData, 'discountPct' | 'discountOn'>, totals: QuoteTotals): string {
  const onFood = data.discountOn === 'food' && totals.service > 0
  return `Discount (${num(data.discountPct)}%${onFood ? ' on food' : ''})`
}

let seq = 0
export const newLineId = () => `l${Date.now().toString(36)}${(++seq).toString(36)}${Math.random().toString(36).slice(2, 5)}`

export function lineFromMenu(name: string, portions: number): QuoteLine {
  const item = findQuoteMenuItem(name)
  if (!item) throw new Error(`Not on the house party menu: ${name}`)
  return { id: newLineId(), name: item.name, course: item.course, per: item.per, unit: item.unit, rate: item.rate, portions, onMenu: true }
}

export const DEFAULT_NOTES = [
  'Delivery charges as per actuals.',
  'Backend service personnel for 3–4 hours; overtime and night-time charges apply as needed.',
  'Some items arrive semi-cooked and are finished on-site in your kitchen.',
  'This quote is valid for 7 days.',
].join('\n')

/** Today in Kolkata as YYYY-MM-DD, independent of the server's timezone. */
export function todayInKolkata(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now)
}

/** The standard eight-guest house party spread every new quote starts from. */
export function starterQuote(): QuoteData {
  const eight = (name: string) => lineFromMenu(name, 8)
  return {
    client: '',
    eventDate: '',
    guests: '',
    venue: '',
    quoteDate: todayInKolkata(),
    discountPct: 7.5,
    discountOn: 'food',
    rounding: 'n100',
    showPrices: true,
    notes: DEFAULT_NOTES,
    lines: [
      eight('Cheese & Corn Samosa'),
      eight('Achari Paneer Tikka'),
      eight('Tandoori Stuffed Aloo Tikka'),
      eight('Palak Patta Chaat'),
      eight('Chola Tikki Chaat'),
      eight('Kashmiri Aloo Dum'),
      eight('Pindi Chana Masala'),
      // Not on the current menu; priced alongside Pindi Chana Masala.
      { id: newLineId(), name: 'Dal Makhani', course: 'Mains', per: 500, unit: 'ml', rate: 320, portions: 8, onMenu: false },
      eight('Masala Kulcha'),
      eight('Pudina Lachha Paratha'),
      eight('Vegetable Pulao'),
      eight('Dal-Badam Halwa'),
      lineFromMenu('Backend Service Personnel', 2),
    ],
  }
}

const UNITS: QuoteUnit[] = ['pcs', 'ml', 'portion', 'person']
const ROUNDINGS: Rounding[] = ['none', 'n10', 'n50', 'n100', 'd100']
const MAX_LINES = 200

const str = (value: unknown, max = 500) => (typeof value === 'string' ? value.slice(0, max) : '')
const isoDate = (value: unknown) => (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '')

/**
 * Coerce whatever arrived at the API into a well-formed quote, or null if it
 * is not a quote at all. Numbers are clamped so a typo cannot store nonsense.
 */
export function sanitizeQuote(value: unknown): QuoteData | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>
  if (!Array.isArray(raw.lines) || raw.lines.length > MAX_LINES) return null

  const lines: QuoteLine[] = []
  for (const entry of raw.lines) {
    if (typeof entry !== 'object' || entry === null) return null
    const l = entry as Record<string, unknown>
    const name = str(l.name, 120).trim()
    if (!name) return null
    lines.push({
      id: str(l.id, 40) || newLineId(),
      name,
      course: (QUOTE_COURSES as readonly string[]).includes(l.course as string) ? (l.course as QuoteCourse) : 'Mains',
      per: Math.max(0, Math.min(100000, num(l.per))),
      unit: UNITS.includes(l.unit as QuoteUnit) ? (l.unit as QuoteUnit) : 'pcs',
      rate: Math.max(0, Math.min(1000000, num(l.rate))),
      portions: Math.max(0, Math.min(10000, num(l.portions))),
      onMenu: l.onMenu !== false,
    })
  }

  return {
    client: str(raw.client, 120),
    eventDate: isoDate(raw.eventDate),
    guests: str(raw.guests, 12),
    venue: str(raw.venue, 160),
    quoteDate: isoDate(raw.quoteDate) || todayInKolkata(),
    discountPct: Math.max(0, Math.min(100, num(raw.discountPct))),
    discountOn: raw.discountOn === 'all' ? 'all' : 'food',
    rounding: ROUNDINGS.includes(raw.rounding as Rounding) ? (raw.rounding as Rounding) : 'n100',
    showPrices: raw.showPrices !== false,
    notes: str(raw.notes, 2000),
    lines,
  }
}

/** UR-260929-03: the date in Kolkata plus that day's running count. */
export function formatQuoteNumber(day: string, count: number): string {
  return `UR-${day.replace(/-/g, '').slice(2)}-${String(count).padStart(2, '0')}`
}
