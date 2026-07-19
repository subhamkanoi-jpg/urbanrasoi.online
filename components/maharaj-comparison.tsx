import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const rows = [
  { old: 'Same 10 dishes, every party', now: 'Six cuisines, chef-crafted' },
  { old: 'Oily, heavy, predictable', now: 'Gourmet, fresh, balanced' },
  { old: 'Your kitchen left a mess', now: 'Your kitchen, untouched' },
  { old: 'You supervise all evening', now: 'You just host' },
]

export function MaharajComparison({ placement = 'maharaj-comparison' }: { placement?: string }) {
  return (
    <section className="bg-ink py-14 text-primary-foreground md:py-20" aria-labelledby="comparison-title">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="section-label text-terracotta-light">Why hosts switch</p>
          <h2 id="comparison-title" className="mt-3 font-serif text-4xl font-semibold text-balance md:text-6xl">
            Still calling the maharaj?
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 md:p-8">
              <h3 className="font-serif text-2xl font-semibold text-primary-foreground/70">The old way</h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {rows.map((row) => (
                  <li key={row.old} className="flex gap-3 text-primary-foreground/60">
                    <span className="mt-0.5 shrink-0" aria-hidden="true">✕</span>
                    <p className="leading-snug">{row.old}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-2xl bg-terracotta p-6 md:p-8">
              <h3 className="font-serif text-2xl font-semibold">Urban Rasoi</h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {rows.map((row) => (
                  <li key={row.now} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-semibold" aria-hidden="true">✓</span>
                    <p className="font-medium leading-snug">{row.now}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-xl font-semibold md:text-2xl">The headache? Ours now.</p>
            <Link
              href={`/plan?src=${placement}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
            >
              Plan my party <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
