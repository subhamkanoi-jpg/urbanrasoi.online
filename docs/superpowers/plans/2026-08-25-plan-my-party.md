# Plan My Party Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/plan` as a veg-only wizard (occasion → guests → service → budget → package → dish swaps → firm WhatsApp bill) using CaterNinja combo logic and Urban Rasoi price bands.

**Architecture:** Catalog and swap pools live in `lib/party-packages.ts`. Gates, price table, plan mutations, and WhatsApp text live in `lib/planner.ts`. `components/party-planner.tsx` is UI only — it calls planner helpers, it does not reimplement price or gate math. `/order` is not touched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, existing `shareOrderSlip`, Node test runner via `tsx --test`.

## Global Constraints

- `/plan` only — do not edit home, `/order`, grazing, puja, Rakhi
- Vegetarian; no `pureVeg` toggle; no cuisine-mood chips
- Price table only: Delivery 749/849, Buffet 849/949, Live 999/1199
- Do not import CaterNinja rupees
- Keep terracotta / serif / cream chips / `rounded-2xl` cards
- Firm total, not a range; WhatsApp booking, no payment
- 25+ = seven plated packages only; 15–24 = four grazing/live-led; under 15 = no ₹
- Default food ids must exist in `lib/alacarte-menu.ts`; live stations are the six ids in the spec
- Storage key `ur-plan-v2` (ignore v1)
- Spec table “25–500 plated + grazing” is superseded by the later rule and tests: **25+ plated only**

## File map

| File | Responsibility |
|---|---|
| Create `lib/party-packages.ts` | Package catalog, slot recipes, swap pools, live stations, `packagesForGuests`, `slotsForPackage` |
| Modify `lib/planner.ts` | New `Plan` type, services, budgets, estimate (single number), mutations, WhatsApp |
| Modify `components/party-planner.tsx` | New steps; drop date-as-step, cuisine chips, pure veg |
| Modify `app/plan/page.tsx` | Metadata copy |
| Create `tests/planner.test.ts` | Spec tests 1–10 |
| Modify `package.json` | `test` script runs both test files |
| Read-only `lib/alacarte-menu.ts` | Dish names/ids |

---

### Task 1: Package catalog

**Files:**
- Create: `lib/party-packages.ts`
- Create: `tests/planner.test.ts` (catalog + swap-pool cases first)
- Test: `tests/planner.test.ts`

**Interfaces:**
- Consumes: `menuSections`, `findItem` from `lib/alacarte-menu.ts`
- Produces:
  - `type SlotKind = 'starter' | 'main' | 'rice' | 'bread' | 'noodles' | 'dessert' | 'chutney' | 'live'`
  - `type PackageBand = 'grazing' | 'plated'`
  - `type PackageSlot = { id: string; kind: SlotKind; defaultItemId: string }`
  - `type SlotFill = { slotId: string; kind: SlotKind; itemId: string }`
  - `type PartyPackage = { id: string; name: string; band: PackageBand; slots: PackageSlot[]; defaultLiveId: string }`
  - `liveStations: { id: string; name: string }[]`
  - `GRAZING_PACKAGE_IDS: readonly string[]`
  - `PLATED_PACKAGE_IDS: readonly string[]`
  - `partyPackages: PartyPackage[]`
  - `getPackage(id: string | undefined): PartyPackage | undefined`
  - `packagesForGuests(guests: number): PartyPackage[]`
  - `slotsForPackage(pkg: PartyPackage, service: 'delivery' | 'buffet' | 'live'): SlotFill[]`
  - `swapPoolIds(kind: SlotKind): string[]`
  - `slotItemName(itemId: string): string`
  - `slotSummary(pkg: PartyPackage, service: 'delivery' | 'buffet' | 'live'): string`
  - `labelSlot(kind: SlotKind, index: number, count: number): string`

- [ ] **Step 1: Write the failing tests**

Create `tests/planner.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx --yes tsx --test tests/planner.test.ts`

Expected: FAIL — `Cannot find module '../lib/party-packages'`

- [ ] **Step 3: Write `lib/party-packages.ts`**

