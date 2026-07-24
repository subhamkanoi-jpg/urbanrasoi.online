/**
 * À la carte house party menu, transcribed from the Urban Rasoi House Party
 * Menu PDF. Every item carries a "min 2 portions" rule, so quantities in the
 * order flow start and floor at MIN_PORTIONS.
 */

export const MIN_PORTIONS = 2

export type MenuItem = {
  id: string
  name: string
  /** Portion descriptor printed on the menu, e.g. "4 pcs" or "500 ml". */
  unit: string
  /** Price per portion in rupees. */
  price: number
  /** Extra spellings people may search for. */
  alias?: string
}

export type MenuSection = {
  id: string
  name: string
  group: 'Starters' | 'Mains' | 'Desserts'
  /** Portion note shown under the section heading. */
  note?: string
  items: MenuItem[]
}

export const menuSections: MenuSection[] = [
  {
    id: 'around-the-world',
    name: 'Around the World',
    group: 'Starters',
    note: '4 pcs per portion',
    items: [
      { id: 'quesadillas', name: 'Bite Size Quesadillas', unit: '4 pcs', price: 290 },
      { id: 'pita-pockets', name: 'Pita Pockets', unit: '4 pcs', price: 290 },
      { id: 'pizza-slices', name: 'Farmhouse Pizza Slices', unit: '4 pcs', price: 240 },
      { id: 'mushroom-dumplings', name: 'Cream of Mushroom Dumplings', unit: '4 pcs', price: 320 },
      { id: 'crystal-dumplings', name: 'Crystal Vegetable Dumplings', unit: '4 pcs', price: 260 },
      { id: 'avocado-sushi', name: 'Avocado Cream & Cheese Sushi', unit: '4 pcs', price: 420 },
    ],
  },
  {
    id: 'cocktail-essentials',
    name: 'Cocktail Essentials',
    group: 'Starters',
    items: [
      { id: 'cheese-corn-samosa', name: 'Cheese & Corn Samosa', unit: '6 pcs', price: 270 },
      { id: 'cocktail-samosa', name: 'Cocktail Samosa', unit: '8 pcs', price: 220 },
      { id: 'cheese-balls', name: 'Classic Cheese Balls', unit: '15 pcs', price: 330 },
      { id: 'veg-momo', name: 'Veg Steamed Momo', unit: '15 pcs', price: 320 },
      { id: 'nachos', name: 'Nachos with In-House Salsa & Cheese Sauce', unit: '1 portion', price: 330 },
    ],
  },
  {
    id: 'tandoori',
    name: 'Tandoori Appetizers',
    group: 'Starters',
    note: '6 pcs per portion',
    items: [
      { id: 'hara-bhara', name: 'Hara Bhara Kebab Croquettes', unit: '6 pcs', price: 320 },
      { id: 'achari-paneer-tikka', name: 'Achari Paneer Tikka', unit: '6 pcs', price: 360 },
      { id: 'aloo-tikka', name: 'Tandoori Stuffed Aloo Tikka', unit: '6 pcs', price: 320 },
      { id: 'galouti', name: 'Mushroom Galouti Kebab', unit: '6 pcs', price: 380 },
      { id: 'tandoori-momo', name: 'Tandoori Momo', unit: '6 pcs', price: 360 },
      { id: 'dahi-kebab', name: 'Dahi Kebab Croquettes', unit: '6 pcs', price: 320 },
    ],
  },
  {
    id: 'chaats',
    name: 'Indian Chaats',
    group: 'Starters',
    items: [
      { id: 'raj-kachori', name: 'Raj Kachori Chaat', unit: '6 pcs', price: 320 },
      { id: 'palak-patta', name: 'Palak Patta Chaat', unit: '8 pcs', price: 320 },
      { id: 'paw-bhaji-chaat', name: 'Paw Bhaji', unit: '6 pcs', price: 360, alias: 'pav bhaji' },
      { id: 'chola-tikki', name: 'Chola Tikki Chaat', unit: '6 pcs', price: 360 },
    ],
  },
  {
    id: 'filling-appetizers',
    name: 'Filling Appetizers',
    group: 'Starters',
    items: [
      { id: 'pindi-naanza', name: 'Pindi Chana Naanza', unit: '5 pcs', price: 350 },
      { id: 'paneer-naanza', name: 'Tandoori Paneer Naanza', unit: '5 pcs', price: 380 },
      { id: 'paw-bhaji-sliders', name: 'Paw Bhaji Sliders', unit: '6 pcs', price: 390, alias: 'pav bhaji sliders' },
      { id: 'dabeli', name: 'Dabeli', unit: '6 pcs', price: 390 },
      { id: 'cottage-cheese-wrap', name: 'Italian Cottage Cheese Wrap', unit: '4 pcs', price: 420 },
      { id: 'mediterranean-wrap', name: 'Mediterranean Wrap', unit: '4 pcs', price: 440 },
      { id: 'garlic-bread', name: 'Cheesy Garlic Bread', unit: '8 pcs', price: 380 },
    ],
  },
  {
    id: 'north-indian',
    name: 'North Indian Mains',
    group: 'Mains',
    note: '500 ml per portion',
    items: [
      { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', unit: '500 ml', price: 280 },
      { id: 'paneer-makhani', name: 'Paneer Makhani', unit: '500 ml', price: 280 },
      { id: 'kadhai-paneer', name: 'Kadhai Paneer', unit: '500 ml', price: 280 },
      { id: 'kashmiri-aloo-dum', name: 'Kashmiri Aloo Dum', unit: '500 ml', price: 260 },
      { id: 'aloo-do-pyaza', name: 'Aloo Do Pyaza', unit: '500 ml', price: 260 },
      { id: 'pindi-chana', name: 'Pindi Chana Masala', unit: '500 ml', price: 280 },
      { id: 'malai-kofta', name: 'Shahi Malai Kofta', unit: '500 ml', price: 290 },
      { id: 'subz-jalfrezi', name: 'Subz Jalfrezi', unit: '500 ml', price: 280 },
      { id: 'palak-corn', name: 'Creamy Palak Corn', unit: '500 ml', price: 260 },
    ],
  },
  {
    id: 'rice-breads',
    name: 'Rice & Tawa Breads',
    group: 'Mains',
    items: [
      { id: 'kulcha', name: 'Kulcha', unit: '4 pcs', price: 200 },
      { id: 'masala-kulcha', name: 'Masala Kulcha', unit: '4 pcs', price: 240 },
      { id: 'paneer-kulcha', name: 'Paneer Vegetable Kulcha', unit: '4 pcs', price: 260 },
      { id: 'lachha-paratha', name: 'Pudina Lachha Paratha', unit: '4 pcs', price: 240 },
      { id: 'zafrani-pulao', name: 'Zafrani Pulao', unit: '500 ml', price: 280 },
      { id: 'peas-pulao', name: 'Peas Pulao', unit: '500 ml', price: 250 },
      { id: 'jeera-rice', name: 'Jeera Rice', unit: '500 ml', price: 250 },
      { id: 'veg-pulao', name: 'Vegetable Pulao', unit: '500 ml', price: 260 },
    ],
  },
  {
    id: 'bengali',
    name: 'Bengali Specialities',
    group: 'Mains',
    items: [
      { id: 'beetroot-cutlet', name: 'Beetroot Cutlet', unit: '8 pcs', price: 350 },
      { id: 'narkel-cholar-dal', name: 'Narkel Cholar Dal', unit: '500 ml', price: 380 },
      { id: 'basanti-pulao', name: 'Basanti Pulao', unit: '500 ml', price: 390 },
      { id: 'radhavallabhi', name: 'Radhavallabhi', unit: '6 pcs', price: 390 },
      { id: 'dum-aloo', name: 'Dum Aloo', unit: '500 ml', price: 390 },
      { id: 'tamatar-khejur-chutney', name: 'Tamatar Khejur Chutney', unit: '500 ml', price: 390 },
    ],
  },
  {
    id: 'rajasthani',
    name: 'Rajasthani Specialities',
    group: 'Mains',
    items: [
      { id: 'gatte-ki-subzi', name: 'Gatte Ki Subzi', unit: '500 ml', price: 280 },
      { id: 'panchmela', name: 'Rajasthani Panchmela', unit: '500 ml', price: 270 },
      { id: 'keriya-sangri', name: 'Keriya Sangri Aachar', unit: '500 ml', price: 500 },
      { id: 'pooran-poli', name: 'Pooran Poli', unit: '6 pcs', price: 280 },
      { id: 'dal-badam-halwa', name: 'Dal-Badam Halwa', unit: '500 ml', price: 550 },
      { id: 'rajasthani-dahi-vada', name: 'Rajasthani Dahi Vada', unit: '5 pcs', price: 280 },
    ],
  },
  {
    id: 'continental',
    name: 'Continental Dishes',
    group: 'Mains',
    items: [
      { id: 'stroganoff', name: 'Exotic Veg Stroganoff with Herbed Rice', unit: '500 ml', price: 320 },
      { id: 'thai-curry', name: 'Green Thai Curry with Steamed Rice', unit: '500 ml', price: 320 },
      { id: 'au-gratin', name: 'Classic Au Gratin', unit: '750 ml', price: 320 },
      { id: 'lasagna', name: 'Baked Exotic Veg Lasagna', unit: '750 ml', price: 320 },
    ],
  },
  {
    id: 'china-town',
    name: 'China Town',
    group: 'Mains',
    note: '500 ml per portion',
    items: [
      { id: 'hakka-noodles', name: 'Hakka Noodles', unit: '500 ml', price: 280 },
      { id: 'chilli-garlic-noodles', name: 'Chilli Garlic Noodles', unit: '500 ml', price: 280 },
      { id: 'burnt-garlic-rice', name: 'Burnt Ginger Garlic Fried Rice', unit: '500 ml', price: 280 },
      { id: 'manchurian', name: 'Vegetable Manchurian Balls', unit: '6 pcs', price: 320 },
      { id: 'tsing-hoi-potato', name: 'Tsing Hoi Potato', unit: '500 ml', price: 320 },
      { id: 'hot-garlic-veg', name: 'Exotic Vegetables in Hot Garlic Sauce', unit: '500 ml', price: 320 },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    group: 'Desserts',
    items: [
      { id: 'monte-carlo', name: 'Chocolate Monte Carlo', unit: '500 ml', price: 400 },
      { id: 'kesariya-rasmalai', name: 'Kesariya Rasmalai', unit: '6 pcs', price: 300 },
      { id: 'darsan', name: 'Darsan', unit: '500 ml', price: 320 },
      { id: 'gulabjamun', name: 'Gulabjamun', unit: '6 pcs', price: 180 },
      { id: 'seasonal-sandesh', name: 'Seasonal Sandesh', unit: '6 pcs', price: 240 },
      { id: 'fudge-brownie', name: 'Fudge Brownie', unit: '4 pcs', price: 360 },
    ],
  },
]

export type ServiceAddOn = {
  id: 'backend' | 'frontend'
  name: string
  detail: string
  price: number
}

export const serviceAddOns: ServiceAddOn[] = [
  {
    id: 'backend',
    name: 'Kitchen service person',
    detail: 'Frying, baking or heating on-site · 3–4 hrs',
    price: 600,
  },
  {
    id: 'frontend',
    name: 'Serving person',
    detail: 'Table layout & guest assistance · 3–4 hrs',
    price: 800,
  },
]

export const orderTerms = [
  'Some items arrive semi-cooked to be finished on-site for freshness.',
  'Service staff use the kitchen infrastructure and utensils available on-site.',
  'Overtime and night-time charges apply as needed.',
  'Delivery charge as per actuals.',
]

const itemIndex = new Map<string, { item: MenuItem; section: MenuSection }>()
for (const section of menuSections) {
  for (const item of section.items) itemIndex.set(item.id, { item, section })
}

export function findItem(id: string) {
  return itemIndex.get(id)
}

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}

export const menuGroups = ['Starters', 'Mains', 'Desserts'] as const
