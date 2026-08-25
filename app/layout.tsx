import type { Metadata } from 'next'
import { Playfair_Display, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { StructuredData } from '@/components/structured-data'
import { SiteShell } from '@/components/site-shell'
import { MetaPixel } from '@/components/meta-pixel'
import { CookieNotice } from '@/components/cookie-notice'
import { liveCampaignIds } from '@/lib/seasonal'
import { site } from '@/lib/site'
import './globals.css'

/**
 * Seasonal pages drop out of the nav on their own once they expire, so the
 * shell has to be re-rendered periodically rather than frozen at build time.
 */
export const revalidate = 3600

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
    default: 'Urban Rasoi | Vegetarian Party Catering in Kolkata',
    template: '%s',
  },
  description:
    '100% vegetarian catering for house parties, grazing tables and offices in Kolkata. Chef-crafted menus from ₹749 a guest, cooked in our FSSAI kitchen in Salt Lake. Order online or WhatsApp.',
  openGraph: {
    title: 'Urban Rasoi | Vegetarian Party Catering in Kolkata',
    description:
      '100% vegetarian party food from a Salt Lake kitchen — house parties, grazing tables and offices across Kolkata, since 2015.',
    url: '/',
    siteName: 'Urban Rasoi',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Urban Rasoi vegetarian catering in Kolkata' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urban Rasoi | Vegetarian Party Catering in Kolkata',
    description:
      '100% vegetarian party catering in Kolkata — house parties, grazing tables and offices, from ₹749 a guest.',
    images: ['/images/og-image.jpg'],
    site: site.instagramHandle,
  },
  robots: { index: true, follow: true },
  other: {
    'geo.region': 'IN-WB',
    'geo.placename': 'Salt Lake, Kolkata',
    'geo.position': `${site.geo.latitude};${site.geo.longitude}`,
    ICBM: `${site.geo.latitude}, ${site.geo.longitude}`,
    ...(process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION
      ? { 'facebook-domain-verification': process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION }
      : {}),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${playfair.variable} ${jost.variable} bg-background`}>
      <body className="font-sans">
        <StructuredData />
        <SiteShell liveCampaigns={liveCampaignIds()}>{children}</SiteShell>
        <CookieNotice />
        <MetaPixel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
