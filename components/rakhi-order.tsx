'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackContact } from '@/lib/meta-tracking'
import { shareOrderSlip, type SlipRow } from '@/lib/order-slip'
import { clearOrderState, loadOrderState, saveOrderState } from '@/lib/order-storage'
import {
  RAKHI_MIN_ORDER,
  RAKHI_PICKUP_DATE,
  RAKHI_PICKUP_ADDRESS,
  RAKHI_DISCOUNT_CAP,
  RAKHI_DISCOUNT_PERCENT,
  RAKHI_MIN_PORTIONS,
  PICKUP_TIME_SLOTS,
  type RakhiItem,
  type RakhiSection,
  findRakhiItem,
  formatINR,
  orderedRakhiSections,
  popularRakhiItems,
  rakhiDiscount,
} from '@/lib/rakhi-menu'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

type Cart = Record<string, number>
type Details = { time: string; name: string; phone: string; note: string }
type ServiceTab = 'alacarte' | 'catering' | 'platter'

const emptyDetails: Details = { time: '', name: '', phone: '', note: '' }
const STORAGE_KEY = 'ur-rakhi-v2'

/* ── Catering package data ──────────────────────────────────────────────── */
const CATERING_PACKAGES = [
  {
    id: '15pax',
    guests: 15,
    price: 19500,
    label: 'FOR 15 GUESTS',
  },
  {
    id: '25pax',
    guests: 25,
    price: 32500,
    label: 'FOR 25 GUESTS',
  },
]

const CATERING_MENU = [
  {
    category: 'APPETIZERS',
    items: [
      { name: 'Mushroom Galouti Charcoal Sliders', qty15: '20 pcs', qty25: '30 pcs' },
      { name: 'Bite Size Quesadillas', qty15: '30 pcs', qty25: '50 pcs' },
      { name: 'Cheesy Veg Cigar Rolls', qty15: '30 pcs', qty25: '50 pcs' },
    ],
  },
  {
    category: 'BAKED DISH',
    items: [
      { name: 'Spinach & Ricotta Ravioli', qty15: '4 ptn', qty25: '7 ptn' },
    ],
  },
  {
    category: 'HEALTHY BITES',
    items: [
      { name: 'Crunchy Thai Cabbage Salad', qty15: '3 ptn', qty25: '5 ptn' },
    ],
  },
  {
    category: 'WRAPS',
    items: [
      { name: 'Mediterranean Falafel Wrap', qty15: '16 pcs', qty25: '28 pcs' },
    ],
  },
  {
    category: 'MAINS',
    items: [
      { name: 'Vegetable Jhalfrezi', qty15: '4 ptn', qty25: '7 ptn' },
      { name: 'Mini Pudina Paratha', qty15: '20 pcs', qty25: '36 pcs' },
      { name: 'Exotic Veg Stroganoff with Herbed Rice', qty15: '4 ptn', qty25: '7 ptn' },
    ],
  },
  {
    category: 'DESSERTS',
    items: [
      { name: 'Sitaphal Rasmalai', qty15: '18 pcs', qty25: '30 pcs' },
      { name: 'Chocolate Monte Carlo', qty15: '3 ptn', qty25: '5 ptn' },
    ],
  },
]

/* ── Ornamental divider ─────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden="true">
      <div className="h-px flex-1 bg-rakhi-gold/30" />
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-rakhi-gold shrink-0">
        <path d="M10 2L10 18M2 10L18 10M4.929 4.929L15.071 15.071M15.071 4.929L4.929 15.071" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-rakhi-gold/30" />
    </div>
  )
}

/* ── Stepper ────────────────────────────────────────────────────────────── */
function Stepper({ qty, onChange }: { qty: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label="Remove one"
        className="flex size-7 items-center justify-center rounded-full border border-rakhi-gold/50 text-rakhi-saffron font-bold text-sm hover:bg-rakhi-gold/10 transition-colors"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-rakhi-deep tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Add one"
        className="flex size-7 items-center justify-center rounded-full border border-rakhi-gold/50 text-rakhi-saffron font-bold text-sm hover:bg-rakhi-gold/10 transition-colors"
      >
        +
      </button>
    </div>
  )
}

/* ── Vegetarian mark ────────────────────────────────────────────────────── */
function VegMark() {
  return (
    <span
      className="flex size-[15px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-green-700"
      role="img"
      aria-label="Pure vegetarian"
    >
      <span className="size-[7px] rounded-full bg-green-700" aria-hidden="true" />
    </span>
  )
}

/* ── "Most ordered" badge ───────────────────────────────────────────────── */
function PopularBadge() {
  return (
    <span className="mt-1.5 flex items-center gap-1.5">
      <span className="flex h-[3px] w-7 overflow-hidden rounded-full bg-rakhi-gold/25" aria-hidden="true">
        <span className="h-full w-4/5 rounded-full bg-rakhi-saffron" />
      </span>
      <span className="text-[11px] font-semibold tracking-wide text-rakhi-saffron">Most ordered</span>
    </span>
  )
}

/* ── Dish photo ─────────────────────────────────────────────────────────── */
function DishPhoto({ item }: { item: RakhiItem }) {
  if (!item.image) return null
  return <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
}

