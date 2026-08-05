/**
 * Seasonal campaigns and when they expire.
 *
 * Festive pages sell a single dated occasion, so they should stop promoting
 * themselves the moment that date passes rather than waiting for someone to
 * remember to unpublish them. Edit `endsOn` here and every link, banner and
 * nav entry follows — nothing else hardcodes these dates.
 *
 * Pages stay reachable after expiry (Meta ads and forwarded WhatsApp links
 * keep pointing at them) but render a closed notice instead of an order form.
 */

export type CampaignId = 'rakhi' | 'rudrabhishek'

export type Campaign = {
  id: CampaignId
  /** Nav label while the campaign is live. */
  label: string
  href: string
  /**
   * Last day the page takes orders, inclusive, in Asia/Kolkata. For dated
   * festive menus this is the order cut-off, not the event — the kitchen needs
   * lead time, so Rakhi closes before its 28 August pickup.
   */
  endsOn: `${number}-${number}-${number}`
  /** Shown on the expired page. */
  closedTitle: string
  closedBody: string
}

export const campaigns: Campaign[] = [
  {
    id: 'rakhi',
    label: 'Rakhi Order',
    href: '/rakhi',
    // Orders close three days before the 28 August pickup, to give the kitchen
    // prep time. Pickup date itself lives in lib/rakhi-menu.ts.
    endsOn: '2026-08-25',
    closedTitle: 'Raksha Bandhan orders have closed',
    closedBody:
      'Our Rakhi 2026 festive menu was a pickup-only special and is no longer taking orders. Our full house-party menu is available all year.',
  },
  {
    id: 'rudrabhishek',
    label: 'Puja Catering',
    href: '/rudrabhishek-catering',
    // Sawan ends on Shravan Purnima.
    endsOn: '2026-08-28',
    closedTitle: 'Sawan catering has wrapped up for this year',
    closedBody:
      'Our satvik Rudra Abhishek menu runs through Sawan. We still cater pujas and family get-togethers year-round — tell us your date and we will plan around your muhurat.',
  },
]

/** Today's date in Asia/Kolkata as YYYY-MM-DD, independent of server timezone. */
function kolkataToday(now: Date): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

export function isCampaignLive(campaign: Campaign, now: Date = new Date()): boolean {
  return kolkataToday(now) <= campaign.endsOn
}

/**
 * Whole days left to order, in Asia/Kolkata. 0 means today is the last day;
 * negative means ordering has closed.
 *
 * Compute this on the server and pass it down — a client component doing its
 * own `new Date()` would disagree with the server-rendered HTML.
 */
export function daysUntilClose(campaign: Campaign, now: Date = new Date()): number {
  const today = Date.parse(`${kolkataToday(now)}T00:00:00Z`)
  const closes = Date.parse(`${campaign.endsOn}T00:00:00Z`)
  return Math.round((closes - today) / (24 * 60 * 60 * 1000))
}

/** Human deadline for the closing date, e.g. "25 August". */
export function closingDateLabel(campaign: Campaign): string {
  return new Date(`${campaign.endsOn}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

export function getCampaign(id: CampaignId): Campaign {
  const found = campaigns.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown campaign: ${id}`)
  return found
}

export function isLive(id: CampaignId, now: Date = new Date()): boolean {
  return isCampaignLive(getCampaign(id), now)
}

/** Campaigns still running, for nav and homepage promos. */
export function liveCampaigns(now: Date = new Date()): Campaign[] {
  return campaigns.filter((c) => isCampaignLive(c, now))
}

/** Serialisable ids, for handing server-computed state to client components. */
export function liveCampaignIds(now: Date = new Date()): CampaignId[] {
  return liveCampaigns(now).map((c) => c.id)
}
