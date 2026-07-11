'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isCampaignPage = pathname === '/kolkata-catering'

  if (isCampaignPage) return <main className="min-h-svh">{children}</main>

  return (
    <>
      <SiteHeader />
      <main className="min-h-svh">{children}</main>
      <SiteFooter />
    </>
  )
}
