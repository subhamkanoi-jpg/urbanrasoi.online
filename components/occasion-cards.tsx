import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

const occasions = [
  {
    slug: 'house-parties',
    label: 'House Parties',
    tagline: 'Your home. Our kitchen.',
    detail: `From ${site.partyMenusFrom} / guest`,
    image: '/images/gallery-houseparty.jpg',
    imageAlt: 'Vegetarian house party buffet spread by Urban Rasoi in Kolkata',
    href: '/house-parties',
    primary: true,
  },
  {
    slug: 'grazing-tables',
    label: 'Grazing Tables',
    tagline: 'The table everyone gathers around.',
    detail: 'From 15 guests · Styled & set up',
    image: '/images/gallery-grazing.jpg',
    imageAlt: 'Lush vegetarian grazing table styled by Urban Rasoi',
    href: '/grazing-tables',
    primary: true,
  },
  {
    slug: 'birthdays',
    label: 'Birthdays & Celebrations',
    tagline: 'Make it memorable.',
    detail: 'Any size · Any cuisine',
    image: '/images/gallery-diwali.jpg',
    imageAlt: 'Festive vegetarian celebration catering by Urban Rasoi',
    href: '/house-parties',  // Birthdays are served via house-party catering
    primary: false,
  },
  {
    slug: 'corporate',
    label: 'Corporate Events',
    tagline: 'Lunch the whole office looks forward to.',
    detail: '10–200+ guests',
    image: '/images/gallery-team.jpg',
    imageAlt: 'Vegetarian corporate catering by Urban Rasoi in Kolkata',
    href: '/corporate',
    primary: false,
  },
]

export function OccasionCards() {
  return (
    <section className="bg-cream py-14 md:py-20" aria-labelledby="occasions-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">What are you hosting?</p>
          <h2
            id="occasions-heading"
            className="mt-4 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl"
          >
            Every celebration, handled.
          </h2>
        </Reveal>

        {/* Primary occasions — large cards */}
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {occasions
            .filter((o) => o.primary)
            .map((occasion, index) => (
              <Reveal key={occasion.slug} delay={index * 80}>
                <Link
                  href={occasion.href}
                  className="group relative block overflow-hidden rounded-2xl bg-ink"
                  aria-label={`${occasion.label} — ${occasion.tagline}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={occasion.image}
                      alt={occasion.imageAlt}
                      fill
                      className="img-zoom object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-70"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-light">
                      {occasion.detail}
                    </p>
                    <h3 className="mt-1.5 font-serif text-2xl font-semibold text-primary-foreground md:text-3xl">
                      {occasion.label}
                    </h3>
                    <p className="mt-1 text-sm text-primary-foreground/75">{occasion.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-terracotta-light transition-all group-hover:gap-3">
                      Explore <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
        </div>

        {/* Secondary occasions — smaller cards */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {occasions
            .filter((o) => !o.primary)
            .map((occasion, index) => (
              <Reveal key={occasion.slug} delay={index * 60 + 160}>
                <Link
                  href={occasion.href}
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta/40 hover:shadow-md md:p-5"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={occasion.image}
                      alt={occasion.imageAlt}
                      fill
                      className="img-zoom object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-ink">{occasion.label}</h3>
                    <p className="mt-0.5 text-sm text-ink-soft">{occasion.detail}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta transition-all group-hover:gap-2">
                      See menus <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  )
}
