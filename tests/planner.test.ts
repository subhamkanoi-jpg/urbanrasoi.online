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
import {
  applyGuests,
  applyService,
  billedGuests,
  canSendPlan,
  composeWhatsappMessage,
  emptyPlan,
  estimatePlan,
  perGuestPrice,
  selectPackage,
  swapSlot,
  type Plan,
} from '../lib/planner'

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

describe('price table', () => {
  it('matches service × budget', () => {
    assert.equal(perGuestPrice('delivery', 'intimate'), 749)
    assert.equal(perGuestPrice('delivery', 'signature'), 849)
    assert.equal(perGuestPrice('buffet', 'intimate'), 849)
    assert.equal(perGuestPrice('buffet', 'signature'), 949)
    assert.equal(perGuestPrice('live', 'intimate'), 999)
    assert.equal(perGuestPrice('live', 'signature'), 1199)
  })

  it('totals per-guest × billed guests; 100+ bills as 100', () => {
    assert.equal(billedGuests(40), 40)
    assert.equal(billedGuests(100), 100)
    assert.equal(billedGuests(140), 100)
    const plan: Plan = {
      ...emptyPlan,
      guests: 40,
      service: 'delivery',
      budget: 'intimate',
      packageId: 'north-indian',
      slots: [{ slotId: 'starter-1', itemId: 'quesadillas' }],
    }
    assert.deepEqual(estimatePlan(plan), { perGuest: 749, total: 749 * 40 })
    assert.equal(estimatePlan({ ...plan, guests: 14 }), null)
    assert.equal(estimatePlan({ ...plan, packageId: undefined, slots: [] }), null)
  })
})

describe('gates', () => {
  it('clears a plated package at 20 guests', () => {
    const plated = selectPackage(
      { ...emptyPlan, guests: 40, service: 'delivery', budget: 'intimate' },
      'north-indian',
    )
    assert.equal(plated.packageId, 'north-indian')
    const { plan, cleared } = applyGuests(plated, 20)
    assert.equal(cleared, true)
    assert.equal(plan.packageId, undefined)
    assert.deepEqual(plan.slots, [])
    assert.equal(plan.guests, 20)
  })
})

describe('send + WhatsApp', () => {
  it('allows under-15 plans without service/budget/package', () => {
    assert.equal(canSendPlan({ ...emptyPlan, occasion: 'birthday', guests: 10 }), true)
    assert.equal(canSendPlan({ ...emptyPlan, guests: 10 }), false)
    assert.equal(
      canSendPlan({ ...emptyPlan, occasion: 'birthday', guests: 40, service: 'delivery' }),
      false,
    )
  })

  it('includes package name, swapped dish, and firm total', () => {
    let plan = selectPackage(
      { ...emptyPlan, occasion: 'birthday', guests: 40, service: 'delivery', budget: 'intimate' },
      'north-indian',
    )
    plan = swapSlot(plan, 'starter-1', 'quesadillas')
    const text = composeWhatsappMessage(plan)
    assert.match(text, /North Indian/)
    assert.match(text, /Bite Size Quesadillas/)
    assert.match(text, /₹29,960/)
    assert.match(text, /₹749/)
    assert.doesNotMatch(text, /–₹/)
  })
})
