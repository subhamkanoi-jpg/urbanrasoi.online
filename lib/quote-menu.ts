/**
 * House party menu used by the staff quote builder (/quote-builder).
 *
 * This is the portion-priced PDF menu that goes out to hosts, not the
 * per-piece à la carte menu in `lib/alacarte-menu.ts`. Prices are per portion
 * and every section sells a minimum of 2 portions. `per` + `unit` describe one
 * portion: 6 pcs, 500 ml, one person, and so on.
 *
 * `course` is where a dish sits on the client's quote, which is not always its
 * menu section: Dal-Badam Halwa is listed under Rajasthani Specialities but
 * reads as a dessert on a quote.
 */

export const QUOTE_COURSES = ['Appetizers', 'Chaats', 'Mains', 'Rice & Breads', 'Desserts', 'Service'] as const
export type QuoteCourse = (typeof QUOTE_COURSES)[number]

export type QuoteUnit = 'pcs' | 'ml' | 'portion' | 'person'

export type QuoteMenuItem = {
  name: string
  section: string
  course: QuoteCourse
  /** Quantity in one portion, in `unit`. */
  per: number
  unit: QuoteUnit
  /** Rupees per portion (per person for service staff). */
  rate: number
}

/** Section minimum printed on the menu. Service staff are booked per person. */
export const MIN_PORTIONS = 2

type Row = [name: string, rate: number, per?: number, unit?: QuoteUnit, course?: QuoteCourse]
type Section = [section: string, course: QuoteCourse, per: number, unit: QuoteUnit, rows: Row[]]

