'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shareOrderSlip, type SlipGroup, type SlipRow } from '@/lib/order-slip'
import { clearOrderState, loadOrderState, saveOrderState } from '@/lib/order-storage'
import {
  type MenuItem,
  type MenuSection,
  findItem,
  formatINR,
  orderedMenuSections,
  popularMenuItems,
  orderTerms,
  serviceAddOns,
} from '@/lib/alacarte-menu'
import { kolkataToday } from '@/lib/dates'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'ur-alacarte-v2'

type Cart = Record<string, number>
type Services = { backend: boolean; frontend: boolean }
type Details = { date: string; time: string; area: string; name: string; note: string }
type CustomItem = { id: string; sectionName: string; name: string; qty: number }

const emptyDetails: Details = { date: '', time: '', area: '', name: '', note: '' }

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

function PopularBadge() {
  return (
    <span className="mt-1.5 flex items-center gap-1.5">
      <span className="flex h-[3px] w-7 overflow-hidden rounded-full bg-terracotta/25" aria-hidden="true">
        <span className="h-full w-4/5 rounded-full bg-terracotta" />
      </span>
      <span className="text-[11px] font-semibold tracking-wide text-terracotta">Most ordered</span>
    </span>
  )
}

function useHoldRepeat(step: () => void) {
  const timers = useRef<{ start?: number; tick?: number }>({})

  const stop = useCallback(() => {
    window.clearTimeout(timers.current.start)
    window.clearInterval(timers.current.tick)
    timers.current = {}
  }, [])

  const start = useCallback(() => {
    stop()
    timers.current.start = window.setTimeout(() => {
      timers.current.tick = window.setInterval(step, 110)
    }, 450)
  }, [step, stop])

  useEffect(() => stop, [stop])

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  }
}

