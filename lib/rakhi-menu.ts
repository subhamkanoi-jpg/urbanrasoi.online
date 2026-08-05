/**
 * Raksha Bandhan 2026 festive menu for Urban Rasoi.
 * Pickup only — AE-287, Salt Lake Sector-1, Kolkata.
 * Fixed pickup date: 28 August 2026.
 * Minimum order value: ₹3,000.
 */

export const RAKHI_MIN_ORDER = 3000
export const RAKHI_PICKUP_DATE = '28 August 2026'
export const RAKHI_PICKUP_DATE_VALUE = '2026-08-28'
export const RAKHI_PICKUP_ADDRESS = 'Urban Rasoi, AE-287, Saltlake Sector-1, Kolkata'
export const RAKHI_WHATSAPP = '919830725556'

export type RakhiItem = {
  id: string
  name: string
  unit: string
  price: number
}

export type RakhiSection = {
  id: string
  name: string
  items: RakhiItem[]
}

export const rakhiSections: RakhiSection[] = [
  {
    id: 'appetisers',
    name: 'Appetisers',
    items: [
      { id: 'mushroom-galouti-sliders', name: 'Mushroom Galouti Charcoal Sliders', unit: '6 pcs', price: 660 },
      { id: 'ulta-paratha-kebab', name: 'Ulta Paratha with Kebab Croquettes', unit: '6 pcs', price: 440 },
      { id: 'mini-dabeli-sliders', name: 'Mini Dabeli Sliders', unit: '6 pcs', price: 450 },
      { id: 'cheesy-veg-cigar-rolls', name: 'Cheesy Veg Cigar Rolls', unit: '6 pcs', price: 390 },
      { id: 'bite-sized-quesadilla', name: 'Bite Sized Quesadilla', unit: '4 pcs', price: 330 },
      { id: 'bite-sized-farmhouse-pizza', name: 'Bite Sized Farmhouse Pizza', unit: '4 pcs', price: 280 },
      { id: 'tandoori-paneer-naanza', name: 'Tandoori Paneer Naanza', unit: '5 pcs', price: 440 },
    ],
  },
  {
    id: 'baked-dish',
    name: 'Baked Dish',
    items: [
      { id: 'spinach-ricotta-ravioli', name: 'Spinach & Ricotta Ravioli', unit: '750 ml', price: 450 },
      { id: 'spaghetti-au-gratin', name: 'Spaghetti Au Gratin', unit: '750 ml', price: 370 },
    ],
  },
  {
    id: 'healthy-bites',
    name: 'Healthy Bites',
    items: [
      { id: 'crunchy-thai-cabbage-salad', name: 'Crunchy Thai Cabbage Salad', unit: '1 portion', price: 350 },
      { id: 'achari-paneer-tikka-skewers', name: 'Achari Paneer Tikka Skewers', unit: '6 pcs', price: 410 },
    ],
  },
  {
    id: 'wraps',
    name: 'Wraps',
    items: [
      { id: 'mediterranean-falafel-wrap', name: 'Mediterranean Falafel Wrap', unit: '4 pcs', price: 480 },
      { id: 'cheesy-paneer-kathi-roll', name: 'Cheesy Paneer Vegetable Kathi Roll', unit: '4 pcs', price: 480 },
    ],
  },
  {
    id: 'rice-mains',
    name: 'Rice Mains',
    items: [
      { id: 'paneer-chole-dum-biryani', name: 'Paneer & Chole Dum Biryani with Raita', unit: '500 ml', price: 400 },
      { id: 'exotic-veg-stroganoff-rice', name: 'Exotic Vegetable Stroganoff with Herbed Rice', unit: '500 ml', price: 520 },
    ],
  },
  {
    id: 'paratha-mains',
    name: 'Paratha Mains',
    items: [
      { id: 'veg-jhalfrezi-pudina-paratha', name: 'Vegetable Jhalfrezi with Mini Pudina Paratha', unit: '500 ml', price: 320 },
      { id: 'mini-pudina-paratha', name: 'Mini Pudina Paratha', unit: '1 pc', price: 40 },
      { id: 'shaam-savera-veg-paratha', name: 'Shaam Savera with Mini Veg Paratha', unit: '500 ml', price: 350 },
      { id: 'mini-veg-paratha', name: 'Mini Veg Paratha', unit: '1 pc', price: 50 },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      { id: 'sitaphal-rasmalai', name: 'Sitaphal Rasmalai', unit: '6 pcs', price: 420 },
      { id: 'chocolate-monte-carlo', name: 'Chocolate Monte Carlo', unit: '500 ml', price: 450 },
      { id: 'mango-sandesh', name: 'Mango Sandesh', unit: '6 pcs', price: 280 },
    ],
  },
]

export function formatINR(amount: number): string {
  return '\u20b9' + amount.toLocaleString('en-IN')
}

const itemIndex = new Map<string, { item: RakhiItem; section: RakhiSection }>()
for (const section of rakhiSections) {
  for (const item of section.items) {
    itemIndex.set(item.id, { item, section })
  }
}

export function findRakhiItem(id: string) {
  return itemIndex.get(id)
}

export const PICKUP_TIME_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
]
