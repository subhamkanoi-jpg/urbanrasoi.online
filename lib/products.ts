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
  cardImage: string
  gallery: { src: string; alt: string }[]
  included: { title: string; detail: string }[]
  steps: { title: string; detail: string }[]
  whatsappMessage: string
  ctaLabel: string
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
    eyebrow: 'Our Signature',
    headline: 'The table everyone gathers around.',
    promise: 'Styled gourmet spreads — delivered, set up, ready to wow.',
    description:
      'Composed like a still life, grazed like a feast. We design, deliver and style it. You host.',
    heroImage: '/images/gallery-event.jpg',
    heroImagePosition: 'object-[80%_center]',
    cardImage: '/images/gallery-event.jpg',
    gallery: [
      { src: '/images/gallery-event.jpg', alt: 'Dabeli sliders and mezze styled on a grazing board' },
      { src: '/images/gallery-spread.jpg', alt: 'Three cheese quesadilla with salsa from our grazing menu' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes from our kitchen' },
      { src: '/images/gallery-houseparty.jpg', alt: 'A full spread styled and ready for guests' },
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
      { title: 'Say hello', detail: 'WhatsApp us your date, guests and mood.' },
      { title: 'We design it', detail: 'A table styled to your gathering — from 15 guests.' },
      { title: 'You host', detail: 'We arrive, set up and leave them talking.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'd love a Grazing Table. Occasion: ___ | Date: ___ | Guests: ___",
    ctaLabel: 'Plan my grazing table',
    closingHeadline: 'Give them a table to talk about.',
    closingCopy: 'Send your date and guest count — we design the rest.',
    metaTitle: 'Gourmet Grazing Tables in Kolkata | Urban Rasoi',
    metaDescription:
      'Artfully styled gourmet grazing tables for house parties and celebrations in Kolkata. Designed, delivered and set up by Urban Rasoi — crafting food experiences since 2015.',
  },
  {
    slug: 'house-parties',
    name: 'House Party Catering',
    shortName: 'House Parties',
    eyebrow: 'Celebrations at Home',
    headline: 'You host. We handle the food.',
    promise: `Curated party menus, delivered warm — from ${site.partyMenusFrom} a guest.`,
    description:
      'Ten guests or a full house. Homestyle Indian, Bengali, Indo-Chinese, Continental and desserts — cooked fresh that day.',
    heroImage: '/images/gallery-diwali.jpg',
    cardImage: '/images/gallery-houseparty.jpg',
    gallery: [
      { src: '/images/gallery-houseparty.jpg', alt: 'House party buffet with curated Indian dishes' },
      { src: '/images/gallery-bengali.jpg', alt: 'Traditional Bengali festive dishes' },
      { src: '/images/gallery-diwali.jpg', alt: 'Live service at a festive home celebration' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
    ],
    included: [
      { title: 'Menus Built Around You', detail: 'Your guests, your taste, your occasion' },
      { title: 'Six Cuisines', detail: 'Indian, Bengali, South Indian, Indo-Chinese, Continental, desserts' },
      { title: 'Festive Specials', detail: 'Diwali, Poila Boishakh, Christmas' },
      { title: 'Fresh, Never Reheated', detail: 'Cooked same day, FSSAI-certified kitchen' },
      { title: 'Doorstep Delivery', detail: 'Warm, on time, ready to serve' },
      { title: 'Portion Planning', detail: 'Nothing runs short, nothing wasted' },
    ],
    steps: [
      { title: 'Say hello', detail: 'One WhatsApp with your date and guest count.' },
      { title: 'Pick your menu', detail: 'We tailor it. You approve it.' },
      { title: 'Take the compliments', detail: 'Fresh food arrives ready to plate.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'm planning a house party and would like a menu. Date: ___ | Guests: ___",
    ctaLabel: 'Plan my house party',
    builderCta: { label: 'Build your own menu', href: '/menu.html' },
    closingHeadline: 'Your home. Our kitchen. One great party.',
    closingCopy: 'Send your date and guest count — hosting just got effortless.',
    metaTitle: 'House Party Catering in Kolkata | Urban Rasoi',
    metaDescription:
      'Curated house party catering in Kolkata — birthdays, anniversaries and festive gatherings. Six cuisines, fresh from our FSSAI-certified kitchen since 2015.',
  },
  {
    slug: 'corporate',
    name: 'Corporate Catering',
    shortName: 'Corporate',
    eyebrow: 'For Teams & Offices',
    headline: 'Lunch the whole office looks forward to.',
    promise: 'Meetings, offsites and office parties — on schedule, every time.',
    description:
      'Ten years of feeding Kolkata workplaces: 10 to 200+ heads, without losing the homemade touch.',
    heroImage: '/images/gallery-houseparty.jpg',
    cardImage: '/images/gallery-team.jpg',
    gallery: [
      { src: '/images/gallery-team.jpg', alt: 'Urban Rasoi team preparing food at a large event' },
      { src: '/images/gallery-houseparty.jpg', alt: 'Buffet spread ready for service' },
      { src: '/images/gallery-spread.jpg', alt: 'Quesadillas served at a catered event' },
      { src: '/images/gallery-kitchen.jpg', alt: 'The Urban Rasoi kitchen team at work' },
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
    closingHeadline: 'Be the office hero.',
    closingCopy: 'Share your headcount and date — the proposal follows fast.',
    metaTitle: 'Corporate Catering in Kolkata | Urban Rasoi',
    metaDescription:
      'Dependable corporate catering in Kolkata — team lunches, office parties and client events from 10 to 200+ heads. FSSAI-certified kitchen, trusted since 2015.',
  },
  {
    slug: 'packed-meals',
    name: 'Custom Packed Meals',
    shortName: 'Packed Meals',
    eyebrow: 'Meals, Made Personal',
    promise: 'Custom meal boxes for events, pujas and offices — 20 to 500+.',
    headline: 'Home-cooked. Packed. Delivered.',
    description:
      'Pick your cuisine, portions and schedule. We cook fresh in Salt Lake and deliver by mealtime.',
    heroImage: '/images/gallery-baguette.jpg',
    cardImage: '/images/gallery-packedmeal.jpg',
    gallery: [
      { src: '/images/gallery-packedmeal.jpg', alt: 'Urban Rasoi branded packed meal box with homestyle food' },
      { src: '/images/gallery-bengali.jpg', alt: 'Bengali homestyle dishes' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
      { src: '/images/gallery-kitchen.jpg', alt: 'Fresh preparation in the Urban Rasoi kitchen' },
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
    metaTitle: 'Custom Packed Meals in Kolkata | Urban Rasoi',
    metaDescription:
      'Custom packed meal boxes in Kolkata for events, pujas, offices and bulk orders. Homestyle cooking, hygienic packaging, delivered fresh — since 2015.',
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
