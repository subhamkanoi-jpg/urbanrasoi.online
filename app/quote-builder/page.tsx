import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Mrs_Saint_Delafield } from 'next/font/google'
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
// geometric sans. Scoped to this page so the rest of the site is untouched.
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--qb-serif', display: 'swap' })
const sans = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--qb-sans', display: 'swap' })
const script = Mrs_Saint_Delafield({ subsets: ['latin'], weight: '400', variable: '--qb-script', display: 'swap' })

export default async function QuoteBuilderPage() {
  const fonts = `${serif.variable} ${sans.variable} ${script.variable}`
  const signedIn = await isSignedIn()
  return (
    <div className={fonts}>
      {signedIn ? <QuoteBuilder storeConfigured={isStoreConfigured()} /> : <QuoteLogin configured={isAuthConfigured()} />}
    </div>
  )
}
