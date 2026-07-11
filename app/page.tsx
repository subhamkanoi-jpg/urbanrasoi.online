import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { MenuBuilderFloat } from '@/components/menu-builder-float'
import { products } from '@/lib/products'
import { site, defaultWhatsappMessage } from '@/lib/site'

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

// Placeholder feed shots — swap these for real posts from @urbanrasoi_kolkata
const galleryImages = [
  { src: '/images/ig-1.png', alt: 'Gourmet grazing spread' },
  { src: '/images/ig-2.png', alt: 'Bengali fish curry plate' },
  { src: '/images/ig-3.png', alt: 'House party snack platter' },
  { src: '/images/ig-4.png', alt: 'Freshly baked baguettes' },
  { src: '/images/ig-5.png', alt: 'Festive Diwali sweets' },
  { src: '/images/ig-6.png', alt: 'Packed gourmet meal box' },
]

export default function HomePage() {
  return (
    <>
      {/* ── FULLSCREEN HERO ──────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <Image
          src="/images/gallery-houseparty.jpg"
          alt="An Urban Rasoi feast, beautifully styled"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/15" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">{site.location}</p>
            <h1 className="mt-3 font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white text-balance md:text-7xl md:max-w-3xl">
              Delicious food, delivered to your celebration.
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton
                message={defaultWhatsappMessage}
                label="Order on WhatsApp"
                size="large"
                className="justify-center"
              />
              <a
                href="/menu.html"
                className="group flex items-center justify-center gap-2 rounded-full bg-white/15 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-ink"
              >
                Build Your Menu
                <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-white/80">
              <span className="text-terracotta-light" aria-hidden="true">★</span>
              {site.rating} rated · {site.community} served · FSSAI certified
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ORDER: PICK AN OCCASION ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">
            What are you planning?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Tap to order — we handle the rest.</p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link
                href={`/${p.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-card"
                style={{ boxShadow: '0 2px 16px 0 rgba(30,20,11,0.07)' }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cardImage}
                    alt={p.name}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
                    <h3 className="font-serif text-xl font-semibold text-white md:text-2xl">
                      {p.shortName}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
                      Order
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MENU BUILDER BANNER ──────────────────────────────── */}
      <section className="px-5 pb-12 md:px-10 md:pb-16">
        <Reveal>
          <a
            href="/menu.html"
            className="group relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-ink px-7 py-8 md:flex-row md:items-center md:px-10 md:py-10"
          >
            <span
              className="pointer-events-none absolute -right-4 -top-3 select-none font-serif text-[7rem] font-semibold leading-none text-white/[0.05] md:text-[9rem]"
              aria-hidden="true"
            >
              Menu
            </span>
            <h2 className="relative max-w-md font-serif text-2xl font-semibold leading-snug text-white text-balance md:text-3xl">
              Pick every dish. Send your dream menu in one tap.
            </h2>
            <span className="relative inline-flex shrink-0 items-center gap-2.5 rounded-full bg-terracotta px-7 py-4 text-base font-semibold text-white transition-all duration-200 group-hover:bg-terracotta-deep group-hover:gap-4">
              Build Your Menu
              <span aria-hidden="true">→</span>
            </span>
          </a>
        </Reveal>
      </section>

      {/* ── INSTAGRAM FEED ───────────────────────────────────── */}
      <section aria-label="Instagram feed" className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-terracotta-deep via-terracotta to-terracotta-light">
                  <InstagramGlyph className="size-6 text-white" />
                </span>
                <span>
                  <span className="block font-serif text-lg font-semibold leading-tight text-ink">
                    {site.instagramHandle}
                  </span>
                  <span className="block text-sm text-ink-soft group-hover:text-terracotta">
                    Fresh from our kitchen
                  </span>
                </span>
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-deep hover:-translate-y-0.5"
              >
                <InstagramGlyph className="size-4" />
                Follow
              </a>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-3 gap-2 md:gap-3">
            {galleryImages.map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl"
                  aria-label={`View ${img.alt} on Instagram`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 768px) 22vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/40 group-hover:opacity-100">
                    <InstagramGlyph className="size-7 text-white" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MenuBuilderFloat />

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/gallery-grazing.jpg"
          alt="A lush Urban Rasoi grazing table"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-white text-balance md:text-6xl">
              Hungry to plan? One message is all it takes.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton
                message={defaultWhatsappMessage}
                label="Chat on WhatsApp"
                size="large"
                className="justify-center"
              />
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-4 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
