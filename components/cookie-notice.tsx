'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ur-cookie-consent'

/**
 * A lightweight, non-blocking cookie notice. It is informational rather than a
 * consent gate: the site's analytics/ad cookies (Meta Pixel) load regardless,
 * so ad measurement is never lost — this simply discloses their use and links
 * to the privacy policy. Dismissal is remembered so it shows once per device.
 */
export function CookieNotice() {
  // Start hidden so the server and first client render agree; reveal only after
  // we have checked localStorage on the client.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    } catch {}
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
        We use cookies to improve your experience and measure our ads. By using this site you agree to this.{' '}
        <Link href="/privacy" className="font-semibold text-terracotta underline-offset-2 hover:underline">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
