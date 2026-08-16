'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { readConsent, writeConsent } from '@/lib/cookie-consent'

/**
 * Consent gate for advertising cookies. Analytics/ad pixels (Meta) load only
 * after the visitor accepts. Essential site cookies (order drafts) still work
 * if they choose essential-only.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readConsent() == null)
  }, [])

  function choose(value: 'accepted' | 'essential') {
    writeConsent(value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-3 left-3 right-3 z-[60] mx-auto max-w-md rounded-2xl border border-border bg-background/98 p-4 shadow-xl backdrop-blur-sm md:left-4 md:right-auto md:bottom-4"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        We use essential cookies so your order draft is saved, and optional cookies to measure ads.{' '}
        <Link href="/privacy" className="font-semibold text-terracotta underline-offset-2 hover:underline">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => choose('essential')}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
