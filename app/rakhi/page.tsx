import type { Metadata } from 'next'
import { CampaignClosed } from '@/components/campaign-closed'
import { RakhiOrder } from '@/components/rakhi-order'
import { getCampaign, isCampaignLive } from '@/lib/seasonal'
import { site } from '@/lib/site'
import { rakhiSections } from '@/lib/rakhi-menu'

/** Re-render hourly so the menu closes itself the day after pickup. */
export const revalidate = 3600

const liveMetadata: Metadata = {
  title: 'Raksha Bandhan Festive Menu 2026 | Urban Rasoi Kolkata',
  description:
    'Order your Raksha Bandhan festive spread from Urban Rasoi — gourmet vegetarian bites curated for home celebrations. Pickup from AE-287, Saltlake Sector-1 on 28 August 2026. Minimum order ₹3,000.',
  alternates: { canonical: '/rakhi' },
  openGraph: {
    title: 'Raksha Bandhan Festive Menu 2026 — Urban Rasoi',
    description:
      'Celebrate Rakhi with a gourmet vegetarian feast. Curated festive bites · pickup from Salt Lake Sector-1 · 28 August 2026.',
    url: `${site.url}/rakhi`,
    siteName: 'Urban Rasoi',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: `${site.url}/images/og-rakhi.png`,
        width: 1200,
        height: 630,
        alt: 'Urban Rasoi Raksha Bandhan Festive Menu 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raksha Bandhan Festive Menu 2026 — Urban Rasoi',
    description:
      'Gourmet vegetarian Rakhi spread · pickup from Salt Lake Sector-1 · 28 August 2026.',
    images: [`${site.url}/images/og-rakhi.png`],
  },
}

/**
 * Once the occasion has passed the page must stop advertising a menu it can no
 * longer sell — otherwise search results and link previews keep promising a
 * pickup date that is gone.
 */
export function generateMetadata(): Metadata {
  const campaign = getCampaign('rakhi')
  if (isCampaignLive(campaign)) return liveMetadata
  return {
    title: 'Raksha Bandhan Menu | Urban Rasoi Kolkata',
    description: campaign.closedBody,
    alternates: { canonical: '/rakhi' },
    robots: { index: false, follow: true },
  }
}

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'FoodEvent',
  name: 'Urban Rasoi Raksha Bandhan Festive Menu 2026',
  description:
    'Gourmet vegetarian festive menu for Raksha Bandhan 2026. Pre-order and self-pickup from AE-287, Saltlake Sector-1, Kolkata.',
  startDate: '2026-08-28',
  endDate: '2026-08-28',
  location: {
    '@type': 'Place',
    name: 'Urban Rasoi',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'AE-287',
      addressLocality: 'Salt Lake Sector 1',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
  },
  organizer: {
    '@type': 'FoodEstablishment',
    name: site.name,
    url: site.url,
    telephone: site.phone,
    servesCuisine: ['Indian', 'Vegetarian'],
  },
  offers: {
    '@type': 'Offer',
    description: 'Festive menu with minimum order ₹3,000',
    priceCurrency: 'INR',
    price: '3000',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-08-01',
    validThrough: '2026-08-28',
  },
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: rakhiSections.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'INR',
          description: item.unit,
        },
        suitableForDiet: 'https://schema.org/VegetarianDiet',
      })),
    })),
  },
}

export default function RakhiPage() {
  const campaign = getCampaign('rakhi')
  if (!isCampaignLive(campaign)) return <CampaignClosed campaign={campaign} />

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />
      <RakhiOrder />
    </>
  )
}
