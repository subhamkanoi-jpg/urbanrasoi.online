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
    headline: 'A table your guests will gather around all evening.',
    promise:
      'Artfully styled gourmet spreads — designed, delivered and set up at your venue, ready to wow.',
    description:
      'Our grazing tables are the centrepiece of any celebration. Every board is composed like a still life — layers of colour, texture and flavour that invite guests to linger, graze and photograph. We handle everything from styling to setup, so you simply host.',
    heroImage: '/images/gallery-event.jpg',
    heroImagePosition: 'object-[80%_center]',
    cardImage: '/images/gallery-event.jpg',
    gallery: [
      { src: '/images/gallery-grazing.jpg', alt: 'Styled gourmet grazing table spread' },
      { src: '/images/gallery-spread.jpg', alt: 'Three cheese quesadilla with salsa from our grazing menu' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes from our kitchen' },
      { src: '/images/gallery-minipartay.jpg', alt: 'Mini party grazing setup with bite-sized portions' },
    ],
    included: [
      { title: 'Mediterranean Mezze', detail: 'Hummus, dips, olives, crackers and artisan breads' },
      { title: 'Live Nacho Station', detail: 'Loaded nachos with salsas, cheese and fresh toppings' },
      { title: 'Dabeli Sliders', detail: 'A gourmet spin on the beloved street classic' },
      { title: 'Quesadillas', detail: 'Golden, cheese-pulled and made for grazing' },
      { title: 'Mango Sandesh & Monte Carlo Cups', detail: 'Signature desserts to end on a high note' },
      { title: 'Styling, Setup & Service', detail: 'Boards, props, tea and coffee — we arrive, we style, you host' },
    ],
    steps: [
      { title: 'Tell us about your occasion', detail: 'Share your date, guest count and the mood you want on WhatsApp.' },
      { title: 'We design your table', detail: 'A curated menu and styling plan tailored to your gathering — starting at 15 guests.' },
      { title: 'We set up, you host', detail: 'Our team arrives, styles the spread and leaves your guests something to talk about.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'd love a Grazing Table. Occasion: ___ | Date: ___ | Guests: ___",
    ctaLabel: 'Plan my grazing table',
    closingHeadline: 'Make your next gathering unforgettable.',
    closingCopy:
      'Tell us your date and guest count — we will design a grazing table your guests will remember long after the last bite.',
    metaTitle: 'Gourmet Grazing Tables in Kolkata | Urban Rasoi',
    metaDescription:
      'Artfully styled gourmet grazing tables for house parties and celebrations in Kolkata. Designed, delivered and set up by Urban Rasoi — crafting food experiences since 2015.',
  },
  {
    slug: 'house-parties',
    name: 'House Party Catering',
    shortName: 'House Parties',
    eyebrow: 'Celebrations at Home',
    headline: 'Host the party. We will handle the food.',
    promise:
      'Curated menus for birthdays, anniversaries and get-togethers — delivered warm to your doorstep.',
    description:
      'From an intimate dinner for ten to a full-house celebration, we build menus around your occasion. Homestyle Indian, Bengali classics, Indo-Chinese favourites, Continental spreads and desserts — cooked fresh in our kitchen and delivered ready to serve.',
    heroImage: '/images/gallery-houseparty.jpg',
    cardImage: '/images/gallery-houseparty.jpg',
    gallery: [
      { src: '/images/gallery-houseparty.jpg', alt: 'House party buffet with curated Indian dishes' },
      { src: '/images/gallery-bengali.jpg', alt: 'Traditional Bengali festive dishes' },
      { src: '/images/gallery-diwali.jpg', alt: 'Live service at a festive home celebration' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
    ],
    included: [
      { title: 'Menus Built Around You', detail: 'Veg, non-veg or mixed — curated for your guests and occasion' },
      { title: 'Six Cuisines, One Kitchen', detail: 'Homestyle Indian, Bengali, South Indian, Indo-Chinese, Continental and desserts' },
      { title: 'Festive Specials', detail: 'Diwali, Poila Boishakh, Christmas — menus that match the moment' },
      { title: 'Fresh, Never Reheated', detail: 'Cooked the same day in our FSSAI-certified kitchen' },
      { title: 'Doorstep Delivery', detail: 'Packed with care, delivered warm and on time' },
      { title: 'Serving Guidance', detail: 'Portion planning help so nothing runs short — or goes to waste' },
    ],
    steps: [
      { title: 'Share your occasion', detail: 'Date, guest count and preferences — one WhatsApp message is all it takes.' },
      { title: 'Approve your menu', detail: 'We propose a curated menu and quote. Tweak it until it feels right.' },
      { title: 'Dinner is served', detail: 'Fresh food arrives at your door, ready to plate. You take the compliments.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'm planning a house party and would like a menu. Date: ___ | Guests: ___",
    ctaLabel: 'Plan my house party',
    closingHeadline: 'Your home. Our kitchen. One great party.',
    closingCopy:
      'Send us your date and guest count — we will send back a menu that makes hosting effortless.',
    metaTitle: 'House Party Catering in Kolkata | Urban Rasoi',
    metaDescription:
      'Curated house party catering in Kolkata — birthdays, anniversaries and festive gatherings. Six cuisines, fresh from our FSSAI-certified kitchen since 2015.',
  },
  {
    slug: 'corporate',
    name: 'Corporate Catering',
    shortName: 'Corporate',
    eyebrow: 'For Teams & Offices',
    headline: 'Food that makes the whole office look forward to lunch.',
    promise:
      'Reliable, delicious catering for meetings, offsites and office celebrations — delivered on schedule, every time.',
    description:
      'Ten years of feeding Kolkata has taught us what workplaces need: consistency, punctuality and food people actually talk about. From daily team lunches to festive office parties and client events, we scale from 10 to 200+ heads without losing the homemade touch.',
    heroImage: '/images/gallery-team.jpg',
    cardImage: '/images/gallery-team.jpg',
    gallery: [
      { src: '/images/gallery-team.jpg', alt: 'Urban Rasoi team preparing food at a large event' },
      { src: '/images/gallery-houseparty.jpg', alt: 'Buffet spread ready for service' },
      { src: '/images/gallery-spread.jpg', alt: 'Quesadillas served at a catered event' },
      { src: '/images/gallery-kitchen.jpg', alt: 'The Urban Rasoi kitchen team at work' },
    ],
    included: [
      { title: 'Meetings & Townhalls', detail: 'Working lunches, snack boxes and high-tea spreads' },
      { title: 'Office Celebrations', detail: 'Festive parties, milestones and team dinners' },
      { title: 'Client Entertainment', detail: 'Menus that make a quiet, confident impression' },
      { title: 'Scales With You', detail: 'From 10 to 200+ heads, same quality at every size' },
      { title: 'On-Time, Every Time', detail: 'A decade of dependable delivery across Kolkata' },
      { title: 'FSSAI-Certified Kitchen', detail: 'Full hygiene compliance your admin team can vouch for' },
    ],
    steps: [
      { title: 'Tell us your requirement', detail: 'Headcount, date, budget and format — buffet, boxes or platters.' },
      { title: 'Get a tailored proposal', detail: 'Menu options and transparent pricing, usually within hours.' },
      { title: 'We deliver, you shine', detail: 'Food arrives on schedule, set up and ready. Your team does the enjoying.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'd like corporate catering for our office. Date: ___ | Headcount: ___",
    ctaLabel: 'Get a corporate quote',
    closingHeadline: 'Give your team something to look forward to.',
    closingCopy:
      'Share your headcount and date — we will send a proposal that makes you the office hero.',
    metaTitle: 'Corporate Catering in Kolkata | Urban Rasoi',
    metaDescription:
      'Dependable corporate catering in Kolkata — team lunches, office parties and client events from 10 to 200+ heads. FSSAI-certified kitchen, trusted since 2015.',
  },
  {
    slug: 'packed-meals',
    name: 'Custom Packed Meals',
    shortName: 'Packed Meals',
    eyebrow: 'Meals, Made Personal',
    promise:
      'Wholesome, homestyle meal boxes — customised to your taste and delivered fresh, daily or on demand.',
    headline: 'Home-cooked goodness, packed and delivered.',
    description:
      'For events, bulk orders, pujas or daily office tiffins — our packed meals bring the comfort of home cooking in neat, hygienic boxes. Choose your cuisine, portion size and schedule; we handle the rest from our Salt Lake kitchen.',
    heroImage: '/images/gallery-baguette.jpg',
    cardImage: '/images/gallery-packedmeal.jpg',
    gallery: [
      { src: '/images/gallery-packedmeal.jpg', alt: 'Urban Rasoi branded packed meal box with homestyle food' },
      { src: '/images/gallery-bengali.jpg', alt: 'Bengali homestyle dishes' },
      { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
      { src: '/images/gallery-kitchen.jpg', alt: 'Fresh preparation in the Urban Rasoi kitchen' },
    ],
    included: [
      { title: 'Fully Customisable', detail: 'Pick cuisine, dishes and portion sizes to suit your need' },
      { title: 'Event & Bulk Orders', detail: 'Pujas, seminars, family functions — 20 to 500+ boxes' },
      { title: 'Hygienic Packaging', detail: 'Leak-proof, food-grade boxes packed in our certified kitchen' },
      { title: 'Six Cuisines', detail: 'Homestyle Indian, Bengali, South Indian, Indo-Chinese, Continental, desserts' },
      { title: 'Fresh Same-Day Cooking', detail: 'Cooked in the morning, delivered by mealtime' },
      { title: 'Flexible Scheduling', detail: 'One-time, weekly or daily — on your calendar' },
    ],
    steps: [
      { title: 'Tell us what you need', detail: 'Number of boxes, cuisine preference and delivery date.' },
      { title: 'Approve menu & pricing', detail: 'We send box options with transparent per-box pricing.' },
      { title: 'Fresh boxes, delivered', detail: 'Packed with care and delivered on time to your venue.' },
    ],
    whatsappMessage:
      "Hi Urban Rasoi! I'm interested in your packed meals. Boxes needed: ___ | Date: ___",
    ctaLabel: 'Order packed meals',
    closingHeadline: 'Fresh boxes, zero hassle.',
    closingCopy:
      'Tell us how many boxes and when — we will take care of everything in between.',
    metaTitle: 'Custom Packed Meals in Kolkata | Urban Rasoi',
    metaDescription:
      'Custom packed meal boxes in Kolkata for events, pujas, offices and bulk orders. Homestyle cooking, hygienic packaging, delivered fresh — since 2015.',
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
