import type { Metadata } from 'next'
import { isAuthConfigured, isSignedIn } from '@/lib/quote-auth'
import { isStoreConfigured } from '@/lib/quote-db'
import { QuoteBuilder } from '@/components/quote-builder/quote-builder'
import { QuoteLogin } from '@/components/quote-builder/quote-login'

/**
 * Staff-only quote builder. Hidden from search, excluded from the sitemap and
 * disallowed in robots.txt; the page itself asks for the staff password.
 */

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quote Builder',
  robots: { index: false, follow: false, nocache: true },
}

// The house party menu's own type: light serif caps, a script flourish and a
// geometric sans. Loaded by the browser rather than through next/font: these
// are only for a staff page, and a Google Fonts hiccup during `next build`
// failed a whole site deploy once. The page falls back cleanly if they are slow.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Montserrat:wght@400;500;600;700&family=Mrs+Saint+Delafield&display=swap'

export default async function QuoteBuilderPage() {
  const signedIn = await isSignedIn()
  return (
    <div>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_HREF} precedence="default" />
      {signedIn ? <QuoteBuilder storeConfigured={isStoreConfigured()} /> : <QuoteLogin configured={isAuthConfigured()} />}
    </div>
  )
}
