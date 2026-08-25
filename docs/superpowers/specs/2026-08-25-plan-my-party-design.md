# Plan My Party — CaterNinja-style builder

Date: 2026-08-25  
Scope: `/plan` only  
Status: approved in conversation; waiting for spec review before implementation

## Goal

Rebuild Urban Rasoi’s Plan My Party wizard so it copies CaterNinja’s **order flow, combo shapes, and dish-swap behaviour**, while keeping Urban Rasoi’s look, veg-only kitchen, WhatsApp booking, and existing per-guest price bands.

Success for this slice: a host can pick occasion → guests → service → budget → named package → swap dishes → see a **firm** total → send that plan on WhatsApp. If this works, later slices can expand (payment, more services, home-page entry).

## Non-goals

- `/order`, home page, grazing product page, puja booking, Rakhi
- Payment, GST line, delivery-fee calculator
- CaterNinja time slots, city picker, non-veg
- Snack boxes / meal boxes
- Inventing dishes not on the à la carte menu
- Changing the visual language (terracotta, serif, cream chips, rounded-2xl cards)

## Decisions (locked)

| Topic | Decision |
|---|---|
| Shape | Wizard with CaterNinja guts (not a package marketplace) |
| Services | Delivery, Buffet, Live |
| Live stations | Chaat, tandoor, nachos, pizza, pasta, momos |
| Prices | Keep today’s bands. Copy combo logic, not CaterNinja rupees |
| Dishes | Existing `lib/alacarte-menu.ts` ids only |
| Customise | Swap inside locked slots; no add/remove slots |
| Guests | 25+ plated; 15–24 grazing/live-led; under 15 WhatsApp handoff, no ₹ |
| Extra required field | Occasion only. Date / name / area / note optional on the bill |
| Total | One firm number. Pay on WhatsApp, not on site |
| Kitchen | Vegetarian. Drop the “pure veg” toggle |

## Flow

Same chrome: logo, progress bar, serif title, terracotta continue, back, local save.

| Step | Id | Title | Required |
|---|---|---|---|
| 1 | `occasion` | What’s the occasion? | yes |
| 2 | `guests` | How many guests? | yes |
| 3 | `service` | How do you want it served? | yes if guests ≥ 15 |
| 4 | `budget` | Intimate or Signature? | yes if guests ≥ 15 |
| 5 | `package` | Pick a menu | yes if guests ≥ 15 |
| 6 | `customise` | Swap anything? | slots must be filled if guests ≥ 15 |
| 7 | `summary` | Your package | send |

**Under 15 guests:** after guests, skip to `summary`. No service/budget/package/customise. No rupee block. CTA: send on WhatsApp to tailor a menu.

Occasions stay: birthday, house party, anniversary, festive/puja, office, grazing, something else. `?occasion=` still skips step 1. Occasion is required for WhatsApp; it does **not** filter the package grid in this slice (avoids empty states).

Date is **not** a wizard step. Optional date / flexible / name / area / note live on the bill screen only.

## Guest gates

| Guests | Packages | Price |
|---|---|---|
| 5–14 | none | none |
| 15–24 | grazing / live-led ids only | firm, once service + budget + package chosen |
| 25–500 | plated + grazing/live-led | firm, same |

Stepper: min 5, max 500, step 5. Presets 10, 15, 25, 40, 60, 100. The `100+` preset **bills as 100**; WhatsApp still says `100+`.

Crossing a gate (30→20, 20→10, 14→15) **clears `packageId` and `slots`**. Banner: “Guest count changed the menus we can offer.” Recalc total. If they land below 15, jump to summary.

## Services

Replace Delivery / Semi / Full / Help me choose.

| Id | Label | Detail | Maps from |
|---|---|---|---|
| `delivery` | Delivery | We deliver hot, you plate up | old Delivery / NinjaBox |
| `buffet` | Buffet | Warmers, kitchen & serving staff | old Semi / NinjaBuffet |
| `live` | Live | One live counter at the venue | old Full / NinjaLive |

- Delivery / Buffet packages have **no** live slot.
- Live packages always have **exactly one** live slot (default by cuisine; swappable among the six stations).
- 15–24 + Delivery: same four grazing packages, **without** a live slot.
- Switching Live → Delivery/Buffet: drop the live slot; keep food slots if that package exists without live; otherwise clear package.

## Budget

Two cards, not a slider.

| Id | Meaning |
|---|---|
| `intimate` | Lower ₹/guest for the chosen service |
| `signature` | Higher ₹/guest. Same dishes. Richer hosting, not more courses |

