import Image from 'next/image'
import Link from 'next/link'
import { EventStories } from '@/components/event-stories'
import {
  ConfidenceSection,
  FAQSection,
  HowItWorks,
  TrustStrip,
} from '@/components/conversion-sections'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { site, structuredWhatsappMessage } from '@/lib/site'

const serviceFacts: Record<string, string[]> = {
  'grazing-tables': ['From 15 guests', 'Styled & set up'],
  'house-parties': ['Intimate to full-house', 'Menus tailored to your guests'],
  corporate: ['10 to 200+ guests', 'Buffets, boxes or platters'],
  'packed-meals': ['20 to 500+ boxes', 'One-time or scheduled'],
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
          aria-label="Sunidhi event catered by Urban Rasoi"
        >
          <source src="/media/customer-stories/story-6.mp4#t=17" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/60" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">Catering in {site.location}</p>
            <h1 className="mt-3 max-w-4xl font-serif text-[2.55rem] font-semibold leading-[1.04] tracking-tight text-primary-foreground text-balance md:text-7xl">
              Catering that lets you enjoy your own celebration.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:mt-5 md:text-lg">
              <span className="md:hidden">Fresh menus and effortless event catering across Kolkata.</span>
              <span className="hidden md:inline">Custom menus, fresh cooking and dependable delivery or event service for house parties, corporate gatherings and celebrations across Kolkata.</span>
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton
                message={structuredWhatsappMessage}
                label="Check availability & get menus"
                size="large"
                className="justify-center"
              />
              <a
                href="/menu.html"
                className="group flex items-center justify-center gap-2 rounded-full border border-primary-foreground/45 bg-ink/20 px-6 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground hover:text-ink"
              >
                Create your celebration menu
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="mt-5 hidden text-sm font-medium text-primary-foreground/75 md:block">
              Share your date, guest count and area once—we will take the conversation from there.
            </p>
          </Reveal>
        </div>
      </section>

      <TrustStrip />
      <TestimonialCarousel />

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20">
        <Reveal>
          <p className="section-label">Choose your occasion</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            What are you planning?
          </h2>
          <p className="mt-3 hidden max-w-2xl leading-relaxed text-ink-soft md:block">Compare the format and guest-count fit, then explore the service that feels closest to your event.</p>
        </Reveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 70}>
              <Link
                href={`/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={product.cardImage}
                    alt={product.name}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="section-label hidden md:block">{product.eyebrow}</p>
                  <h3 className="font-serif text-2xl font-semibold text-ink md:mt-2">{product.shortName}</h3>
                  <p className="mt-3 hidden leading-relaxed text-ink-soft md:block">{product.promise}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 md:mt-5">
                    {serviceFacts[product.slug].map((fact) => (
                      <li key={fact} className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-ink">{fact}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-terracotta transition-all group-hover:gap-3">
                    Explore menus & service <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />

      <section className="px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <a
            href="/menu.html"
            className="group relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-ink px-7 py-9 md:flex-row md:items-center md:px-10 md:py-11"
          >
            <div className="relative max-w-2xl">
              <p className="section-label text-terracotta-light">Celebration menus · 25+ guests</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-primary-foreground text-balance md:text-4xl">
                Prefer to choose every dish? Build a Celebration Menu and get an instant estimate.
              </h2>
              <p className="mt-3 text-sm text-primary-foreground/70">Food delivery, semi-catering and full-service options are available in the builder.</p>
            </div>
            <span className="relative inline-flex shrink-0 items-center gap-2.5 rounded-full bg-terracotta px-7 py-4 text-base font-semibold text-primary-foreground transition-colors group-hover:bg-terracotta-deep">
              Build my menu <span aria-hidden="true">→</span>
            </span>
          </a>
        </Reveal>
      </section>

      <div id="celebrations">
        <EventStories />
      </div>
      <ConfidenceSection />
      <FAQSection />

      <section className="relative overflow-hidden">
        <Image src="/images/gallery-grazing.jpg" alt="A lush Urban Rasoi grazing table" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <p className="section-label text-terracotta-light">Start with the essentials</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance md:text-6xl">
              Tell us the date, guest count and occasion. We will help shape the rest.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton message={structuredWhatsappMessage} label="Get menu options & availability" size="large" className="justify-center" />
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-center justify-center rounded-full border border-primary-foreground/30 px-6 py-4 text-base font-medium text-primary-foreground hover:bg-primary-foreground/10">
                Call {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
