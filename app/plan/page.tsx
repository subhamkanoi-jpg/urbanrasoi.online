import type { Metadata } from 'next'
import { PartyPlanner } from '@/components/party-planner'

export const metadata: Metadata = {
  title: 'Plan a Vegetarian Party in Kolkata | Urban Rasoi',
  description:
    'Pick a 100% vegetarian menu, swap dishes, see a firm per-guest price, and send your Kolkata party plan to our Salt Lake kitchen on WhatsApp.',
  alternates: { canonical: '/plan' },
  openGraph: {
    title: 'Plan a Vegetarian Party in Kolkata | Urban Rasoi',
    description: 'Build a veg party menu, see the total, send it on WhatsApp.',
    url: '/plan',
    images: ['/images/og-image.jpg'],
  },
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string; src?: string }>
}) {
  const { occasion, src } = await searchParams
  return <PartyPlanner initialOccasion={occasion} source={src} />
}