function AddControl({
  item,
  qty,
  onAdd,
  onQty,
}: {
  item: MenuItem
  qty: number
  onAdd: (item: MenuItem) => void
  onQty: (item: MenuItem, next: number) => void
}) {
  const qtyRef = useRef(qty)
  qtyRef.current = qty
  const decrement = useCallback(() => onQty(item, qtyRef.current - 1), [item, onQty])
  const increment = useCallback(() => onQty(item, qtyRef.current + 1), [item, onQty])
  const holdDown = useHoldRepeat(decrement)
  const holdUp = useHoldRepeat(increment)

  if (qty > 0) {
    return (
      <div className="flex w-[106px] items-center justify-between rounded-xl border border-terracotta bg-white px-2 py-2 shadow-[0_4px_14px_rgba(30,20,11,.14)]">
        <button
          type="button"
          onClick={decrement}
          {...holdDown}
          aria-label={`Remove one ${item.name}`}
          className="flex size-6 touch-none items-center justify-center text-lg font-bold leading-none text-terracotta"
        >
          −
        </button>
        <span className="text-sm font-bold tabular-nums text-terracotta">{qty}</span>
        <button
          type="button"
          onClick={increment}
          {...holdUp}
          aria-label={`Add one more ${item.name}`}
          className="flex size-6 touch-none items-center justify-center text-lg font-bold leading-none text-terracotta"
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
      className="relative w-[106px] rounded-xl border border-terracotta bg-white py-2.5 text-sm font-bold tracking-[0.08em] text-terracotta shadow-[0_4px_14px_rgba(30,20,11,.14)] transition-colors hover:bg-terracotta hover:text-primary-foreground"
    >
      ADD
      <span className="absolute right-2 top-1 text-[11px] leading-none" aria-hidden="true">
        +
      </span>
    </button>
  )
}

function DishCard({
  item,
  qty,
  onAdd,
  onQty,
}: {
  item: MenuItem
  qty: number
  onAdd: (item: MenuItem) => void
  onQty: (item: MenuItem, next: number) => void
}) {
  const hasPhoto = Boolean(item.image)
  return (
    <article
      className={cn(
        'flex gap-4 border-b border-border py-5 last:border-b-0',
        hasPhoto ? 'pb-9' : 'items-center',
      )}
    >
      <div className="min-w-0 flex-1">
        <VegMark />
        <h3 className="mt-2 font-serif text-[17px] font-semibold leading-snug text-ink">{item.name}</h3>
        {item.popular && <PopularBadge />}
        <p className="mt-1.5 flex items-baseline gap-1.5 text-[15px] font-semibold text-ink">
          {formatINR(item.price)}
          <span className="text-xs font-normal text-ink-soft">{item.unit}</span>
        </p>
        {item.description && <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.description}</p>}
      </div>

      {hasPhoto ? (
        <div className="relative w-32 shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-cream ring-1 ring-inset ring-border">
            <Image src={item.image!} alt={item.name} fill sizes="128px" className="object-cover" />
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

function Stepper({ qty, onChange }: { qty: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-terracotta bg-cream p-1">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label="Remove one"
        className="flex size-8 items-center justify-center rounded-full text-lg font-semibold text-terracotta transition-colors hover:bg-background"
      >
        {qty <= 1 ? '🗑' : '−'}
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-ink">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Add one"
        className="flex size-8 items-center justify-center rounded-full text-lg font-semibold text-terracotta transition-colors hover:bg-background"
      >
        +
      </button>
    </div>
  )
}

function CustomItemAdder({
  sectionName,
  label,
  prefill = '',
  addedCount = 0,
  onAdd,
}: {
  sectionName: string
  label: string
  prefill?: string
  addedCount?: number
  onAdd: (name: string, qty: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(prefill)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function submit() {
    if (!name.trim()) return
    onAdd(name, qty)
    setName('')
    setQty(1)
    setOpen(false)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2600)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setName(prefill)
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-terracotta/50 bg-cream/60 px-4 py-3.5 text-sm font-semibold text-terracotta transition-colors hover:border-terracotta hover:bg-cream"
      >
        <span aria-hidden="true">+</span>
        {justAdded ? 'Added — request another?' : label}
        {addedCount > 0 && !justAdded && (
          <span className="rounded-full bg-terracotta px-2 py-0.5 text-xs text-primary-foreground">{addedCount}</span>
        )}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-terracotta bg-cream/60 p-4">
      <label className="block">
        <span className="text-sm font-semibold text-ink">Tell us what you would like</span>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit()
            if (event.key === 'Escape') setOpen(false)
          }}
          placeholder={`e.g. a dish you loved, or a twist on our ${sectionName.toLowerCase()}`}
          className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-ink placeholder:text-ink-lighter focus:border-terracotta focus:outline-none"
        />
      </label>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-ink-soft">Quantity</span>
        <Stepper qty={qty} onChange={(next) => setQty(Math.max(1, next))} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="flex-1 whitespace-nowrap rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep disabled:opacity-40"
        >
          Add request
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
      <p className="mt-2.5 text-xs text-ink-soft">We will confirm if we can make it and quote the price on WhatsApp.</p>
    </div>
  )
}

function SectionBlock({
  section,
  cart,
  customCount,
  onAdd,
  onQty,
  onAddCustom,
  registerRef,
}: {
  section: MenuSection
  cart: Cart
  customCount: number
  onAdd: (item: MenuItem) => void
  onQty: (item: MenuItem, next: number) => void
  onAddCustom: (name: string, qty: number) => void
  registerRef: (el: HTMLElement | null) => void
}) {
  return (
    <section id={section.id} ref={registerRef} className="scroll-mt-36">
      <div className="flex items-baseline justify-between gap-3 border-t-8 border-cream pt-6">
        <h2 className="font-serif text-xl font-semibold text-ink md:text-2xl">{section.name}</h2>
        <span className="text-xs font-medium text-ink-lighter">
          {section.items.length} {section.items.length === 1 ? 'dish' : 'dishes'}
        </span>
      </div>
      {section.note && <p className="mt-1 text-sm text-ink-soft">{section.note}</p>}
      <div className="mt-1">
        {section.items.map((item) => (
          <DishCard key={item.id} item={item} qty={cart[item.id] ?? 0} onAdd={onAdd} onQty={onQty} />
        ))}
      </div>
      <div className="mt-3 mb-6">
        <CustomItemAdder
          sectionName={section.name}
          label={`Something else from ${section.name}?`}
          addedCount={customCount}
          onAdd={onAddCustom}
        />
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <p className="text-ink-soft">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  )
}

export function AlacarteOrder() {
  const [cart, setCart] = useState<Cart>({})
  const [customItems, setCustomItems] = useState<CustomItem[]>([])
  const [services, setServices] = useState<Services>({ backend: false, frontend: false })
  const [details, setDetails] = useState<Details>(emptyDetails)
  const [query, setQuery] = useState('')
  const [popularOnly, setPopularOnly] = useState(false)
  const [activeSection, setActiveSection] = useState(orderedMenuSections[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const menuTopRef = useRef<HTMLDivElement>(null)
  const suppressSpy = useRef(false)

  useEffect(() => {
    const saved = loadOrderState<{
      cart?: Cart
      customItems?: CustomItem[]
      services?: Services
      details?: Partial<Details>
      perPiece?: boolean
    }>(STORAGE_KEY)
    if (saved) {
      if (saved.cart && !saved.perPiece) clearOrderState(STORAGE_KEY)
      else {
        if (saved.cart) setCart(saved.cart)
        if (Array.isArray(saved.customItems)) setCustomItems(saved.customItems)
        if (saved.services) setServices(saved.services)
        if (saved.details) setDetails({ ...emptyDetails, ...saved.details })
      }
    }
    setHydrated(true)
    window.fbq?.('trackCustom', 'AlacarteOpen')
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveOrderState(STORAGE_KEY, { cart, customItems, services, details, perPiece: true })
  }, [cart, customItems, services, details, hydrated])

  const resetOrder = useCallback(() => {
    setCart({})
    setCustomItems([])
    setServices({ backend: false, frontend: false })
    setDetails(emptyDetails)
    clearOrderState(STORAGE_KEY)
  }, [])

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
  }, [query, popularOnly])

  const setQty = useCallback((item: MenuItem, next: number) => {
    setCart((current) => {
      const updated = { ...current }
      if (next < 1) delete updated[item.id]
      else updated[item.id] = next
      return updated
    })
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    setCart((current) => ({ ...current, [item.id]: 1 }))
    window.fbq?.('track', 'AddToCart', {
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'INR',
    })
  }, [])

  const addCustomItem = useCallback((sectionName: string, name: string, qty: number) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCustomItems((current) => [
      ...current,
      { id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, sectionName, name: trimmed, qty },
    ])
    window.fbq?.('trackCustom', 'CustomItemRequested', { item: trimmed, section: sectionName })
  }, [])

  const setCustomQty = useCallback((id: string, next: number) => {
    setCustomItems((current) =>
      next < 1 ? current.filter((entry) => entry.id !== id) : current.map((entry) => (entry.id === id ? { ...entry, qty: next } : entry)),
    )
  }, [])

  const lines = useMemo(
    () =>
      Object.entries(cart).flatMap(([id, qty]) => {
        const found = findItem(id)
        return found ? [{ ...found.item, section: found.section.name, qty, lineTotal: found.item.price * qty }] : []
      }),
    [cart],
  )

  const foodTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const servicesTotal =
    (services.backend ? serviceAddOns[0].price : 0) + (services.frontend ? serviceAddOns[1].price : 0)
  const grandTotal = foodTotal + servicesTotal
  const itemCount = lines.length + customItems.length
  const canSend = itemCount > 0 && Boolean(details.date) && details.area.trim().length > 1 && details.name.trim().length > 1

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orderedMenuSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            (!q || item.name.toLowerCase().includes(q) || item.alias?.toLowerCase().includes(q)) &&
            (!popularOnly || item.popular),
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [query, popularOnly])

  function jumpTo(sectionId: string) {
    suppressSpy.current = true
    setActiveSection(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      suppressSpy.current = false
    }, 700)
  }

  function handleSearch(next: string) {
    const wasEmpty = query.trim() === ''
    setQuery(next)
    if (next.trim() && wasEmpty) {
      window.requestAnimationFrame(() => menuTopRef.current?.scrollIntoView({ block: 'start' }))
    }
  }

  async function sendOrder() {
    if (sending || !canSend) return
    setSending(true)

    const parts = ['Hi Urban Rasoi! 🧡 I would like to place an à la carte order.', '']
    if (lines.length) {
      parts.push('🍽️ *MY ORDER*')
      for (const line of lines) {
        parts.push(`• ${line.name} (${line.unit}) × ${line.qty} = ${formatINR(line.lineTotal)}`)
      }
      parts.push('', `💰 Food total: ${formatINR(foodTotal)}`)
    }
    if (customItems.length) {
      parts.push('', '✨ *SPECIAL REQUESTS* (please quote)')
      for (const custom of customItems) {
        parts.push(`• ${custom.name} × ${custom.qty} — ${custom.sectionName}`)
      }
    }
    if (services.backend) parts.push(`🧑‍🍳 ${serviceAddOns[0].name} — ${formatINR(serviceAddOns[0].price)}`)
    if (services.frontend) parts.push(`🙋 ${serviceAddOns[1].name} — ${formatINR(serviceAddOns[1].price)}`)
    if (servicesTotal || customItems.length) {
      parts.push(`*Estimated total: ${formatINR(grandTotal)}${customItems.length ? ' + special requests' : ''}*`)
    }
    parts.push('')
    if (details.name) parts.push(`🙋 Name: ${details.name}`)
    parts.push(`🗓️ Date: ${details.date || '—'}`)
    parts.push(`🕐 Delivery time: ${details.time || '—'}`)
    parts.push(`📍 Area: ${details.area || '—'}`)
    if (details.note) parts.push(`📝 Note: ${details.note}`)
    parts.push('', 'Please confirm availability and the final quote (delivery charge as per actuals).')

    const groups: SlipGroup[] = []
    if (lines.length) {
      groups.push({
        heading: 'Your order',
        rows: lines.map<SlipRow>((line) => ({
          name: line.name,
          qty: `×${line.qty}`,
          price: formatINR(line.price),
          total: formatINR(line.lineTotal),
        })),
      })
    }
    if (customItems.length) {
      groups.push({
        heading: 'Special requests · to be quoted',
        rows: customItems.map<SlipRow>((custom) => ({ name: custom.name, qty: `×${custom.qty}` })),
      })
    }
    const addOnRows: SlipRow[] = []
    if (services.backend) addOnRows.push({ name: serviceAddOns[0].name, total: formatINR(serviceAddOns[0].price) })
    if (services.frontend) addOnRows.push({ name: serviceAddOns[1].name, total: formatINR(serviceAddOns[1].price) })
    if (addOnRows.length) groups.push({ heading: 'Service add-ons', rows: addOnRows })

    const facts: string[] = []
    if (details.name) facts.push(`Name: ${details.name}`)
    facts.push(`Date: ${details.date || '—'}   ·   Time: ${details.time || '—'}`)
    facts.push(`Area: ${details.area || '—'}`)

    const outcome = await shareOrderSlip({
      slip: {
        eyebrow: 'À la carte order',
        facts,
        groups,
        totalLabel: customItems.length ? 'Estimated total' : 'Order total',
        totalValue: formatINR(grandTotal),
        note: details.note || undefined,
      },
      text: parts.join('\n'),
      fileName: 'urban-rasoi-order.png',
      title: 'My Urban Rasoi order',
      tracking: {
        placement: 'alacarte',
        contentName: 'À la carte order',
        value: grandTotal,
        currency: 'INR',
      },
    })

    setSending(false)
    if (outcome === 'cancelled') return
    window.fbq?.('track', 'InitiateCheckout', {
      num_items: itemCount,
      value: grandTotal,
      currency: 'INR',
    })
    setSent(true)
    setCartOpen(false)
    resetOrder()
  }

  return (
    <div className="pb-32 md:pb-24">
      {sent && (
        <div role="status" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-ink px-5 py-4 text-primary-foreground">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">Order sent to WhatsApp. We will confirm availability shortly.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="shrink-0 rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
            >
              Start a new order
            </button>
          </div>
        </div>
      )}

      <div className="border-b border-border bg-cream">
        <div className="mx-auto max-w-3xl px-5 pb-6 pt-6 md:px-8 md:pt-8">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.jpg"
                alt="Urban Rasoi"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-cream-dark"
              />
              <span className="font-serif text-base font-semibold text-ink">Urban Rasoi</span>
            </Link>
            <Link
              href="/"
              aria-label="Back to home"
              className="flex size-9 items-center justify-center rounded-full bg-background text-lg text-ink transition-colors hover:bg-cream-dark"
            >
              ✕
            </Link>
          </div>
          <p className="section-label">À la carte · House party menu</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Build your own order.</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Priced by the piece, no minimum. Add exactly what you want and send it to our kitchen on WhatsApp.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-ink-soft">
            <li className="flex items-center gap-1.5">
              <span className="text-terracotta" aria-hidden="true">
                ●
              </span>{' '}
              100% vegetarian
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-terracotta" aria-hidden="true">
                ●
              </span>{' '}
              No minimum order
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-terracotta" aria-hidden="true">
                ●
              </span>{' '}
              FSSAI licensed kitchen
            </li>
          </ul>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-5 py-3 md:px-8">
          <label className="relative block">
            <span className="sr-only">Search dishes</span>
            <input
              type="search"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search dishes — paneer, sliders, dessert…"
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-ink placeholder:text-ink-lighter focus:border-terracotta focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-lighter" aria-hidden="true">
              ⌕
            </span>
          </label>
          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide" aria-label="Menu filters">
            <button
              type="button"
              onClick={() => setPopularOnly((v) => !v)}
              aria-pressed={popularOnly}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                popularOnly
                  ? 'border-terracotta bg-terracotta text-primary-foreground'
                  : 'border-border bg-white text-ink hover:bg-cream',
              )}
            >
              <span aria-hidden="true">★</span> Most ordered
            </button>
            {orderedMenuSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-colors',
                  activeSection === section.id && !popularOnly && !query
                    ? 'bg-ink text-background'
                    : 'bg-cream text-ink hover:bg-cream-dark',
                )}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={menuTopRef} className="mx-auto max-w-3xl scroll-mt-40 px-5 md:px-8">
        {!query && !popularOnly && popularMenuItems.length > 0 && (
          <section className="mt-7" aria-labelledby="most-ordered-heading">
            <h2 id="most-ordered-heading" className="font-serif text-xl font-semibold text-ink">
              Most ordered
            </h2>
            <p className="mt-0.5 text-xs text-ink-soft">What Kolkata reaches for first</p>
            <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
              {popularMenuItems.map((item) => (
                <article key={item.id} className="w-[152px] shrink-0">
                  <div className="relative h-[152px] w-[152px] overflow-hidden rounded-2xl bg-cream ring-1 ring-inset ring-border">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="152px" className="object-cover" />}
                    <div className="absolute inset-x-0 bottom-2 flex justify-center">
                      <AddControl item={item} qty={cart[item.id] ?? 0} onAdd={addItem} onQty={setQty} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-1.5">
                    <VegMark />
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{item.name}</p>
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-terracotta">{formatINR(item.price)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {visibleSections.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-ink-soft">
              No dishes match “{query}”.{' '}
              <button type="button" onClick={() => setQuery('')} className="font-semibold text-terracotta">
                Clear search
              </button>
            </p>
            {query.trim() && (
              <div className="mx-auto mt-6 max-w-md text-left">
                <CustomItemAdder
                  sectionName="Special request"
                  prefill={query.trim()}
                  label={`Ask us for “${query.trim()}”`}
                  onAdd={(name, qty) => {
                    addCustomItem('Special request', name, qty)
                    setQuery('')
                  }}
                />
              </div>
            )}
          </div>
        )}

        {visibleSections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            cart={cart}
            customCount={customItems.filter((entry) => entry.sectionName === section.name).length}
            onAdd={addItem}
            onQty={setQty}
            onAddCustom={(name, qty) => addCustomItem(section.name, name, qty)}
            registerRef={(el) => {
              sectionRefs.current[section.id] = el
            }}
          />
        ))}

        <section className="mt-4 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold text-ink">Need a hand on the day?</h2>
          <p className="mt-1 text-sm text-ink-soft">Optional — add service staff to your order.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {serviceAddOns.map((addOn) => {
              const active = services[addOn.id]
              return (
                <button
                  key={addOn.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setServices((current) => ({ ...current, [addOn.id]: !current[addOn.id] }))}
                  className={cn(
                    'flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all',
                    active ? 'border-terracotta bg-cream ring-2 ring-terracotta/25' : 'border-border bg-background hover:border-terracotta/50',
                  )}
                >
                  <span>
                    <span className="block font-semibold text-ink">{addOn.name}</span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{addOn.detail}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-serif text-lg font-semibold text-terracotta">{formatINR(addOn.price)}</span>
                    <span className="text-xs font-semibold text-ink-soft">{active ? 'Added' : 'Add'}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <ul className="mt-5 flex flex-col gap-1.5 text-sm text-ink-soft">
            {orderTerms.map((term) => (
              <li key={term} className="flex gap-2">
                <span aria-hidden="true">·</span>
                {term}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 pb-8 text-center text-xs text-ink-lighter">Pure Vegetarian · FSSAI Lic. No. 12823013000353</p>
      </div>

      {!cartOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={cn(
            'fixed right-4 z-40 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition-all md:right-6',
            itemCount > 0 ? 'bottom-24' : 'bottom-6',
          )}
        >
          Menu
        </button>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 px-4 pb-24 md:items-center md:pb-4"
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
              {orderedMenuSections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      setQuery('')
                      setPopularOnly(false)
                      jumpTo(section.id)
                    }}
                    className="flex w-full items-center justify-between px-6 py-3.5 text-left transition-colors hover:bg-cream"
                  >
                    <span className="text-[15px] font-medium text-ink">{section.name}</span>
                    <span className="text-sm font-semibold text-ink-soft">{section.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-sm font-semibold text-primary-foreground"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {itemCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-sm md:p-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="font-serif text-xl font-semibold text-ink">
                {grandTotal > 0 ? formatINR(grandTotal) : 'Quote on request'}
                {customItems.length > 0 && grandTotal > 0 && <span className="text-sm font-medium text-ink-soft"> + requests</span>}
              </p>
              <p className="text-xs text-ink-soft">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} · plus delivery
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
            >
              Review order <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Your order"
        >
          <div className="flex max-h-[92svh] w-full max-w-2xl flex-col rounded-t-3xl bg-background md:rounded-3xl">
            <div className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-8">
              <h2 className="font-serif text-2xl font-semibold text-ink">Your order</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-cream text-lg text-ink"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4 md:px-8">
              <ul className="mt-5 divide-y divide-border">
                {lines.map((line) => (
                  <li key={line.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{line.name}</p>
                      <p className="text-sm text-ink-soft">
                        {line.unit} · {formatINR(line.price)} each
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Stepper qty={line.qty} onChange={(next) => setQty(line, next)} />
                      <p className="w-20 text-right font-semibold text-ink tabular-nums">{formatINR(line.lineTotal)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {customItems.length > 0 && (
                <div className="mt-5">
                  <p className="section-label">Special requests · we will quote these</p>
                  <ul className="mt-2 divide-y divide-border">
                    {customItems.map((custom) => (
                      <li key={custom.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{custom.name}</p>
                          <p className="text-sm text-ink-soft">{custom.sectionName} · price on request</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <Stepper qty={custom.qty} onChange={(next) => setCustomQty(custom.id, next)} />
                          <button
                            type="button"
                            onClick={() => setCustomQty(custom.id, 0)}
                            aria-label={`Remove ${custom.name}`}
                            className="w-20 text-right text-sm font-semibold text-ink-soft hover:text-terracotta"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 rounded-2xl bg-cream p-4">
                <Row label="Food total" value={formatINR(foodTotal)} />
                {services.backend && <Row label={serviceAddOns[0].name} value={formatINR(serviceAddOns[0].price)} />}
                {services.frontend && <Row label={serviceAddOns[1].name} value={formatINR(serviceAddOns[1].price)} />}
                {customItems.length > 0 && <Row label={`Special requests (${customItems.length})`} value="To be quoted" />}
                <p className="mt-2 border-t border-border pt-2 text-xs text-ink-soft">
                  Delivery charge as per actuals. Final quote confirmed on WhatsApp.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Delivery date *">
                  <input
                    type="date"
                    value={details.date}
                    min={kolkataToday()}
                    required
                    onChange={(e) => setDetails({ ...details, date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
                <Field label="Delivery time">
                  <input
                    type="time"
                    value={details.time}
                    onChange={(e) => setDetails({ ...details, time: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
                <Field label="Area in Kolkata *">
                  <input
                    type="text"
                    value={details.area}
                    required
                    placeholder="e.g. Salt Lake"
                    onChange={(e) => setDetails({ ...details, area: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink placeholder:text-ink-lighter"
                  />
                </Field>
                <Field label="Your name *">
                  <input
                    type="text"
                    value={details.name}
                    required
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything else? (optional)">
                    <input
                      type="text"
                      value={details.note}
                      placeholder="Allergies, spice level, packing…"
                      onChange={(e) => setDetails({ ...details, note: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card p-3 text-ink placeholder:text-ink-lighter"
                    />
                  </Field>
                </div>
              </div>

              <p className="mt-4 text-center text-sm">
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-ink-soft hover:text-ink">
                  In a rush? Call {site.phone}
                </a>
              </p>
            </div>

            <div className="border-t border-border bg-background px-5 py-4 md:px-8">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-lg font-semibold text-ink">Estimated total</p>
                <p className="text-right">
                  <span className="font-serif text-2xl font-semibold text-ink">
                    {grandTotal > 0 ? formatINR(grandTotal) : 'On request'}
                  </span>
                  {customItems.length > 0 && grandTotal > 0 && <span className="block text-xs text-ink-soft">+ special requests</span>}
                </p>
              </div>
              {!canSend && itemCount > 0 && (
                <p className="mt-3 text-center text-xs font-medium text-amber-700">
                  Add your name, delivery date and area so the kitchen can confirm.
                </p>
              )}
              <button
                type="button"
                onClick={sendOrder}
                disabled={sending || !canSend}
                className={cn(
                  'mt-3 w-full rounded-full px-8 py-4 text-lg font-semibold transition-colors',
                  sending || !canSend
                    ? 'cursor-not-allowed bg-cream text-ink-lighter'
                    : 'bg-terracotta text-primary-foreground hover:bg-terracotta-deep',
                )}
              >
                {sending ? 'Preparing your order slip…' : 'Send order on WhatsApp →'}
              </button>
              <p className="mt-2 text-center text-xs text-ink-soft">
                Your order goes across as an image plus the details. No payment now — we confirm availability first.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
