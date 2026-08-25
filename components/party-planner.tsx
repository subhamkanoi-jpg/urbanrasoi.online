'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shareOrderSlip, type SlipRow } from '@/lib/order-slip'
import { clearOrderState, loadOrderState, saveOrderState } from '@/lib/order-storage'
import {
  getPackage,
  labelSlot,
  packagesForGuests,
  slotItemName,
  slotSummary,
  swapPoolIds,
  type SlotKind,
} from '@/lib/party-packages'
import {
  ALL_STEPS,
  GRAZING_MIN_GUESTS,
  type Plan,
  type Step,
  applyGuests,
  applyService,
  billedGuests,
  budgets,
  canSendPlan,
  composeWhatsappMessage,
  dateNote,
  emptyPlan,
  estimatePlan,
  formatINR,
  getOccasion,
  guestNote,
  nextWeekendISO,
  occasions,
  perGuestPrice,
  prettyDate,
  selectPackage,
  services,
  stepsFor,
  swapSlot,
} from '@/lib/planner'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

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

const guestPresets = [10, 15, 25, 40, 60, 100]

function isStep(value: unknown): value is Step {
  return typeof value === 'string' && (ALL_STEPS as readonly string[]).includes(value)
}

function coerceStep(plan: Plan, step: Step): Step {
  const visible = stepsFor(plan.guests)
  return visible.includes(step) ? step : visible[visible.length - 1]!
}

function resolveItemId(plan: Plan, slotId: string, itemId: string): string {
  const pkg = getPackage(plan.packageId)
  if (!pkg) return itemId
  const kind: SlotKind = slotId === 'live' ? 'live' : (pkg.slots.find((s) => s.id === slotId)?.kind ?? 'starter')
  const pool = swapPoolIds(kind)
  if (itemId && pool.includes(itemId)) return itemId
  if (slotId === 'live') return pkg.defaultLiveId
  return pkg.slots.find((s) => s.id === slotId)?.defaultItemId ?? itemId
}

function loadSaved(): { plan: Plan; step: Step } | null {
  const parsed = loadOrderState<{ plan?: Plan; step?: Step }>(STORAGE_KEY)
  if (!parsed || typeof parsed.plan !== 'object' || parsed.plan === null) return null
  const plan: Plan = {
    ...emptyPlan,
    ...parsed.plan,
    guests: typeof parsed.plan.guests === 'number' ? parsed.plan.guests : emptyPlan.guests,
    slots: Array.isArray(parsed.plan.slots) ? parsed.plan.slots : [],
  }
  const step = isStep(parsed.step) ? coerceStep(plan, parsed.step) : 'occasion'
  return { plan, step }
}

