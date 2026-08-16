import { site } from '@/lib/site'

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': ['FoodEstablishment', 'LocalBusiness'],
  name: site.name,
  url: site.url,
  image: `${site.url}/images/og-image.jpg`,
  telephone: site.phone,
  description: site.tagline,
  foundingDate: String(site.foundedYear),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Salt Lake',
    addressRegion: 'West Bengal',
    addressCountry: 'IN',
  },
  sameAs: [site.instagram, site.facebook],
  servesCuisine: ['Indian', 'Bengali', 'South Indian', 'Indo-Chinese', 'Continental'],
}

export function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
}
