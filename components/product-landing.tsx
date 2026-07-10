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

      {/* ── INTRO + TRUST ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px] md:items-start">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-ink text-balance md:text-3xl">
              {product.description}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col gap-5 rounded-2xl bg-cream p-6 md:p-7">
              {[
                { value: `Since ${site.foundedYear}`, label: 'A decade of craft' },
                { value: `${site.rating}★ rated`, label: 'By our customers' },
                { value: 'FSSAI certified', label: `${site.location} kitchen` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-b border-border pb-5 last:border-0 last:pb-0">
                  <p className="font-serif text-lg font-semibold text-ink">{item.value}</p>
                  <p className="text-xs uppercase tracking-widest text-ink-soft">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
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
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <Reveal>
          <p className="section-label">What you get</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Everything, thoughtfully handled.
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.included.map((item, i) => (
            <Reveal key={item.title} delay={i * 55}>
              <li className="flex gap-4 rounded-2xl bg-cream p-5 md:p-6">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-terracotta/15 font-serif text-sm font-semibold text-terracotta">
                  {`0${i + 1}`}
                </span>
                <div>
                  <p className="font-serif text-base font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="section-label">How it works</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Three steps to done.
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {product.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <li className="relative flex flex-col gap-4 rounded-2xl bg-card p-6 md:p-8" style={{ boxShadow: '0 2px 16px rgba(30,20,11,0.07)' }}>
                  {/* Step number */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-5xl font-semibold leading-none text-terracotta/20">
                      {`0${i + 1}`}
                    </span>
                    {i < product.steps.length - 1 && (
                      <span className="hidden text-2xl text-border md:block" aria-hidden="true">→</span>
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-xl font-semibold text-ink">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                  </div>
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
            <p className="section-label text-terracotta-light">{product.eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-white text-balance md:text-6xl">
              {product.closingHeadline}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65">
              {product.closingCopy}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
                size="large"
              />
            </div>
            <p className="mt-5 text-xs uppercase tracking-widest text-white/40">
              Or call us at {site.phone}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
