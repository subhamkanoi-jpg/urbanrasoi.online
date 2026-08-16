import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isAllowedCapiEvent, isAllowedCapiRequest, sanitizeCustomData } from '../lib/meta-capi'
import { kolkataToday } from '../lib/dates'
import { isCampaignLive, getCampaign } from '../lib/seasonal'
import { site } from '../lib/site'

describe('site url', () => {
  it('uses the www host that production serves', () => {
    assert.equal(site.url, 'https://www.urbanrasoi.online')
  })
})

describe('CAPI guards', () => {
  it('allows only Lead, Contact and ViewContent', () => {
    assert.equal(isAllowedCapiEvent('Lead'), true)
    assert.equal(isAllowedCapiEvent('Purchase'), false)
  })

  it('allows same-origin and our hosts', () => {
    assert.equal(isAllowedCapiRequest({ secFetchSite: 'same-origin' }), true)
    assert.equal(isAllowedCapiRequest({ origin: 'https://www.urbanrasoi.online' }), true)
    assert.equal(isAllowedCapiRequest({ referer: 'https://urbanrasoi.online/order' }), true)
    assert.equal(isAllowedCapiRequest({ origin: 'https://evil.example' }), false)
    assert.equal(isAllowedCapiRequest({}), false)
  })

  it('keeps only allowlisted custom data', () => {
    const cleaned = sanitizeCustomData({
      placement: 'rakhi-order',
      value: 3000,
      evil: '<script>',
      currency: 'INR',
    })
    assert.deepEqual(cleaned, { placement: 'rakhi-order', value: 3000, currency: 'INR' })
  })
})

describe('Kolkata dates', () => {
  it('is independent of the server timezone offset', () => {
    const morningUtc = new Date('2026-08-16T02:00:00Z')
    assert.equal(kolkataToday(morningUtc), '2026-08-16')
    const lateUtc = new Date('2026-08-16T20:00:00Z')
    assert.equal(kolkataToday(lateUtc), '2026-08-17')
  })

  it('treats Rakhi as live on 25 Aug and closed on 26 Aug', () => {
    const rakhi = getCampaign('rakhi')
    assert.equal(isCampaignLive(rakhi, new Date('2026-08-25T06:00:00Z')), true)
    assert.equal(isCampaignLive(rakhi, new Date('2026-08-26T06:00:00Z')), false)
  })
})
