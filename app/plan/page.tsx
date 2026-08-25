import type { Metadata } from 'next'
import { PartyPlanner } from '@/components/party-planner'

export const metadata: Metadata = {
  title: 'Plan Your Party | Urban Rasoi',
  description:
    'Pick a veg menu, swap dishes, see a firm per-guest price, and send your Kolkata party plan to our kitchen on WhatsApp.',
  alternates: { canonical: '/plan' },
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string; src?: string }>
}) {
  const { occasion, src } = await searchParams
  return <PartyPlanner initialOccasion={occasion} source={src} />
}