```ts
import { findItem, menuSections } from '@/lib/alacarte-menu'

export type SlotKind =
  | 'starter'
  | 'main'
  | 'rice'
  | 'bread'
  | 'noodles'
  | 'dessert'
  | 'chutney'
  | 'live'

export type PackageBand = 'grazing' | 'plated'

export type PackageSlot = { id: string; kind: SlotKind; defaultItemId: string }
export type SlotFill = { slotId: string; kind: SlotKind; itemId: string }

export type PartyPackage = {
  id: string
  name: string
  band: PackageBand
  slots: PackageSlot[]
  defaultLiveId: string
}

export const liveStations = [
  { id: 'live-chaat', name: 'Live chaat' },
  { id: 'live-tandoor', name: 'Live tandoor' },
  { id: 'live-nachos', name: 'Live nachos' },
  { id: 'live-pizza', name: 'Live pizza' },
  { id: 'live-pasta', name: 'Live pasta' },
  { id: 'live-momos', name: 'Live momos' },
] as const

export const GRAZING_PACKAGE_IDS = [
  'grazing-board',
  'chaat-party',
  'pizza-starters',
  'tandoor-night',
] as const

export const PLATED_PACKAGE_IDS = [
  'north-indian',
  'bengali-table',
  'indo-chinese',
  'house-party-fusion',
  'festive-spread',
  'continental',
  'kids-party',
] as const

function slots(defs: [SlotKind, string][]): PackageSlot[] {
  const seen: Partial<Record<SlotKind, number>> = {}
  return defs.map(([kind, defaultItemId]) => {
    seen[kind] = (seen[kind] ?? 0) + 1
    return { id: `${kind}-${seen[kind]}`, kind, defaultItemId }
  })
}

export const partyPackages: PartyPackage[] = [
  {
    id: 'grazing-board',
    name: 'Grazing board',
    band: 'grazing',
    defaultLiveId: 'live-nachos',
    slots: slots([
      ['starter', 'quesadillas'],
      ['starter', 'dabeli'],
      ['starter', 'nachos'],
      ['starter', 'pita-pockets'],
      ['dessert', 'monte-carlo'],
    ]),
  },
  {
    id: 'chaat-party',
    name: 'Chaat party',
    band: 'grazing',
    defaultLiveId: 'live-chaat',
    slots: slots([
      ['starter', 'raj-kachori'],
      ['starter', 'palak-patta'],
      ['starter', 'chola-tikki'],
      ['dessert', 'darsan'],
    ]),
  },
  {
    id: 'pizza-starters',
    name: 'Pizza & starters',
    band: 'grazing',
    defaultLiveId: 'live-pizza',
    slots: slots([
      ['starter', 'pizza-slices'],
      ['starter', 'quesadillas'],
      ['starter', 'cheese-balls'],
      ['starter', 'garlic-bread'],
      ['dessert', 'fudge-brownie'],
    ]),
  },
  {
    id: 'tandoor-night',
    name: 'Tandoor night',
    band: 'grazing',
    defaultLiveId: 'live-tandoor',
    slots: slots([
      ['starter', 'achari-paneer-tikka'],
      ['starter', 'hara-bhara'],
      ['starter', 'galouti'],
      ['starter', 'dahi-kebab'],
      ['dessert', 'gulabjamun'],
    ]),
  },
  {
    id: 'north-indian',
    name: 'North Indian',
    band: 'plated',
    defaultLiveId: 'live-tandoor',
    slots: slots([
      ['starter', 'achari-paneer-tikka'],
      ['starter', 'dahi-kebab'],
      ['main', 'paneer-butter-masala'],
      ['main', 'pindi-chana'],
      ['main', 'kashmiri-aloo-dum'],
      ['rice', 'jeera-rice'],
      ['bread', 'lachha-paratha'],
      ['dessert', 'kesariya-rasmalai'],
    ]),
  },
  {
    id: 'bengali-table',
    name: 'Bengali table',
    band: 'plated',
    defaultLiveId: 'live-chaat',
    slots: slots([
      ['starter', 'beetroot-cutlet'],
      ['main', 'dum-aloo'],
      ['main', 'narkel-cholar-dal'],
      ['rice', 'basanti-pulao'],
      ['bread', 'radhavallabhi'],
      ['chutney', 'tamatar-khejur-chutney'],
      ['dessert', 'seasonal-sandesh'],
    ]),
  },
  {
    id: 'indo-chinese',
    name: 'Indo-Chinese',
    band: 'plated',
    defaultLiveId: 'live-momos',
    slots: slots([
      ['starter', 'crystal-dumplings'],
      ['starter', 'veg-momo'],
      ['main', 'manchurian'],
      ['main', 'hot-garlic-veg'],
      ['noodles', 'hakka-noodles'],
      ['rice', 'burnt-garlic-rice'],
      ['dessert', 'fudge-brownie'],
    ]),
  },
  {
    id: 'house-party-fusion',
    name: 'House-party fusion',
    band: 'plated',
    defaultLiveId: 'live-nachos',
    slots: slots([
      ['starter', 'quesadillas'],
      ['starter', 'raj-kachori'],
      ['main', 'paneer-makhani'],
      ['main', 'thai-curry'],
      ['rice', 'peas-pulao'],
      ['bread', 'kulcha'],
      ['dessert', 'monte-carlo'],
    ]),
  },
  {
    id: 'festive-spread',
    name: 'Festive spread',
    band: 'plated',
    defaultLiveId: 'live-tandoor',
    slots: slots([
      ['starter', 'hara-bhara'],
      ['starter', 'achari-paneer-tikka'],
      ['main', 'malai-kofta'],
      ['main', 'kadhai-paneer'],
      ['main', 'palak-corn'],
      ['rice', 'zafrani-pulao'],
      ['bread', 'paneer-kulcha'],
      ['dessert', 'kesariya-rasmalai'],
    ]),
  },
  {
    id: 'continental',
    name: 'Continental',
    band: 'plated',
    defaultLiveId: 'live-pasta',
    slots: slots([
      ['starter', 'mediterranean-wrap'],
      ['starter', 'avocado-sushi'],
      ['starter', 'garlic-bread'],
      ['main', 'lasagna'],
      ['main', 'au-gratin'],
      ['dessert', 'monte-carlo'],
    ]),
  },
  {
    id: 'kids-party',
    name: "Kids' party",
    band: 'plated',
    defaultLiveId: 'live-pizza',
    slots: slots([
      ['starter', 'pizza-slices'],
      ['starter', 'dabeli'],
      ['starter', 'cheese-balls'],
      ['main', 'paneer-butter-masala'],
      ['noodles', 'hakka-noodles'],
      ['dessert', 'gulabjamun'],
    ]),
  },
]

const STARTER_EXTRAS = ['beetroot-cutlet', 'rajasthani-dahi-vada']
const MAIN_IDS = [
  'paneer-butter-masala',
  'paneer-makhani',
  'kadhai-paneer',
  'kashmiri-aloo-dum',
  'aloo-do-pyaza',
  'pindi-chana',
  'malai-kofta',
  'subz-jalfrezi',
  'palak-corn',
  'dum-aloo',
  'narkel-cholar-dal',
  'gatte-ki-subzi',
  'panchmela',
  'stroganoff',
  'thai-curry',
  'au-gratin',
  'lasagna',
  'manchurian',
  'tsing-hoi-potato',
  'hot-garlic-veg',
]
const RICE_IDS = [
  'zafrani-pulao',
  'peas-pulao',
  'jeera-rice',
  'veg-pulao',
  'basanti-pulao',
  'burnt-garlic-rice',
]
const BREAD_IDS = ['kulcha', 'masala-kulcha', 'paneer-kulcha', 'lachha-paratha', 'radhavallabhi']
const NOODLE_IDS = ['hakka-noodles', 'chilli-garlic-noodles']
const DESSERT_EXTRAS = ['dal-badam-halwa']
const CHUTNEY_IDS = ['tamatar-khejur-chutney']

export function getPackage(id: string | undefined) {
  if (!id) return undefined
  return partyPackages.find((p) => p.id === id)
}

export function packagesForGuests(guests: number): PartyPackage[] {
  if (guests < 15) return []
  if (guests < 25) return partyPackages.filter((p) => p.band === 'grazing')
  return partyPackages.filter((p) => p.band === 'plated')
}

export function slotsForPackage(
  pkg: PartyPackage,
  service: 'delivery' | 'buffet' | 'live',
): SlotFill[] {
  const food = pkg.slots.map((s) => ({ slotId: s.id, kind: s.kind, itemId: s.defaultItemId }))
  if (service !== 'live') return food
  return [...food, { slotId: 'live', kind: 'live', itemId: pkg.defaultLiveId }]
}

export function swapPoolIds(kind: SlotKind): string[] {
  if (kind === 'starter') {
    const fromMenu = menuSections.filter((s) => s.group === 'Starters').flatMap((s) => s.items.map((i) => i.id))
    return [...new Set([...fromMenu, ...STARTER_EXTRAS])]
  }
  if (kind === 'main') return MAIN_IDS
  if (kind === 'rice') return RICE_IDS
  if (kind === 'bread') return BREAD_IDS
  if (kind === 'noodles') return NOODLE_IDS
  if (kind === 'dessert') {
    const fromMenu = menuSections.filter((s) => s.group === 'Desserts').flatMap((s) => s.items.map((i) => i.id))
    return [...new Set([...fromMenu, ...DESSERT_EXTRAS])]
  }
  if (kind === 'chutney') return CHUTNEY_IDS
  return liveStations.map((s) => s.id)
}

export function slotItemName(itemId: string): string {
  const live = liveStations.find((s) => s.id === itemId)
  if (live) return live.name
  return findItem(itemId)?.item.name ?? itemId
}

const KIND_PLURAL: Record<Exclude<SlotKind, 'live'>, string> = {
  starter: 'starters',
  main: 'mains',
  rice: 'rice',
  bread: 'bread',
  noodles: 'noodles',
  dessert: 'dessert',
  chutney: 'chutney',
}

export function slotSummary(
  pkg: PartyPackage,
  service: 'delivery' | 'buffet' | 'live',
): string {
  const counts = new Map<SlotKind, number>()
  for (const slot of pkg.slots) counts.set(slot.kind, (counts.get(slot.kind) ?? 0) + 1)
  const parts: string[] = []
  for (const kind of ['starter', 'main', 'rice', 'bread', 'noodles', 'dessert', 'chutney'] as const) {
    const n = counts.get(kind)
    if (!n) continue
    parts.push(n === 1 ? KIND_PLURAL[kind] : `${n} ${KIND_PLURAL[kind]}`)
  }
  if (service === 'live') {
    parts.push(slotItemName(pkg.defaultLiveId).toLowerCase())
  }
  return parts.join(' · ')
}

const KIND_LABEL: Record<SlotKind, string> = {
  starter: 'Starter',
  main: 'Main',
  rice: 'Rice',
  bread: 'Bread',
  noodles: 'Noodles',
  dessert: 'Dessert',
  chutney: 'Chutney',
  live: 'Live station',
}

export function labelSlot(kind: SlotKind, index: number, count: number): string {
  if (kind === 'live' || count <= 1) return KIND_LABEL[kind]
  return `${KIND_LABEL[kind]} ${index}`
}
```

