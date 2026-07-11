import type { Metadata } from 'next'
import { Playfair_Display, Jost } from 'next/font/google'
import { StructuredData } from '@/components/structured-data'
import { SiteShell } from '@/components/site-shell'
import { MetaPixel } from '@/components/meta-pixel'
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
    default: 'Urban Rasoi — Gourmet Party & Get-Together Catering in Kolkata',
    template: '%s',
  },
  description:
    'Gourmet catering for get-togethers, house parties and celebrations in Kolkata — chef-crafted menus, spotless execution and zero kitchen chaos. Grazing tables, corporate catering and packed meals since 2015.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Urban Rasoi — Gourmet Party & Get-Together Catering in Kolkata',
    description:
      'The change Kolkata’s party food scene always needed. Chef-crafted menus, dependable service and zero kitchen chaos — since 2015.',
    url: '/',
    siteName: 'Urban Rasoi',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Urban Rasoi gourmet catering in Kolkata' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urban Rasoi — Gourmet Party & Get-Together Catering in Kolkata',
    description:
      'Chef-crafted menus, dependable service and zero kitchen chaos for get-togethers across Kolkata.',
    images: ['/images/og-image.jpg'],
  },
  ...(process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION
    ? { other: { 'facebook-domain-verification': process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION } }
    : {}),
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
        <SiteShell>{children}</SiteShell>
        <MetaPixel />
      </body>
    </html>
  )
}
