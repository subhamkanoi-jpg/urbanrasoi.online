import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const rows = [
  {
    old: 'Same 10 dishes, every party',
    now: 'Six cuisines, chef-crafted menus',
  },
  {
    old: 'Oily, heavy, predictable food',
    now: 'Fresh, balanced, gourmet',
  },
  {
    old: 'Your kitchen left in chaos',
    now: 'Your kitchen, completely untouched',
  },
  {
    old: 'You supervise the cook all evening',
    now: 'You just host — and enjoy it',
  },
]

export function MaharajComparison({ placement = 'maharaj-comparison' }: { placement?: string }) {
  return (
    <section
      className="bg-ink py-14 text-primary-foreground md:py-20"
      aria-labelledby="comparison-title"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow text-terracotta-light">Hosting shouldn't feel like work</p>
          <h2
            id="comparison-title"
            className="mt-4 font-serif text-4xl font-semibold text-balance md:text-6xl"
          >
            Still calling the maharaj?
          </h2>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/65">
            Nothing against the maharaj. But there's a better way to host.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-primary-foreground/12 bg-primary-foreground/5 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40">
                Self-managed hosting
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {rows.map((row) => (
                  <li key={row.old} className="flex gap-3 text-primary-foreground/55">
                    <span className="mt-0.5 shrink-0 text-primary-foreground/30" aria-hidden="true">
                      ✕
                    </span>
                    <p className="leading-snug">{row.old}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-2xl bg-terracotta p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                Urban Rasoi
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {rows.map((row) => (
                  <li key={row.now} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-bold" aria-hidden="true">
                      ✓
                    </span>
                    <p className="font-medium leading-snug">{row.now}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-9 flex flex-col items-start gap-4 border-t border-primary-foreground/10 pt-9 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-xl font-semibold text-primary-foreground md:text-2xl">
              You host. We handle the rest.
            </p>
            <Link
              href={`/plan?src=${placement}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Plan my party <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
