import type { Metadata } from 'next'
import { PartyPlanner } from '@/components/party-planner'

export const metadata: Metadata = {
  title: 'Plan Your Party in 30 Seconds | Urban Rasoi',
  description:
    'Tap through occasion, guests, date and food mood — get a live estimate and send your party plan straight to our Kolkata kitchen on WhatsApp.',
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
