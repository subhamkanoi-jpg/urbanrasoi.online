import type { Metadata } from 'next'
import { AreaLanding } from '@/components/area-landing'
import { getServiceArea } from '@/lib/areas'

const area = getServiceArea('south-kolkata-catering')!

export const metadata: Metadata = {
  title: area.metaTitle,
  description: area.metaDescription,
  alternates: { canonical: `/${area.slug}` },
  openGraph: {
    title: area.metaTitle,
    description: area.metaDescription,
    url: `/${area.slug}`,
    locale: 'en_IN',
    images: [{ url: area.heroImage, alt: area.heroAlt }],
  },
}

export default function SouthKolkataCateringPage() {
  return <AreaLanding area={area} />
}
