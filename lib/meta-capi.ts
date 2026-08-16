import { site } from './site'

export const ALLOWED_CAPI_EVENTS = new Set(['Lead', 'Contact', 'ViewContent'])

const ALLOWED_CUSTOM_KEYS = new Set([
  'placement',
  'occasion',
  'content_name',
  'content_category',
  'value',
  'currency',
  'campaign',
])

const allowedHosts = new Set(
  [site.url, 'https://urbanrasoi.online', 'https://www.urbanrasoi.online', 'http://localhost:3000']
    .map((value) => {
      try {
        return new URL(value).host
      } catch {
        return ''
      }
    })
    .filter(Boolean),
)

export function hostFromUrl(value: string | null): string | null {
  if (!value) return null
  try {
    return new URL(value).host
  } catch {
    return null
  }
}

/** True when the request looks like it came from this site, not a random caller. */
export function isAllowedCapiRequest(headers: {
  origin?: string | null
  referer?: string | null
  secFetchSite?: string | null
}): boolean {
  const siteFetch = headers.secFetchSite ?? ''
  if (siteFetch === 'same-origin' || siteFetch === 'same-site') return true

  const originHost = hostFromUrl(headers.origin ?? null)
  if (originHost && allowedHosts.has(originHost)) return true

  const refererHost = hostFromUrl(headers.referer ?? null)
  if (refererHost && allowedHosts.has(refererHost)) return true

  return false
}

export function sanitizeCustomData(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!ALLOWED_CUSTOM_KEYS.has(key)) continue
    if (value == null) continue
    if (typeof value === 'string') {
      cleaned[key] = value.slice(0, 200)
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      cleaned[key] = value
    }
  }
  return Object.keys(cleaned).length ? cleaned : undefined
}

export function isAllowedCapiEvent(eventName: string): boolean {
  return ALLOWED_CAPI_EVENTS.has(eventName)
}