## Price table

Package shape does **not** change the rupee. Only service × budget × guests.

| | Intimate | Signature |
|---|---|---|
| Delivery | ₹749 | ₹849 |
| Buffet | ₹849 | ₹949 |
| Live | ₹999 | ₹1,199 |

**Total** = per-guest × guest count.

**In the number:** food slots; buffet staff (do not add à la carte ₹600/₹800); the live station when service is Live.

**Not in the number:** delivery as per area; overtime / night. One footnote on the bill: delivery extra, confirmed on WhatsApp.

Do not show a total until service + budget + package are set (and guests ≥ 15). Service cards may still show “from ₹X/guest”.

No GST line. No range. Label: “Your package”, not “Live estimate”.

## Packages

Locked shape + default dishes. Swap within the slot’s pool. All item ids exist on the à la carte menu except live stations (defined here).

### Slot types

`starter` · `main` · `rice` · `bread` · `noodles` · `dessert` · `chutney` · `live`

If a slot’s swap pool has one item, hide Swap.

### Live stations

| Id | Label |
|---|---|
| `live-chaat` | Live chaat |
| `live-tandoor` | Live tandoor |
| `live-nachos` | Live nachos |
| `live-pizza` | Live pizza |
| `live-pasta` | Live pasta |
| `live-momos` | Live momos |

### 15–24 (grazing / live-led)

**Grazing board** `grazing-board`  
4 starters + 1 dessert. Default live: nachos.  
quesadillas, dabeli, nachos, pita-pockets · monte-carlo

**Chaat party** `chaat-party`  
3 starters + 1 dessert. Default live: chaat.  
raj-kachori, palak-patta, chola-tikki · darsan

**Pizza & starters** `pizza-starters`  
4 starters + 1 dessert. Default live: pizza.  
pizza-slices, quesadillas, cheese-balls, garlic-bread · fudge-brownie

**Tandoor night** `tandoor-night`  
4 starters + 1 dessert. Default live: tandoor.  
achari-paneer-tikka, hara-bhara, galouti, dahi-kebab · gulabjamun

### 25+ (plated; also still offer the four above)

**North Indian** `north-indian`  
2 starters + 3 mains + rice + bread + dessert. Default live: tandoor.  
achari-paneer-tikka, dahi-kebab · paneer-butter-masala, pindi-chana, kashmiri-aloo-dum · jeera-rice · lachha-paratha · kesariya-rasmalai

**Bengali table** `bengali-table`  
1 starter + 2 mains + rice + bread + chutney + dessert. Default live: chaat.  
beetroot-cutlet · dum-aloo, narkel-cholar-dal · basanti-pulao · radhavallabhi · tamatar-khejur-chutney · seasonal-sandesh

**Indo-Chinese** `indo-chinese`  
2 starters + 2 mains + noodles + rice + dessert. Default live: momos.  
crystal-dumplings, veg-momo · manchurian, hot-garlic-veg · hakka-noodles · burnt-garlic-rice · fudge-brownie

**House-party fusion** `house-party-fusion`  
2 starters + 2 mains + rice + bread + dessert. Default live: nachos.  
quesadillas, raj-kachori · paneer-makhani, thai-curry · peas-pulao · kulcha · monte-carlo

**Festive spread** `festive-spread`  
2 starters + 3 mains + rice + bread + dessert. Default live: tandoor.  
hara-bhara, achari-paneer-tikka · malai-kofta, kadhai-paneer, palak-corn · zafrani-pulao · paneer-kulcha · kesariya-rasmalai

**Continental** `continental`  
3 starters + 2 mains + dessert. Default live: pasta.  
mediterranean-wrap, avocado-sushi, garlic-bread · lasagna, au-gratin · monte-carlo

**Kids’ party** `kids-party`  
3 starters + 1 main + 1 noodles + dessert. Default live: pizza.  
pizza-slices, dabeli, cheese-balls · paneer-butter-masala · hakka-noodles · gulabjamun

At 25+, the package grid is the **seven plated** packages only. The four grazing/live-led packages are 15–24 only. Live service on plated menus adds the live slot; it does not swap in the grazing catalog.

### Swap pools

