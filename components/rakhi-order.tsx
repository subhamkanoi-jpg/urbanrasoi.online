'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { shareOrderSlip, type SlipRow } from '@/lib/order-slip'
import { clearOrderState, loadOrderState, saveOrderState } from '@/lib/order-storage'
import {
  RAKHI_MIN_ORDER,
  RAKHI_PICKUP_DATE,
  RAKHI_PICKUP_ADDRESS,
  PICKUP_TIME_SLOTS,
  type RakhiItem,
  type RakhiSection,
  findRakhiItem,
  formatINR,
  rakhiSections,
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

/* ── Menu item row ──────────────────────────────────────────────────────── */
function ItemRow({
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
  const inCart = qty > 0
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl transition-all',
        inCart ? 'bg-rakhi-cream/80 ring-1 ring-rakhi-gold/40' : 'hover:bg-rakhi-cream/40',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-rakhi-deep leading-snug">{item.name}</p>
        <p className="text-xs text-rakhi-muted mt-0.5">{item.unit}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-serif text-base font-semibold text-rakhi-saffron">{formatINR(item.price)}</span>
        {inCart ? (
          <Stepper qty={qty} onChange={(next) => onQty(item, next)} />
        ) : (
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="rounded-full border border-rakhi-gold/60 px-3 py-1.5 text-xs font-semibold text-rakhi-saffron transition-colors hover:bg-rakhi-saffron hover:text-white"
          >
            Add
          </button>
        )}
      </div>
    </div>
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
      <div className="mt-10 mb-3">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-rakhi-saffron">{section.name}</p>
        <Divider />
      </div>
      <div className="flex flex-col gap-1">
        {section.items.map((item) => (
          <ItemRow
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

/* ── Audio player ───────────────────────────────────────────────────────── */
const FESTIVE_MUSIC_URL =
  'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bhoopali.ogg'

function FestiveMusic() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <div className="fixed bottom-6 right-4 z-50 md:right-6">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={FESTIVE_MUSIC_URL} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause festive music' : 'Play Indian festive music'}
        className={cn(
          'relative flex size-12 items-center justify-center rounded-full shadow-lg transition-all',
          playing
            ? 'bg-rakhi-saffron text-white ring-2 ring-rakhi-gold/50 ring-offset-2'
            : 'bg-white text-rakhi-saffron border border-rakhi-gold/40 hover:bg-rakhi-cream',
        )}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
        {playing && (
          <span className="absolute -top-1 -right-1 flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rakhi-gold opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-rakhi-gold" />
          </span>
        )}
      </button>
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
  const [activeSection, setActiveSection] = useState(rakhiSections[0].id)
  const [hydrated, setHydrated] = useState(false)
  const [orderSent, setOrderSent] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const suppressSpy = useRef(false)

  useEffect(() => {
    const saved = loadOrderState<{ cart?: Cart; details?: Partial<Details> }>(STORAGE_KEY)
    if (saved) {
      if (saved.cart) setCart(saved.cart)
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
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }))
    window.fbq?.('track', 'AddToCart', { content_name: item.name, value: item.price, currency: 'INR' })
  }, [])

  const setQty = useCallback((item: RakhiItem, next: number) => {
    setCart((c) => {
      const updated = { ...c }
      if (next <= 0) delete updated[item.id]
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

  const grandTotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const itemCount = lines.length
  const belowMinimum = grandTotal < RAKHI_MIN_ORDER && grandTotal > 0
  const canOrder = grandTotal >= RAKHI_MIN_ORDER && details.name.trim() && details.time

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
    parts.push(`*Order Total: ${formatINR(grandTotal)}*`)
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
        ],
        totalLabel: 'Order total',
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
      {/* Category rail */}
      <div className="sticky top-16 z-30 border-b border-rakhi-gold/20 bg-rakhi-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide" aria-label="Menu sections">
            {rakhiSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap',
                  activeSection === section.id
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
        <div className="mt-5 rounded-xl border border-rakhi-gold/25 bg-rakhi-cream px-4 py-3 text-sm text-rakhi-muted">
          <p className="font-medium text-rakhi-deep mb-1">How it works</p>
          <ul className="space-y-0.5 text-xs">
            <li>· Add dishes to cart, then review and send via WhatsApp</li>
            <li>· Minimum order: <strong className="text-rakhi-deep">{formatINR(RAKHI_MIN_ORDER)}</strong></li>
            <li>· Self pickup · <strong className="text-rakhi-deep">AE-287, Saltlake Sector-1</strong> · <strong className="text-rakhi-deep">28 August 2026</strong></li>
          </ul>
        </div>

        {rakhiSections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            cart={cart}
            onAdd={addItem}
            onQty={setQty}
            registerRef={(el) => { sectionRefs.current[section.id] = el }}
          />
        ))}

        <div className="mt-10 text-center text-xs text-rakhi-muted">
          <p>Pure Vegetarian · FSSAI Lic. No. 12823013000353</p>
        </div>
      </div>

      {/* Sticky cart bar */}
      {itemCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rakhi-gold/20 bg-rakhi-bg/97 p-3 backdrop-blur-sm md:p-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="font-serif text-xl font-semibold text-rakhi-deep">{formatINR(grandTotal)}</p>
              <p className="text-xs text-rakhi-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                {belowMinimum && (
                  <span className="ml-1.5 text-amber-600">· Add {formatINR(RAKHI_MIN_ORDER - grandTotal)} more</span>
                )}
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
                  <BillRow label="Order Total" value={formatINR(grandTotal)} bold />
                </div>
                {belowMinimum && (
                  <p className="mt-2 text-xs text-amber-700 font-medium">
                    Minimum order is {formatINR(RAKHI_MIN_ORDER)}. Please add {formatINR(RAKHI_MIN_ORDER - grandTotal)} more.
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
                      ? `Add ${formatINR(RAKHI_MIN_ORDER - grandTotal)} more to reach the minimum.`
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
                <p className="mt-1.5 text-center text-xs font-medium text-rakhi-deep">
                  {site.phone}
                </p>
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
      <FestiveMusic />

      {/* Hero — using real food gallery images in a collage */}
      <div className="relative overflow-hidden">
        {/* Background: collage of real food photos */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-1">
          <div className="relative overflow-hidden">
            <Image src="/images/gallery-event.jpg" alt="" fill className="object-cover object-center scale-105" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/images/gallery-spread.jpg" alt="" fill className="object-cover object-center scale-105" />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/images/gallery-diwali.jpg" alt="" fill className="object-cover object-center scale-105" />
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-rakhi-deep/75 via-rakhi-deep/55 to-rakhi-bg" />

        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-28 text-center md:pb-20 md:pt-36">
          <div className="mb-5 flex justify-center">
            <Link href="/" aria-label="Urban Rasoi home">
              <Image
                src="/images/logo.jpg"
                alt="Urban Rasoi"
                width={60}
                height={60}
                className="size-15 rounded-full ring-4 ring-rakhi-gold/50 object-cover shadow-xl transition-transform hover:scale-105"
              />
            </Link>
          </div>
          <p className="text-xs font-semibold tracking-[0.3em] text-rakhi-gold uppercase">Raksha Bandhan 2026</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white text-balance md:text-6xl">
            Festive Menu
          </h1>
          <p className="mt-3 text-white/75 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Curated gourmet bites for your Rakhi celebration at home.
            Pure vegetarian · Crafted with love.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5 text-xs">
            {[
              { text: 'Pickup: Salt Lake Sector-1' },
              { text: '28 August 2026' },
              { text: 'Min. order ₹3,000 (a la carte)' },
            ].map(({ text }) => (
              <span key={text} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-sm">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ClosingBand daysLeft={daysLeftToOrder} closingDate={closingDate} />

      {/* Service tabs */}
      <div className="sticky top-16 z-30 border-b border-rakhi-gold/20 bg-rakhi-bg/95 backdrop-blur-sm">
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
