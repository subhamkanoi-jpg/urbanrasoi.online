'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { openWhatsapp } from '@/lib/meta-tracking'
import {
  CELEBRATION_MIN_GUESTS,
  type Plan,
  type ServiceId,
  composeWhatsappMessage,
  cuisineOptions,
  dateNote,
  daysUntil,
  emptyPlan,
  estimatePlan,
  formatINR,
  getOccasion,
  guestNote,
  nextWeekendISO,
  occasions,
  prettyDate,
  services,
} from '@/lib/planner'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'ur-plan-v1'
const STEPS = ['occasion', 'guests', 'date', 'service', 'food', 'summary'] as const
type Step = (typeof STEPS)[number]

const stepTitles: Record<Step, string> = {
  occasion: "What's the occasion?",
  guests: 'How many guests?',
  date: 'When is the party?',
  service: 'How hands-off do you want to be?',
  food: "What's the food mood?",
  summary: 'Your party, planned.',
}

const guestPresets = [10, 15, 25, 40, 60, 100]

function loadSaved(): { plan: Plan; step: number } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.plan !== 'object') return null
    return { plan: { ...emptyPlan, ...parsed.plan }, step: Math.min(parsed.step ?? 0, STEPS.length - 1) }
  } catch {
    return null
  }
}