- **starter:** every `group: 'Starters'` item, plus `beetroot-cutlet`, `rajasthani-dahi-vada`
- **main:** North Indian mains; `dum-aloo`, `narkel-cholar-dal`; `gatte-ki-subzi`, `panchmela`; Continental mains; `manchurian`, `tsing-hoi-potato`, `hot-garlic-veg`
- **rice:** `zafrani-pulao`, `peas-pulao`, `jeera-rice`, `veg-pulao`, `basanti-pulao`, `burnt-garlic-rice`
- **bread:** `kulcha`, `masala-kulcha`, `paneer-kulcha`, `lachha-paratha`, `radhavallabhi`
- **noodles:** `hakka-noodles`, `chilli-garlic-noodles`
- **dessert:** every Desserts item, plus `dal-badam-halwa`
- **chutney:** `tamatar-khejur-chutney` only (hide Swap)
- **live:** the six stations above

If a stored `itemId` is missing from the pool later, fall back to that slot’s package default.

## Data model

```ts
type ServiceId = 'delivery' | 'buffet' | 'live'
type BudgetId = 'intimate' | 'signature'
type SlotKind = 'starter' | 'main' | 'rice' | 'bread' | 'noodles' | 'dessert' | 'chutney' | 'live'

type Plan = {
  occasion?: string
  guests: number
  service?: ServiceId
  budget?: BudgetId
  packageId?: string
  slots: { slotId: string; itemId: string }[]
  date?: string
  dateFlexible?: boolean
  name?: string
  area?: string
  note?: string
}
```

Drop `cuisines` and `pureVeg`.

Selecting a package fills `slots` from defaults, then adds/removes the live slot to match `service`.

### Files

- `lib/planner.ts` — Plan type, steps, gates, price table, `estimatePlan` (single number or null), WhatsApp text, guest notes
- `lib/party-packages.ts` — catalog, slot recipes, swap pools, live stations
- `components/party-planner.tsx` — wizard UI
- `app/plan/page.tsx` — metadata only (title/description mention menus + firm price)
- `tests/planner.test.ts` — logic tests
- `/order` and à la carte UI **untouched** (read `alacarte-menu.ts` only)

Storage key: `ur-plan-v2` (ignore v1). Resume banner stays. Successful send clears the draft; cancelled share does not.

## UI

Keep current planner chrome. No CaterNinja filter drawer, no dark marketplace cards.

- **Service:** three stacked cards with “from ₹X/guest” when guests ≥ 15
- **Budget:** two cards showing the exact ₹/guest for the chosen service
- **Package:** occasion-style grid; name + slot summary (`2 starters · 3 mains · rice · bread · dessert`); live name if Live; terracotta ring when selected
- **Customise:** one row per slot (Starter 1, Main 2, …); **Swap** opens an in-page list (chips/cards), not a foreign modal; current dish selected
- **Bill:** Edit jumps to that step; ink block with `₹X per guest × N = ₹T`; footnote; optional date/name/area/note; WhatsApp CTA

Send disabled until occasion + guests, and if guests ≥ 15: service + budget + package with every slot filled.

## WhatsApp

Same `shareOrderSlip` helper (image + text).

Include: occasion, guests (with `+` if 100+), service, budget, package name, each slot’s dish, live station if any, firm total + per-guest, optional date/area/name/note, ask to confirm date and delivery.

Tracking: `PlannerOpen` stays. Lead `value` = firm total when present (not a range midpoint).

## Errors and edges

- Back does not clear the plan unless a gate invalidates the package
- Empty package grid must not happen for guests ≥ 15 (gates + catalog cover it)
- No new API routes
- Deep link `?occasion=` + `?src=` unchanged

## Tests

Node test file, same style as `tests/meta-capi.test.ts`.

1. Each service × budget matches the price table
2. Total = per-guest × guests; `100+` bills 100
3. Guests 14 → `estimatePlan` null
4. Guests 15–24 → only the four grazing/live-led package ids
5. Guests 25+ → the seven plated ids only (no grazing-board / chaat-party / pizza-starters / tandoor-night)
6. Live slot present iff `service === 'live'`
7. Plated package at 20 guests is invalid and must be cleared
8. WhatsApp body includes package name, a swapped dish, and the firm total
9. Swap pools contain only veg à la carte ids + the six live ids; no invented food ids
10. Under-15 plan is sendable without service/budget/package

## Implementation notes

- `estimatePlan` today returns a range and null below 25. Change to `{ perGuest: number; total: number } | null` with the new gates.
- Guest note copy must describe 15 / 25 gates, not “celebration menus from ₹749” alone.
- Buffet/Live copy must not promise extra paid staff add-ons; they are in the plate.

## Review checklist

- No CaterNinja rupees imported
- No design-system change beyond new steps in the existing wizard
- `/plan` is the only user-facing surface
- Every default dish id exists in `lib/alacarte-menu.ts` except live stations
