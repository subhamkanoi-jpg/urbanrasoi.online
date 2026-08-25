import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { findItem, menuSections } from '../lib/alacarte-menu'
import {
  GRAZING_PACKAGE_IDS,
  PLATED_PACKAGE_IDS,
  getPackage,
  packagesForGuests,
  slotsForPackage,
  swapPoolIds,
} from '../lib/party-packages'

const FOOD_IDS = new Set(menuSections.flatMap((s) => s.items.map((i) => i.id)))
const LIVE_IDS = new Set([
  'live-chaat',
  'live-tandoor',
  'live-nachos',
  'live-pizza',
  'live-pasta',
  'live-momos',
])

describe('packagesForGuests', () => {
  it('returns no packages under 15', () => {
    assert.deepEqual(packagesForGuests(14).map((p) => p.id), [])
  })

  it('returns only grazing/live-led ids at 15–24', () => {
    assert.deepEqual(
      packagesForGuests(20).map((p) => p.id).sort(),
      [...GRAZING_PACKAGE_IDS].sort(),
    )
    assert.deepEqual(GRAZING_PACKAGE_IDS, [
      'grazing-board',
      'chaat-party',
      'pizza-starters',
      'tandoor-night',
    ])
  })

  it('returns only the seven plated ids at 25+', () => {
    assert.deepEqual(
      packagesForGuests(40).map((p) => p.id).sort(),
      [...PLATED_PACKAGE_IDS].sort(),
    )
    for (const id of GRAZING_PACKAGE_IDS) {
      assert.equal(PLATED_PACKAGE_IDS.includes(id), false)
    }
  })
})

describe('live slot', () => {
  it('is present only when service is live', () => {
    const pkg = getPackage('north-indian')
    assert.ok(pkg)
    const delivery = slotsForPackage(pkg, 'delivery')
    const buffet = slotsForPackage(pkg, 'buffet')
    const live = slotsForPackage(pkg, 'live')
    assert.equal(delivery.some((s) => s.kind === 'live'), false)
    assert.equal(buffet.some((s) => s.kind === 'live'), false)
    assert.equal(live.filter((s) => s.kind === 'live').length, 1)
    assert.equal(live.find((s) => s.kind === 'live')?.itemId, 'live-tandoor')
  })
})

describe('swap pools', () => {
  it('only contain veg à la carte ids plus the six live ids', () => {
    const kinds = ['starter', 'main', 'rice', 'bread', 'noodles', 'dessert', 'chutney', 'live'] as const
    for (const kind of kinds) {
      for (const id of swapPoolIds(kind)) {
        if (kind === 'live') assert.equal(LIVE_IDS.has(id), true, id)
        else assert.equal(FOOD_IDS.has(id), true, id)
      }
    }
  })

  it('uses real default dish ids', () => {
    for (const pkg of [...packagesForGuests(20), ...packagesForGuests(40)]) {
      for (const slot of pkg.slots) {
        assert.equal(FOOD_IDS.has(slot.defaultItemId), true, `${pkg.id}:${slot.defaultItemId}`)
        assert.ok(findItem(slot.defaultItemId), slot.defaultItemId)
      }
      assert.equal(LIVE_IDS.has(pkg.defaultLiveId), true, pkg.defaultLiveId)
    }
  })
})
