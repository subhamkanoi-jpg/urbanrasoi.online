'use client'

/**
 * Draft-order persistence.
 *
 * Baskets are saved so a customer can close the tab mid-order and pick up
 * where they left off. Two rules keep that from turning into a stale order
 * greeting them weeks later:
 *
 *  1. drafts expire (see MAX_AGE_MS), and
 *  2. flows call `clearOrderState` once the order has actually been sent.
 *
 * State is wrapped with a timestamp, so drafts written by older builds (which
 * had no timestamp) fail the shape check and are discarded.
 */

const MAX_AGE_MS = 24 * 60 * 60 * 1000

type Envelope<T> = { savedAt: number; data: T }

function isEnvelope<T>(value: unknown): value is Envelope<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Envelope<T>).savedAt === 'number' &&
    'data' in value
  )
}

/** Read a saved draft, or null if it is missing, malformed or stale. */
export function loadOrderState<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isEnvelope<T>(parsed)) {
      window.localStorage.removeItem(key)
      return null
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(key)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

export function saveOrderState<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data } satisfies Envelope<T>))
  } catch {
    // Private mode or quota exceeded — the draft just will not persist.
  }
}

export function clearOrderState(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to do — the in-memory reset has already happened.
  }
}
