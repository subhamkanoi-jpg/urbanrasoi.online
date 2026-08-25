import { findItem, menuSections } from './alacarte-menu'

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

const COUNTED_KINDS: ReadonlySet<SlotKind> = new Set(['starter', 'main'])

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
    if (!COUNTED_KINDS.has(kind)) {
      parts.push(KIND_PLURAL[kind])
      continue
    }
    parts.push(n === 1 ? kind : `${n} ${KIND_PLURAL[kind]}`)
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
