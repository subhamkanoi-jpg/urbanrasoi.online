'use client'

import { site } from '@/lib/site'

export const attributionKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
] as const

type Attribution = Partial<Record<(typeof attributionKeys)[number], string>>

const STORAGE_KEY = 'ur-attribution'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

function readStored(): Attribution {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Attribution
  } catch {
    return {}
  }
}

/**
 * Persist campaign parameters from the landing URL so attribution survives
 * navigation to other pages before the visitor taps a WhatsApp button.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const stored = readStored()
    let changed = false
    for (const key of attributionKeys) {
      const value = params.get(key)
      if (value && stored[key] !== value) {
        stored[key] = value
        changed = true
      }
    }
    if (changed) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage unavailable (private mode) — attribution falls back to URL params.
  }
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  const merged = readStored()
  const params = new URLSearchParams(window.location.search)
  for (const key of attributionKeys) {
    const value = params.get(key)
    if (value) merged[key] = value
  }
  return merged
}

function newEventId(): string {
  try {
    return window.crypto.randomUUID()
  } catch {
    return `ur-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}

type LeadDetails = {
  placement: string
  occasion?: string
  contentName?: string
}

function sendServerEvent(eventName: string, eventId: string, details: LeadDetails, attribution: Attribution) {
  try {
    const payload = JSON.stringify({
      eventName,
      eventId,
      sourceUrl: window.location.href,
      fbclid: attribution.fbclid,
      customData: {
        placement: details.placement,
        occasion: details.occasion,
        content_name: details.contentName,
        content_category: 'Catering',
        campaign: attribution.utm_campaign ?? 'direct',
      },
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/meta/events', new Blob([payload], { type: 'application/json' }))
    } else {
      void fetch('/api/meta/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      })
    }
  } catch {
    // Server-side event is best-effort; the browser pixel already fired.
  }
}

/**
 * Fire a Meta standard Lead event (browser pixel + Conversions API with a
 * shared event ID for deduplication). Returns the attribution snapshot so the
 * caller can append a campaign reference to the WhatsApp message.
 */
export function trackLead(details: LeadDetails): Attribution {
  const attribution = getAttribution()
  const eventId = newEventId()
  const eventData = {
    content_name: details.contentName ?? details.occasion ?? 'Catering enquiry',
    content_category: 'Catering',
    placement: details.placement,
  }
  window.fbq?.('track', 'Lead', eventData, { eventID: eventId })
  window.fbq?.('trackCustom', 'WhatsAppEnquiry', {
    placement: details.placement,
    occasion: details.occasion ?? 'Celebration catering',
    campaign: attribution.utm_campaign ?? 'direct',
  })
  sendServerEvent('Lead', eventId, details, attribution)
  return attribution
}

/** Fire a Meta standard Contact event for phone-call taps. */
export function trackContact(placement: string): void {
  const attribution = getAttribution()
  const eventId = newEventId()
  window.fbq?.('track', 'Contact', { placement }, { eventID: eventId })
  sendServerEvent('Contact', eventId, { placement }, attribution)
}

function attributionSuffix(attribution: Attribution): string {
  const entries = attributionKeys.flatMap((key) => {
    const value = attribution[key]
    return value && key !== 'fbclid' ? [`${key}=${value}`] : []
  })
  return entries.length ? `\n\nCampaign reference: ${entries.join(' | ')}` : ''
}

/**
 * Track the lead and open WhatsApp with the message plus campaign reference.
 * Callers should preventDefault on the anchor click before invoking this.
 */
export function openWhatsapp(message: string, details: LeadDetails): void {
  const attribution = trackLead(details)
  const text = message + attributionSuffix(attribution)
  window.open(
    `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`,
    '_blank',
    'noopener,noreferrer',
  )
}
