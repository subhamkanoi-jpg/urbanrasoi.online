import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
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

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const defaultTitle = 'Urban Rasoi | Premium Vegetarian House Party Catering in Kolkata'
const defaultDescription =
  'Premium vegetarian catering for house parties, private dinners and celebrations across Kolkata. Cooked in our FSSAI-licensed Salt Lake kitchen since 2015. Menus from ₹749 a guest. Plan on WhatsApp.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: '%s',
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: 'Your party. Our kitchen. Premium vegetarian house-party catering across Kolkata, since 2015.',
    url: '/',
    siteName: 'Urban Rasoi',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Urban Rasoi vegetarian catering in Kolkata' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: 'Premium vegetarian house-party catering in Kolkata, from ₹749 a guest.',
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
    <html lang='en-IN' data-scroll-behavior='smooth' className={`${display.variable} ${body.variable} bg-background`}>
      <body className='font-sans'>
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
