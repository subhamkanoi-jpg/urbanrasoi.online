import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'

export function ProductLanding({ product }: { product: Product }) {
  return (
    <>
      {/* ── FULLSCREEN HERO ──────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[580px] overflow-hidden">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          priority
          className={cn('object-cover', product.heroImagePosition)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        {/* Content — pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-20">
          <Reveal>
            <p className="section-label text-terracotta-light">{product.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.07] tracking-tight text-white text-balance md:text-6xl">
              {product.headline}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {product.promise}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
                size="large"
              />
              {product.builderCta && (
                <a
                  href={product.builderCta.href}
                  className="rounded-full border border-white/40 px-6 py-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
                >
                  {product.builderCta.label} →
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border">
          {[
            { value: `Since ${site.foundedYear}`, label: 'Crafting food' },
            { value: `${site.rating}★`, label: 'Customer rating' },
            { value: 'FSSAI', label: 'Certified kitchen' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 py-6 px-4 text-center">
              <p className="font-serif text-xl font-semibold text-ink">{item.value}</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ink-soft">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <section aria-label={`${product.name} gallery`} className="bg-cream py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {product.gallery.map((img, i) => (
              <Reveal key={img.src} delay={i * 70}>
                <div className={cn(
                  'relative overflow-hidden rounded-2xl',
                  i === 0 ? 'aspect-[4/3]' : 'aspect-square',
                )}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="img-zoom object-cover"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <p className="section-label">What you get</p>
        </Reveal>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.included.map((item, i) => (
            <Reveal key={item.title} delay={i * 45}>
              <li className="flex items-center gap-3 rounded-xl bg-cream px-5 py-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-terracotta/15 font-serif text-xs font-semibold text-terracotta">
                  {`0${i + 1}`}
                </span>
                <p className="font-serif text-sm font-semibold text-ink">{item.title}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="section-label">How it works</p>
          </Reveal>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {product.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="flex items-center gap-4 rounded-xl bg-card px-6 py-5" style={{ boxShadow: '0 1px 8px rgba(30,20,11,0.06)' }}>
                  <span className="font-serif text-3xl font-semibold leading-none text-terracotta/25 tabular-nums">
                    {`0${i + 1}`}
                  </span>
                  <p className="font-serif text-base font-semibold text-ink">{step.title}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          className={cn('object-cover', product.heroImagePosition)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-white text-balance md:text-6xl">
              {product.closingHeadline}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
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
