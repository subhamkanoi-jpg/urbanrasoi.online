'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shareOrderSlip, type SlipRow } from '@/lib/order-slip'
import { clearOrderState, loadOrderState, saveOrderState } from '@/lib/order-storage'
import { downloadBlob, renderPujaMenuJpg } from '@/lib/puja-menu-card'
import {
  BASE_PAX,
  MAX_PAX,
  STEP_PAX,
  formatINR,
  guestPresets,
  inclusions,
  perGuest,
  priceForPax,
  pujaMenu,
} from '@/lib/puja-menu'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'ur-puja-booking-v1'

type Booking = {
  pax: number
  date: string
  time: string
  area: string
  name: string
  chai: boolean
  ekadashi: boolean
  note: string
}

const emptyBooking: Booking = {
  pax: BASE_PAX,
  date: '',
  time: '',
  area: '',
  name: '',
  chai: false,
  ekadashi: false,
  note: '',
}

function prettyDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function PujaBooking() {
  const [booking, setBooking] = useState<Booking>(emptyBooking)
  const [hydrated, setHydrated] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [sending, setSending] = useState(false)
  const [booked, setBooked] = useState(false)
  const [panelVisible, setPanelVisible] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = loadOrderState<Partial<Booking>>(STORAGE_KEY)
    if (saved) setBooking({ ...emptyBooking, ...saved })
    setHydrated(true)
  }, [])

  // The sticky bar is only useful while the booking panel is off-screen.
  useEffect(() => {
    const node = panelRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setPanelVisible(entry.isIntersecting), {
      rootMargin: '-80px 0px -120px 0px',
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [hydrated])

  useEffect(() => {
    if (!hydrated || booked) return
    saveOrderState(STORAGE_KEY, booking)
  }, [booking, hydrated, booked])

  const price = useMemo(() => priceForPax(booking.pax), [booking.pax])
  const rate = useMemo(() => perGuest(booking.pax), [booking.pax])

  const update = useCallback((patch: Partial<Booking>) => {
    setBooking((current) => ({ ...current, ...patch }))
  }, [])

  function setPax(next: number) {
    update({ pax: Math.max(BASE_PAX, Math.min(MAX_PAX, next)) })
  }

  async function sendBooking() {
    if (sending) return
    setSending(true)

    const lines = [
      'Hi Urban Rasoi! 🙏 I would like to book the *Sawan · Rudra Abhishek* family get-together menu.',
      '',
      `👥 Guests: ${booking.pax}`,
      `💰 Package: ${formatINR(price)} (incl. 2 kitchen staff, 2 stewards & disposables)`,
      `🗓️ Puja date: ${booking.date ? prettyDate(booking.date) : 'To be confirmed'}`,
      `🕐 Serving time: ${booking.time || 'To be confirmed'}`,
      `📍 Area: ${booking.area || '—'}`,
    ]
    if (booking.name) lines.splice(2, 0, `🙋 Name: ${booking.name}`)
    const extras = [booking.chai && 'Kulhad Chai', booking.ekadashi && 'Ekadashi cuisine'].filter(Boolean)
    if (extras.length) lines.push(`✨ Add-ons: ${extras.join(', ')}`)
    if (booking.note) lines.push(`📝 Note: ${booking.note}`)
    lines.push('', 'Please confirm availability for my date.')

    window.fbq?.('track', 'InitiateCheckout', { value: price, currency: 'INR', num_items: booking.pax })

    const rows: SlipRow[] = [
      { name: 'Guests', qty: `${booking.pax}` },
      { name: 'Puja date', qty: booking.date ? prettyDate(booking.date) : 'To confirm' },
      { name: 'Serving time', qty: booking.time || 'To confirm' },
      { name: 'Area', qty: booking.area || '—' },
      { name: 'Rate', qty: `${formatINR(rate)} per guest` },
    ]
    const extraRows: SlipRow[] = []
    if (booking.chai) extraRows.push({ name: 'Kulhad Chai' })
    if (booking.ekadashi) extraRows.push({ name: 'Ekadashi cuisine' })

    const groups = [{ heading: 'Your booking', rows }]
    if (extraRows.length) groups.push({ heading: 'Add-ons', rows: extraRows })
    groups.push({
      heading: 'Included',
      rows: inclusions.map<SlipRow>((item) => ({ name: item.title, qty: item.detail })),
    })

    const outcome = await shareOrderSlip({
      slip: {
        eyebrow: 'Sawan · Rudra Abhishek booking',
        facts: booking.name ? [`Name: ${booking.name}`] : undefined,
        groups,
        totalLabel: 'Package',
        totalValue: formatINR(price),
        note: booking.note || undefined,
      },
      text: lines.join('\n'),
      fileName: 'urban-rasoi-puja-booking.png',
      title: 'Sawan Puja Booking — Urban Rasoi',
      tracking: {
        placement: 'puja-booking',
        occasion: 'Rudra Abhishek Puja',
        contentName: 'Sawan Puja Menu',
        value: price,
        currency: 'INR',
      },
    })

    setSending(false)
    if (outcome === 'cancelled') return
    setBooked(true)
    clearOrderState(STORAGE_KEY)
  }

  async function downloadMenu() {
    setDownloading(true)
    try {
      const blob = await renderPujaMenuJpg({
        pax: booking.pax,
        price,
        dateLabel: prettyDate(booking.date),
        includeChai: booking.chai,
      })
      downloadBlob(blob, 'urban-rasoi-sawan-puja-menu.jpg')
      window.fbq?.('trackCustom', 'MenuDownloaded', { menu: 'Sawan Puja', pax: booking.pax })
      setDownloaded(true)
      window.setTimeout(() => setDownloaded(false), 3200)
    } catch {
      window.alert('Could not create the image. Please try again, or ask us on WhatsApp for the menu.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section id="book" className="scroll-mt-20 bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* ── The menu ─────────────────────────────── */}
          <div className="rounded-3xl border border-border bg-background p-6 md:p-9">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                ☾ {pujaMenu.badge}
              </span>
              <h2 className="mt-5 font-serif text-3xl font-semibold text-ink md:text-4xl">
                Family Get-Together <span className="italic text-terracotta">Catering</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md font-serif text-base italic leading-relaxed text-ink-soft">
                {pujaMenu.promise}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {pujaMenu.courses.map((course) => (
                <div key={course.name} className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A98B45]">
                    · {course.name} ·
                  </p>
                  <p className="mt-2 font-serif text-lg font-semibold leading-relaxed text-ink md:text-xl">
                    {course.items.join('  ·  ')}
                  </p>
                </div>
              ))}
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A98B45]">· Add-ons ·</p>
                <p className="mt-2 font-serif text-lg font-semibold text-ink md:text-xl">
                  {pujaMenu.addOnCourse.items.join('  ·  ')}
                  <span className="ml-2 align-middle text-xs font-medium not-italic text-ink-soft">on request</span>
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <span className="rounded-full border border-[#6E7A4F] px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E7A4F]">
                {pujaMenu.satvikNote}
              </span>
              <p className="text-center font-serif text-xl italic leading-snug text-ink">
                {pujaMenu.closingLine[0]}
                <br />
                {pujaMenu.closingLine[1]}
              </p>
              <p className="text-center text-sm italic text-ink-soft">{pujaMenu.ekadashiNote}</p>

              <button
                type="button"
                onClick={downloadMenu}
                disabled={downloading}
                className="mt-1 inline-flex items-center gap-2 rounded-full border border-terracotta px-6 py-3 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground disabled:opacity-60"
              >
                {downloading ? 'Preparing…' : downloaded ? '✓ Saved to your device' : '⤓ Download menu (JPG)'}
              </button>
              <p className="-mt-1 text-center text-xs text-ink-soft">Save it, or forward it to the family.</p>
            </div>
          </div>

          {/* ── Booking panel ─────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <div ref={panelRef} className="rounded-3xl border border-border bg-background p-6 md:p-8">
              <p className="section-label">Your booking</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink md:text-3xl">
                How many guests are coming?
              </h2>

              <div className="mt-6 flex items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={() => setPax(booking.pax - STEP_PAX)}
                  disabled={booking.pax <= BASE_PAX}
                  aria-label="Fewer guests"
                  className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-2xl text-ink transition-colors hover:border-terracotta disabled:opacity-30"
                >
                  −
                </button>
                <div className="min-w-28 text-center">
                  <p className="font-serif text-5xl font-semibold tabular-nums text-ink">{booking.pax}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">guests</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPax(booking.pax + STEP_PAX)}
                  aria-label="More guests"
                  className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-2xl text-ink transition-colors hover:border-terracotta"
                >
                  +
                </button>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {guestPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPax(preset)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                      booking.pax === preset ? 'bg-ink text-background' : 'bg-cream text-ink hover:bg-cream-dark',
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Live price */}
              <div className="mt-6 rounded-2xl bg-ink p-5 text-primary-foreground">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-light">
                      All-inclusive package
                    </p>
                    <p className="mt-1 font-serif text-4xl font-semibold">{formatINR(price)}</p>
                  </div>
                  <p className="pb-1 text-right text-sm text-primary-foreground/70">
                    ≈ {formatINR(rate)}
                    <br />
                    per guest
                  </p>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-primary-foreground/15 pt-4 text-sm text-primary-foreground/80">
                  {inclusions.map((item) => (
                    <li key={item.title} className="flex gap-1.5">
                      <span className="text-terracotta-light" aria-hidden="true">✓</span>
                      {item.title}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-primary-foreground/55">
                  Food, service and disposables included. Only travel outside central Kolkata may be extra.
                </p>
              </div>

              {/* Add-ons */}
              <div className="mt-5 grid gap-2.5">
                <ToggleRow
                  active={booking.chai}
                  onClick={() => update({ chai: !booking.chai })}
                  title="Kulhad Chai"
                  detail="Served hot through the evening"
                />
                <ToggleRow
                  active={booking.ekadashi}
                  onClick={() => update({ ekadashi: !booking.ekadashi })}
                  title="Ekadashi cuisine"
                  detail="Vrat-friendly menu on request"
                />
              </div>

              {/* Details */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Puja date">
                  <input
                    type="date"
                    value={booking.date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) => update({ date: event.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
                <Field label="Serving time">
                  <input
                    type="time"
                    value={booking.time}
                    onChange={(event) => update({ time: event.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
                <Field label="Area in Kolkata">
                  <input
                    type="text"
                    value={booking.area}
                    placeholder="e.g. Salt Lake"
                    onChange={(event) => update({ area: event.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink placeholder:text-ink-lighter"
                  />
                </Field>
                <Field label="Your name">
                  <input
                    type="text"
                    value={booking.name}
                    onChange={(event) => update({ name: event.target.value })}
                    className="w-full rounded-xl border border-border bg-card p-3 text-ink"
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={sendBooking}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
              >
                Check my date on WhatsApp →
              </button>
              <p className="mt-2.5 text-center text-sm text-ink-soft">
                No payment now. We confirm your date first.
              </p>
              <p className="mt-1 text-center text-sm">
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-ink-soft hover:text-ink">
                  Or call {site.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky price bar — shown only while the booking panel is off-screen */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-sm transition-transform duration-300 md:p-4',
          panelVisible ? 'translate-y-full' : 'translate-y-0',
        )}
        aria-hidden={panelVisible}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl font-semibold text-ink">{formatINR(price)}</p>
            <p className="text-xs text-ink-soft">{booking.pax} guests · staff included</p>
          </div>
          <a
            href="#book"
            tabIndex={panelVisible ? -1 : 0}
            className="flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
          >
            Check my date <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function ToggleRow({
  active,
  onClick,
  title,
  detail,
}: {
  active: boolean
  onClick: () => void
  title: string
  detail: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all',
        active ? 'border-terracotta bg-cream ring-2 ring-terracotta/20' : 'border-border bg-card hover:border-terracotta/50',
      )}
    >
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{detail}</span>
      </span>
      <span className={cn('shrink-0 text-sm font-semibold', active ? 'text-terracotta' : 'text-ink-soft')}>
        {active ? 'Added' : 'Add'}
      </span>
    </button>
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
