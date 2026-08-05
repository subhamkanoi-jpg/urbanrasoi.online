import Image from 'next/image'
import Link from 'next/link'
import { EventStories } from '@/components/event-stories'
import { FAQSection, HowItWorks, TrustStrip } from '@/components/conversion-sections'
import { ImageTicker } from '@/components/image-ticker'
import { Reveal } from '@/components/reveal'
import { TelLink } from '@/components/tracked-links'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { site, structuredWhatsappMessage } from '@/lib/site'

const serviceFacts: Record<string, string[]> = {
  'house-parties': [`From ${site.partyMenusFrom}/guest`, 'Any size, any cuisine'],
  corporate: ['10–200+ guests', 'Always on time'],
  'packed-meals': ['20–500+ boxes', 'Cooked same day'],
}

// Real Instagram food photos from @urbanrasoi_kolkata
const igPhotos = [
  { src: '/images/ig-1.png', alt: 'Urban Rasoi food' },
  { src: '/images/ig-2.png', alt: 'Urban Rasoi food' },
  { src: '/images/ig-3.png', alt: 'Urban Rasoi food' },
  { src: '/images/ig-4.png', alt: 'Urban Rasoi food' },
  { src: '/images/ig-5.png', alt: 'Urban Rasoi food' },
  { src: '/images/ig-6.png', alt: 'Urban Rasoi food' },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative h-[82svh] min-h-[580px] overflow-hidden md:h-screen">
        {/*
          Poster shown immediately while video buffers.
          Video starts at 0s (no fragment) to avoid the weird
          mid-seek crop on first paint. object-[center_30%] keeps the
          food in frame on every viewport.
        */}
        <video
          className="absolute inset-0 size-full object-cover object-[center_30%]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/customer-stories/story-6-poster.png"
          aria-label="Urban Rasoi house party catering in Kolkata"
        >
          <source src="/media/customer-stories/story-6.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/75" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-12 md:pb-20">
          <Reveal>
            <p className="section-label text-terracotta-light">House party catering · Kolkata</p>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-primary-foreground text-balance md:text-[4.5rem]">
              Finally, enjoy your own party.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Gourmet menus, cooked and delivered — from {site.partyMenusFrom} a guest.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/plan?src=home-hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/40 bg-ink/20 px-7 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground hover:text-ink"
              >
                Order à la carte
              </Link>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/60">30 seconds · no signup · reply within hours</p>
          </Reveal>
        </div>
      </section>

      <TrustStrip />

      {/* ── Image ticker ─────────────────────────────────────────────── */}
      <ImageTicker />

      {/* ── Services grid ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            What are you planning?
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 70}>
              <Link
                href={`/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.cardImage}
                    alt={product.name}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl font-semibold text-ink">{product.shortName}</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {serviceFacts[product.slug]?.map((fact) => (
                      <li key={fact} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink">{fact}</li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta transition-all group-hover:gap-2.5">
                    See menus <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Instagram real food photos ────────────────────────────────── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-4xl">
                Real food. Real parties.
              </h2>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 items-center gap-2 rounded-full border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground sm:flex"
              >
                @urbanrasoi_kolkata
              </a>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {igPhotos.map((photo, i) => (
              <Reveal key={photo.src} delay={i * 50}>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl"
                  aria-label={`View on Instagram: ${photo.alt}`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="img-zoom object-cover"
                      sizes="(min-width: 768px) 33vw, 50vw"
                    />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex sm:hidden">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground"
            >
              @urbanrasoi_kolkata
            </a>
          </div>
        </div>
      </section>

      {/* ── Build my menu CTA ─────────────────────────────────────────── */}
      <section className="px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <a
            href="/menu.html"
            className="group relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-ink px-7 py-9 md:flex-row md:items-center md:px-10 md:py-11"
          >
            <div className="relative max-w-2xl">
              <p className="section-label text-terracotta-light">Celebration menus · 25+ guests</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-primary-foreground text-balance md:text-4xl">
                Want to pick every dish?
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/60">Instant estimate — from {site.partyMenusFrom} a guest.</p>
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

      <HowItWorks />
      <FAQSection />

      {/* ── Closing CTA — real food photo background ─────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/gallery-houseparty.jpg"
          alt="Urban Rasoi house party catering spread"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/78" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance md:text-6xl">
              Your date. Our kitchen.
            </h2>
            <p className="mt-4 text-base text-primary-foreground/70">
              Three steps, zero stress: say hello, pick your menu, enjoy your party.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/plan?src=home-final"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <WhatsAppButton message={structuredWhatsappMessage} label="Chat on WhatsApp" placement="home-final-cta" variant="light" size="large" className="justify-center" />
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              or call <TelLink placement="home-final-cta" className="font-semibold underline-offset-2 hover:underline">{site.phone}</TelLink>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