/* ── Add button / quantity stepper, overlapping the photo ───────────────── */
function AddControl({
  item,
  qty,
  onAdd,
  onQty,
}: {
  item: RakhiItem
  qty: number
  onAdd: (item: RakhiItem) => void
  onQty: (item: RakhiItem, next: number) => void
}) {
  if (qty > 0) {
    return (
      <div className="flex w-[106px] items-center justify-between rounded-xl border border-rakhi-saffron bg-white px-2 py-2 shadow-[0_4px_14px_rgba(45,26,10,.18)]">
        <button
          type="button"
          onClick={() => onQty(item, qty - 1)}
          aria-label={`Remove one ${item.name}`}
          className="flex size-6 items-center justify-center text-lg font-bold leading-none text-rakhi-saffron"
        >
          −
        </button>
        <span className="text-sm font-bold tabular-nums text-rakhi-saffron">{qty}</span>
        <button
          type="button"
          onClick={() => onQty(item, qty + 1)}
          aria-label={`Add one more ${item.name}`}
          className="flex size-6 items-center justify-center text-lg font-bold leading-none text-rakhi-saffron"
        >
          +
        </button>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onAdd(item)}
      aria-label={`Add ${item.name}`}
      className="relative w-[106px] rounded-xl border border-rakhi-saffron bg-white py-2.5 text-sm font-bold tracking-[0.08em] text-rakhi-saffron shadow-[0_4px_14px_rgba(45,26,10,.18)] transition-colors hover:bg-rakhi-saffron hover:text-white"
    >
      ADD
      <span className="absolute right-2 top-1 text-[11px] leading-none" aria-hidden="true">+</span>
    </button>
  )
}

/* ── Menu dish card ─────────────────────────────────────────────────────── */
function DishCard({
  item,
  qty,
  onAdd,
  onQty,
}: {
  item: RakhiItem
  qty: number
  onAdd: (item: RakhiItem) => void
  onQty: (item: RakhiItem, next: number) => void
}) {
  const hasPhoto = Boolean(item.image)
  return (
    <article
      className={cn(
        'flex gap-4 border-b border-rakhi-gold/15 py-5 last:border-b-0',
        // Photographed cards need room for the control hanging off the image.
        hasPhoto ? 'pb-9' : 'items-center',
      )}
    >
      <div className="min-w-0 flex-1">
        <VegMark />
        <h3 className="mt-2 font-serif text-[17px] font-semibold leading-snug text-rakhi-deep">
          {item.name}
        </h3>
        {item.popular && <PopularBadge />}
        <p className="mt-1.5 text-[15px] font-semibold text-rakhi-deep">{formatINR(item.price)}</p>
        <p className="mt-1 text-xs leading-relaxed text-rakhi-muted">
          ({item.unit}){item.description ? ` ${item.description}` : ''}
        </p>
      </div>

      {hasPhoto ? (
        <div className="relative w-32 shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-rakhi-cream ring-1 ring-inset ring-rakhi-gold/20">
            <DishPhoto item={item} />
          </div>
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2">
            <AddControl item={item} qty={qty} onAdd={onAdd} onQty={onQty} />
          </div>
        </div>
      ) : (
        <div className="shrink-0 self-center">
          <AddControl item={item} qty={qty} onAdd={onAdd} onQty={onQty} />
        </div>
      )}
    </article>
  )
}

/* ── Section block ──────────────────────────────────────────────────────── */
function SectionBlock({
  section,
  cart,
  onAdd,
  onQty,
  registerRef,
}: {
  section: RakhiSection
  cart: Cart
  onAdd: (item: RakhiItem) => void
  onQty: (item: RakhiItem, next: number) => void
  registerRef: (el: HTMLElement | null) => void
}) {
  return (
    <section id={section.id} ref={registerRef} className="scroll-mt-36">
      <div className="flex items-baseline justify-between gap-3 border-t-8 border-rakhi-gold/15 pt-6">
        <h2 className="font-serif text-xl font-semibold text-rakhi-deep">{section.name}</h2>
        <span className="text-xs font-medium text-rakhi-muted">
          {section.items.length} {section.items.length === 1 ? 'dish' : 'dishes'}
        </span>
      </div>
      <div className="mt-1">
        {section.items.map((item) => (
          <DishCard
            key={item.id}
            item={item}
            qty={cart[item.id] ?? 0}
            onAdd={onAdd}
            onQty={onQty}
          />
        ))}
      </div>
    </section>
  )
}

/* ── Bill Row ────────────────────────────────────────────────────────────── */
function BillRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between gap-2 py-1', bold && 'font-semibold')}>
      <span className={bold ? 'text-rakhi-deep' : 'text-rakhi-muted'}>{label}</span>
      <span className={bold ? 'text-rakhi-saffron font-serif text-lg' : 'text-rakhi-deep'}>{value}</span>
    </div>
  )
}