const SECTIONS: Section[] = [
  ['Around the World', 'Appetizers', 4, 'pcs', [
    ['Bite Size Quesadillas', 330],
    ['Pita Pockets', 330],
    ['Farmhouse Pizza Slices', 280],
    ['Cream of Mushroom Dumplings', 370],
    ['Crystal Vegetable Dumplings', 300],
    ['Avocado Cream & Cheese Sushi', 480],
  ]],
  ['Cocktail Essentials', 'Appetizers', 6, 'pcs', [
    ['Cheese & Corn Samosa', 310, 6],
    ['Cocktail Samosa', 250, 8],
    ['Classic Cheese Balls', 380, 15],
    ['Veg Steamed Momo', 370, 15],
    ['Nachos with In-house Salsa & Cheese Sauce', 380, 1, 'portion'],
  ]],
  ['Tandoori Appetizers', 'Appetizers', 6, 'pcs', [
    ['Hara Bhara Kebab Croquettes', 370],
    ['Achari Paneer Tikka', 410],
    ['Tandoori Stuffed Aloo Tikka', 370],
    ['Mushroom Galouti Kebab', 440],
    ['Tandoori Momo', 410],
    ['Dahi Kebab Croquettes', 370],
  ]],
  ['Indian Chaats', 'Chaats', 6, 'pcs', [
    ['Raj Kachori Chaat', 370],
    ['Palak Patta Chaat', 370, 8],
    ['Paw Bhaji', 410],
    ['Chola Tikki Chaat', 410],
  ]],
  ['Filling Appetizers', 'Appetizers', 6, 'pcs', [
    ['Pindi Chana Naanza', 400, 5],
    ['Tandoori Paneer Naanza', 440, 5],
    ['Paw Bhaji Sliders', 450, 6],
    ['Dabeli', 450, 6],
    ['Italian Cottage Cheese Wrap', 480, 4],
    ['Mediterranean Wrap', 510, 4],
    ['Cheesy Garlic Bread', 440, 8],
  ]],
  ['North Indian Mains', 'Mains', 500, 'ml', [
    ['Paneer Butter Masala', 320],
    ['Paneer Makhani', 320],
    ['Kadhai Paneer', 320],
    ['Kashmiri Aloo Dum', 300],
    ['Aloo Do Pyaza', 300],
    ['Pindi Chana Masala', 320],
    ['Shahi Malai Kofta', 330],
    ['Subz Jalfrezi', 320],
    ['Creamy Palak Corn', 300],
  ]],
  ['Rice & Tawa Breads', 'Rice & Breads', 4, 'pcs', [
    ['Kulcha', 230],
    ['Masala Kulcha', 280],
    ['Paneer Vegetable Kulcha', 300],
    ['Pudina Lachha Paratha', 280],
    ['Zafrani Pulao', 320, 500, 'ml'],
    ['Peas Pulao', 290, 500, 'ml'],
    ['Jeera Rice', 290, 500, 'ml'],
    ['Vegetable Pulao', 300, 500, 'ml'],
  ]],
  ['Bengali Specialities', 'Mains', 500, 'ml', [
    ['Beetroot Cutlet', 350, 8, 'pcs', 'Appetizers'],
    ['Narkel Cholar Dal', 380],
    ['Basanti Pulao', 390, 500, 'ml', 'Rice & Breads'],
    ['Radhavallabhi', 390, 6, 'pcs', 'Rice & Breads'],
    ['Dum Aloo', 390],
    ['Tamatar Khejur Chutney', 390],
  ]],
  ['Rajasthani Specialities', 'Mains', 500, 'ml', [
    ['Gatte Ki Subzi', 320],
    ['Rajasthani Panchmela', 310],
    ['Keriya Sangri Aachar', 580],
    ['Pooran Poli', 320, 6, 'pcs', 'Desserts'],
    ['Dal-Badam Halwa', 630, 500, 'ml', 'Desserts'],
    ['Rajasthani Dahi Vada', 320, 5, 'pcs', 'Chaats'],
  ]],
  ['Continental Dishes', 'Mains', 500, 'ml', [
    ['Exotic Veg Stroganoff with Herbed Rice', 370],
    ['Green Thai Curry with Steamed Rice', 370],
    ['Classic Au Gratin', 370, 750],
    ['Baked Exotic Veg Lasagna', 370, 750],
  ]],
  ['China Town', 'Mains', 500, 'ml', [
    ['Hakka Noodles', 320, 500, 'ml', 'Rice & Breads'],
    ['Chilli Garlic Noodles', 320, 500, 'ml', 'Rice & Breads'],
    ['Burnt Ginger Garlic Fried Rice', 320, 500, 'ml', 'Rice & Breads'],
    ['Vegetable Manchurian Balls', 370, 6, 'pcs'],
    ['Tsing Hoi Potato', 370],
    ['Exotic Vegetables in Hot Garlic Sauce', 370],
  ]],
  ['Desserts', 'Desserts', 6, 'pcs', [
    ['Chocolate Monte Carlo', 460, 500, 'ml'],
    ['Kesariya Rasmalai', 350, 6],
    ['Darsan', 370, 500, 'ml'],
    ['Gulabjamun', 210, 6],
    ['Seasonal Sandesh', 280, 6],
    ['Fudge Brownie', 410, 4],
  ]],
  // Backend staff fry, bake and heat on-site; frontend staff run the table.
  // Both are booked for 3-4 hours, overtime and night charges extra.
  ['Service', 'Service', 1, 'person', [
    ['Backend Service Personnel', 700],
    ['Frontend Service Person', 800],
  ]],
]

export const QUOTE_MENU_SECTIONS: string[] = SECTIONS.map(([section]) => section)

export const QUOTE_MENU: QuoteMenuItem[] = SECTIONS.flatMap(([section, course, per, unit, rows]) =>
  rows.map(([name, rate, rowPer, rowUnit, rowCourse]) => ({
    name,
    section,
    course: rowCourse ?? course,
    per: rowPer ?? per,
    unit: rowUnit ?? unit,
    rate,
  })),
)

export function findQuoteMenuItem(name: string): QuoteMenuItem | undefined {
  const key = name.trim().toLowerCase()
  return QUOTE_MENU.find((item) => item.name.toLowerCase() === key)
}
