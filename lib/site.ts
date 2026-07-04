export const site = {
  name: 'Urban Rasoi',
  tagline: 'Crafted food experiences from our Kolkata kitchen, since 2015.',
  url: 'https://urbanrasoi.online',
  phone: '+91 98307 25556',
  whatsappNumber: '919830725556',
  instagram: 'https://instagram.com/urbanrasoi_kolkata',
  instagramHandle: '@urbanrasoi_kolkata',
  facebook: 'https://facebook.com/urbanrasoi',
  fssai: 'FSSAI Lic. No. 12823013000353',
  location: 'Salt Lake, Kolkata',
  rating: '4.9',
  community: '2,000+',
  foundedYear: 2015,
} as const

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const defaultWhatsappMessage =
  "Hi Urban Rasoi! I came across your website and I'd love to know more about your offerings."
