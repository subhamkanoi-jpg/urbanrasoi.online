import type { Metadata } from 'next'
import { Playfair_Display, Jost } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StructuredData } from '@/components/structured-data'
import { site } from '@/lib/site'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Urban Rasoi — Crafted Food Experiences in Kolkata, Since 2015',
    template: '%s',
  },
  description:
    'Urban Rasoi is a boutique cloud kitchen in Kolkata crafting grazing tables, house party catering, corporate catering and packed meals since 2015.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
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
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${jost.variable} bg-background`}>
      <body className="font-sans">
        <StructuredData />
        <SiteHeader />
        <main className="min-h-svh">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