If `@/` fails in `tsx` tests, import with relative `./alacarte-menu` from `lib/` and `../lib/alacarte-menu` from tests (already relative). **In `lib/party-packages.ts` use `./alacarte-menu`** so tests and Next both resolve:

```ts
import { findItem, menuSections } from './alacarte-menu'
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx --yes tsx --test tests/planner.test.ts`

Expected: PASS (catalog describes)

- [ ] **Step 5: Commit**

```bash
git add lib/party-packages.ts tests/planner.test.ts
git commit -m "feat: add party package catalog and swap pools"
```

---

### Task 2: Planner types, prices, gates, WhatsApp

**Files:**
- Modify: `lib/planner.ts` (replace types, services, estimate, WhatsApp; keep occasions + date helpers)
- Modify: `tests/planner.test.ts` (append price/gate/WhatsApp cases)
- Modify: `package.json` `scripts.test`

**Interfaces:**
- Consumes: `getPackage`, `packagesForGuests`, `slotsForPackage`, `slotItemName`, `liveStations` from `lib/party-packages.ts`
- Produces:
  - `type ServiceId = 'delivery' | 'buffet' | 'live'`
  - `type BudgetId = 'intimate' | 'signature'`
  - `type Plan` as in spec (`slots: { slotId: string; itemId: string }[]`, no `cuisines`/`pureVeg`)
  - `emptyPlan: Plan` `{ guests: 25, slots: [] }`
  - `services: { id: ServiceId; label: string; detail: string; fromPlate: number }[]`
  - `budgets: { id: BudgetId; label: string; blurb: string }[]`
  - `ALL_STEPS` and `stepsFor(guests: number): readonly Step[]`
  - `billedGuests(guests: number): number` — `guests >= 100 ? 100 : guests`
  - `perGuestPrice(service: ServiceId, budget: BudgetId): number`
  - `estimatePlan(plan: Plan): { perGuest: number; total: number } | null`
  - `canSendPlan(plan: Plan): boolean`
  - `applyGuests(plan: Plan, guests: number): { plan: Plan; cleared: boolean }`
  - `applyService(plan: Plan, service: ServiceId): Plan`
  - `selectPackage(plan: Plan, packageId: string): Plan`
  - `swapSlot(plan: Plan, slotId: string, itemId: string): Plan`
  - `composeWhatsappMessage(plan: Plan): string`
  - Keep `occasions`, `getOccasion`, `formatINR`, `guestNote`, `dateNote`, `daysUntil`, `nextWeekendISO`, `prettyDate`, `GRAZING_MIN_GUESTS = 15`, `CELEBRATION_MIN_GUESTS = 25`

