import Image from 'next/image'
import Link from 'next/link'
import { EventStories } from '@/components/event-stories'
import { FAQSection, HowItWorks, TrustStrip } from '@/components/conversion-sections'
import { MaharajComparison } from '@/components/maharaj-comparison'
import { Reveal } from '@/components/reveal'
import { TelLink } from '@/components/tracked-links'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { isLive } from '@/lib/seasonal'
import { site, structuredWhatsappMessage } from '@/lib/site'

const serviceFacts: Record<string, string[]> = {
  'grazing-tables': ['From 15 guests', 'Styled & set up'],
  'house-parties': [`From ${site.partyMenusFrom}/guest`, 'Any size, any cuisine'],
  corporate: ['10–200+ guests', 'Always on time'],
  'packed-meals': ['20–500+ boxes', 'Cooked same day'],
}

export default function HomePage() {
  return (
    <>
      <section className="relative h-[78svh] min-h-[560px] overflow-hidden md:h-[92svh]">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/customer-stories/story-6-poster.png"
          aria-hidden="true"
        >
          <source src="/media/customer-stories/story-6.mp4#t=17" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/60" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">House party catering · Kolkata</p>
            <h1 className="mt-3 max-w-4xl font-serif text-[2.8rem] font-semibold leading-[1.04] tracking-tight text-primary-foreground text-balance md:text-7xl">
              Finally, enjoy your own party.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              Gourmet menus, cooked and delivered — from {site.partyMenusFrom} a guest.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/plan?src=home-hero"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/order"
                className="group flex items-center justify-center gap-2 rounded-full border border-primary-foreground/45 bg-ink/20 px-6 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground hover:text-ink"
              >
                Order à la carte
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-primary-foreground/70">30 seconds · no signup · reply within hours</p>
          </Reveal>
        </div>
      </section>

      <TrustStrip />

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

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 md:px-10 md:pb-20 md:pt-16">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            What are you planning?
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 70}>
              <Link
                href={`/${product.slug}`}
                className="group flex h-full flex-row overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 sm:flex-col"
              >
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden sm:aspect-[16/9] sm:w-full">
                  <Image
                    src={product.cardImage}
                    alt={product.name}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 640px) 50vw, 112px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-4 sm:p-5 md:p-6">
                  <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">{product.shortName}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                    {serviceFacts[product.slug].map((fact) => (
                      <li key={fact} className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink sm:px-3 sm:py-1.5 sm:text-sm">{fact}</li>
                    ))}
                  </ul>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-terracotta transition-all group-hover:gap-3 sm:mt-5 sm:text-base">
                    See menus <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <MaharajComparison placement="home-comparison" />

      <div id="celebrations">
        <EventStories />
      </div>
      <HowItWorks />
      <FAQSection />

      <section className="relative overflow-hidden">
        <Image src="/images/gallery-grazing.jpg" alt="A lush Urban Rasoi grazing table" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance md:text-6xl">
              Your date. Our kitchen.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/plan?src=home-final"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <WhatsAppButton message={structuredWhatsappMessage} label="Chat on WhatsApp" placement="home-final-cta" variant="light" size="large" className="justify-center" />
            </div>
            <p className="mt-4 text-sm text-primary-foreground/60">
              or call <TelLink placement="home-final-cta" className="font-semibold underline-offset-2 hover:underline">{site.phone}</TelLink>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
