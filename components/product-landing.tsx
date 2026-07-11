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
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          priority
          className={cn('object-cover', product.heroImagePosition)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/15" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-20">
          <Reveal>
            <p className="section-label text-terracotta-light">{product.eyebrow}</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-[1.07] tracking-tight text-white text-balance md:text-6xl">
              {product.name}
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
                size="large"
                className="justify-center"
              />
              {product.builderCta && (
                <a
                  href={product.builderCta.href}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-4 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
                >
                  {product.builderCta.label} →
                </a>
              )}
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

      {/* ── WHAT'S INCLUDED (scannable chips) ────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">What you get</h2>
        </Reveal>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {product.included.map((item, i) => (
            <Reveal key={item.title} delay={i * 40}>
              <li className="flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 font-serif text-sm font-semibold text-ink">
                <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
                {item.title}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── HOW TO ORDER (3 quick steps) ─────────────────────── */}
      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">How to order</h2>
          </Reveal>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {product.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
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
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
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
