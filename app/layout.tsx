import type { Metadata } from 'next'
import { Fraunces, Figtree } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingWhatsApp } from '@/components/whatsapp-button'
import { site, defaultWhatsappMessage } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Urban Rasoi — Crafted Food Experiences in Kolkata, Since 2015',
    template: '%s',
  },
  description:
    'Urban Rasoi is a boutique cloud kitchen in Kolkata crafting grazing tables, house party catering, corporate catering and packed meals since 2015.',
  openGraph: {
    siteName: 'Urban Rasoi',
    type: 'website',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${figtree.variable} bg-background`}>
      <body className="font-sans">
        <SiteHeader />
        <main className="min-h-svh">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp message={defaultWhatsappMessage} />
      </body>
    </html>
  )
}
