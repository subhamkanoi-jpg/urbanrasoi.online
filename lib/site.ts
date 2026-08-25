export const site = {
  name: 'Urban Rasoi',
  tagline: 'Crafted food experiences from our Kolkata kitchen, since 2015.',
  url: 'https://www.urbanrasoi.online',
  phone: '+91 98307 25556',
  phoneE164: '+919830725556',
  whatsappNumber: '919830725556',
  instagram: 'https://www.instagram.com/urbanrasoi_kolkata/',
  instagramHandle: '@urbanrasoi_kolkata',
  facebook: 'https://www.facebook.com/urbanrasoi',
  fssai: 'FSSAI Lic. No. 12823013000353',
  fssaiNumber: '12823013000353',
  location: 'Salt Lake, Kolkata',
  rating: '4.9',
  community: '2,000+',
  foundedYear: 2015,
  partyMenusFrom: '₹749',
  address: {
    street: 'AE-287, Salt Lake Sector 1',
    locality: 'Kolkata',
    region: 'West Bengal',
    postalCode: '700064',
    country: 'IN',
    line: 'AE-287, Salt Lake Sector 1, Kolkata 700064',
  },
  geo: {
    latitude: 22.59112,
    longitude: 88.40403,
  },
  /** Neighbourhoods we actually cook for — used in copy, footer and schema. */
  areasServed: [
    'Salt Lake',
    'New Town',
    'Rajarhat',
    'Sector V',
    'Alipore',
    'Ballygunge',
    'Gariahat',
    'Park Street',
    'Tollygunge',
    'Behala',
    'Dum Dum',
    'Howrah',
  ],
} as const

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const structuredWhatsappMessage = `Hi Urban Rasoi! I am planning an event and would like menu options, pricing and availability.

Occasion:
Date:
Approx. guest count:
Area in Kolkata:
Dietary preferences or allergies:
Service needed (delivery/setup/staff):`

export const defaultWhatsappMessage = structuredWhatsappMessage
