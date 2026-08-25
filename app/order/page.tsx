import type { Metadata } from 'next'
import { AlacarteOrder } from '@/components/alacarte-order'
import { JsonLd } from '@/components/json-ld'
import { menuSections } from '@/lib/alacarte-menu'
import { businessId } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order Vegetarian Party Food in Kolkata | Urban Rasoi',
  description:
    'Build a 100% vegetarian house party order dish by dish — starters, mains, wraps, biryani and desserts, priced by the piece with no minimum. Send it to our Salt Lake kitchen on WhatsApp.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'Order Vegetarian Party Food | Urban Rasoi Kolkata',
    description: 'Pick exactly the dishes you want — priced by the piece, no minimum order — and send it on WhatsApp.',
    url: '/order',
    images: [{ url: '/images/og-order.jpg', width: 1200, height: 630, alt: 'Urban Rasoi vegetarian house party menu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Vegetarian Party Food | Urban Rasoi Kolkata',
    description: 'Pick exactly the dishes you want — priced by the piece, no minimum order — and send it on WhatsApp.',
    images: ['/images/og-order.jpg'],
  },
}

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Urban Rasoi House Party Menu — À La Carte',
  description:
    '100% vegetarian à la carte house party menu for delivery across Kolkata. Countable dishes priced by the piece, no minimum order.',
  url: `${site.url}/order`,
  provider: { '@id': businessId },
  hasMenuSection: menuSections.map((section) => ({
    '@type': 'MenuSection',
    name: section.name,
    hasMenuItem: section.items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      image: item.image ? `${site.url}${item.image}` : undefined,
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: 'INR',
        description: item.unit,
      },
      suitableForDiet: 'https://schema.org/VegetarianDiet',
    })),
  })),
}

export default function OrderPage() {
  return (
    <>
      <JsonLd data={menuSchema} />
      <AlacarteOrder />
    </>
  )
}
