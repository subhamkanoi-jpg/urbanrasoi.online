import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'

export function ProductLanding({ product }: { product: Product }) {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full">
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            priority
            className={cn('object-cover', product.heroImagePosition)}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-5 pb-14 md:px-8 md:pb-20">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
                  {product.eyebrow}
                </p>
                <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-background text-balance md:text-6xl">
                  {product.headline}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-background/85 md:text-lg">
                  {product.promise}
                </p>
                <div className="mt-8">
                  <WhatsAppButton
                    message={product.whatsappMessage}
                    label={product.ctaLabel}
                    size="large"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + trust */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-20">
          <Reveal className="flex-1">
            <h2 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-ink text-balance md:text-3xl">
              {product.description}
            </h2>
          </Reveal>
          <Reveal delay={100} className="md:w-64 md:shrink-0">
            <ul className="flex flex-col gap-4 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <li>
                <p className="font-serif text-xl font-semibold text-ink">Since {site.foundedYear}</p>
                <p className="text-xs uppercase tracking-widest text-ink-soft">A decade of craft</p>
              </li>
              <li>
                <p className="font-serif text-xl font-semibold text-ink">{site.rating} rated</p>
                <p className="text-xs uppercase tracking-widest text-ink-soft">By our customers</p>
              </li>
              <li>
                <p className="font-serif text-xl font-semibold text-ink">FSSAI certified</p>
                <p className="text-xs uppercase tracking-widest text-ink-soft">{site.location} kitchen</p>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              What you get
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Everything, thoughtfully handled.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.included.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <li className="flex flex-col gap-2 border-t border-border pt-5">
                  <p className="font-serif text-lg font-semibold text-ink">
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {item.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
            How it works
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Three steps to done.
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {product.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <li className="flex flex-col gap-3">
                <p className="font-serif text-4xl font-semibold text-terracotta">
                  {`0${i + 1}`}
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
      </section>

      {/* Gallery */}
      <section aria-label={`${product.name} gallery`} className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {product.gallery.map((img, i) => (
            <Reveal key={img.src} delay={i * 80}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink py-20 text-background md:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-balance md:text-5xl">
              {product.closingHeadline}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-background/70">
              {product.closingCopy}
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton
                message={product.whatsappMessage}
                label={product.ctaLabel}
                size="large"
              />
            </div>
            <p className="mt-6 text-xs uppercase tracking-widest text-background/50">
              Or call us at {site.phone}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
