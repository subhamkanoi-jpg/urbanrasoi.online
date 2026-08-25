import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  COUNTABLE_UNITS,
  findItem,
  menuItemCount,
  menuSections,
  orderedMenuSections,
  popularMenuItems,
} from '../lib/alacarte-menu'
import { rakhiSections } from '../lib/rakhi-menu'
import { partyPackages } from '../lib/party-packages'

/** Rakhi SKUs that are the same dish as an existing house-party item. */
const RAKHI_TO_ALACARTE: Record<string, string> = {
  'bite-sized-quesadilla': 'quesadillas',
  'bite-sized-farmhouse-pizza': 'pizza-slices',
  'tandoori-paneer-naanza': 'paneer-naanza',
  'achari-paneer-tikka-skewers': 'achari-paneer-tikka',
  'mini-dabeli-sliders': 'dabeli',
  'exotic-veg-stroganoff-rice': 'stroganoff',
  'chocolate-monte-carlo': 'monte-carlo',
}

const EXISTING_IDS = [
  'quesadillas',
  'pita-pockets',
  'pizza-slices',
  'mushroom-dumplings',
  'crystal-dumplings',
  'avocado-sushi',
  'cheese-corn-samosa',
  'cocktail-samosa',
  'cheese-balls',
  'veg-momo',
  'nachos',
  'hara-bhara',
  'achari-paneer-tikka',
  'aloo-tikka',
  'galouti',
  'tandoori-momo',
  'dahi-kebab',
  'raj-kachori',
  'palak-patta',
  'paw-bhaji-chaat',
  'chola-tikki',
  'pindi-naanza',
  'paneer-naanza',
  'paw-bhaji-sliders',
  'dabeli',
  'cottage-cheese-wrap',
  'mediterranean-wrap',
  'garlic-bread',
  'paneer-butter-masala',
  'paneer-makhani',
  'kadhai-paneer',
  'kashmiri-aloo-dum',
  'aloo-do-pyaza',
  'pindi-chana',
  'malai-kofta',
  'subz-jalfrezi',
  'palak-corn',
  'kulcha',
  'masala-kulcha',
  'paneer-kulcha',
  'lachha-paratha',
  'zafrani-pulao',
  'peas-pulao',
  'jeera-rice',
  'veg-pulao',
  'beetroot-cutlet',
  'narkel-cholar-dal',
  'basanti-pulao',
  'radhavallabhi',
  'dum-aloo',
  'tamatar-khejur-chutney',
  'gatte-ki-subzi',
  'panchmela',
  'keriya-sangri',
  'pooran-poli',
  'dal-badam-halwa',
  'rajasthani-dahi-vada',
  'stroganoff',
  'thai-curry',
  'au-gratin',
  'lasagna',
  'hakka-noodles',
  'chilli-garlic-noodles',
  'burnt-garlic-rice',
  'manchurian',
  'tsing-hoi-potato',
  'hot-garlic-veg',
  'monte-carlo',
  'kesariya-rasmalai',
  'darsan',
  'gulabjamun',
  'seasonal-sandesh',
  'fudge-brownie',
]

describe('alacarte catalog', () => {
  it('keeps every previous house-party id', () => {
    for (const id of EXISTING_IDS) {
      assert.ok(findItem(id), id)
    }
  })

  it('has no duplicate ids', () => {
    const ids = menuSections.flatMap((s) => s.items.map((i) => i.id))
    assert.equal(ids.length, new Set(ids).size)
  })

  it('has no duplicate dish names', () => {
    const names = menuSections.flatMap((s) => s.items.map((i) => i.name.trim().toLowerCase()))
    assert.equal(names.length, new Set(names).size)
  })

  it('folds every Rakhi dish in without a second listing', () => {
    for (const section of rakhiSections) {
      for (const item of section.items) {
        const mapped = RAKHI_TO_ALACARTE[item.id] ?? item.id
        const found = findItem(mapped)
        assert.ok(found, `missing rakhi dish ${item.id} → ${mapped}`)
      }
    }
  })

  it('uses one unit style: per piece, per portion, or a tray size', () => {
    const allowed = new Set(['per piece', 'per portion', '500 ml', '750 ml'])
    for (const section of menuSections) {
      for (const item of section.items) {
        assert.equal(allowed.has(item.unit), true, `${item.id} unit ${item.unit}`)
      }
    }
  })

  it('prices overlapping Rakhi dishes at the Rakhi per-piece (or tray) rate', () => {
    assert.equal(findItem('quesadillas')?.item.price, 85)
    assert.equal(findItem('quesadillas')?.item.unit, 'per piece')
    assert.equal(findItem('pizza-slices')?.item.price, 70)
    assert.equal(findItem('paneer-naanza')?.item.price, 88)
    assert.equal(findItem('achari-paneer-tikka')?.item.price, 70)
    assert.equal(findItem('dabeli')?.item.price, 75)
    assert.equal(findItem('dabeli')?.item.unit, 'per piece')
    assert.equal(findItem('monte-carlo')?.item.price, 450)
  })

  it('exposes photographed popular dishes for the most-ordered rail', () => {
    assert.ok(popularMenuItems.length >= 4)
    assert.ok(popularMenuItems.every((item) => item.popular))
    assert.ok(orderedMenuSections.at(-1)?.id === 'desserts')
  })

  it('still resolves every party-package default dish', () => {
    for (const pkg of partyPackages) {
      for (const slot of pkg.slots) {
        assert.ok(findItem(slot.defaultItemId), `${pkg.id}:${slot.defaultItemId}`)
      }
    }
  })

  it('has more dishes than the original house-party menu after the fold', () => {
    assert.ok(menuItemCount > EXISTING_IDS.length)
    assert.equal(COUNTABLE_UNITS.has('per piece'), true)
  })
})
