'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { openWhatsapp } from '@/lib/meta-tracking'
import {
  MIN_PORTIONS,
  type MenuItem,
  type MenuSection,
  findItem,
  formatINR,
  menuSections,
  orderTerms,
  serviceAddOns,
} from '@/lib/alacarte-menu'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'ur-alacarte-v1'

type Cart = Record<string, number>
type Services = { backend: boolean; frontend: boolean }
type Details = { date: string; time: string; area: string; name: string; note: string }

const emptyDetails: Details = { date: '', time: '', area: '', name: '', note: '' }

export function AlacarteOrder() {
  const [cart, setCart] = useState<Cart>({})
  const [services, setServices] = useState<Services>({ backend: false, frontend: false })
  const [details, setDetails] = useState<Details>(emptyDetails)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(menuSections[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const suppressSpy = useRef(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved.cart) setCart(saved.cart)
        if (saved.services) setServices(saved.services)
        if (saved.details) setDetails({ ...emptyDetails, ...saved.details })
      }
    } catch {}
    setHydrated(true)
    window.fbq?.('trackCustom', 'AlacarteOpen')
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, services, details }))
    } catch {}
  }, [cart, services, details, hydrated])

  // Highlight the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSpy.current) return
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -65% 0px' },
    )
    for (const el of Object.values(sectionRefs.current)) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [query])

  const setQty = useCallback((item: MenuItem, next: number) => {
    setCart((current) => {
      const updated = { ...current }
      if (next <= 0) delete updated[item.id]
      else updated[item.id] = next
      return updated
    })
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    setCart((current) => ({ ...current, [item.id]: MIN_PORTIONS }))
    window.fbq?.('track', 'AddToCart', {
      content_name: item.name,
      content_type: 'product',
      value: item.price * MIN_PORTIONS,
      currency: 'INR',
    })
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
  const itemCount = lines.length

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return menuSections
    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => item.name.toLowerCase().includes(q) || item.alias?.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [query])

  function jumpTo(sectionId: string) {
    suppressSpy.current = true
    setActiveSection(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => { suppressSpy.current = false }, 700)
  }

  function sendOrder() {
    const parts = ['Hi Urban Rasoi! 🧡 I would like to place an à la carte order.', '', '🍽️ *MY ORDER*']
    for (const line of lines) {
      parts.push(`• ${line.name} (${line.unit}) × ${line.qty} = ${formatINR(line.lineTotal)}`)
    }
    parts.push('', `💰 Food total: ${formatINR(foodTotal)}`)
    if (services.backend) parts.push(`🧑‍🍳 ${serviceAddOns[0].name} — ${formatINR(serviceAddOns[0].price)}`)
    if (services.frontend) parts.push(`🙋 ${serviceAddOns[1].name} — ${formatINR(serviceAddOns[1].price)}`)
    if (servicesTotal) parts.push(`*Estimated total: ${formatINR(grandTotal)}*`)
    parts.push('')
    if (details.name) parts.push(`🙋 Name: ${details.name}`)
    parts.push(`🗓️ Date: ${details.date || '—'}`)
    parts.push(`🕐 Delivery time: ${details.time || '—'}`)
    parts.push(`📍 Area: ${details.area || '—'}`)
    if (details.note) parts.push(`📝 Note: ${details.note}`)
    parts.push('', 'Please confirm availability and the final quote (delivery charge as per actuals).')

    window.fbq?.('track', 'InitiateCheckout', {
      num_items: itemCount,
      value: grandTotal,
      currency: 'INR',
    })
    openWhatsapp(parts.join('\n'), {
      placement: 'alacarte',
      contentName: 'À la carte order',
      value: grandTotal,
      currency: 'INR',
    })
  }

  return (
    <div className="pb-32 md:pb-24">
      {/* Header */}
      <div className="border-b border-border bg-cream">
        <div className="mx-auto max-w-5xl px-5 pb-6 pt-24 md:px-8 md:pt-28">
          <p className="section-label">À la carte · House party menu</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            Build your own order.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Pick exactly what you want, see your total as you go, and send it to our kitchen on WhatsApp.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-ink-soft">
            <li className="flex items-center gap-1.5"><span className="text-terracotta" aria-hidden="true">●</span> 100% vegetarian</li>
            <li className="flex items-center gap-1.5"><span className="text-terracotta" aria-hidden="true">●</span> Minimum 2 portions per dish</li>
            <li className="flex items-center gap-1.5"><span className="text-terracotta" aria-hidden="true">●</span> FSSAI licensed kitchen</li>
          </ul>
        </div>
      </div>

      {/* Sticky search + category rail */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-5 py-3 md:px-8">
          <label className="relative block">
            <span className="sr-only">Search dishes</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes — paneer, momo, dessert…"
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-ink placeholder:text-ink-lighter focus:border-terracotta focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-lighter" aria-hidden="true">⌕</span>
          </label>
          {!query && (
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1" aria-label="Menu sections">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jumpTo(section.id)}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    activeSection === section.id ? 'bg-ink text-background' : 'bg-cream text-ink hover:bg-cream-dark',
                  )}
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        {filteredSections.length === 0 && (
          <p className="py-16 text-center text-ink-soft">
            No dishes match “{query}”. <button type="button" onClick={() => setQuery('')} className="font-semibold text-terracotta">Clear search</button>
          </p>
        )}

        {filteredSections.map((section) => (
          <MenuSectionBlock
            key={section.id}
            section={section}
            cart={cart}
            onAdd={addItem}
            onQty={setQty}
            registerRef={(el) => { sectionRefs.current[section.id] = el }}
          />
        ))}

        {/* Service add-ons */}
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
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
              <li key={term} className="flex gap-2"><span aria-hidden="true">·</span>{term}</li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Planning a full celebration instead?{' '}
          <Link href="/plan?src=alacarte" className="font-semibold text-terracotta hover:text-terracotta-deep">
            Use the Party Planner →
          </Link>
        </p>
      </div>

      {/* Sticky cart bar */}
      {itemCount > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-sm md:p-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div>
              <p className="font-serif text-xl font-semibold text-ink">{formatINR(grandTotal)}</p>
              <p className="text-xs text-ink-soft">{itemCount} {itemCount === 1 ? 'dish' : 'dishes'} · plus delivery</p>
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

      {/* Cart sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 md:items-center" role="dialog" aria-modal="true" aria-label="Your order">
          <div className="flex max-h-[92svh] w-full max-w-2xl flex-col rounded-t-3xl bg-background md:rounded-3xl">
            <div className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-8">
              <h2 className="font-serif text-2xl font-semibold text-ink">Your order</h2>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-cream text-lg text-ink">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4 md:px-8">
            <ul className="mt-5 divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{line.name}</p>
                    <p className="text-sm text-ink-soft">{line.unit} · {formatINR(line.price)} each</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Stepper
                      qty={line.qty}
                      onChange={(next) => setQty(line, next)}
                    />
                    <p className="w-20 text-right font-semibold text-ink tabular-nums">{formatINR(line.lineTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl bg-cream p-4">
              <Row label="Food total" value={formatINR(foodTotal)} />
              {services.backend && <Row label={serviceAddOns[0].name} value={formatINR(serviceAddOns[0].price)} />}
              {services.frontend && <Row label={serviceAddOns[1].name} value={formatINR(serviceAddOns[1].price)} />}
              <p className="mt-2 border-t border-border pt-2 text-xs text-ink-soft">Delivery charge as per actuals. Final quote confirmed on WhatsApp.</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label="Delivery date">
                <input type="date" value={details.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDetails({ ...details, date: e.target.value })} className="w-full rounded-xl border border-border bg-card p-3 text-ink" />
              </Field>
              <Field label="Delivery time">
                <input type="time" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })} className="w-full rounded-xl border border-border bg-card p-3 text-ink" />
              </Field>
              <Field label="Area in Kolkata">
                <input type="text" value={details.area} placeholder="e.g. Salt Lake" onChange={(e) => setDetails({ ...details, area: e.target.value })} className="w-full rounded-xl border border-border bg-card p-3 text-ink placeholder:text-ink-lighter" />
              </Field>
              <Field label="Your name">
                <input type="text" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="w-full rounded-xl border border-border bg-card p-3 text-ink" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Anything else? (optional)">
                  <input type="text" value={details.note} placeholder="Allergies, spice level, packing…" onChange={(e) => setDetails({ ...details, note: e.target.value })} className="w-full rounded-xl border border-border bg-card p-3 text-ink placeholder:text-ink-lighter" />
                </Field>
              </div>
            </div>

            <p className="mt-4 text-center text-sm">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-ink-soft hover:text-ink">In a rush? Call {site.phone}</a>
            </p>
            </div>

            {/* Pinned footer — total and CTA stay reachable while scrolling */}
            <div className="border-t border-border bg-background px-5 py-4 md:px-8">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-lg font-semibold text-ink">Estimated total</p>
                <p className="font-serif text-2xl font-semibold text-ink">{formatINR(grandTotal)}</p>
              </div>
              <button
                type="button"
                onClick={sendOrder}
                className="mt-3 w-full rounded-full bg-terracotta px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
              >
                Send order on WhatsApp →
              </button>
              <p className="mt-2 text-center text-xs text-ink-soft">No payment now — we confirm availability first.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuSectionBlock({
  section,
  cart,
  onAdd,
  onQty,
  registerRef,
}: {
  section: MenuSection
  cart: Cart
  onAdd: (item: MenuItem) => void
  onQty: (item: MenuItem, next: number) => void
  registerRef: (el: HTMLElement | null) => void
}) {
  return (
    <section id={section.id} ref={registerRef} className="scroll-mt-36 pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">{section.name}</h2>
        <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-lighter">{section.group}</p>
      </div>
      {section.note && <p className="mt-1 text-sm text-ink-soft">{section.note}</p>}

      <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {section.items.map((item) => {
          const qty = cart[item.id] ?? 0
          return (
            <li key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {item.unit} · {formatINR(item.price)} per portion
                </p>
              </div>
              <div className="shrink-0">
                {qty > 0 ? (
                  <Stepper qty={qty} onChange={(next) => onQty(item, next)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdd(item)}
                    className="rounded-full border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground"
                  >
                    Add
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Quantity control. Stepping below the 2-portion minimum removes the item. */
function Stepper({ qty, onChange }: { qty: number; onChange: (next: number) => void }) {
  const atMinimum = qty <= MIN_PORTIONS
  return (
    <div className="flex items-center gap-1 rounded-full border border-terracotta bg-cream p-1">
      <button
        type="button"
        onClick={() => onChange(atMinimum ? 0 : qty - 1)}
        aria-label={atMinimum ? 'Remove from order' : 'Fewer portions'}
        className="flex size-8 items-center justify-center rounded-full text-lg font-semibold text-terracotta transition-colors hover:bg-background"
      >
        {atMinimum ? '🗑' : '−'}
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-ink">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="More portions"
        className="flex size-8 items-center justify-center rounded-full text-lg font-semibold text-terracotta transition-colors hover:bg-background"
      >
        +
      </button>
    </div>
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
