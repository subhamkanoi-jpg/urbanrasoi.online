import type { Metadata } from 'next'
import { AlacarteOrder } from '@/components/alacarte-order'
import { menuSections } from '@/lib/alacarte-menu'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order Online | House Party Menu — Urban Rasoi Kolkata',
  description:
    'Build your own house party order dish by dish — starters, mains, wraps, biryani and desserts, priced by the piece with no minimum. See your total live and send it to our Kolkata kitchen on WhatsApp.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'Order Online | Urban Rasoi House Party Menu',
    description: 'Pick exactly the dishes you want — priced by the piece, no minimum order — and send it on WhatsApp.',
    url: '/order',
    images: [{ url: '/images/og-order.jpg', width: 1200, height: 630, alt: 'Urban Rasoi House Party Menu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Online | Urban Rasoi House Party Menu',
    description: 'Pick exactly the dishes you want — priced by the piece, no minimum order — and send it on WhatsApp.',
    images: ['/images/og-order.jpg'],
  },
}

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Urban Rasoi House Party Menu — À La Carte',
  description:
    'Vegetarian à la carte house party menu for delivery across Kolkata. Countable dishes priced by the piece, no minimum order.',
  provider: {
    '@type': 'FoodEstablishment',
    name: site.name,
    url: site.url,
    telephone: site.phone,
    servesCuisine: ['Indian', 'Bengali', 'Rajasthani', 'Indo-Chinese', 'Continental'],
  },
  hasMenuSection: menuSections.map((section) => ({
    '@type': 'MenuSection',
    name: section.name,
    hasMenuItem: section.items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      image: item.image,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }} />
      <AlacarteOrder />
    </>
  )
}
