export const CONSENT_STORAGE_KEY = 'ur-cookie-consent'
export const CONSENT_EVENT = 'ur-consent-changed'

export type ConsentValue = 'accepted' | 'essential'

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    if (raw === 'essential') return 'essential'
    // Current value, or a legacy ISO timestamp from the old single-button notice.
    return 'accepted'
  } catch {
    return null
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Private mode — consent lasts for this visit only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

export function hasAdConsent(): boolean {
  return readConsent() === 'accepted'
}
