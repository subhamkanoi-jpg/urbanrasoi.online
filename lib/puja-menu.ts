/**
 * Sawan · Rudra Abhishek family get-together menu.
 * A fixed satvik menu priced per guest-block, unlike the à la carte menu.
 */

export const pujaMenu = {
  badge: 'Sawan · Rudra Abhishek Menu',
  title: 'Family Get-Together Catering',
  promise:
    'For the gathering after the puja — when the whole family is home, and nobody should be in the kitchen.',
  courses: [
    { name: 'Drinks', items: ['Kulhad Bela Sherbat'] },
    { name: 'Appetizers', items: ['Mediterranean Kalmi Vada', 'Bite-size Raj Kachori Chaat'] },
    {
      name: 'Main Course',
      items: ['Belwa Kachori / Mixed Paratha', 'Banarasi Aloo Dum', 'Paneer Jhalfrezi', 'Kadhi with Jeera Pulao'],
    },
    { name: 'Accompaniments', items: ['Dahi Vada', 'Aachar', 'Papad', 'Salad', 'Mint & Imli Chutney'] },
    { name: 'Dessert', items: ['Kesariya Kheer'] },
  ],
  addOnCourse: { name: 'Add-ons', items: ['Kulhad Chai'] },
  satvikNote: 'Satvik · No Onion · No Garlic',
  closingLine: ['you stay in the puja.', 'we take care of the bhojan.'],
  ekadashiNote: 'Ekadashi cuisine available on request.',
} as const

/* ---- Pricing ---------------------------------------------------------- */

export const BASE_PAX = 40
export const BASE_PRICE = 30_000
export const STEP_PAX = 10
export const STEP_PRICE = 7_000
export const MAX_PAX = 300

/** Price for a guest count. Extra guests bill in blocks of 10. */
export function priceForPax(pax: number): number {
  if (pax <= BASE_PAX) return BASE_PRICE
  const extraBlocks = Math.ceil((pax - BASE_PAX) / STEP_PAX)
  return BASE_PRICE + extraBlocks * STEP_PRICE
}

/** Effective per-guest rate — falls as the party grows, which is worth showing. */
export function perGuest(pax: number): number {
  return Math.round(priceForPax(pax) / Math.max(pax, 1))
}

export const inclusions = [
  { title: '2 kitchen staff', detail: 'Cooking and finishing on-site' },
  { title: '2 stewards', detail: 'Serving your guests through the event' },
  { title: 'Disposables', detail: 'Plates, cutlery and serveware included' },
  { title: 'Full setup', detail: 'We arrive, set up, serve and clear' },
]

export const guestPresets = [40, 50, 60, 80, 100, 150]

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}