- [ ] **Step 1: Append failing tests to `tests/planner.test.ts`**

```ts
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
```

`₹29,960` is `749 * 40` with `en-IN` grouping. `formatINR` uses `toLocaleString('en-IN')`.

- [ ] **Step 2: Run tests to verify new cases fail**

Run: `npx --yes tsx --test tests/planner.test.ts`

Expected: FAIL — `../lib/planner` has no `perGuestPrice` / old `Estimate` range type

- [ ] **Step 3: Rewrite `lib/planner.ts`**

Keep date helpers and occasions. Replace the rest:

```ts
import {
  getPackage,
  packagesForGuests,
  slotItemName,
  slotsForPackage,
  type SlotFill,
} from './party-packages'

export type ServiceId = 'delivery' | 'buffet' | 'live'
export type BudgetId = 'intimate' | 'signature'

export type Plan = {
  occasion?: string
  guests: number
  service?: ServiceId
  budget?: BudgetId
  packageId?: string
  slots: { slotId: string; itemId: string }[]
  date?: string
  dateFlexible?: boolean
  note?: string
  name?: string
  area?: string
}

export const emptyPlan: Plan = { guests: 25, slots: [] }

export const occasions = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'house-party', label: 'House party', emoji: '🥂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍' },
  { id: 'festive', label: 'Festive / Puja', emoji: '🪔' },
  { id: 'office', label: 'Office party', emoji: '💼' },
  { id: 'grazing', label: 'Grazing table', emoji: '🧀' },
  { id: 'other', label: 'Something else', emoji: '✨' },
] as const

export const services = [
  { id: 'delivery' as const, label: 'Delivery', detail: 'We deliver hot, you plate up', fromPlate: 749 },
  { id: 'buffet' as const, label: 'Buffet', detail: 'Warmers, kitchen & serving staff', fromPlate: 849 },
  { id: 'live' as const, label: 'Live', detail: 'One live counter at the venue', fromPlate: 999 },
]

export const budgets = [
  { id: 'intimate' as const, label: 'Intimate', blurb: 'Our classic plate — same dishes, the lower rate.' },
  { id: 'signature' as const, label: 'Signature', blurb: 'Richer hosting, not more courses. Same menu shape.' },
]

const PRICE: Record<ServiceId, Record<BudgetId, number>> = {
  delivery: { intimate: 749, signature: 849 },
  buffet: { intimate: 849, signature: 949 },
  live: { intimate: 999, signature: 1199 },
}

export const CELEBRATION_MIN_GUESTS = 25
export const GRAZING_MIN_GUESTS = 15

export const ALL_STEPS = ['occasion', 'guests', 'service', 'budget', 'package', 'customise', 'summary'] as const
export type Step = (typeof ALL_STEPS)[number]

export function stepsFor(guests: number): readonly Step[] {
  if (guests < GRAZING_MIN_GUESTS) return ['occasion', 'guests', 'summary']
  return ALL_STEPS
}

export function billedGuests(guests: number): number {
  return guests >= 100 ? 100 : guests
}

export function perGuestPrice(service: ServiceId, budget: BudgetId): number {
  return PRICE[service][budget]
}

export type Estimate = { perGuest: number; total: number }

export function estimatePlan(plan: Plan): Estimate | null {
  if (plan.guests < GRAZING_MIN_GUESTS) return null
  if (!plan.service || !plan.budget || !plan.packageId) return null
  if (!packagesForGuests(plan.guests).some((p) => p.id === plan.packageId)) return null
  const perGuest = perGuestPrice(plan.service, plan.budget)
  return { perGuest, total: perGuest * billedGuests(plan.guests) }
}

export function canSendPlan(plan: Plan): boolean {
  if (!plan.occasion) return false
  if (plan.guests < GRAZING_MIN_GUESTS) return true
  if (!plan.service || !plan.budget || !plan.packageId) return false
  const pkg = getPackage(plan.packageId)
  if (!pkg) return false
  const expected = slotsForPackage(pkg, plan.service)
  if (expected.length === 0) return false
  return expected.every((slot) => plan.slots.some((s) => s.slotId === slot.slotId && s.itemId))
}

export function applyGuests(plan: Plan, guests: number): { plan: Plan; cleared: boolean } {
  const next = Math.min(500, Math.max(5, guests))
  const stillOk = !plan.packageId || packagesForGuests(next).some((p) => p.id === plan.packageId)
  if (stillOk) return { plan: { ...plan, guests: next }, cleared: false }
  return { plan: { ...plan, guests: next, packageId: undefined, slots: [] }, cleared: true }
}

export function applyService(plan: Plan, service: ServiceId): Plan {
  const pkg = getPackage(plan.packageId)
  if (!pkg) return { ...plan, service }
  const food = plan.slots.filter((s) => s.slotId !== 'live')
  if (service !== 'live') return { ...plan, service, slots: food }
  const existing = plan.slots.find((s) => s.slotId === 'live')
  return {
    ...plan,
    service,
    slots: [...food, { slotId: 'live', itemId: existing?.itemId ?? pkg.defaultLiveId }],
  }
}

export function selectPackage(plan: Plan, packageId: string): Plan {
  const pkg = getPackage(packageId)
  if (!pkg) return plan
  if (!packagesForGuests(plan.guests).some((p) => p.id === packageId)) return plan
  const service = plan.service ?? 'delivery'
  return {
    ...plan,
    packageId,
    slots: slotsForPackage(pkg, service).map((s) => ({ slotId: s.slotId, itemId: s.itemId })),
  }
}

export function swapSlot(plan: Plan, slotId: string, itemId: string): Plan {
  return {
    ...plan,
    slots: plan.slots.map((s) => (s.slotId === slotId ? { ...s, itemId } : s)),
  }
}

export function guestNote(guests: number): string {
  if (guests < GRAZING_MIN_GUESTS) return 'Under 15 — we will tailor a custom menu on WhatsApp. No package price yet.'
  if (guests < CELEBRATION_MIN_GUESTS) return 'Grazing and live-led menus. Plated combos open from 25 guests.'
  if (guests >= 100) return 'A big one! We have fed 200+ without breaking a sweat.'
  return `Plated menus are open — from ${formatINR(PRICE.delivery.intimate)} a guest.`
}

export function getOccasion(idOrLabel: string | undefined) {
  if (!idOrLabel) return undefined
  const needle = idOrLabel.trim().toLowerCase()
  return occasions.find((o) => o.id === needle || o.label.toLowerCase() === needle)
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN')
}

// keep daysUntil, dateNote, nextWeekendISO, prettyDate unchanged from current file

export function composeWhatsappMessage(plan: Plan): string {
  const occasion = getOccasion(plan.occasion)
  const service = services.find((s) => s.id === plan.service)
  const budget = budgets.find((b) => b.id === plan.budget)
  const pkg = getPackage(plan.packageId)
  const estimate = estimatePlan(plan)

  const lines = ['Hi Urban Rasoi! 🧡 Here is my party plan:', '']
  if (plan.name) lines.push(`🙋 Name: ${plan.name}`)
  lines.push(`🎉 Occasion: ${occasion?.label ?? 'Celebration'}`)
  if (plan.dateFlexible) lines.push('🗓️ Date: Still deciding')
  else if (plan.date) lines.push(`🗓️ Date: ${prettyDate(plan.date)}`)
  lines.push(`👥 Guests: ${plan.guests}${plan.guests >= 100 ? '+' : ''}`)
  if (service) lines.push(`🍽️ Service: ${service.label} — ${service.detail}`)
  if (budget) lines.push(`✨ Budget: ${budget.label}`)
  if (pkg) lines.push(`🥘 Package: ${pkg.name}`)
  if (plan.slots.length) {
    lines.push('📋 Menu:')
    for (const slot of plan.slots) {
      lines.push(`- ${slotItemName(slot.itemId)}`)
    }
  }
  if (plan.note) lines.push(`📝 Note: ${plan.note}`)
  if (plan.area) lines.push(`📍 Area: ${plan.area}`)
  if (estimate) {
    lines.push(
      '',
      `Package price: ${formatINR(estimate.total)} (${formatINR(estimate.perGuest)}/guest)`,
    )
  }
  lines.push('', 'Please confirm date and delivery. We will take payment on WhatsApp.')
  return lines.join('\n')
}
```

