import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const cuisines = [
  {
    name: 'Indian',
    detail: 'Dal makhani, paneer, biryanis, breads',
    accent: 'bg-terracotta/10 border-terracotta/20',
    textAccent: 'text-terracotta',
  },
  {
    name: 'Bengali',
    detail: 'Shukto, cholar dal, mishti, festive thalis',
    accent: 'bg-olive/10 border-olive/20',
    textAccent: 'text-olive',
  },
  {
    name: 'South Indian',
    detail: 'Dosas, uttapam, sambhar, chutneys',
    accent: 'bg-terracotta/10 border-terracotta/20',
    textAccent: 'text-terracotta',
  },
  {
    name: 'Indo-Chinese',
    detail: 'Manchurian, fried rice, noodles, momos',
    accent: 'bg-olive/10 border-olive/20',
    textAccent: 'text-olive',
  },
  {
    name: 'Continental',
    detail: 'Pasta, risotto, bruschetta, baked dishes',
    accent: 'bg-terracotta/10 border-terracotta/20',
    textAccent: 'text-terracotta',
  },
  {
    name: 'Desserts',
    detail: 'Sandesh, gulab jamun, mousse, live counters',
    accent: 'bg-olive/10 border-olive/20',
    textAccent: 'text-olive',
  },
]

export function MenuSection() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="menu-section-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="eyebrow">Six cuisines · 100% vegetarian</p>
              <h2
                id="menu-section-heading"
                className="mt-4 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl"
              >
                Food people remember.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <Link
              href="/order"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-terracotta px-6 py-3 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Explore full menus <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {cuisines.map((cuisine, index) => (
            <Reveal key={cuisine.name} delay={index * 50}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-5 md:p-6 ${cuisine.accent}`}
              >
                <h3 className={`font-serif text-2xl font-semibold ${cuisine.textAccent}`}>
                  {cuisine.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{cuisine.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center md:flex-row md:justify-between md:p-8 md:text-left">
            <div>
              <p className="font-serif text-xl font-semibold text-ink md:text-2xl">
                Build your own menu, dish by dish.
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                À la carte ordering — pick exactly what you want, priced per piece.
              </p>
            </div>
            <Link
              href="/order"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-ink/85 hover:-translate-y-0.5"
            >
              Order à la carte <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