/* ── Catering tab ────────────────────────────────────────────────────────── */
function CateringTab() {
  const [selectedPkg, setSelectedPkg] = useState<string>('15pax')
  const [contactSent, setContactSent] = useState(false)
  const [sending, setSending] = useState(false)

  const pkg = CATERING_PACKAGES.find((p) => p.id === selectedPkg) ?? CATERING_PACKAGES[0]

  async function sendCateringEnquiry() {
    if (sending) return
    setSending(true)

    const lines = [
      'Raksha Bandhan Catering Enquiry — Urban Rasoi',
      '',
      `*Package:* ${pkg.guests} guests — ${formatINR(pkg.price)}`,
      `*Rate:* ₹1,300 per head`,
      '',
      '*MENU INCLUDED*',
    ]
    for (const section of CATERING_MENU) {
      lines.push(`\n*${section.category}*`)
      for (const item of section.items) {
        const qty = pkg.guests === 15 ? item.qty15 : item.qty25
        lines.push(`• ${item.name} — ${qty}`)
      }
    }
    lines.push('')
    lines.push('*INCLUSIONS*')
    lines.push('• 1 backend + 2 service staff for 3 hours')
    lines.push('• Inclusive of Govt. Taxes (5%)')
    lines.push('• Pure Vegetarian')
    lines.push('')
    lines.push('Please confirm availability for 28 August 2026.')

    const outcome = await shareOrderSlip({
      slip: {
        theme: 'rakhi',
        eyebrow: 'Raksha Bandhan 2026 · catering package',
        facts: [
          `Package: ${pkg.guests} guests  ·  ₹1,300 per head`,
          'Date: 28 August 2026',
          'Includes 1 backend + 2 service staff for 3 hours',
        ],
        groups: CATERING_MENU.map((section) => ({
          heading: section.category,
          rows: section.items.map<SlipRow>((item) => ({
            name: item.name,
            qty: pkg.guests === 15 ? item.qty15 : item.qty25,
          })),
        })),
        totalLabel: `Package · ${pkg.guests} guests`,
        totalValue: formatINR(pkg.price),
      },
      text: lines.join('\n'),
      fileName: 'urban-rasoi-rakhi-catering.png',
      title: 'Raksha Bandhan Catering — Urban Rasoi',
      tracking: {
        placement: 'rakhi-catering',
        contentName: 'Rakhi Catering Package',
        value: pkg.price,
        currency: 'INR',
      },
    })

    setSending(false)
    if (outcome !== 'cancelled') setContactSent(true)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
      {/* Package selector */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {CATERING_PACKAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPkg(p.id)}
            className={cn(
              'rounded-2xl border-2 p-5 text-left transition-all',
              selectedPkg === p.id
                ? 'border-rakhi-saffron bg-rakhi-saffron/5'
                : 'border-rakhi-gold/30 bg-rakhi-cream hover:border-rakhi-gold/60',
            )}
          >
            <p className="font-serif text-2xl font-semibold text-rakhi-saffron">{formatINR(p.price)}</p>
            <p className="text-xs font-semibold tracking-widest text-rakhi-muted mt-0.5 uppercase">{p.label}</p>
            <p className="text-xs text-rakhi-muted mt-1.5">₹1,300 per head</p>
          </button>
        ))}
      </div>

      {/* Menu breakdown */}
      <div className="mt-5 rounded-2xl border border-rakhi-gold/25 bg-rakhi-cream overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_6rem_6rem] gap-2 px-4 py-3 border-b border-rakhi-gold/20 bg-rakhi-saffron/8">
          <p className="text-xs font-semibold text-rakhi-deep">ITEM</p>
          <p className="text-xs font-semibold text-rakhi-saffron text-right">15 PAX</p>
          <p className="text-xs font-semibold text-rakhi-saffron text-right">25 PAX</p>
        </div>
        {CATERING_MENU.map((section) => (
          <div key={section.category}>
            <div className="px-4 py-2 bg-rakhi-gold/10">
              <p className="text-[10px] font-bold tracking-widest text-rakhi-saffron uppercase">{section.category}</p>
            </div>
            {section.items.map((item) => (
              <div
                key={item.name}
                className={cn(
                  'grid grid-cols-[1fr_6rem_6rem] gap-2 px-4 py-2.5 border-b border-rakhi-gold/10',
                  selectedPkg === '15pax' ? 'bg-rakhi-cream/50' : 'bg-white/60',
                )}
              >
                <p className="text-sm text-rakhi-deep">{item.name}</p>
                <p className={cn('text-sm text-right tabular-nums', selectedPkg === '15pax' ? 'font-semibold text-rakhi-deep' : 'text-rakhi-muted')}>{item.qty15}</p>
                <p className={cn('text-sm text-right tabular-nums', selectedPkg === '25pax' ? 'font-semibold text-rakhi-deep' : 'text-rakhi-muted')}>{item.qty25}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Inclusions */}
      <div className="mt-4 rounded-xl bg-rakhi-cream border border-rakhi-gold/20 p-4 text-sm text-rakhi-muted">
        <p className="font-medium text-rakhi-deep mb-1.5">Package includes</p>
        <ul className="space-y-0.5">
          <li>· 1 backend + 2 service staff for 3 hours</li>
          <li>· Inclusive of Govt. taxes (5%)</li>
          <li>· Pure vegetarian</li>
          <li>· Fixed date: <strong className="text-rakhi-deep">28 August 2026</strong></li>
        </ul>
      </div>

      <VoiceNoteNudge />

      {/* CTA */}
      <div className="mt-5">
        <button
          type="button"
          onClick={sendCateringEnquiry}
          disabled={sending}
          className={cn(
            'flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-semibold text-base transition-colors',
            sending
              ? 'cursor-not-allowed bg-rakhi-cream text-rakhi-muted'
              : 'bg-rakhi-saffron text-white hover:bg-rakhi-saffron-deep active:scale-[0.98]',
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M5.077 19.938A11.924 11.924 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.185.627 4.236 1.718 5.961L2 22l3.077-2.062zM12 4a8 8 0 1 1 0 16A8 8 0 0 1 12 4z" />
          </svg>
          Book catering for {pkg.guests} guests
        </button>
        {contactSent && (
          <p className="mt-3 text-center text-sm text-green-700 font-medium">
            Enquiry sent! We will be in touch shortly.
          </p>
        )}
        <p className="mt-2.5 text-center text-xs text-rakhi-muted">
          Sends to <span className="font-medium text-rakhi-deep">{site.phone}</span> on WhatsApp
        </p>
      </div>
    </div>
  )
}

/* ── A la carte tab ─────────────────────────────────────────────────────── */
function AlaCarteTab() {
  const [cart, setCart] = useState<Cart>({})
  const [details, setDetails] = useState<Details>(emptyDetails)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [popularOnly, setPopularOnly] = useState(false)
  const [activeSection, setActiveSection] = useState(orderedRakhiSections[0].id)
  const [hydrated, setHydrated] = useState(false)
  const [orderSent, setOrderSent] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const suppressSpy = useRef(false)

  useEffect(() => {
    const saved = loadOrderState<{ cart?: Cart; details?: Partial<Details> }>(STORAGE_KEY)
    if (saved) {
      if (saved.cart) {
        // A basket saved before the two-portion rule could hold a single
        // portion; lift it rather than send the kitchen an order it cannot fill.
        setCart(
          Object.fromEntries(
            Object.entries(saved.cart).map(([id, qty]) => [id, Math.max(qty, RAKHI_MIN_PORTIONS)]),
          ),
        )
      }
      if (saved.details) setDetails({ ...emptyDetails, ...saved.details })
    }
    setHydrated(true)
    window.fbq?.('trackCustom', 'RakhiOrderOpen')
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveOrderState(STORAGE_KEY, { cart, details })
  }, [cart, details, hydrated])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSpy.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -65% 0px' },
    )
    for (const el of Object.values(sectionRefs.current)) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const addItem = useCallback((item: RakhiItem) => {
    setCart((c) => ({ ...c, [item.id]: RAKHI_MIN_PORTIONS }))
    window.fbq?.('track', 'AddToCart', {
      content_name: item.name,
      value: item.price * RAKHI_MIN_PORTIONS,
      currency: 'INR',
    })
  }, [])

  const setQty = useCallback((item: RakhiItem, next: number) => {
    setCart((c) => {
      const updated = { ...c }
      // Stepping below the two-portion minimum takes the dish out altogether,
      // rather than leaving a quantity the kitchen will not cook.
      if (next < RAKHI_MIN_PORTIONS) delete updated[item.id]
      else updated[item.id] = next
      return updated
    })
  }, [])

  const lines = useMemo(
    () =>
      Object.entries(cart).flatMap(([id, qty]) => {
        const found = findRakhiItem(id)
        return found ? [{ ...found.item, qty, lineTotal: found.item.price * qty }] : []
      }),
    [cart],
  )

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const discount = rakhiDiscount(subtotal)
  const grandTotal = subtotal - discount
  const itemCount = lines.length
  // The minimum is judged on the subtotal, so the website saving is allowed to
  // take the payable amount below it.
  const belowMinimum = subtotal < RAKHI_MIN_ORDER && subtotal > 0
  const canOrder = subtotal >= RAKHI_MIN_ORDER && details.name.trim() && details.time

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orderedRakhiSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => (!q || item.name.toLowerCase().includes(q)) && (!popularOnly || item.popular),
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [query, popularOnly])

  function jumpTo(sectionId: string) {
    suppressSpy.current = true
    setActiveSection(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => { suppressSpy.current = false }, 700)
  }

  function buildWhatsappText() {
    const parts = [
      'Raksha Bandhan Order — Urban Rasoi',
      '',
      '*ORDER DETAILS*',
    ]
    for (const line of lines) {
      parts.push(`• ${line.name} (${line.unit}) x${line.qty} — ${formatINR(line.lineTotal)}`)
    }
    parts.push('')
    parts.push(`Item total: ${formatINR(subtotal)}`)
    if (discount > 0) {
      parts.push(`Website saving (${RAKHI_DISCOUNT_PERCENT}%): -${formatINR(discount)}`)
    }
    parts.push(`*To pay: ${formatINR(grandTotal)}*`)
    parts.push('')
    parts.push('*PICKUP DETAILS*')
    parts.push(`Date: ${RAKHI_PICKUP_DATE}`)
    parts.push(`Time: ${details.time}`)
    parts.push(`From: ${RAKHI_PICKUP_ADDRESS}`)
    parts.push('')
    parts.push('*CUSTOMER*')
    parts.push(`Name: ${details.name}`)
    if (details.phone) parts.push(`Phone: ${details.phone}`)
    if (details.note) parts.push(`Note: ${details.note}`)
    return parts.join('\n')
  }


  const [sharing, setSharing] = useState(false)

  async function sendOrder() {
    if (!canOrder || sharing) return
    setSharing(true)
    window.fbq?.('track', 'InitiateCheckout', { num_items: itemCount, value: grandTotal, currency: 'INR' })

    const facts = [`Name: ${details.name}`]
    if (details.phone) facts.push(`Phone: ${details.phone}`)
    facts.push(`Pickup: ${RAKHI_PICKUP_DATE}  ·  ${details.time}`)
    facts.push(RAKHI_PICKUP_ADDRESS)

    const outcome = await shareOrderSlip({
      slip: {
        theme: 'rakhi',
        eyebrow: 'Raksha Bandhan 2026 · festive order',
        facts,
        groups: [
          {
            heading: 'Your order',
            rows: lines.map<SlipRow>((line) => ({
              name: line.name,
              qty: `×${line.qty}`,
              price: formatINR(line.price),
              total: formatINR(line.lineTotal),
            })),
          },
          ...(discount > 0
            ? [{
                heading: 'Savings',
                rows: [
                  { name: 'Item total', total: formatINR(subtotal) },
                  { name: `Website saving (${RAKHI_DISCOUNT_PERCENT}%)`, total: `− ${formatINR(discount)}` },
                ] as SlipRow[],
              }]
            : []),
        ],
        totalLabel: 'To pay',
        totalValue: formatINR(grandTotal),
        note: details.note || undefined,
      },
      text: buildWhatsappText(),
      fileName: 'urban-rasoi-rakhi-order.png',
      title: 'Raksha Bandhan Order — Urban Rasoi',
      tracking: {
        placement: 'rakhi-order',
        contentName: 'Rakhi Festive Order',
        value: grandTotal,
        currency: 'INR',
      },
    })

    setSharing(false)
    if (outcome === 'cancelled') return
    setOrderSent(true)
    setCartOpen(false)
    // Clear the basket so a sent order does not reappear on the next visit.
    setCart({})
    setDetails(emptyDetails)
    clearOrderState(STORAGE_KEY)
  }

  return (
    <>
      {/* Search + category rail */}
      <div className="sticky top-16 z-30 border-b border-rakhi-gold/20 bg-rakhi-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 pb-2.5 pt-3">
          <label className="relative block">
            <span className="sr-only">Search the Rakhi menu</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-rakhi-muted"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for sliders, paneer, dessert…"
              className="w-full rounded-full border border-rakhi-gold/35 bg-white py-2.5 pl-11 pr-4 text-sm text-rakhi-deep placeholder:text-rakhi-muted/70 focus:border-rakhi-saffron focus:outline-none"
            />
          </label>

          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide" aria-label="Menu filters">
            <button
              type="button"
              onClick={() => setPopularOnly((v) => !v)}
              aria-pressed={popularOnly}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                popularOnly
                  ? 'border-rakhi-saffron bg-rakhi-saffron text-white'
                  : 'border-rakhi-gold/40 bg-white text-rakhi-deep hover:bg-rakhi-cream',
              )}
            >
              <span aria-hidden="true">★</span> Most ordered
            </button>
            {orderedRakhiSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap',
                  activeSection === section.id && !popularOnly && !query
                    ? 'bg-rakhi-saffron text-white'
                    : 'bg-rakhi-cream text-rakhi-deep hover:bg-rakhi-gold/20',
                )}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu list */}
      <div className="mx-auto max-w-3xl px-4 pb-36 md:px-8">
        {/* Website-only saving */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-rakhi-saffron/45 bg-rakhi-saffron/8 px-4 py-3">
          <span className="text-xl" aria-hidden="true">🎟️</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-rakhi-deep">
              {RAKHI_DISCOUNT_PERCENT}% off, up to {formatINR(RAKHI_DISCOUNT_CAP)}
            </p>
            <p className="text-xs text-rakhi-muted">
              Applied automatically because you are ordering on our website.
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-rakhi-gold/25 bg-rakhi-cream px-4 py-3 text-sm text-rakhi-muted">
          <p className="mb-1 font-medium text-rakhi-deep">How it works</p>
          <ul className="space-y-0.5 text-xs">
            <li>· Add dishes, review your basket, then send it on WhatsApp</li>
            <li>· Minimum <strong className="text-rakhi-deep">{RAKHI_MIN_PORTIONS} portions</strong> per dish</li>
            <li>· Minimum order: <strong className="text-rakhi-deep">{formatINR(RAKHI_MIN_ORDER)}</strong> before discount</li>
            <li>· Self pickup · <strong className="text-rakhi-deep">AE-287, Saltlake Sector-1</strong> · <strong className="text-rakhi-deep">{RAKHI_PICKUP_DATE}</strong></li>
          </ul>
        </div>

        {/* Most ordered — hidden while searching or filtering */}
        {!query && !popularOnly && popularRakhiItems.length > 0 && (
          <section className="mt-7" aria-labelledby="most-ordered-heading">
            <h2 id="most-ordered-heading" className="font-serif text-xl font-semibold text-rakhi-deep">
              Most ordered
            </h2>
            <p className="mt-0.5 text-xs text-rakhi-muted">What Kolkata reaches for first</p>
            <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {popularRakhiItems.map((item) => (
                <article key={item.id} className="w-[152px] shrink-0">
                  <div className="relative h-[152px] w-[152px] overflow-hidden rounded-2xl bg-rakhi-cream ring-1 ring-inset ring-rakhi-gold/20">
                    <DishPhoto item={item} />
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 pb-2">
                      <AddControl item={item} qty={cart[item.id] ?? 0} onAdd={addItem} onQty={setQty} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-1.5">
                    <VegMark />
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-rakhi-deep">{item.name}</p>
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-rakhi-saffron">{formatINR(item.price)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {visibleSections.length === 0 ? (
          <p className="py-16 text-center text-sm text-rakhi-muted">
            Nothing matched “{query}”. Try “sliders”, “paneer” or “dessert”.
          </p>
        ) : (
          visibleSections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              cart={cart}
              onAdd={addItem}
              onQty={setQty}
              registerRef={(el) => { sectionRefs.current[section.id] = el }}
            />
          ))
        )}

        <div className="mt-10 text-center text-xs text-rakhi-muted">
          <p>Pure Vegetarian · FSSAI Lic. No. 12823013000353</p>
        </div>
      </div>

      {/* Floating menu browser */}
      {!cartOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={cn(
            'fixed right-4 z-40 flex items-center gap-2 rounded-xl bg-rakhi-deep px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all md:right-6',
            itemCount > 0 ? 'bottom-24' : 'bottom-6',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M7 2v9M4.5 2v5a2.5 2.5 0 0 0 5 0V2M7 11v11M17.5 2c-1.6 1.7-2.3 3.8-2.3 6s.7 3.4 2.3 4.4V22" />
          </svg>
          Menu
        </button>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-rakhi-deep/55 px-4 pb-24 md:items-center md:pb-4"
          role="dialog"
          aria-modal="true"
          aria-label="Browse the menu"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ul className="max-h-[60svh] overflow-y-auto py-2">
              {orderedRakhiSections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); setQuery(''); setPopularOnly(false); jumpTo(section.id) }}
                    className="flex w-full items-center justify-between px-6 py-3.5 text-left transition-colors hover:bg-rakhi-cream"
                  >
                    <span className="text-[15px] font-medium text-rakhi-deep">{section.name}</span>
                    <span className="text-sm font-semibold text-rakhi-muted">{section.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 bg-rakhi-deep py-3.5 text-sm font-semibold text-white"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Sticky cart bar */}
      {itemCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rakhi-gold/20 bg-rakhi-bg/97 p-3 backdrop-blur-sm md:p-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-semibold text-rakhi-deep">{formatINR(grandTotal)}</span>
                {discount > 0 && (
                  <span className="text-sm text-rakhi-muted line-through">{formatINR(subtotal)}</span>
                )}
              </p>
              <p className="text-xs text-rakhi-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                {belowMinimum ? (
                  <span className="ml-1.5 text-amber-600">· Add {formatINR(RAKHI_MIN_ORDER - subtotal)} more</span>
                ) : discount > 0 ? (
                  <span className="ml-1.5 font-semibold text-green-700">· saved {formatINR(discount)}</span>
                ) : null}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full bg-rakhi-saffron px-6 py-3.5 font-semibold text-white transition-colors hover:bg-rakhi-saffron-deep"
            >
              Review order <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-rakhi-deep/50 md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Your Rakhi order"
        >
          <div className="flex max-h-[92svh] w-full max-w-2xl flex-col rounded-t-3xl bg-rakhi-bg md:rounded-3xl overflow-hidden">
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-rakhi-gold/20 md:px-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-rakhi-saffron">Raksha Bandhan 2026</p>
                <h2 className="font-serif text-2xl font-semibold text-rakhi-deep">Your Order</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-rakhi-cream text-lg text-rakhi-deep hover:bg-rakhi-gold/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4 md:px-8">
              {/* Order image card */}
              <div className="mt-4 rounded-xl overflow-hidden relative h-28">
                <Image
                  src="/images/gallery-diwali.jpg"
                  alt="Urban Rasoi festive spread"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rakhi-deep/70 to-transparent flex items-center px-4">
                  <div>
                    <p className="text-white font-serif text-lg font-semibold">Urban Rasoi</p>
                    <p className="text-white/70 text-xs">Raksha Bandhan 2026 · Festive Order</p>
                  </div>
                </div>
              </div>

              {/* Order lines */}
              <ul className="mt-4 divide-y divide-rakhi-gold/15">
                {lines.map((line) => (
                  <li key={line.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-rakhi-deep text-sm leading-snug">{line.name}</p>
                      <p className="text-xs text-rakhi-muted">{line.unit} · {formatINR(line.price)} each</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Stepper qty={line.qty} onChange={(next) => setQty(line, next)} />
                      <p className="w-16 text-right font-semibold text-rakhi-deep tabular-nums text-sm">
                        {formatINR(line.lineTotal)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Bill summary */}
              <div className="mt-4 rounded-2xl bg-rakhi-cream border border-rakhi-gold/20 p-4">
                <Divider />
                {lines.map((line) => (
                  <BillRow key={line.id} label={line.name} value={formatINR(line.lineTotal)} />
                ))}
                <div className="mt-2 border-t border-rakhi-gold/20 pt-2">
                  <BillRow label="Item total" value={formatINR(subtotal)} />
                  {discount > 0 && (
                    <div className="flex justify-between gap-2 py-1 text-green-700">
                      <span>Website saving ({RAKHI_DISCOUNT_PERCENT}%)</span>
                      <span className="font-semibold">− {formatINR(discount)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 border-t border-rakhi-gold/20 pt-2">
                  <BillRow label="To pay" value={formatINR(grandTotal)} bold />
                </div>
                {discount > 0 && (
                  <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-center text-xs font-semibold text-green-700">
                    You saved {formatINR(discount)} by ordering on the website 🎉
                  </p>
                )}
                {belowMinimum && (
                  <p className="mt-2 text-xs text-amber-700 font-medium">
                    Minimum order is {formatINR(RAKHI_MIN_ORDER)} before the discount. Please add {formatINR(RAKHI_MIN_ORDER - subtotal)} more.
                  </p>
                )}
                <Divider />
                <div className="text-xs text-rakhi-muted space-y-0.5">
                  <p>Pickup: {RAKHI_PICKUP_ADDRESS}</p>
                  <p>Date: {RAKHI_PICKUP_DATE}</p>
                </div>
              </div>

              {/* Customer details */}
              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-rakhi-saffron">Your Details</p>
                <div>
                  <label className="block text-xs font-medium text-rakhi-deep mb-1">
                    Pickup time <span className="text-rakhi-saffron">*</span>
                  </label>
                  <select
                    value={details.time}
                    onChange={(e) => setDetails({ ...details, time: e.target.value })}
                    className="w-full rounded-xl border border-rakhi-gold/30 bg-white p-3 text-rakhi-deep text-sm focus:border-rakhi-saffron focus:outline-none"
                  >
                    <option value="">Select a time slot</option>
                    {PICKUP_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-rakhi-deep mb-1">
                      Your name <span className="text-rakhi-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-rakhi-gold/30 bg-white p-3 text-rakhi-deep text-sm placeholder:text-rakhi-muted focus:border-rakhi-saffron focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rakhi-deep mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      placeholder="9XXXXXXXXX"
                      className="w-full rounded-xl border border-rakhi-gold/30 bg-white p-3 text-rakhi-deep text-sm placeholder:text-rakhi-muted focus:border-rakhi-saffron focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-rakhi-deep mb-1">Special note (optional)</label>
                  <input
                    type="text"
                    value={details.note}
                    onChange={(e) => setDetails({ ...details, note: e.target.value })}
                    placeholder="Allergies, packing preferences…"
                    className="w-full rounded-xl border border-rakhi-gold/30 bg-white p-3 text-rakhi-deep text-sm placeholder:text-rakhi-muted focus:border-rakhi-saffron focus:outline-none"
                  />
                </div>
              </div>

              <VoiceNoteNudge />

              {/* Send button */}
              <div className="mt-5 mb-2">
                {!canOrder && grandTotal > 0 && (
                  <p className="mb-2 text-center text-xs text-amber-700">
                    {belowMinimum
                      ? `Add ${formatINR(RAKHI_MIN_ORDER - subtotal)} more to reach the minimum.`
                      : 'Please enter your name and select a pickup time.'}
                  </p>
                )}
                <button
                  type="button"
                  onClick={sendOrder}
                  disabled={!canOrder || sharing}
                  className={cn(
                    'flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-semibold text-base transition-all',
                    canOrder && !sharing
                      ? 'bg-rakhi-saffron text-white hover:bg-rakhi-saffron-deep active:scale-[0.98]'
                      : 'bg-rakhi-cream text-rakhi-muted cursor-not-allowed',
                  )}
                >
                  {sharing ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Preparing graphic…
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M5.077 19.938A11.924 11.924 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.185.627 4.236 1.718 5.961L2 22l3.077-2.062zM12 4a8 8 0 1 1 0 16A8 8 0 0 1 12 4z" />
                      </svg>
                      Send order on WhatsApp
                    </>
                  )}
                </button>
                {orderSent && (
                  <p className="mt-3 text-center text-sm text-green-700 font-medium">
                    Order sent! We will confirm shortly.
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-rakhi-muted">
                  On mobile, your order graphic opens the share sheet — pick WhatsApp to send it directly.
                  On desktop, the graphic is saved to your downloads; then WhatsApp opens with the order text.
                </p>
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  onClick={() => trackContact('rakhi-cart')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rakhi-gold/40 py-3 text-sm font-semibold text-rakhi-deep transition-colors hover:bg-rakhi-cream"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Rather talk it through? Call {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Order deadline band ────────────────────────────────────────────────── */
function ClosingBand({ daysLeft, closingDate }: { daysLeft: number; closingDate: string }) {
  if (daysLeft < 0) return null

  const message =
    daysLeft === 0
      ? 'Last day to order'
      : daysLeft === 1
        ? `1 day left to order · closes ${closingDate}`
        : daysLeft <= 7
          ? `${daysLeft} days left to order · closes ${closingDate}`
          : `Orders close ${closingDate}`
  const urgent = daysLeft <= 7

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2.5 px-5 py-2.5 text-center text-sm font-semibold',
        urgent ? 'bg-rakhi-saffron text-white' : 'bg-rakhi-gold/15 text-rakhi-deep',
      )}
    >
      <span aria-hidden="true">🪢</span>
      <span>{message}</span>
      <span className={cn('hidden font-normal sm:inline', urgent ? 'text-white/70' : 'text-rakhi-muted')}>
        · limited pickup slots
      </span>
    </div>
  )
}

/* ── Voice note nudge ───────────────────────────────────────────────────── */
function VoiceNoteNudge() {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-rakhi-gold/30 bg-rakhi-cream px-4 py-3.5">
      <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">🎙️</span>
      <p className="text-xs leading-relaxed text-rakhi-muted">
        <strong className="font-semibold text-rakhi-deep">Easier said than typed?</strong>{' '}
        Once WhatsApp opens, hold the mic button and send us a voice note — allergies, spice
        levels, packing or timing. We listen to every one before we cook.
      </p>
    </div>
  )
}

/* ── Main page component ────────────────────────────────────────────────── */
export function RakhiOrder({
  daysLeftToOrder,
  closingDate,
}: {
  /** Computed on the server so the countdown cannot drift from the HTML. */
  daysLeftToOrder: number
  closingDate: string
}) {
  const [activeTab, setActiveTab] = useState<ServiceTab>('alacarte')

  const tabs: { id: ServiceTab; label: string; sublabel: string }[] = [
    { id: 'alacarte', label: 'A la Carte', sublabel: 'Build your own order' },
    { id: 'catering', label: 'Catering Package', sublabel: '15 or 25 guests' },
    { id: 'platter', label: 'Platters', sublabel: 'Coming soon' },
  ]

  return (
    <div className="min-h-screen bg-rakhi-bg">
      {/* Hero — one reel, and only what a guest needs to read */}
      <div className="relative flex min-h-[84svh] items-center overflow-hidden">
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/rakhi-hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/media/rakhi-hero.mp4" type="video/mp4" />
        </video>
        {/* Two layers: an even wash for legibility, plus a fade into the page */}
        <div className="absolute inset-0 bg-rakhi-deep/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-rakhi-deep/70 via-rakhi-deep/45 to-rakhi-bg" />

        <div className="relative mx-auto w-full max-w-3xl px-5 py-24 text-center">
          <div className="mb-7 flex justify-center">
            <Link href="/" aria-label="Urban Rasoi home">
              <Image
                src="/images/logo.jpg"
                alt="Urban Rasoi"
                width={52}
                height={52}
                className="size-13 rounded-full object-cover ring-2 ring-white/35 transition-transform hover:scale-105"
              />
            </Link>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-rakhi-gold">
            Raksha Bandhan 2026
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] text-white text-balance md:text-7xl">
            Festive Menu
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Pure vegetarian, made to order · Pickup {RAKHI_PICKUP_DATE} from Salt Lake
          </p>

          <a
            href="#menu"
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-rakhi-deep shadow-xl transition-transform hover:-translate-y-0.5"
          >
            Explore the menu
            <span aria-hidden="true">↓</span>
          </a>

          {/* Quiet secondary actions — present, but not competing with the menu */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/75">
            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              onClick={() => trackContact('rakhi-hero')}
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Call us
            </a>
            <span aria-hidden="true" className="text-white/30">·</span>
            <a
              href="/images/rakhi-festive-menu.jpg"
              download="urban-rasoi-raksha-bandhan-menu.jpg"
              onClick={() => window.fbq?.('trackCustom', 'MenuDownloaded', { menu: 'Raksha Bandhan' })}
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Download menu
            </a>
            <span aria-hidden="true" className="text-white/30">·</span>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.fbq?.('trackCustom', 'InstagramClick', { from: 'rakhi-hero' })}
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              See our work
            </a>
          </div>
        </div>
      </div>

      <ClosingBand daysLeft={daysLeftToOrder} closingDate={closingDate} />

      {/* Service tabs */}
      <div id="menu" className="sticky top-16 z-30 scroll-mt-16 border-b border-rakhi-gold/20 bg-rakhi-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id !== 'platter') setActiveTab(tab.id)
                }}
                disabled={tab.id === 'platter'}
                className={cn(
                  'group relative shrink-0 flex flex-col items-start px-4 py-3 text-left transition-colors',
                  tab.id === 'platter' && 'cursor-not-allowed opacity-50',
                  activeTab === tab.id
                    ? 'text-rakhi-saffron'
                    : 'text-rakhi-muted hover:text-rakhi-deep',
                )}
              >
                <span className="text-sm font-semibold">{tab.label}</span>
                <span className="text-[10px]">{tab.sublabel}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-rakhi-saffron" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'alacarte' && <AlaCarteTab />}
      {activeTab === 'catering' && <CateringTab />}
    </div>
  )
}