Copy `daysUntil` / `dateNote` / `nextWeekendISO` / `prettyDate` from the current file unchanged.

- [ ] **Step 4: Point `package.json` test script at both files**

```json
"test": "npx --yes tsx --test tests/meta-capi.test.ts tests/planner.test.ts"
```

- [ ] **Step 5: Run tests**

Run: `npx --yes tsx --test tests/planner.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/planner.ts tests/planner.test.ts package.json
git commit -m "feat: firm party-plan pricing, gates, and WhatsApp text"
```

---

### Task 3: Wizard UI + metadata

**Files:**
- Modify: `components/party-planner.tsx` (replace step machine)
- Modify: `app/plan/page.tsx` metadata

**Interfaces:**
- Consumes: all Task 2 planner helpers + `packagesForGuests`, `getPackage`, `swapPoolIds`, `slotItemName`, `slotSummary`, `labelSlot`, `liveStations` from `party-packages`
- Produces: `/plan` wizard matching the spec screens

- [ ] **Step 1: Update `app/plan/page.tsx` metadata**

```ts
export const metadata: Metadata = {
  title: 'Plan Your Party | Urban Rasoi',
  description:
    'Pick a veg menu, swap dishes, see a firm per-guest price, and send your Kolkata party plan to our kitchen on WhatsApp.',
  alternates: { canonical: '/plan' },
}
```

