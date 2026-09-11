'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { MobileCTABar } from '@/components/mobile-cta-bar'
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
      {/* pb-[env(safe-area-inset-bottom)] + 56px for mobile CTA bar height */}
      <main className="min-h-svh pb-14 md:pb-0">{children}</main>
      <div className="pb-14 md:pb-0">
        <SiteFooter liveCampaigns={liveCampaigns} />
      </div>
      <MobileCTABar />
    </>
  )
}
