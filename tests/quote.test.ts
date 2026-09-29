import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { findQuoteMenuItem, QUOTE_MENU } from '../lib/quote-menu'
import {
  formatQuoteNumber,
  lineFromMenu,
  quantityLabel,
  quoteTotals,
  roundQuote,
  sanitizeQuote,
  starterQuote,
  todayInKolkata,
} from '../lib/quote-calc'
import { createSessionToken, verifySessionToken, checkPassword } from '../lib/quote-auth'

describe('house party quote menu', () => {
  it('has unique dish names', () => {
    const names = QUOTE_MENU.map((item) => item.name.toLowerCase())
    assert.equal(new Set(names).size, names.length)
  })

  it('carries the revised menu prices', () => {
    assert.equal(findQuoteMenuItem('Cheese & Corn Samosa')?.rate, 310)
    assert.equal(findQuoteMenuItem('Dal-Badam Halwa')?.rate, 630)
    assert.equal(findQuoteMenuItem('Dal-Badam Halwa')?.course, 'Desserts')
    assert.equal(findQuoteMenuItem('Palak Patta Chaat')?.per, 8)
    assert.equal(findQuoteMenuItem('Backend Service Personnel')?.rate, 700)
  })
})

describe('quote totals', () => {
  it('prices the standard eight-guest spread', () => {
    const totals = quoteTotals(starterQuote())
    assert.equal(totals.food, 34400)
    assert.equal(totals.service, 1400)
    assert.equal(totals.discount, 2580)
    assert.equal(totals.total, 33220)
    assert.equal(totals.final, 33200)
  })

  it('discounts service too when asked', () => {
    const totals = quoteTotals({ ...starterQuote(), discountOn: 'all' })
    assert.equal(totals.discount, 2685)
  })

  it('rounds the way the rounding option says', () => {
    assert.equal(roundQuote(33220, 'n100'), 33200)
    assert.equal(roundQuote(33250, 'n100'), 33300)
    assert.equal(roundQuote(33290, 'd100'), 33200)
    assert.equal(roundQuote(33224, 'n50'), 33200)
    assert.equal(roundQuote(33226, 'n10'), 33230)
    assert.equal(roundQuote(33220.4, 'none'), 33220)
  })
})

describe('quantities', () => {
  it('reads naturally', () => {
    assert.equal(quantityLabel(lineFromMenu('Cheese & Corn Samosa', 8)), '48 pcs')
    assert.equal(quantityLabel(lineFromMenu('Dal-Badam Halwa', 8)), '4 L')
    assert.equal(quantityLabel(lineFromMenu('Classic Au Gratin', 1)), '750 ml')
    assert.equal(quantityLabel(lineFromMenu('Backend Service Personnel', 2)), '2 people')
  })
})

describe('saving', () => {
  it('rejects things that are not quotes', () => {
    assert.equal(sanitizeQuote(null), null)
    assert.equal(sanitizeQuote({ lines: 'no' }), null)
    assert.equal(sanitizeQuote({ lines: [{ name: '' }] }), null)
  })

  it('clamps bad numbers instead of storing them', () => {
    const clean = sanitizeQuote({ ...starterQuote(), discountPct: 400, lines: [{ name: 'Test', rate: -5, portions: 'x', unit: 'kg' }] })
    assert.ok(clean)
    assert.equal(clean.discountPct, 100)
    assert.equal(clean.lines[0].rate, 0)
    assert.equal(clean.lines[0].portions, 0)
    assert.equal(clean.lines[0].unit, 'pcs')
  })

  it('numbers quotes by Kolkata date', () => {
    assert.equal(formatQuoteNumber('2026-09-29', 3), 'UR-260929-03')
    // 20:00 UTC on the 29th is already the 30th in Kolkata.
    assert.equal(todayInKolkata(new Date('2026-09-29T20:00:00Z')), '2026-09-30')
  })
})

describe('staff sign-in', () => {
  it('accepts only the right password and fresh sessions', () => {
    process.env.QUOTE_BUILDER_PASSWORD = 'dal-badam'
    assert.equal(checkPassword('dal-badam'), true)
    assert.equal(checkPassword('dal'), false)

    const now = Date.now()
    const token = createSessionToken(now)!
    assert.equal(verifySessionToken(token, now), true)
    assert.equal(verifySessionToken(token, now + 31 * 24 * 60 * 60 * 1000), false)
    assert.equal(verifySessionToken(token.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')), now), false)

    process.env.QUOTE_BUILDER_PASSWORD = 'changed'
    assert.equal(verifySessionToken(token, now), false)
    delete process.env.QUOTE_BUILDER_PASSWORD
  })
})