- [ ] **Step 2: Rewrite `components/party-planner.tsx`**

Keep the existing chrome (sticky header, logo, close, progress ticks, `Chip` / `PrimaryButton` / `SummaryRow` helpers, `shareOrderSlip`). Replace step list and bodies.

Key behaviours to implement (do not re-code price math in the component):

```ts
const STORAGE_KEY = 'ur-plan-v2'

const stepTitles: Record<Step, string> = {
  occasion: "What's the occasion?",
  guests: 'How many guests?',
  service: 'How do you want it served?',
  budget: 'Intimate or Signature?',
  package: 'Pick a menu',
  customise: 'Swap anything?',
  summary: 'Your package.',
}

function loadSaved(): { plan: Plan; step: Step } | null { /* ur-plan-v2 only */ }

const visibleSteps = stepsFor(plan.guests)
// progress ticks = visibleSteps.length
// current index = visibleSteps.indexOf(step); if -1, snap to last
```

**Navigation**
- Occasion tap → `guests`
- Guests Continue → if `guests < 15` then `summary`, else `service`
- Service tap → `applyService` then `budget`
- Budget tap → `package`
- Package tap → `selectPackage` then `customise`
- Customise Continue → `summary`
- Back uses previous entry in `visibleSteps`
- `?occasion=` still starts at guests

