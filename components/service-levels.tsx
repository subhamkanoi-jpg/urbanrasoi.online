import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { services } from '@/lib/planner'
import { site } from '@/lib/site'

const levelMeta: Record<string, { tagline: string; detail: string; badge: string | null }> = {
  delivery: {
    tagline: 'Food arrives warm, ready to plate.',
    detail:
      'We cook, pack and deliver to your door. You plate up and serve. Perfect for intimate gatherings where you want to stay in control.',
    badge: 'Most popular',
  },
  buffet: {
    tagline: 'Warmers, setup and serving staff.',
    detail:
      'We bring the food, warmers and a team to keep the buffet running. You mingle. We manage the spread.',
    badge: null,
  },
  live: {
    tagline: 'A live counter at your venue.',
    detail:
      'One or more live stations — chaat, dosa, pasta — with a chef on-site. The experience guests talk about.',
    badge: 'Premium',
  },
}

export function ServiceLevels() {
  return (
    <section className="bg-cream py-14 md:py-20" aria-labelledby="service-levels-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">Choose your service</p>
          <h2
            id="service-levels-heading"
            className="mt-4 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl"
          >
            Celebrations from{' '}
            <span className="text-terracotta">{site.partyMenusFrom} / guest.</span>
          </h2>
          <p className="mt-3 max-w-xl text-base text-ink-soft">
            Final pricing depends on your menu, guest count and service level. WhatsApp us for a
            personalised quote — usually within hours.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {services.map((service, index) => {
            const meta = levelMeta[service.id]
            if (!meta) return null
            return (
              <Reveal key={service.id} delay={index * 70}>
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 md:p-7">
                  {meta.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                      {meta.badge}
                    </span>
                  )}
                  <p className="font-serif text-2xl font-semibold text-ink">{service.label}</p>
                  <p className="mt-1 text-sm font-medium text-terracotta">{meta.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{meta.detail}</p>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs text-ink-lighter">From</p>
                    <p className="font-serif text-2xl font-semibold text-ink">
                      ₹{service.fromPlate.toLocaleString('en-IN')}
                      <span className="text-base font-normal text-ink-soft"> / guest</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={210}>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Not sure which level suits your party?{' '}
            <Link
              href="/plan?src=service-levels"
              className="font-semibold text-terracotta hover:text-terracotta-deep"
            >
              Use the party planner →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
