'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import type { CampaignId } from '@/lib/seasonal'

export function SiteShell({
  children,
  liveCampaigns = [],
}: {
  children: ReactNode
  /** Computed on the server so the nav never disagrees with the rendered HTML. */
  liveCampaigns?: CampaignId[]
}) {
  const pathname = usePathname()
  // Focused standalone pages with no chrome — these carry their own logo link home.
  const isBarePage =
    pathname === '/kolkata-catering' ||
    pathname === '/plan' ||
    pathname === '/order'

  if (isBarePage) return <main className="min-h-svh">{children}</main>

  return (
    <>
      <SiteHeader liveCampaigns={liveCampaigns} />
      <main className="min-h-svh">{children}</main>
      <SiteFooter liveCampaigns={liveCampaigns} />
    </>
  )
}
