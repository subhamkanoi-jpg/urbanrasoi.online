'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

function FloatingPlanBar() {
  return (
    <Link
      href="/plan?src=floating"
      className="fixed bottom-3 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:bottom-6 md:left-auto md:right-6 md:w-auto md:px-6"
    >
      Plan my party <span aria-hidden="true">→</span>
    </Link>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isBarePage = pathname === '/kolkata-catering' || pathname === '/plan'

  if (isBarePage) return <main className="min-h-svh">{children}</main>

  return (
    <>
      <SiteHeader />
      <main className="min-h-svh pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <FloatingPlanBar />
    </>
  )
}
