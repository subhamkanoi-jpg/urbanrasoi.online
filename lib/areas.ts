/**
 * Service-area data for Kolkata. Three locality pages plus a hub — not one
 * thin page per neighbourhood. Copy has to differ because Google treats
 * “catering in X” clones as doorways.
 */

import { site } from './site'

export type ServiceArea = {
  slug: string
  name: string
  regionLabel: string
  pin: string
  geo: { latitude: number; longitude: number }
  driveMins: string
  heroImage: string
  heroAlt: string
  metaTitle: string
  metaDescription: string
  h1: string
  lede: string
  body: string[]
  typical: string
  neighborhoods: string[]
  faqs: { question: string; answer: string }[]
}

export const hubPath = '/catering-across-kolkata'

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'salt-lake-catering',
    name: 'Salt Lake',
    regionLabel: 'Bidhannagar · Sector 1 kitchen',
    pin: '700064',
    geo: { latitude: site.geo.latitude, longitude: site.geo.longitude },
    driveMins: '15–35 minutes across Sectors 1–5 and Sector V',
    heroImage: '/images/gallery-kitchen.jpg',
    heroAlt: 'Urban Rasoi vegetarian kitchen in Salt Lake Sector 1, Kolkata',
    metaTitle: 'Vegetarian Catering in Salt Lake, Kolkata | Urban Rasoi',
    metaDescription:
      '100% vegetarian catering from our own kitchen at AE-287, Salt Lake Sector 1. House parties, grazing tables and offices across Bidhannagar and Sector V. From ₹749 a guest.',
    h1: 'Vegetarian catering in Salt Lake.',
    lede: 'This is where we cook. AE-287, Sector 1 — not a restaurant you walk into, a kitchen that sends vegetarian party food across Bidhannagar the same day.',
    body: [
      'Most Salt Lake hosts are ten to twenty minutes from the door. That is why a 7 pm Sector 2 house party and an 8 pm Sector V office spread can leave the same kitchen without sitting in a box. Pickup is possible by arrangement; most orders still go out as a timed delivery.',
      'We cover Sector 1 through 5, AE / BD / BE / CA blocks, City Centre, Karunamoyee and Sector V. Club nights, apartment get-togethers and packed lunches for Sector V offices are the usual brief — all 100% vegetarian, FSSAI-licensed, since 2015.',
    ],
    typical: 'Apartment house parties, City Centre get-togethers, Sector V office lunches.',
    neighborhoods: ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 5', 'City Centre', 'Karunamoyee', 'AE Block', 'Sector V'],
    faqs: [
      {
        question: 'Where exactly is the kitchen?',
        answer:
          'AE-287, Salt Lake Sector 1, Kolkata 700064. It is a production kitchen — WhatsApp us if you want to pick up rather than take a delivery.',
      },
      {
        question: 'How quickly can you deliver inside Salt Lake?',
        answer:
          'Same-day is common when the menu is already on the à la carte list. Large grazing tables and staffed service still need a day’s notice so we can roster.',
      },
    ],
  },
  {
    slug: 'new-town-catering',
    name: 'New Town',
    regionLabel: 'Action Areas · Rajarhat',
    pin: '700156',
    geo: { latitude: 22.5896, longitude: 88.465 },
    driveMins: '35–50 minutes from the Salt Lake kitchen',
    heroImage: '/images/gallery-corporate.jpg',
    heroAlt: 'Vegetarian office and house-party catering delivered to New Town, Kolkata',
    metaTitle: 'Vegetarian Catering in New Town, Kolkata | Urban Rasoi',
    metaDescription:
      'Vegetarian house-party and corporate catering for New Town, Rajarhat and the Action Areas. Cooked in Salt Lake, timed for your slot. From ₹749 a guest.',
    h1: 'Vegetarian catering in New Town.',
    lede: 'High-rises, Action Areas and Eco Park offices — we cook in Salt Lake and time the van so food is hot when it reaches your tower.',
    body: [
      'New Town parties run on building service lifts and visitor slots. We plan for that: labelled boxes, a delivery window you can send to security, and a menu that still tastes like it left a kitchen, not a canteen. Uniworld, Greenwood, the Action Areas and Rajarhat apartments are regular drops.',
      'Corporate is the other half. Working lunches and offsites around Eco Park and New Town’s office belt get the same vegetarian kitchen as a Saturday house party — 10 to 200+ heads, on the clock you give us. Tell us the tower and the pin (700156 / 700135 / 700157) with the order.',
    ],
    typical: 'High-rise house parties, Eco Park office lunches, Action Area get-togethers.',
    neighborhoods: ['Action Area I', 'Action Area II', 'Action Area III', 'Rajarhat', 'Eco Park', 'Uniworld', 'Greenwood Park', 'Street 32'],
    faqs: [
      {
        question: 'Do you deliver to Rajarhat and the Action Areas?',
        answer:
          'Yes. New Town, Rajarhat and the Action Areas are a regular run from our Salt Lake kitchen. Share the tower name and pin code so we can pad the drive.',
      },
      {
        question: 'Can you do a weekday office lunch in New Town?',
        answer:
          'Yes — packed boxes or a buffet, 10 to 200+ heads. We cook in Salt Lake that morning and hit the slot you book with facilities.',
      },
    ],
  },
  {
    slug: 'south-kolkata-catering',
    name: 'South Kolkata',
    regionLabel: 'Alipore · Ballygunge · Gariahat',
    pin: '700019',
    geo: { latitude: 22.5275, longitude: 88.363 },
    driveMins: '40–60 minutes from the Salt Lake kitchen',
    heroImage: '/images/gallery-bengali.jpg',
    heroAlt: 'Bengali vegetarian festive catering for South Kolkata house parties',
    metaTitle: 'Vegetarian Catering in South Kolkata | Urban Rasoi',
    metaDescription:
      'Vegetarian catering for Alipore, Ballygunge, Gariahat and Tollygunge. House parties, pujas and family gatherings, cooked in Salt Lake and driven south. From ₹749 a guest.',
    h1: 'Vegetarian catering in South Kolkata.',
    lede: 'Alipore bungalows, Ballygunge apartments, Gariahat get-togethers — we pad the kitchen clock so a Salt Lake cook still lands hot in the south.',
    body: [
      'South Kolkata is a longer run from Sector 1, so we do not treat it like a Salt Lake drop. The menu is the same vegetarian kitchen; the dispatch is earlier. Bungalow pujas, 50th-birthday lunches and quiet anniversary dinners are the briefs we get from Alipore and Ballygunge. Gariahat, Tollygunge, Behala and Park Street sit on the same route.',
      'Families here often want Bengali festive dishes next to Continental starters, and they want the veg kitchen to be actually veg. That is the point of cooking everything at AE-287: no shared tandoor, no “veg option” after the mutton. Send the pin (700019, 700027, 700029, 700033 and neighbours) and the time guests sit down.',
    ],
    typical: 'Family pujas, Alipore dinners, Ballygunge birthdays, Gariahat get-togethers.',
    neighborhoods: ['Alipore', 'Ballygunge', 'Gariahat', 'Park Street', 'Tollygunge', 'Behala', 'Kalighat', 'Southern Avenue'],
    faqs: [
      {
        question: 'Is South Kolkata too far from Salt Lake?',
        answer:
          'No. It is a longer drive, so we dispatch earlier. Alipore, Ballygunge, Gariahat, Tollygunge and Behala are regular deliveries — WhatsApp the pin and sit-down time.',
      },
      {
        question: 'Do you cook Bengali vegetarian food for pujas?',
        answer:
          'Yes. Bengali festive dishes sit on the same menu as Continental and Indo-Chinese, all from the vegetarian kitchen. Satvik constraints can be planned in if you tell us up front.',
      },
    ],
  },
]

export const alsoDelivered = ['Howrah', 'Dum Dum', 'Baguiati', 'Lake Town'] as const

export function getServiceArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug)
}

export function areaPath(area: ServiceArea): string {
  return `/${area.slug}`
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