export function PartyPlanner({ initialOccasion, source }: { initialOccasion?: string; source?: string }) {
  const preset = getOccasion(initialOccasion)
  const [plan, setPlan] = useState<Plan>(() => ({ ...emptyPlan, occasion: preset?.id }))
  const [step, setStep] = useState(() => (preset ? 1 : 0))
  const [resumed, setResumed] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = loadSaved()
    if (saved && !preset && (saved.plan.occasion || saved.step > 0)) {
      setPlan(saved.plan)
      setStep(saved.step)
      setResumed(true)
    }
    setHydrated(true)
    window.fbq?.('trackCustom', 'PlannerOpen', { src: source ?? 'direct' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, step }))
    } catch {}
  }, [plan, step, hydrated])

  const goTo = useCallback((next: number) => {
    setResumed(false)
    setStep(Math.max(0, Math.min(next, STEPS.length - 1)))
    topRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  const update = useCallback((patch: Partial<Plan>) => {
    setPlan((current) => ({ ...current, ...patch }))
  }, [])

  const current = STEPS[step]
  const estimate = useMemo(() => estimatePlan(plan), [plan])

  function send() {
    const message = composeWhatsappMessage(plan)
    const value = estimate ? Math.round((estimate.total[0] + estimate.total[1]) / 2) : undefined
    openWhatsapp(message, {
      placement: 'planner',
      occasion: getOccasion(plan.occasion)?.label,
      contentName: 'Party Planner',
      value,
      currency: value != null ? 'INR' : undefined,
    })
  }

  return (
    <div ref={topRef} className="mx-auto flex min-h-svh w-full max-w-2xl flex-col px-5 pb-10">
      {/* Top bar */}
      <div className="sticky top-0 z-20 -mx-5 bg-background/95 px-5 pb-3 pt-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo.jpg" alt="Urban Rasoi" width={32} height={32} className="size-8 rounded-full object-cover" />
            <span className="font-serif text-base font-semibold text-ink">Party Planner</span>
          </Link>
          <Link href="/" aria-label="Close planner" className="flex size-9 items-center justify-center rounded-full bg-cream text-lg text-ink">
            ✕
          </Link>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={cn('h-1 flex-1 rounded-full transition-colors duration-300', i <= step ? 'bg-terracotta' : 'bg-cream-dark')} />
          ))}
        </div>
      </div>

      {resumed && (
        <button
          type="button"
          onClick={() => { setPlan({ ...emptyPlan }); goTo(0) }}
          className="mt-3 self-start rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink-soft"
        >
          Welcome back — picked up where you left off. Start over?
        </button>
      )}

      <div className="mt-6 flex flex-1 flex-col md:mt-10">
        <p className="section-label">
          {current === 'summary' ? 'One tap to our kitchen' : `Question ${step + 1} of ${STEPS.length - 1}`}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">{stepTitles[current]}</h1>

        {/* ── Occasion ─────────────────────────────── */}
        {current === 'occasion' && (
          <>
            <p className="mt-2 text-sm text-ink-soft">Takes about 30 seconds. No payment, no signup.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {occasions.map((occasion) => (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => { update({ occasion: occasion.id }); goTo(1) }}
                  className={cn(
                    'flex min-h-24 flex-col items-start justify-between rounded-2xl border bg-card p-4 text-left transition-all active:scale-[0.98]',
                    plan.occasion === occasion.id ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-border hover:border-terracotta/50',
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">{occasion.emoji}</span>
                  <span className="font-serif text-lg font-semibold text-ink">{occasion.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Guests ───────────────────────────────── */}
        {current === 'guests' && (
          <>
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => update({ guests: Math.max(5, plan.guests - 5) })}
                aria-label="Fewer guests"
                className="flex size-14 items-center justify-center rounded-full border border-border bg-card text-2xl text-ink active:scale-95"
              >
                −
              </button>
              <div className="min-w-32 text-center">
                <p className="font-serif text-6xl font-semibold text-ink tabular-nums">{plan.guests}{plan.guests >= 100 ? '+' : ''}</p>
                <p className="mt-1 text-sm text-ink-soft">guests</p>
              </div>
              <button
                type="button"
                onClick={() => update({ guests: Math.min(500, plan.guests + 5) })}
                aria-label="More guests"
                className="flex size-14 items-center justify-center rounded-full border border-border bg-card text-2xl text-ink active:scale-95"
              >
                +
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {guestPresets.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ guests: n })}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    plan.guests === n ? 'bg-ink text-background' : 'bg-cream text-ink',
                  )}
                >
                  {n}{n === 100 ? '+' : ''}
                </button>
              ))}
            </div>
            <p className="mt-6 rounded-xl bg-cream p-4 text-center text-sm font-medium text-ink" aria-live="polite">
              {guestNote(plan.guests)}
            </p>
            <PrimaryButton onClick={() => goTo(2)}>Continue</PrimaryButton>
          </>
        )}

        {/* ── Date ─────────────────────────────────── */}
        {current === 'date' && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip active={!plan.dateFlexible && plan.date === nextWeekendISO()} onClick={() => update({ date: nextWeekendISO(), dateFlexible: false })}>
                This Saturday
              </Chip>
              <Chip active={!plan.dateFlexible && plan.date === nextWeekendISO(1)} onClick={() => update({ date: nextWeekendISO(1), dateFlexible: false })}>
                Next Saturday
              </Chip>
              <Chip active={!!plan.dateFlexible} onClick={() => update({ dateFlexible: true, date: undefined })}>
                Still deciding
              </Chip>
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-medium text-ink-soft">Or pick a date</span>
              <input
                type="date"
                value={plan.dateFlexible ? '' : plan.date ?? ''}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => update({ date: event.target.value || undefined, dateFlexible: false })}
                className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-lg text-ink"
              />
            </label>
            {plan.date && !plan.dateFlexible && dateNote(plan.date) && (
              <p className="mt-4 rounded-xl bg-cream p-4 text-sm font-medium text-ink" aria-live="polite">
                {dateNote(plan.date)}
              </p>
            )}
            <PrimaryButton onClick={() => goTo(3)} disabled={!plan.date && !plan.dateFlexible}>
              Continue
            </PrimaryButton>
          </>
        )}

        {/* ── Service ──────────────────────────────── */}
        {current === 'service' && (
          <div className="mt-6 flex flex-col gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => { update({ service: service.id as ServiceId }); goTo(4) }}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 text-left transition-all active:scale-[0.99]',
                  plan.service === service.id ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-border hover:border-terracotta/50',
                )}
              >
                <span>
                  <span className="block font-serif text-xl font-semibold text-ink">{service.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{service.detail}</span>
                </span>
                {service.fromPlate && plan.guests >= CELEBRATION_MIN_GUESTS && (
                  <span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-terracotta">
                    from {formatINR(service.fromPlate)}/guest
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Food ─────────────────────────────────── */}
        {current === 'food' && (
          <>
            <p className="mt-2 text-sm text-ink-soft">Pick as many as you like.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {cuisineOptions.map((cuisine) => {
                const active = plan.cuisines.includes(cuisine)
                return (
                  <Chip
                    key={cuisine}
                    active={active}
                    onClick={() =>
                      update({ cuisines: active ? plan.cuisines.filter((c) => c !== cuisine) : [...plan.cuisines, cuisine] })
                    }
                  >
                    {cuisine}
                  </Chip>
                )
              })}
            </div>
            <label className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <span className="font-medium text-ink">Pure veg kitchen for this event</span>
              <input
                type="checkbox"
                checked={plan.pureVeg}
                onChange={(event) => update({ pureVeg: event.target.checked })}
                className="size-5 accent-terracotta"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-medium text-ink-soft">Allergies or must-haves? (optional)</span>
              <input
                type="text"
                value={plan.note ?? ''}
                onChange={(event) => update({ note: event.target.value })}
                placeholder="e.g. no nuts, extra desserts"
                className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-ink placeholder:text-ink-lighter"
              />
            </label>
            <PrimaryButton onClick={() => goTo(5)}>See my plan</PrimaryButton>
          </>
        )}

        {/* ── Summary ──────────────────────────────── */}
        {current === 'summary' && (
          <>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              <SummaryRow label="Occasion" value={getOccasion(plan.occasion)?.label ?? '—'} onEdit={() => goTo(0)} emoji={getOccasion(plan.occasion)?.emoji} />
              <SummaryRow label="Guests" value={`${plan.guests}${plan.guests >= 100 ? '+' : ''}`} onEdit={() => goTo(1)} emoji="👥" />
              <SummaryRow
                label="Date"
                value={plan.dateFlexible || !plan.date ? 'Still deciding' : prettyDate(plan.date)}
                onEdit={() => goTo(2)}
                emoji="🗓️"
              />
              <SummaryRow label="Service" value={services.find((s) => s.id === plan.service)?.label ?? '—'} onEdit={() => goTo(3)} emoji="🍽️" />
              <SummaryRow
                label="Food"
                value={[plan.cuisines.join(', ') || 'Open to ideas', plan.pureVeg ? 'Pure veg' : null].filter(Boolean).join(' · ')}
                onEdit={() => goTo(4)}
                emoji="🥘"
              />
            </div>

            {estimate && (
              <div className="mt-4 rounded-2xl bg-ink p-5 text-primary-foreground">
                <p className="section-label text-terracotta-light">Live estimate</p>
                <p className="mt-1 font-serif text-3xl font-semibold">
                  {formatINR(estimate.total[0])}–{formatINR(estimate.total[1])}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  {formatINR(estimate.perGuest[0])}–{formatINR(estimate.perGuest[1])} per guest · final quote on WhatsApp
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink-soft">Your name (optional)</span>
                <input
                  type="text"
                  value={plan.name ?? ''}
                  onChange={(event) => update({ name: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-border bg-card p-3.5 text-ink"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink-soft">Area in Kolkata (optional)</span>
                <input
                  type="text"
                  value={plan.area ?? ''}
                  onChange={(event) => update({ area: event.target.value })}
                  placeholder="e.g. Salt Lake"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card p-3.5 text-ink placeholder:text-ink-lighter"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={send}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-terracotta px-8 py-4.5 text-lg font-semibold text-primary-foreground transition-all hover:bg-terracotta-deep active:scale-[0.99]"
            >
              Send my plan on WhatsApp →
            </button>
            <p className="mt-3 text-center text-sm text-ink-soft">No payment now. Menus & quote usually within hours.</p>

            <div className="mt-5 flex flex-col items-center gap-2 text-sm">
              {plan.guests >= CELEBRATION_MIN_GUESTS && (
                <a href="/menu.html" className="font-semibold text-terracotta hover:text-terracotta-deep">
                  Prefer to hand-pick every dish? Open the menu builder →
                </a>
              )}
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-ink-soft hover:text-ink">
                In a rush? Call {site.phone}
              </a>
            </div>
          </>
        )}

        {/* Back */}
        {step > 0 && current !== 'summary' && (
          <button type="button" onClick={() => goTo(step - 1)} className="mt-8 self-start text-sm font-medium text-ink-soft hover:text-ink">
            ← Back
          </button>
        )}
        {current === 'summary' && (
          <button type="button" onClick={() => goTo(4)} className="mt-6 self-start text-sm font-medium text-ink-soft hover:text-ink">
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
        active ? 'bg-ink text-background' : 'border border-border bg-card text-ink hover:border-terracotta',
      )}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-8 w-full rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function SummaryRow({ label, value, emoji, onEdit }: { label: string; value: string; emoji?: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true">{emoji}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-lighter">{label}</p>
          <p className="truncate font-medium text-ink">{value}</p>
        </div>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 text-sm font-semibold text-terracotta">
        Edit
      </button>
    </div>
  )
}
