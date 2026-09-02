import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { OrderCard } from '@/components/janmashtami/order-card'
import { JanmashtamiFaq } from '@/components/janmashtami/janmashtami-faq'
import { StickyOrderBar } from '@/components/janmashtami/sticky-order-bar'
import { JANMASHTAMI_CONFIG } from '@/lib/janmashtami-config'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Janmashtami Nariyal ke Laddu | Urban Rasoi Kolkata',
  description:
    'Celebrate Janmashtami with Urban Rasoi’s special Nariyal ke Laddu. Limited orders on 3rd & 4th September. Order online across Kolkata.',
  openGraph: {
    title: 'Janmashtami Special · Urban Rasoi',
    description:
      'Nariyal ke Laddu, made specially for Janmashtami. Orders 3rd & 4th September only.',
    url: `${site.url}/janmashtami`,
    images: [
      {
        url: '/images/janmashtami-og.jpg',
        width: 1200,
        height: 675,
        alt: 'Urban Rasoi Janmashtami Special Nariyal ke Laddu',
      },
    ],
  },
}

const trustStats = [
  { value: 'Since 2015', label: 'A decade of craft' },
  { value: '2,000+', label: 'Hosts served' },
  { value: '4.9★', label: 'Host rating' },
  { value: 'FSSAI', label: 'Licensed kitchen' },
]

const benefitStatements = [
  {
    title: 'Freshly prepared',
    detail: 'Prepared specifically for the Janmashtami order window.',
  },
  {
    title: '100% Vegetarian',
    detail: 'Made in Urban Rasoi’s vegetarian-only kitchen.',
  },
  {
    title: 'Made in Kolkata',
    detail: 'Prepared from Urban Rasoi’s Salt Lake kitchen.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Choose your boxes',
    detail: 'Select how many boxes you need for your family, puja and guests.',
  },
  {
    num: '02',
    title: 'Share your delivery details',
    detail: 'Pick your preferred date (3rd or 4th Sept) and Kolkata delivery address.',
  },
  {
    num: '03',
    title: 'We prepare & deliver',
    detail: 'Our kitchen crafts fresh laddus and delivers them directly to your doorstep.',
  },
]

export default function JanmashtamiPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-16 pt-10 md:flex-row md:items-center md:gap-14 md:px-8 md:pb-24 md:pt-16">
          {/* Left / Content Column */}
          <div className="flex-1">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-terracotta/20 bg-terracotta/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                <span className="size-1.5 rounded-full bg-terracotta animate-pulse" />
                {JANMASHTAMI_CONFIG.eyebrow}
              </div>

              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl md:text-6xl">
                Nariyal ke Laddu,
                <br />
                <span className="italic font-normal">made for Janmashtami.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
                {JANMASHTAMI_CONFIG.heroSupport}
              </p>

              {/* Urgency Badge */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-cream px-4 py-2.5">
                <svg
                  className="size-4 text-terracotta shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.253M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  ORDERS OPEN · 3rd & 4th SEPTEMBER ONLY
                </span>
              </div>

              {/* CTA & Microcopy */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#order-section"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-terracotta-deep hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  Order Nariyal ke Laddu
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <p className="mt-3 text-xs text-ink-soft">
                No signup. Quick checkout. Delivery across Kolkata.
              </p>
            </Reveal>
          </div>

          {/* Right / Hero Photography Column */}
          <Reveal delay={150} className="flex-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/80 shadow-2xl md:aspect-[4/3]">
              <Image
                src="/images/janmashtami-hero.jpg"
                alt="Artisanal Nariyal ke Laddu freshly prepared by Urban Rasoi for Janmashtami"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Urgency Strip */}
      <section
        aria-label="Order Window Announcement"
        className="border-y border-border bg-ink text-background py-5"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-center sm:flex-row sm:text-left md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-2.5 rounded-full bg-terracotta animate-ping" />
            <p className="font-serif text-lg font-bold tracking-wide uppercase text-background">
              {JANMASHTAMI_CONFIG.urgencyText}
            </p>
          </div>
          <p className="text-xs uppercase tracking-widest text-background/80 sm:text-sm">
            {JANMASHTAMI_CONFIG.urgencySubtext}
          </p>
        </div>
      </section>

      {/* Product Section */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Festive Craft
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Made for the festive table.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
              {JANMASHTAMI_CONFIG.subheading}
            </p>

            <div className="mt-10 space-y-6">
              {benefitStatements.map((benefit, i) => (
                <div key={benefit.title} className="flex gap-4 border-t border-border pt-5">
                  <span className="font-serif text-lg font-bold text-terracotta">
                    {`0${i + 1}`}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {benefit.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/images/janmashtami-og.jpg"
                alt="Urban Rasoi Nariyal ke Laddu gift box presentation"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ordering Section (Embedded Conversion Engine) */}
      <section
        id="order-section"
        aria-label="Order Form"
        className="bg-cream/70 py-20 md:py-28 scroll-mt-16"
      >
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
                Online Ordering
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Reserve your Janmashtami box
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft sm:text-base">
                Freshly prepared for 3rd & 4th September. Delivered across Kolkata.
              </p>
            </div>
          </Reveal>

          <OrderCard />
        </div>
      </section>

      {/* Delivery Area Reassurance */}
      <section id="delivery" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Delivery Coverage
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Made in Salt Lake. Delivered across Kolkata.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Prepared in Urban Rasoi’s vegetarian-only kitchen at AE-287, Salt Lake Sector 1, and delivered across Kolkata.
            </p>
          </div>
        </Reveal>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Delivering across key Kolkata areas:
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {JANMASHTAMI_CONFIG.deliveryAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-soft">
            * Final delivery availability is confirmed by pincode during order placement.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section
        aria-label="Urban Rasoi Trust Credentials"
        className="border-y border-border bg-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Kitchen Credentials
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              From the kitchen you already trust.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {trustStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 border-t border-border/80 pt-4">
                <p className="font-serif text-2xl font-bold text-ink sm:text-3xl">
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-ink-soft">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festive Emotional Section */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-2xl">
              <Image
                src="/images/janmashtami-lifestyle.jpg"
                alt="Janmashtami family celebration and festive dessert sharing"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
                Festive Gatherings
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
                Some festivals are meant to be shared.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
                A little sweetness after the puja. A box for the family. Something special for the people coming home.
              </p>
              <div className="mt-8">
                <a
                  href="#order-section"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-background transition-all hover:bg-terracotta"
                >
                  Order for Janmashtami
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-20 md:py-28" aria-label="How it works">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Simple Ordering
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Three steps. That’s it.
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 md:p-8">
                  <p className="font-serif text-3xl font-bold text-terracotta">
                    {step.num}
                  </p>
                  <p className="font-serif text-xl font-semibold text-ink">
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {step.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ Accordion */}
      <JanmashtamiFaq />

      {/* Final Closing CTA */}
      <section className="bg-ink py-20 text-background md:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <Reveal>
            <span className="inline-flex items-center rounded-full bg-terracotta/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-terracotta">
              3rd & 4th SEPTEMBER ONLY
            </span>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
              Make this Janmashtami a little sweeter.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-background/75">
              Urban Rasoi Nariyal ke Laddu · Janmashtami Special
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#order-section"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-terracotta-deep hover:-translate-y-0.5"
              >
                Order Now
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="mt-8 text-xs text-background/50 font-mono">
              www.urbanrasoi.online/janmashtami
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mobile Sticky Conversion Bar */}
      <StickyOrderBar />
    </>
  )
}
