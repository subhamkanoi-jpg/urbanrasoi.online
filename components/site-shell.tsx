'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { FloatingWhatsApp } from '@/components/whatsapp-button'
import { structuredWhatsappMessage } from '@/lib/site'

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isCampaignPage = pathname === '/kolkata-catering'

  if (isCampaignPage) return <main className="min-h-svh">{children}</main>

  return (
    <>
      <SiteHeader />
      <main className="min-h-svh pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp message={structuredWhatsappMessage} />
    </>
  )
}
