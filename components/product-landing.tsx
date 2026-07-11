import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'

const serviceFit: Record<string, string[]> = {
  'grazing-tables': ['Starts at 15 guests', 'Styling and setup included', 'Designed for relaxed grazing'],
  'house-parties': ['Intimate dinners to full-house parties', 'Vegetarian, non-vegetarian or mixed', 'Delivery ready to serve'],
  corporate: ['10 to 200+ guests', 'Buffets, boxes or platters', 'Meetings, celebrations and client events'],
  'packed-meals': ['20 to 500+ boxes', 'One-time, weekly or daily', 'Fresh same-day cooking'],
}

export function ProductLanding({ product }: { product: Product }) {
  const facts = serviceFit[product.slug]

  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden md:h-[92svh]">
        <Image src={product.heroImage} alt={product.name} fill priority className={cn('object-cover', product.heroImagePosition)} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-12 pt-32 md:h-[92svh] md:px-10 md:pb-20">
          <Reveal>
            <div className="max-w-3xl">
              <p className="section-label text-terracotta-light">{product.eyebrow}</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground text-balance md:text-7xl">{product.headline}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">{product.promise}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {facts.map((fact) => <li key={fact} className="rounded-full border border-primary-foreground/25 bg-ink/25 px-3 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">{fact}</li>)}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton message={product.whatsappMessage} label={product.ctaLabel} size="large" className="justify-center" />
                {product.builderCta && <a href={product.builderCta.href} className="flex items-center justify-center rounded-full border border-primary-foreground/40 px-6 py-4 font-semibold text-primary-foreground hover:bg-primary-foreground hover:text-ink">{product.builderCta.label} →</a>}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-16">
          <Reveal><h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">{product.name}</h2></Reveal>
          <Reveal delay={80}><p className="text-lg leading-relaxed text-ink-soft">{product.description}</p></Reveal>
        </div>
      </section>

      <section aria-label={`${product.name} gallery`} className="bg-cream py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {product.gallery.map((image, index) => (
              <Reveal key={image.src} delay={index * 60}>
                <div className={cn('relative overflow-hidden rounded-2xl', index === 0 ? 'aspect-[4/3]' : 'aspect-square')}>
                  <Image src={image.src} alt={image.alt} fill className="img-zoom object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <Reveal>
          <p className="section-label">Included in the experience</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-5xl">What you get</h2>
        </Reveal>
        <ul className="mt-9 grid gap-4 md:grid-cols-2">
          {product.included.map((item, index) => (
            <Reveal key={item.title} delay={index * 45}>
              <li className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="mt-0.5 font-semibold text-terracotta" aria-hidden="true">✓</span>
                <div><h3 className="font-serif text-lg font-semibold text-ink">{item.title}</h3><p className="mt-2 leading-relaxed text-ink-soft">{item.detail}</p></div>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal><p className="section-label">From enquiry to event</p><h2 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-5xl">How it works</h2></Reveal>
          <ol className="mt-9 grid gap-4 md:grid-cols-3">
            {product.steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 70}>
                <li className="h-full rounded-2xl bg-card p-7">
                  <span className="font-serif text-3xl text-terracotta/30">0{index + 1}</span>
                  <h3 className="mt-8 font-serif text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{step.detail}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-5 text-center md:px-10">
          <p className="section-label">A customer note</p>
          <Reveal><blockquote className="mt-5 font-serif text-3xl font-semibold leading-snug text-ink text-balance md:text-5xl">“The flavors were perfect and everyone enjoyed the meal. Surely looking forward to ordering again.”</blockquote><p className="mt-5 text-sm text-ink-soft">Abhinav · customer message shared with permission</p></Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Image src={product.heroImage} alt="" fill className={cn('object-cover', product.heroImagePosition)} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/82" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-primary-foreground text-balance md:text-6xl">{product.closingHeadline}</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-primary-foreground/75">{product.closingCopy}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton message={product.whatsappMessage} label={product.ctaLabel} size="large" className="justify-center" />
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-center justify-center rounded-full border border-primary-foreground/30 px-6 py-4 font-medium text-primary-foreground hover:bg-primary-foreground/10">Call {site.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
