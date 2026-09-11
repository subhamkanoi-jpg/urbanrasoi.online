import { site } from '@/lib/site'

export type Product = {
  slug: string
  name: string
  shortName: string
  eyebrow: string
  headline: string
  promise: string
  description: string
  heroImage: string
  heroImagePosition?: string
  heroVideo?: string
  cardImage: string
  gallery: { src: string; alt: string }[]
  included: { title: string; detail: string }[]
  steps: { title: string; detail: string }[]
  whatsappMessage: string
  ctaLabel: string
  plannerOccasion?: string
  builderCta?: { label: string; href: string }
  closingHeadline: string
  closingCopy: string
  metaTitle: string
  metaDescription: string
}

export const products: Product[] = [
  {
    slug: 'grazing-tables',
    name: 'Gourmet Grazing Tables',
    shortName: 'Grazing Tables',
    eyebrow: 'Our Signature · Vegetarian',
    headline: 'The table everyone gathers around.',
    promise: 'Styled gourmet spreads — delivered, set up, ready to wow.',
    description:
      'Composed like a still life, grazed like a feast. 100% vegetarian boards we design, deliver and style in Kolkata. You host.',
    heroImage: '/images/gallery-event.jpg',
    heroImagePosition: 'object-[80%_center]',
    heroVideo: '/media/grazing-table-hero.mp4',
    cardImage: '/images/gallery-event.jpg',
    gallery: [
      { src: '/images/gallery-event.jpg', alt: 'Vegetarian dabeli sliders and mezze styled on a Kolkata grazing board' },
      { src: '/images/gallery-spread.jpg', alt: 'Three cheese quesadilla with salsa from our vegetarian grazing menu' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes from our Salt Lake kitchen' },
      { src: '/images/gallery-houseparty.jpg', alt: 'A full vegetarian spread styled and ready for guests in Kolkata' },
    ],
    included: [
      { title: 'Mediterranean Mezze', detail: 'Hummus, dips, olives, artisan breads' },
      { title: 'Live Nacho Station', detail: 'Loaded nachos, salsas, fresh toppings' },
      { title: 'Dabeli Sliders', detail: 'A gourmet spin on the street classic' },
      { title: 'Quesadillas', detail: 'Golden and cheese-pulled' },
      { title: 'Signature Desserts', detail: 'Mango sandesh, Monte Carlo cups' },
      { title: 'Styling & Setup', detail: 'Boards, props, tea and coffee' },
    ],
    steps: [
      { title: 'Tell us your date', detail: 'WhatsApp your date, guest count and occasion.' },
      { title: 'We design the table', detail: 'A spread styled to your gathering — from 15 guests.' },
      { title: 'You host', detail: 'We arrive, set up and leave them talking.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'd love a Grazing Table.\nOccasion: ___\nDate: ___\nGuest count: ___\nArea: ___",
    ctaLabel: 'Plan my grazing table',
    plannerOccasion: 'grazing',
    closingHeadline: 'Give them a table to talk about.',
    closingCopy: 'Send your date and guest count — we design the rest.',
    metaTitle: 'Vegetarian Grazing Tables in Kolkata | Urban Rasoi',
    metaDescription:
      '100% vegetarian grazing tables in Kolkata — styled, delivered and set up for house parties from 15 guests. Designed by Urban Rasoi’s Salt Lake kitchen since 2015.',
  },
  {
    slug: 'house-parties',
    name: 'House Party Catering',
    shortName: 'House Parties',
    eyebrow: 'House Party Catering · Kolkata',
    headline: 'Your home. Our kitchen.',
    promise: `Premium vegetarian menus, cooked fresh and delivered — from ${site.partyMenusFrom} a guest.`,
    description:
      'Birthdays, anniversaries, festive gatherings, private dinners — any occasion at home. Homestyle Indian, Bengali, South Indian, Indo-Chinese, Continental and desserts, 100% vegetarian, cooked fresh that day in our Salt Lake kitchen.',
    heroImage: '/images/gallery-diwali.jpg',
    cardImage: '/images/gallery-houseparty.jpg',
    gallery: [
      { src: '/images/gallery-houseparty.jpg', alt: 'Vegetarian house party buffet with curated Indian dishes in Kolkata' },
      { src: '/images/gallery-bengali.jpg', alt: 'Traditional Bengali vegetarian festive dishes from Urban Rasoi' },
      { src: '/images/gallery-diwali.jpg', alt: 'Live vegetarian service at a festive home celebration in Kolkata' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes for a house party' },
    ],
    included: [
      { title: 'Menus built around you', detail: 'Your guests, your taste, your occasion — nothing off-the-shelf.' },
      { title: 'Six cuisines', detail: 'Indian, Bengali, South Indian, Indo-Chinese, Continental, Desserts.' },
      { title: 'Fresh, never reheated', detail: 'Cooked same day in our FSSAI-licensed Salt Lake kitchen.' },
      { title: 'Doorstep delivery', detail: 'Warm, on time, ready to serve — no assembly required.' },
      { title: 'Portion planning', detail: 'We calculate quantities. Nothing runs short, nothing wasted.' },
      { title: 'Festive specials', detail: 'Diwali, Poila Boishakh, Christmas and more — we know the calendar.' },
    ],
    steps: [
      { title: 'Tell us your date', detail: 'One WhatsApp with your date, guest count and area.' },
      { title: 'We curate the menu', detail: 'We tailor it to your occasion and preferences. You approve it.' },
      { title: 'You enjoy your party', detail: 'Food arrives warm and ready. You host — without lifting a ladle.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'm planning a house party and would like a menu.\nDate: ___\nGuest count: ___\nArea: ___\nOccasion: ___",
    ctaLabel: 'Plan my house party',
    plannerOccasion: 'house-party',
    builderCta: { label: 'Build your own menu', href: '/order' },
    closingHeadline: 'Your home. Our kitchen. One great party.',
    closingCopy: 'Tell us your date and guest count — we handle everything else.',
    metaTitle: 'Vegetarian House Party Catering in Kolkata | Urban Rasoi',
    metaDescription:
      '100% vegetarian house party catering in Kolkata — birthdays, anniversaries and festive gatherings. Six cuisines from our FSSAI-licensed Salt Lake kitchen, from ₹749 a guest.',
  },
  {
    slug: 'corporate',
    name: 'Corporate Catering',
    shortName: 'Corporate',
    eyebrow: 'For Teams & Offices · Kolkata',
    headline: 'Lunch the whole office looks forward to.',
    promise: 'Meetings, offsites and office parties — on schedule, every time.',
    description:
      'Ten years of feeding Kolkata workplaces: 10 to 200+ heads of 100% vegetarian food, without losing the homemade touch.',
    heroImage: '/images/gallery-houseparty.jpg',
    cardImage: '/images/gallery-team.jpg',
    gallery: [
      { src: '/images/gallery-team.jpg', alt: 'Urban Rasoi team preparing vegetarian food at a Kolkata corporate event' },
      { src: '/images/gallery-houseparty.jpg', alt: 'Vegetarian buffet spread ready for office service in Kolkata' },
      { src: '/images/gallery-spread.jpg', alt: 'Quesadillas served at a catered office event' },
      { src: '/images/gallery-kitchen.jpg', alt: 'The Urban Rasoi vegetarian kitchen team at work in Salt Lake' },
    ],
    included: [
      { title: 'Meetings & Townhalls', detail: 'Working lunches, snack boxes, high tea' },
      { title: 'Office Celebrations', detail: 'Festive parties, milestones, team dinners' },
      { title: 'Client Entertainment', detail: 'Quiet, confident impressions' },
      { title: 'Scales With You', detail: '10 to 200+ heads, same quality' },
      { title: 'On Time, Every Time', detail: 'A decade of dependable delivery' },
      { title: 'FSSAI Certified', detail: 'Compliance your admin team can vouch for' },
    ],
    steps: [
      { title: 'Tell us the brief', detail: 'Headcount, date, format — buffet, boxes or platters.' },
      { title: 'Get your proposal', detail: 'Menus and clear pricing, usually within hours.' },
      { title: 'You take the credit', detail: 'Food arrives on schedule, set up, ready.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'd like corporate catering for our office. Date: ___ | Headcount: ___",
    ctaLabel: 'Get a corporate quote',
    plannerOccasion: 'office',
    closingHeadline: 'Be the office hero.',
    closingCopy: 'Share your headcount and date — the proposal follows fast.',
    metaTitle: 'Vegetarian Corporate Catering in Kolkata | Urban Rasoi',
    metaDescription:
      '100% vegetarian corporate catering in Kolkata — team lunches, office parties and client events from 10 to 200+ heads. FSSAI kitchen in Salt Lake, trusted since 2015.',
  },
  {
    slug: 'packed-meals',
    name: 'Custom Packed Meals',
    shortName: 'Packed Meals',
    eyebrow: 'Meals, Made Personal · Kolkata',
    promise: 'Custom vegetarian meal boxes for events, pujas and offices — 20 to 500+.',
    headline: 'Home-cooked. Packed. Delivered.',
    description:
      'Pick your cuisine, portions and schedule. We cook fresh in our vegetarian Salt Lake kitchen and deliver by mealtime across Kolkata.',
    heroImage: '/images/gallery-baguette.jpg',
    cardImage: '/images/gallery-packedmeal.jpg',
    gallery: [
      { src: '/images/gallery-packedmeal.jpg', alt: 'Urban Rasoi branded vegetarian packed meal box with homestyle food' },
      { src: '/images/gallery-bengali.jpg', alt: 'Bengali homestyle vegetarian dishes packed for delivery in Kolkata' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes from Urban Rasoi' },
      { src: '/images/gallery-kitchen.jpg', alt: 'Fresh vegetarian preparation in the Urban Rasoi Salt Lake kitchen' },
    ],
    included: [
      { title: 'Fully Customisable', detail: 'Cuisine, dishes and portion sizes' },
      { title: 'Event & Bulk Orders', detail: 'Pujas, seminars, functions — 20 to 500+' },
      { title: 'Hygienic Packaging', detail: 'Leak-proof, food-grade boxes' },
      { title: 'Six Cuisines', detail: 'Indian, Bengali, South Indian, Indo-Chinese, Continental, desserts' },
      { title: 'Same-Day Fresh', detail: 'Cooked in the morning, delivered by mealtime' },
      { title: 'Flexible Scheduling', detail: 'One-time, weekly or daily' },
    ],
    steps: [
      { title: 'Tell us the count', detail: 'Boxes, cuisine and delivery date.' },
      { title: 'Approve the box', detail: 'Clear per-box pricing, no surprises.' },
      { title: 'Delivered fresh', detail: 'Packed with care, on time, every time.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'm interested in your packed meals. Boxes needed: ___ | Date: ___",
    ctaLabel: 'Order packed meals',
    closingHeadline: 'Fresh boxes, zero hassle.',
    closingCopy: 'Tell us how many and when — done.',
    metaTitle: 'Vegetarian Packed Meals in Kolkata | Urban Rasoi',
    metaDescription:
      'Custom vegetarian packed meals in Kolkata for events, pujas and offices. Homestyle cooking from our FSSAI kitchen in Salt Lake, 20 to 500+ boxes, delivered fresh.',
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
