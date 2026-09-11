import { Reveal } from '@/components/reveal'

const benefits = [
  {
    title: 'Beautiful food',
    detail: 'Chef-crafted menus across six cuisines — Indian, Bengali, South Indian, Indo-Chinese, Continental, Desserts.',
  },
  {
    title: 'Freshly cooked',
    detail: 'Everything leaves our FSSAI-licensed Salt Lake kitchen the same day. Never reheated, never frozen.',
  },
  {
    title: 'Professional service',
    detail: 'Choose delivery, buffet with warmers, or full live service with staff — we match your occasion.',
  },
  {
    title: 'Zero kitchen chaos',
    detail: 'Your kitchen stays untouched. No prep, no cleanup, no supervising. You just host.',
  },
]

export function HomepagePromise() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="promise-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-24">
          {/* Left: editorial headline */}
          <Reveal>
            <div className="flex flex-col justify-center">
              <p className="eyebrow">The Urban Rasoi promise</p>
              <h2
                id="promise-heading"
                className="mt-4 font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-ink text-balance md:text-5xl lg:text-6xl"
              >
                You host.{' '}
                <em className="not-italic text-terracotta">We handle the rest.</em>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                House parties should feel like parties — not like catering projects. We take the food, service and
                operational headache completely off your plate.
              </p>
            </div>
          </Reveal>

          {/* Right: benefit list */}
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 md:p-6">
                  <span
                    className="mb-3 inline-block h-px w-8 bg-terracotta"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-xl font-semibold text-ink">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{benefit.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