**Guests**
```ts
const { plan: next, cleared } = applyGuests(plan, n)
setPlan(next)
if (cleared) setGateBanner(true)
```
Show banner: `Guest count changed the menus we can offer.`

**Service cards** — map `services`; show `from {formatINR(service.fromPlate)}/guest` when `plan.guests >= GRAZING_MIN_GUESTS`

**Budget cards** — map `budgets`; show exact `formatINR(perGuestPrice(plan.service!, budget.id))/guest`

**Package grid** — `packagesForGuests(plan.guests).map` cards with `pkg.name` and `slotSummary(pkg, plan.service ?? 'delivery')`

**Customise**
```ts
const pkg = getPackage(plan.packageId)
const kindsCount = ...
// For each plan.slot, resolve kind from pkg.slots or 'live'
// Row: labelSlot(...) + slotItemName(itemId) + Swap if swapPoolIds(kind).length > 1
// Swap opens in-page list of pool names; on pick call swapSlot and close
// Missing itemId → fall back to package default for that slotId
```

**Summary**
- Rows: Occasion, Guests, Service, Budget, Package (edit jumps)
- Under 15: no ink price; CTA `Send on WhatsApp`; helper “We’ll tailor a menu.”
- Else if `estimate`: ink block
  ```
  Your package
  ₹T
  ₹X per guest × N
  Delivery extra as per area — confirmed on WhatsApp.
  ```
