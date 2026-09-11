import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EventStories } from '@/components/event-stories'
import { FAQSection, HowItWorks, TrustStrip, faqItems } from '@/components/conversion-sections'
import { GrazingSection } from '@/components/grazing-section'
import { HomepagePromise } from '@/components/homepage-promise'
import { JsonLd } from '@/components/json-ld'
import { MaharajComparison } from '@/components/maharaj-comparison'
import { MenuSection } from '@/components/menu-section'
import { OccasionCards } from '@/components/occasion-cards'
import { Reveal } from '@/components/reveal'
import { ServiceLevels } from '@/components/service-levels'
import { TelLink } from '@/components/tracked-links'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { faqNode, webPageNode } from '@/lib/seo'
import { isLive } from '@/lib/seasonal'
import { site, quickWhatsappMessage } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageNode({
              path: '/',
              name: 'Urban Rasoi | Premium Vegetarian House Party Catering in Kolkata',
              description:
                'Premium vegetarian catering for house parties, private dinners and celebrations across Kolkata. Cooked in our FSSAI-licensed Salt Lake kitchen since 2015.',
            }),
            faqNode(faqItems),
          ],
        }}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[88svh] min-h-[600px] overflow-hidden md:h-[96svh]">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/customer-stories/story-6-poster.png"
          aria-hidden="true"
        >
          <source src="/media/customer-stories/story-6.mp4#t=17" type="video/mp4" />
        </video>
        {/* Gradient: dark at bottom for legibility, lighter at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-12 md:pb-20">
          <Reveal>
            <p className="eyebrow text-terracotta-light">
              Premium vegetarian catering · Kolkata
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-primary-foreground text-balance md:text-[5.5rem]">
              Your party.{' '}
              <br className="hidden md:block" />
              Our kitchen.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-xl">
              Premium vegetarian catering for house parties and celebrations across Kolkata.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/plan?src=home-hero"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/order"
                className="flex items-center justify-center gap-2 rounded-full border border-primary-foreground/40 bg-ink/20 px-7 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
              >
                View menus <span aria-hidden="true">→</span>
              </Link>
            </div>
            {/* Subtle trust line — only verified facts */}
            <p className="mt-5 text-sm text-primary-foreground/55">
              Since {site.foundedYear} · FSSAI-licensed kitchen · {site.community} hosts served
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Trust strip ──────────────────────────────────────────── */}
      <TrustStrip />

      {/* Seasonal campaign banner */}
      {isLive('rudrabhishek') && (
        <Link
          href="/rudrabhishek-catering"
          className="group flex items-center justify-center gap-2.5 bg-ink px-5 py-3.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
        >
          <span aria-hidden="true">🪔</span>
          <span>Sawan special — satvik Rudra Abhishek catering, ₹30,000 for 40 guests</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}

      {/* ── 3. Core promise ─────────────────────────────────────────── */}
      <HomepagePromise />

      {/* ── 4. Occasion cards ───────────────────────────────────────── */}
      <OccasionCards />

      {/* ── 5. Menu section ─────────────────────────────────────────── */}
      <MenuSection />

      {/* ── 6. Grazing editorial ────────────────────────────────────── */}
      <GrazingSection />

      {/* ── 7. Maharaj comparison ───────────────────────────────────── */}
      <MaharajComparison placement="home-comparison" />

      {/* ── 8. Real events / stories ────────────────────────────────── */}
      <div id="celebrations">
        <EventStories />
      </div>

      {/* ── 9. How it works ─────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── 10. Service levels & pricing ────────────────────────────── */}
      <ServiceLevels />

      {/* ── 11. FAQ ─────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── 12. Closing CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/gallery-houseparty.jpg"
          alt="A beautifully served Urban Rasoi vegetarian house party spread in Kolkata"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/82" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-36">
          <Reveal>
            <p className="eyebrow text-terracotta-light">Tell us when you're hosting</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance md:text-6xl">
              Your date. Our kitchen.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-primary-foreground/70 md:text-lg">
              We'll take it from there.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/plan?src=home-final"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <WhatsAppButton
                message={quickWhatsappMessage}
                label="WhatsApp us"
                placement="home-final-cta"
                variant="light"
                size="large"
                className="justify-center"
              />
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              or call{' '}
              <TelLink
                placement="home-final-cta"
                className="font-semibold text-primary-foreground/70 underline-offset-2 hover:underline"
              >
                {site.phone}
              </TelLink>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