export function PartyPlanner({ initialOccasion, source }: { initialOccasion?: string; source?: string }) {
  const preset = getOccasion(initialOccasion)
  const [plan, setPlan] = useState<Plan>(() => ({ ...emptyPlan, occasion: preset?.id }))
  const [step, setStep] = useState<Step>(() => (preset ? 'guests' : 'occasion'))
  const [resumed, setResumed] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [sending, setSending] = useState(false)
  const [sentPlan, setSentPlan] = useState(false)
  const [gateBanner, setGateBanner] = useState(false)
  const [swappingSlot, setSwappingSlot] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = loadSaved()
    if (saved && !preset && (saved.plan.occasion || saved.step !== 'occasion')) {
      setPlan(saved.plan)
      setStep(saved.step)
      setResumed(true)
    }
    setHydrated(true)
    window.fbq?.('trackCustom', 'PlannerOpen', { src: source ?? 'direct' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleSteps = stepsFor(plan.guests)
  const current = coerceStep(plan, step)
  const currentIndex = visibleSteps.indexOf(current)
  const estimate = useMemo(() => estimatePlan(plan), [plan])
  const sendBlocked = sending || !canSendPlan(plan)
  const offeredPackages = packagesForGuests(plan.guests)
  const selectedPackageOffered = Boolean(
    plan.packageId && offeredPackages.some((p) => p.id === plan.packageId),
  )

  useEffect(() => {
    if (current !== step) setStep(current)
  }, [current, step])

  useEffect(() => {
    if (!hydrated || sentPlan) return
    saveOrderState(STORAGE_KEY, { plan, step: current })
  }, [plan, current, hydrated, sentPlan])

  useEffect(() => {
    if (current !== 'customise') setSwappingSlot(null)
  }, [current])

  const goTo = useCallback((next: Step) => {
    setResumed(false)
    setStep(next)
    topRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  const update = useCallback((patch: Partial<Plan>) => {
    setPlan((currentPlan) => ({ ...currentPlan, ...patch }))
  }, [])

  const setGuests = useCallback((n: number) => {
    const { plan: next, cleared } = applyGuests(plan, n)
    setPlan(next)
    if (cleared) setGateBanner(true)
  }, [plan])

  const goBack = useCallback(() => {
    const index = visibleSteps.indexOf(current)
    if (current === 'guests' && plan.packageId) setGateBanner(false)
    if (index > 0) goTo(visibleSteps[index - 1]!)
  }, [visibleSteps, current, goTo, plan.packageId])

  const slotRows = useMemo(() => {
    const pkg = getPackage(plan.packageId)
    if (!pkg) return []
    const kinds: SlotKind[] = plan.slots.map((s) =>
      s.slotId === 'live' ? 'live' : (pkg.slots.find((ps) => ps.id === s.slotId)?.kind ?? 'starter'),
    )
    const counts = new Map<SlotKind, number>()
    for (const kind of kinds) counts.set(kind, (counts.get(kind) ?? 0) + 1)
    const seen = new Map<SlotKind, number>()
    return plan.slots.map((s, i) => {
      const kind = kinds[i]!
      const index = (seen.get(kind) ?? 0) + 1
      seen.set(kind, index)
      const itemId = resolveItemId(plan, s.slotId, s.itemId)
      const pool = swapPoolIds(kind)
      return {
        slotId: s.slotId,
        kind,
        itemId,
        label: labelSlot(kind, index, counts.get(kind) ?? 1),
        pool,
        swappable: pool.length > 1,
      }
    })
  }, [plan])

  async function send() {
    if (sendBlocked) return
    setSending(true)

    const toSend: Plan = {
      ...plan,
      slots: plan.slots.map((s) => ({ ...s, itemId: resolveItemId(plan, s.slotId, s.itemId) })),
    }
    const value = estimate?.total
    const service = services.find((s) => s.id === toSend.service)
    const budget = budgets.find((b) => b.id === toSend.budget)
    const pkg = getPackage(toSend.packageId)

    const details: SlipRow[] = [
      { name: 'Occasion', qty: getOccasion(toSend.occasion)?.label ?? '—' },
      { name: 'Guests', qty: `${toSend.guests}${toSend.guests >= 100 ? '+' : ''}` },
    ]
    if (toSend.dateFlexible) details.push({ name: 'Date', qty: 'Flexible' })
    else if (toSend.date) details.push({ name: 'Date', qty: prettyDate(toSend.date) })
    if (service) details.push({ name: 'Service', qty: service.label })
    if (budget) details.push({ name: 'Budget', qty: budget.label })
    if (pkg) details.push({ name: 'Package', qty: pkg.name })
    if (toSend.area) details.push({ name: 'Area', qty: toSend.area })

    const groups = [{ heading: 'Your party', rows: details }]
    if (toSend.slots.length) {
      groups.push({
        heading: 'Menu',
        rows: toSend.slots.map((s) => ({ name: slotItemName(s.itemId) })),
      })
    }

    const outcome = await shareOrderSlip({
      slip: {
        eyebrow: 'Party plan',
        facts: toSend.name ? [`Name: ${toSend.name}`] : undefined,
        groups,
        totalLabel: estimate ? 'Your package' : undefined,
        totalValue: estimate ? formatINR(estimate.total) : undefined,
        note: toSend.note || undefined,
      },
      text: composeWhatsappMessage(toSend),
      fileName: 'urban-rasoi-party-plan.png',
      title: 'My Urban Rasoi party plan',
      tracking: {
        placement: 'planner',
        occasion: getOccasion(toSend.occasion)?.label,
        contentName: 'Party Planner',
        value,
        currency: value != null ? 'INR' : undefined,
      },
    })

    setSending(false)
    if (outcome === 'cancelled') return
    setSentPlan(true)
    clearOrderState(STORAGE_KEY)
  }

  const questionTotal = visibleSteps.length - 1
  const questionNumber = currentIndex + 1
  const underFifteen = plan.guests < GRAZING_MIN_GUESTS

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
          {visibleSteps.map((s, i) => (
            <span key={s} className={cn('h-1 flex-1 rounded-full transition-colors duration-300', i <= currentIndex ? 'bg-terracotta' : 'bg-cream-dark')} />
          ))}
        </div>
      </div>

      {resumed && (
        <button
          type="button"
          onClick={() => {
            setPlan({ ...emptyPlan })
            setGateBanner(false)
            goTo('occasion')
          }}
          className="mt-3 self-start rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink-soft"
        >
          Welcome back — picked up where you left off. Start over?
        </button>
      )}

      {gateBanner && current !== 'summary' && (
        <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-ink" role="status">
          Guest count changed the menus we can offer.
        </p>
      )}

      <div className="mt-6 flex flex-1 flex-col md:mt-10">
        <p className="section-label">
          {current === 'summary' ? 'One tap to our kitchen' : `Question ${questionNumber} of ${questionTotal}`}
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
                  onClick={() => { update({ occasion: occasion.id }); goTo('guests') }}
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
                onClick={() => setGuests(plan.guests - 5)}
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
                onClick={() => setGuests(plan.guests + 5)}
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
                  onClick={() => setGuests(n)}
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
            <PrimaryButton
              onClick={() => {
                if (plan.packageId) setGateBanner(false)
                goTo(underFifteen ? 'summary' : 'service')
              }}
            >
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
                onClick={() => { setPlan(applyService(plan, service.id)); goTo('budget') }}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 text-left transition-all active:scale-[0.99]',
                  plan.service === service.id ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-border hover:border-terracotta/50',
                )}
              >
                <span>
                  <span className="block font-serif text-xl font-semibold text-ink">{service.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{service.detail}</span>
                </span>
                {plan.guests >= GRAZING_MIN_GUESTS && (
                  <span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-terracotta">
                    from {formatINR(service.fromPlate)}/guest
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Budget ───────────────────────────────── */}
        {current === 'budget' && (
          <div className="mt-6 flex flex-col gap-3">
            {budgets.map((budget) => (
              <button
                key={budget.id}
                type="button"
                onClick={() => { update({ budget: budget.id }); goTo('package') }}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 text-left transition-all active:scale-[0.99]',
                  plan.budget === budget.id ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-border hover:border-terracotta/50',
                )}
              >
                <span>
                  <span className="block font-serif text-xl font-semibold text-ink">{budget.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{budget.blurb}</span>
                </span>
                {plan.service && (
                  <span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-terracotta">
                    {formatINR(perGuestPrice(plan.service, budget.id))}/guest
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Package ──────────────────────────────── */}
        {current === 'package' && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {offeredPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setPlan(selectPackage(plan, pkg.id))
                    setGateBanner(false)
                    goTo('customise')
                  }}
                  className={cn(
                    'flex min-h-24 flex-col items-start justify-between rounded-2xl border bg-card p-4 text-left transition-all active:scale-[0.98]',
                    plan.packageId === pkg.id ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-border hover:border-terracotta/50',
                  )}
                >
                  <span className="font-serif text-lg font-semibold text-ink">{pkg.name}</span>
                  <span className="mt-1 text-sm text-ink-soft">{slotSummary(pkg, plan.service ?? 'delivery')}</span>
                </button>
              ))}
            </div>
            {selectedPackageOffered && (
              <PrimaryButton
                onClick={() => {
                  setGateBanner(false)
                  goTo('customise')
                }}
              >
                Continue
              </PrimaryButton>
            )}
          </>
        )}

        {/* ── Customise ────────────────────────────── */}
        {current === 'customise' && (
          <>
            {slotRows.length === 0 ? (
              <p className="mt-6 rounded-xl bg-cream p-4 text-center text-sm font-medium text-ink">
                No dishes to swap yet — go back to Pick a menu.
              </p>
            ) : (
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
                {slotRows.map((row) => (
                  <div key={row.slotId} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-lighter">{row.label}</p>
                        <p className="truncate font-medium text-ink">{slotItemName(row.itemId)}</p>
                      </div>
                      {row.swappable && (
                        <button
                          type="button"
                          onClick={() => setSwappingSlot((id) => (id === row.slotId ? null : row.slotId))}
                          className="shrink-0 text-sm font-semibold text-terracotta"
                        >
                          {swappingSlot === row.slotId ? 'Close' : 'Swap'}
                        </button>
                      )}
                    </div>
                    {swappingSlot === row.slotId && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {row.pool.map((id) => (
                          <Chip
                            key={id}
                            active={id === row.itemId}
                            onClick={() => {
                              setPlan(swapSlot(plan, row.slotId, id))
                              setSwappingSlot(null)
                            }}
                          >
                            {slotItemName(id)}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <PrimaryButton onClick={() => goTo('summary')} disabled={slotRows.length === 0}>
              Continue
            </PrimaryButton>
          </>
        )}

        {/* ── Summary ──────────────────────────────── */}
        {current === 'summary' && (
          <>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              <SummaryRow label="Occasion" value={getOccasion(plan.occasion)?.label ?? '—'} onEdit={() => goTo('occasion')} emoji={getOccasion(plan.occasion)?.emoji} />
              <SummaryRow label="Guests" value={`${plan.guests}${plan.guests >= 100 ? '+' : ''}`} onEdit={() => goTo('guests')} emoji="👥" />
              {!underFifteen && (
                <>
                  <SummaryRow label="Service" value={services.find((s) => s.id === plan.service)?.label ?? '—'} onEdit={() => goTo('service')} emoji="🍽️" />
                  <SummaryRow label="Budget" value={budgets.find((b) => b.id === plan.budget)?.label ?? '—'} onEdit={() => goTo('budget')} emoji="✨" />
                  <SummaryRow label="Package" value={getPackage(plan.packageId)?.name ?? '—'} onEdit={() => goTo('package')} emoji="🥘" />
                </>
              )}
            </div>

            {underFifteen ? (
              <p className="mt-4 rounded-xl bg-cream p-4 text-center text-sm font-medium text-ink">
                We'll tailor a menu.
              </p>
            ) : estimate ? (
              <div className="mt-4 rounded-2xl bg-ink p-5 text-primary-foreground">
                <p className="section-label text-terracotta-light">Your package</p>
                <p className="mt-1 font-serif text-3xl font-semibold">{formatINR(estimate.total)}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  {formatINR(estimate.perGuest)} per guest × {billedGuests(plan.guests)} = {formatINR(estimate.total)}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/70">
                  Delivery extra as per area — confirmed on WhatsApp.
                </p>
              </div>
            ) : null}

            <div className="mt-4">
              <p className="text-sm font-medium text-ink-soft">When is the party? (optional)</p>
              <div className="mt-2 flex flex-wrap gap-2">
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
              <label className="mt-3 block">
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
            </div>

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
            <label className="mt-3 block">
              <span className="text-sm font-medium text-ink-soft">Allergies or must-haves? (optional)</span>
              <input
                type="text"
                value={plan.note ?? ''}
                onChange={(event) => update({ note: event.target.value })}
                placeholder="e.g. no nuts, extra desserts"
                className="mt-1.5 w-full rounded-xl border border-border bg-card p-3.5 text-ink placeholder:text-ink-lighter"
              />
            </label>

            <button
              type="button"
              onClick={send}
              disabled={sendBlocked}
              className={cn(
                'mt-6 flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4.5 text-lg font-semibold transition-all',
                sendBlocked
                  ? 'cursor-not-allowed bg-cream text-ink-lighter'
                  : 'bg-terracotta text-primary-foreground hover:bg-terracotta-deep active:scale-[0.99]',
              )}
            >
              {sending
                ? 'Preparing your plan…'
                : underFifteen
                  ? 'Send on WhatsApp'
                  : 'Send my plan on WhatsApp →'}
            </button>
            {sentPlan ? (
              <p className="mt-3 text-center text-sm font-medium text-terracotta">
                Plan sent. We will come back with menus and a quote shortly.
              </p>
            ) : (
              <p className="mt-3 text-center text-sm text-ink-soft">
                {underFifteen
                  ? "We'll tailor a menu. No payment now — usually within hours."
                  : 'Sent as an image plus the details. No payment now — menus & quote usually within hours.'}
              </p>
            )}

            <div className="mt-5 flex flex-col items-center gap-2 text-sm">
              <Link href="/order" className="font-semibold text-terracotta hover:text-terracotta-deep">
                Prefer to pick dish by dish? Order Online →
              </Link>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-ink-soft hover:text-ink">
                In a rush? Call {site.phone}
              </a>
            </div>
          </>
        )}

        {/* Back */}
        {currentIndex > 0 && (
          <button type="button" onClick={goBack} className="mt-8 self-start text-sm font-medium text-ink-soft hover:text-ink">
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