- Optional date (This Saturday / Next Saturday / Still deciding / date input), name, area, note
- WhatsApp disabled when `!canSendPlan(plan) || sending`
- `value` for tracking = `estimate?.total` (firm, not midpoint)
- Slip groups: party facts + menu rows (`slotItemName`)
- Success clears `ur-plan-v2`

Drop: `cuisineOptions`, `pureVeg`, date as its own wizard step, range estimate, “Help me choose”.

Reuse `PrimaryButton`, `Chip`, `SummaryRow` classNames from the current file so the look does not drift.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`

Expected: PASS (no leftover `semi` / `cuisines` / `Estimate` tuple)

- [ ] **Step 4: Run unit tests**

Run: `npx --yes tsx --test tests/meta-capi.test.ts tests/planner.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/party-planner.tsx app/plan/page.tsx
git commit -m "feat: rebuild Plan My Party wizard with packages and swaps"
```

---

### Task 4: Manual /plan pass

**Files:** none unless a bugfix

- [ ] **Step 1: Run the app**

`npx next dev` and open `/plan`.

Walk:
1. Birthday → 10 guests → summary has no ₹ → WhatsApp enabled
2. Back, 20 guests → only four grazing cards; Delivery then Intimate; swap a starter; bill is `849? no` Delivery Intimate = 749 × 20
3. Live + Signature at 20 = 1199 × 20 and a live row
4. 40 guests → seven plated, no grazing-board; swap starter; bill 749 × 40
5. Drop 40 → 20 with plated selected → banner + package cleared
6. Visual: terracotta, serif, no marketplace chrome

- [ ] **Step 2: Fix any bug with a failing test first, then commit**

---

## Self-review

**Spec coverage**
- Flow / skip-under-15 → Task 3 + `stepsFor` / `canSendPlan` (Task 2)
- Gates 15/25 and plated-only at 25+ → Task 1 tests + `packagesForGuests`
- Live slot iff live → Task 1
- Price table + 100+ billing → Task 2
- Swap pools veg-only → Task 1
- WhatsApp firm total + swapped dish → Task 2
- UI chrome / optional date on bill → Task 3
- Metadata → Task 3
- `ur-plan-v2` → Task 3
- `/order` untouched → constraint

**Placeholders:** none

**Types:** `ServiceId` / `BudgetId` / `Plan.slots` / `Estimate` single number used the same in Tasks 2 and 3
