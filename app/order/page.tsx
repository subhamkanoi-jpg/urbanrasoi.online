import type { Metadata } from 'next'
import { AlacarteOrder } from '@/components/alacarte-order'
import { menuSections } from '@/lib/alacarte-menu'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order À La Carte | House Party Menu — Urban Rasoi Kolkata',
  description:
    'Build your own house party order dish by dish — starters, mains, Bengali and Rajasthani specialities, Chinese, continental and desserts. See your total live and send it to our Kolkata kitchen on WhatsApp.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'Order À La Carte | Urban Rasoi House Party Menu',
    description: 'Pick exactly the dishes you want, see your total as you go, and order on WhatsApp.',
    url: '/order',
    images: ['/images/og-image.jpg'],
  },
}

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Urban Rasoi House Party Menu — À La Carte',
  description: 'Vegetarian à la carte house party menu for delivery across Kolkata. Minimum two portions per dish.',
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
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: 'INR',
        description: `Per portion (${item.unit}) · minimum 2 portions`,
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
