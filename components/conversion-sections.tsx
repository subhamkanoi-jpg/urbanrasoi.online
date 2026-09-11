import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

const trustPoints = [
  { value: `Since ${site.foundedYear}`, label: 'Feeding Kolkata' },
  { value: site.community, label: 'Hosts served' },
  { value: `${site.rating}★`, label: 'Host rating' },
  { value: 'FSSAI', label: 'Licensed kitchen' },
]

const steps = [
  {
    marker: '01',
    title: 'Tell us your date',
    copy: 'WhatsApp your date, guest count and area. Takes 30 seconds.',
  },
  {
    marker: '02',
    title: 'We curate the menu',
    copy: 'We tailor a menu to your occasion and preferences. You approve it.',
  },
  {
    marker: '03',
    title: 'You enjoy your party',
    copy: 'We cook, deliver and serve. You host — without lifting a ladle.',
  },
]

export const faqItems = [
  {
    question: 'Is Urban Rasoi 100% vegetarian?',
    answer:
      'Yes — always. Everything is cooked in a vegetarian-only, FSSAI-licensed kitchen in Salt Lake. No meat, no shared tandoor, no mixed kitchen. Ever.',
  },
  {
    question: 'How is Urban Rasoi different from calling a maharaj?',
    answer:
      'Everything is cooked in our FSSAI-licensed kitchen and delivered or served at your venue — no mess in your kitchen, no repeats. Chef-crafted menus across six cuisines, never the same oily-heavy spread.',
  },
  {
    question: 'Which parts of Kolkata do you serve?',
    answer:
      'We cook in Salt Lake Sector 1 and deliver across the city — Salt Lake, New Town, Rajarhat, South Kolkata (Alipore, Ballygunge, Gariahat, Tollygunge), Howrah and Dum Dum. WhatsApp your pin code and we confirm the slot.',
  },
  {
    question: 'What is the minimum guest count?',
    answer:
      'Grazing tables from 15 guests, celebration menus from 25, corporate from 10. À la carte orders have no minimum.',
  },
  {
    question: 'Can menus be customised?',
    answer:
      'Yes — every menu is built around your occasion, preferences, allergies and dietary needs. Nothing is off-the-shelf.',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'WhatsApp us your date, guest count and area — menu options and pricing usually follow within hours. No registration, no forms.',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Urban Rasoi at a glance" className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
        {trustPoints.map((point) => (
          <div
            key={point.value}
            className="px-4 py-5 text-center md:px-6 md:py-6"
          >
            <p className="font-serif text-xl font-semibold text-ink md:text-2xl">{point.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft md:text-sm">
              {point.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">From enquiry to event</p>
          <h2
            id="how-it-works-heading"
            className="mt-4 max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl"
          >
            Three steps. Zero stress.
          </h2>
        </Reveal>
        <ol className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <li className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
                {/* Large step number as background watermark */}
                <span
                  className="pointer-events-none absolute right-4 top-2 select-none font-serif text-8xl font-semibold text-ink/5 md:text-9xl"
                  aria-hidden="true"
                >
                  {step.marker}
                </span>
                <span className="font-serif text-sm font-semibold text-terracotta">{step.marker}</span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-ink md:mt-4 md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={210}>
          <div className="mt-8 text-center">
            <Link
              href="/plan?src=how-it-works"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-terracotta-deep hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Plan my party <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function FAQSection() {
  return (
    <section className="bg-cream py-14 md:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-[0.65fr_1.35fr] md:gap-14">
          <Reveal>
            <div className="md:sticky md:top-24">
              <p className="eyebrow">Good to know</p>
              <h2
                id="faq-heading"
                className="mt-4 font-serif text-3xl font-semibold text-ink text-balance md:text-4xl"
              >
                Questions hosts ask.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Anything else?{' '}
                <a
                  href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent("Hi Urban Rasoi, I have a question about catering.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-terracotta hover:text-terracotta-deep"
                >
                  WhatsApp us →
                </a>
              </p>
            </div>
          </Reveal>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 md:px-7">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">
                  {item.question}
                  <span
                    className="shrink-0 text-xl text-terracotta transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-relaxed text-ink-soft md:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
