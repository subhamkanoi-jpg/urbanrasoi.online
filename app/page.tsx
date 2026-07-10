import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { site, defaultWhatsappMessage } from '@/lib/site'

const stats = [
  { value: 'Since 2015', label: 'A decade of craft' },
  { value: '4.9★', label: 'Customer rating' },
  { value: '2,000+', label: 'Happy guests served' },
  { value: 'FSSAI', label: 'Certified kitchen' },
]

const galleryImages = [
  { src: '/images/gallery-spread.jpg',     alt: 'Gourmet grazing spread', span: 'col-span-2 row-span-2' },
  { src: '/images/gallery-baguette.jpg',   alt: 'Freshly baked baguettes' },
  { src: '/images/gallery-diwali.jpg',     alt: 'Festive spread' },
  { src: '/images/gallery-bengali.jpg',    alt: 'Bengali classics' },
  { src: '/images/gallery-minipartay.jpg', alt: 'Mini party platter' },
  { src: '/images/gallery-packedmeal.jpg', alt: 'Packed meal box' },
]

const TICKER_ITEMS = [
  'Grazing Tables',
  'House Parties',
  'Corporate Catering',
  'Packed Meals',
  'Bengali Classics',
  'Continental Spreads',
  'Festive Menus',
  'Fresh Daily',
]

export default function HomePage() {
  return (
    <>
      {/* ── FULLSCREEN HERO ──────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/gallery-houseparty.jpg"
          alt="An Urban Rasoi feast, beautifully styled"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" />

        {/* Content — pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">
              Cloud kitchen — {site.location}
            </p>
            <h1 className="mt-4 font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white text-balance md:text-7xl md:max-w-3xl">
              Food that turns gatherings into memories.
            </h1>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <WhatsAppButton
                message={defaultWhatsappMessage}
                label="Order on WhatsApp"
                size="large"
              />
              <Link
                href="/grazing-tables"
                className="rounded-full border border-white/40 px-6 py-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
              >
                See our menus
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TICKER TAPE ──────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-border bg-cream py-3.5">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-6 font-serif text-sm font-medium italic text-ink-soft">
                {item}
                <span className="size-1.5 rounded-full bg-terracotta not-italic" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAND ───────────────────────────────────────── */}
      <section aria-label="Why Urban Rasoi" className="bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5 bg-cream px-6 py-8 md:px-10 md:py-10">
              <p className="font-serif text-2xl font-semibold text-ink md:text-3xl">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          {/* Image */}
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[3/4]">
              <Image
                src="/images/gallery-kitchen.jpg"
                alt="Inside the Urban Rasoi kitchen"
                fill
                className="img-zoom object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 rounded-xl bg-cream/90 px-4 py-3 backdrop-blur-sm">
                <p className="font-serif text-sm font-semibold text-ink">Since 2015</p>
                <p className="text-xs text-ink-soft">Salt Lake, Kolkata</p>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={100}>
            <p className="section-label">Our story</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-snug tracking-tight text-ink text-balance md:text-4xl">
              Ten years of one simple belief — food made with passion tastes different.
            </h2>
            <p className="mt-5 text-sm uppercase tracking-widest text-ink-soft">
              Salt Lake, Kolkata &nbsp;·&nbsp; FSSAI Certified &nbsp;·&nbsp; Since 2015
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── OFFERINGS ────────────────────────────────────────── */}
      <section className="bg-cream py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="section-label">What we craft</p>
          </Reveal>

          {/* Bento grid of offerings */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  href={`/${p.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-card"
                  style={{ boxShadow: '0 2px 16px 0 rgba(30,20,11,0.07)' }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.cardImage}
                      alt={p.name}
                      fill
                      className="img-zoom object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    {/* Badge on image */}
                    <div className="absolute top-3 left-3 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      {p.eyebrow}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex items-center justify-between px-5 py-4 md:px-6">
                    <h3 className="font-serif text-lg font-semibold text-ink md:text-xl">
                      {p.name}
                    </h3>
                    <span className="text-sm font-semibold text-terracotta transition-all group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY MOSAIC ───────────────────────────────────── */}
      <section aria-label="From our kitchen" className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="section-label">From our kitchen</p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
              >
                {site.instagramHandle}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>

          {/* Mosaic grid */}
          <div className="mt-8 grid grid-cols-3 grid-rows-2 gap-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <Reveal
                key={img.src}
                delay={i * 60}
                className={i === 0 ? 'col-span-2 row-span-2' : ''}
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-xl',
                    i === 0 ? 'aspect-[4/3] md:aspect-[4/3]' : 'aspect-square',
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="img-zoom object-cover"
                    sizes={i === 0 ? '(min-width: 768px) 45vw, 65vw' : '(min-width: 768px) 22vw, 33vw'}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="bg-cream py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: '✓', title: 'FSSAI Certified' },
              { icon: '★', title: '4.9 Customer Rating' },
              { icon: '♥', title: 'Made Fresh Daily' },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="flex items-center gap-4 rounded-2xl bg-card px-6 py-5" style={{ boxShadow: '0 1px 8px rgba(30,20,11,0.06)' }}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-terracotta/10 font-serif text-base text-terracotta">
                    {item.icon}
                  </span>
                  <p className="font-serif text-base font-semibold text-ink">{item.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
              One message is all it takes.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WhatsAppButton
                message={defaultWhatsappMessage}
                label="Chat on WhatsApp"
                size="large"
              />
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
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

// Helper needed inside server component
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
