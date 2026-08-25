/**
 * À la carte house party menu.
 *
 * Pricing is the Rakhi method, used everywhere:
 *   - anything countable is `per piece`
 *   - trays and bakes are `500 ml` / `750 ml`
 *   - a composed salad is `per portion`
 * There is no per-dish minimum and no order minimum — guests add exactly
 * what they want. The old "min 2 portions of 4–6 pcs" packing is gone
 * because the arithmetic was costing orders.
 *
 * The Raksha Bandhan 2026 festive SKUs live here too. Same dish is listed
 * once: when both menus carried it, the Rakhi per-piece price and photo win.
 */

export type MenuItem = {
  id: string
  name: string
  /** How one unit is sold, e.g. "per piece" or "500 ml". */
  unit: string
  /** Price for one unit in rupees. */
  price: number
  /** Extra spellings people may search for. */
  alias?: string
  /** Square photo, usually from `/images/menu/rakhi/`. */
  image?: string
  /** One appetising line under the name. Keep it under ~90 characters. */
  description?: string
  /** Surfaces the dish in the "Most ordered" rail and badges the card. */
  popular?: boolean
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
    items: [
      {
        id: 'quesadillas',
        name: 'Bite Size Quesadillas',
        unit: 'per piece',
        price: 85,
        popular: true,
        alias: 'quesadilla bite sized',
        image: '/images/menu/rakhi/bite-sized-quesadilla.jpg',
        description: 'Three cheese, spinach and corn, with French salsa.',
      },
      { id: 'pita-pockets', name: 'Pita Pockets', unit: 'per piece', price: 85 },
      {
        id: 'pizza-slices',
        name: 'Farmhouse Pizza Slices',
        unit: 'per piece',
        price: 70,
        alias: 'bite sized farmhouse pizza',
        image: '/images/menu/rakhi/bite-sized-farmhouse-pizza.jpg',
        description: 'Mini farmhouse pizza loaded with peppers, herbs and melted cheese.',
      },
      { id: 'mushroom-dumplings', name: 'Cream of Mushroom Dumplings', unit: 'per piece', price: 95 },
      { id: 'crystal-dumplings', name: 'Crystal Vegetable Dumplings', unit: 'per piece', price: 75 },
      { id: 'avocado-sushi', name: 'Avocado Cream & Cheese Sushi', unit: 'per piece', price: 120 },
    ],
  },
  {
    id: 'cocktail-essentials',
    name: 'Cocktail Essentials',
    group: 'Starters',
    items: [
      { id: 'cheese-corn-samosa', name: 'Cheese & Corn Samosa', unit: 'per piece', price: 50 },
      { id: 'cocktail-samosa', name: 'Cocktail Samosa', unit: 'per piece', price: 30 },
      { id: 'cheese-balls', name: 'Classic Cheese Balls', unit: 'per piece', price: 25 },
      { id: 'veg-momo', name: 'Veg Steamed Momo', unit: 'per piece', price: 25 },
      { id: 'nachos', name: 'Nachos with In-House Salsa & Cheese Sauce', unit: 'per portion', price: 380 },
      {
        id: 'cheesy-veg-cigar-rolls',
        name: 'Cheesy Veg Cigar Rolls',
        unit: 'per piece',
        price: 65,
        popular: true,
        image: '/images/menu/rakhi/cheesy-veg-cigar-rolls.jpg',
        description: 'Crisp rolls of spiced greens and cheese, with salsa on the side.',
      },
    ],
  },
  {
    id: 'tandoori',
    name: 'Tandoori Appetizers',
    group: 'Starters',
    items: [
      { id: 'hara-bhara', name: 'Hara Bhara Kebab Croquettes', unit: 'per piece', price: 60 },
      {
        id: 'achari-paneer-tikka',
        name: 'Achari Paneer Tikka',
        unit: 'per piece',
        price: 70,
        alias: 'achari paneer tikka skewers',
        image: '/images/menu/rakhi/achari-paneer-tikka-skewers.jpg',
        description: 'Achari paneer tikka finished with tandoori mayo.',
      },
      { id: 'aloo-tikka', name: 'Tandoori Stuffed Aloo Tikka', unit: 'per piece', price: 60 },
      { id: 'galouti', name: 'Mushroom Galouti Kebab', unit: 'per piece', price: 75 },
      { id: 'tandoori-momo', name: 'Tandoori Momo', unit: 'per piece', price: 70 },
      { id: 'dahi-kebab', name: 'Dahi Kebab Croquettes', unit: 'per piece', price: 60 },
      {
        id: 'ulta-paratha-kebab',
        name: 'Ulta Paratha with Kebab Croquettes',
        unit: 'per piece',
        price: 75,
        image: '/images/menu/rakhi/ulta-paratha-kebab.jpg',
        description: 'Kebab croquettes on soft ulta paratha, topped with sliced onion.',
      },
    ],
  },
  {
    id: 'chaats',
    name: 'Indian Chaats',
    group: 'Starters',
    items: [
      { id: 'raj-kachori', name: 'Raj Kachori Chaat', unit: 'per piece', price: 60 },
      { id: 'palak-patta', name: 'Palak Patta Chaat', unit: 'per piece', price: 45 },
      { id: 'paw-bhaji-chaat', name: 'Paw Bhaji', unit: 'per piece', price: 70, alias: 'pav bhaji' },
      { id: 'chola-tikki', name: 'Chola Tikki Chaat', unit: 'per piece', price: 70 },
    ],
  },
  {
    id: 'filling-appetizers',
    name: 'Filling Appetizers',
    group: 'Starters',
    items: [
      { id: 'pindi-naanza', name: 'Pindi Chana Naanza', unit: 'per piece', price: 80 },
      {
        id: 'paneer-naanza',
        name: 'Tandoori Paneer Naanza',
        unit: 'per piece',
        price: 88,
        alias: 'tandoori paneer naanza',
      },
      { id: 'paw-bhaji-sliders', name: 'Paw Bhaji Sliders', unit: 'per piece', price: 75, alias: 'pav bhaji sliders' },
      {
        id: 'dabeli',
        name: 'Mini Dabeli Sliders',
        unit: 'per piece',
        price: 75,
        popular: true,
        alias: 'dabeli mini dabeli sliders',
        image: '/images/menu/rakhi/mini-dabeli-sliders.jpg',
        description: 'Spiced potato and crunchy sev in soft buns, finished with pomegranate.',
      },
      { id: 'cottage-cheese-wrap', name: 'Italian Cottage Cheese Wrap', unit: 'per piece', price: 120 },
      { id: 'mediterranean-wrap', name: 'Mediterranean Wrap', unit: 'per piece', price: 130 },
      { id: 'garlic-bread', name: 'Cheesy Garlic Bread', unit: 'per piece', price: 55 },
      {
        id: 'mushroom-galouti-sliders',
        name: 'Mushroom Galouti Charcoal Sliders',
        unit: 'per piece',
        price: 110,
        popular: true,
        image: '/images/menu/rakhi/mushroom-galouti-sliders.jpg',
        description: 'Smoky mushroom and caramelised onion in a charcoal sesame bun.',
      },
    ],
  },
  {
    id: 'wraps',
    name: 'Wraps',
    group: 'Starters',
    items: [
      {
        id: 'mediterranean-falafel-wrap',
        name: 'Mediterranean Falafel Wrap',
        unit: 'per piece',
        price: 120,
      },
      {
        id: 'cheesy-paneer-kathi-roll',
        name: 'Cheesy Paneer Vegetable Kathi Roll',
        unit: 'per piece',
        price: 120,
        alias: 'paneer kathi roll',
      },
    ],
  },
  {
    id: 'healthy-bites',
    name: 'Healthy Bites',
    group: 'Starters',
    items: [
      {
        id: 'crunchy-thai-cabbage-salad',
        name: 'Crunchy Thai Cabbage Salad',
        unit: 'per portion',
        price: 350,
        image: '/images/menu/rakhi/crunchy-thai-cabbage-salad.jpg',
        description: 'Crisp shredded cabbage and carrot, tossed Thai-style.',
      },
    ],
  },
  {
    id: 'north-indian',
    name: 'North Indian Mains',
    group: 'Mains',
    note: '500 ml per tray',
    items: [
      { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', unit: '500 ml', price: 320 },
      { id: 'paneer-makhani', name: 'Paneer Makhani', unit: '500 ml', price: 320 },
      { id: 'kadhai-paneer', name: 'Kadhai Paneer', unit: '500 ml', price: 320 },
      { id: 'kashmiri-aloo-dum', name: 'Kashmiri Aloo Dum', unit: '500 ml', price: 300 },
      { id: 'aloo-do-pyaza', name: 'Aloo Do Pyaza', unit: '500 ml', price: 300 },
      { id: 'pindi-chana', name: 'Pindi Chana Masala', unit: '500 ml', price: 320 },
      { id: 'malai-kofta', name: 'Shahi Malai Kofta', unit: '500 ml', price: 330 },
      { id: 'subz-jalfrezi', name: 'Subz Jalfrezi', unit: '500 ml', price: 320 },
      { id: 'palak-corn', name: 'Creamy Palak Corn', unit: '500 ml', price: 300 },
      {
        id: 'veg-jhalfrezi-pudina-paratha',
        name: 'Vegetable Jhalfrezi with Mini Pudina Paratha',
        unit: '500 ml',
        price: 320,
        alias: 'jalfrezi jhalfrezi',
      },
      {
        id: 'shaam-savera-veg-paratha',
        name: 'Shaam Savera with Mini Veg Paratha',
        unit: '500 ml',
        price: 350,
      },
    ],
  },
  {
    id: 'rice-breads',
    name: 'Rice & Tawa Breads',
    group: 'Mains',
    items: [
      { id: 'kulcha', name: 'Kulcha', unit: 'per piece', price: 60 },
      { id: 'masala-kulcha', name: 'Masala Kulcha', unit: 'per piece', price: 70 },
      { id: 'paneer-kulcha', name: 'Paneer Vegetable Kulcha', unit: 'per piece', price: 75 },
      { id: 'lachha-paratha', name: 'Pudina Lachha Paratha', unit: 'per piece', price: 70 },
      { id: 'mini-pudina-paratha', name: 'Mini Pudina Paratha', unit: 'per piece', price: 40 },
      { id: 'mini-veg-paratha', name: 'Mini Veg Paratha', unit: 'per piece', price: 50 },
      { id: 'zafrani-pulao', name: 'Zafrani Pulao', unit: '500 ml', price: 320 },
      { id: 'peas-pulao', name: 'Peas Pulao', unit: '500 ml', price: 290 },
      { id: 'jeera-rice', name: 'Jeera Rice', unit: '500 ml', price: 290 },
      { id: 'veg-pulao', name: 'Vegetable Pulao', unit: '500 ml', price: 300 },
      {
        id: 'paneer-chole-dum-biryani',
        name: 'Paneer & Chole Dum Biryani with Raita',
        unit: '500 ml',
        price: 400,
        alias: 'paneer biryani chole biryani',
      },
    ],
  },
  {
    id: 'bengali',
    name: 'Bengali Specialities',
    group: 'Mains',
    items: [
      { id: 'beetroot-cutlet', name: 'Beetroot Cutlet', unit: 'per piece', price: 45 },
      { id: 'narkel-cholar-dal', name: 'Narkel Cholar Dal', unit: '500 ml', price: 380 },
      { id: 'basanti-pulao', name: 'Basanti Pulao', unit: '500 ml', price: 390 },
      { id: 'radhavallabhi', name: 'Radhavallabhi', unit: 'per piece', price: 65 },
      { id: 'dum-aloo', name: 'Dum Aloo', unit: '500 ml', price: 390 },
      { id: 'tamatar-khejur-chutney', name: 'Tamatar Khejur Chutney', unit: '500 ml', price: 390 },
    ],
  },
  {
    id: 'rajasthani',
    name: 'Rajasthani Specialities',
    group: 'Mains',
    items: [
      { id: 'gatte-ki-subzi', name: 'Gatte Ki Subzi', unit: '500 ml', price: 320 },
      { id: 'panchmela', name: 'Rajasthani Panchmela', unit: '500 ml', price: 310 },
      { id: 'keriya-sangri', name: 'Keriya Sangri Aachar', unit: '500 ml', price: 580 },
      { id: 'pooran-poli', name: 'Pooran Poli', unit: 'per piece', price: 55 },
      { id: 'dal-badam-halwa', name: 'Dal-Badam Halwa', unit: '500 ml', price: 630 },
      { id: 'rajasthani-dahi-vada', name: 'Rajasthani Dahi Vada', unit: 'per piece', price: 65 },
    ],
  },
  {
    id: 'continental',
    name: 'Continental Dishes',
    group: 'Mains',
    items: [
      {
        id: 'stroganoff',
        name: 'Exotic Veg Stroganoff with Herbed Rice',
        unit: '500 ml',
        price: 380,
        popular: true,
        alias: 'exotic vegetable stroganoff',
        image: '/images/menu/rakhi/exotic-veg-stroganoff-rice.jpg',
        description: 'Creamy mushroom stroganoff alongside herbed rice.',
      },
      { id: 'thai-curry', name: 'Green Thai Curry with Steamed Rice', unit: '500 ml', price: 380 },
      { id: 'au-gratin', name: 'Classic Au Gratin', unit: '750 ml', price: 380 },
      { id: 'lasagna', name: 'Baked Exotic Veg Lasagna', unit: '750 ml', price: 380 },
      {
        id: 'spinach-ricotta-ravioli',
        name: 'Spinach & Ricotta Ravioli',
        unit: '750 ml',
        price: 450,
        image: '/images/menu/rakhi/spinach-ricotta-ravioli.jpg',
        description: 'Baked ravioli under a blistered cheese crust.',
      },
      {
        id: 'spaghetti-au-gratin',
        name: 'Spaghetti Au Gratin',
        unit: '750 ml',
        price: 370,
        image: '/images/menu/rakhi/spaghetti-au-gratin.jpg',
        description: 'Baked spaghetti with a golden gratin top.',
      },
    ],
  },
  {
    id: 'china-town',
    name: 'China Town',
    group: 'Mains',
    note: '500 ml per tray',
    items: [
      { id: 'hakka-noodles', name: 'Hakka Noodles', unit: '500 ml', price: 320 },
      { id: 'chilli-garlic-noodles', name: 'Chilli Garlic Noodles', unit: '500 ml', price: 320 },
      { id: 'burnt-garlic-rice', name: 'Burnt Ginger Garlic Fried Rice', unit: '500 ml', price: 320 },
      { id: 'manchurian', name: 'Vegetable Manchurian Balls', unit: 'per piece', price: 60 },
      { id: 'tsing-hoi-potato', name: 'Tsing Hoi Potato', unit: '500 ml', price: 370 },
      { id: 'hot-garlic-veg', name: 'Exotic Vegetables in Hot Garlic Sauce', unit: '500 ml', price: 370 },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    group: 'Desserts',
    items: [
      {
        id: 'monte-carlo',
        name: 'Chocolate Monte Carlo',
        unit: '500 ml',
        price: 450,
        popular: true,
        image: '/images/menu/rakhi/chocolate-monte-carlo.jpg',
        description: 'Layers of cream and chocolate under dark chocolate shavings.',
      },
      { id: 'kesariya-rasmalai', name: 'Kesariya Rasmalai', unit: 'per piece', price: 60 },
      {
        id: 'sitaphal-rasmalai',
        name: 'Sitaphal Rasmalai',
        unit: 'per piece',
        price: 70,
        popular: true,
        image: '/images/menu/rakhi/sitaphal-rasmalai.jpg',
        description: 'Soft rasmalai in saffron milk, scattered with pistachio.',
      },
      { id: 'darsan', name: 'Darsan', unit: '500 ml', price: 370 },
      { id: 'gulabjamun', name: 'Gulabjamun', unit: 'per piece', price: 35 },
      { id: 'seasonal-sandesh', name: 'Seasonal Sandesh', unit: 'per piece', price: 45 },
      { id: 'mango-sandesh', name: 'Mango Sandesh', unit: 'per piece', price: 50 },
      { id: 'fudge-brownie', name: 'Fudge Brownie', unit: 'per piece', price: 105 },
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

const TRAILING_SECTION_IDS = ['desserts']

/**
 * Photographed dishes first, both within each section and across the menu.
 * Desserts stay last so the menu still reads as a meal.
 */
export const orderedMenuSections: MenuSection[] = (() => {
  const photoCount = (section: MenuSection) => section.items.filter((item) => item.image).length

  const sections = menuSections.map((section) => ({
    ...section,
    items: [...section.items].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))),
  }))

  const trailing = TRAILING_SECTION_IDS.flatMap((id) => sections.filter((s) => s.id === id))
  const leading = sections
    .filter((s) => !TRAILING_SECTION_IDS.includes(s.id))
    .sort((a, b) => photoCount(b) - photoCount(a))

  return [...leading, ...trailing]
})()

export const popularMenuItems: MenuItem[] = orderedMenuSections
  .flatMap((section) => section.items.filter((item) => item.popular))
  .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))

export const menuItemCount = menuSections.reduce((sum, section) => sum + section.items.length, 0)

/** Units that are sold one-at-a-time (not a tray). */
export const COUNTABLE_UNITS = new Set(['per piece', 'per portion'])
