import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { site, defaultWhatsappMessage } from '@/lib/site'

const stats = [
  { value: 'Since 2015', label: 'A decade of craft' },
  { value: '4.9', label: 'Customer rating' },
  { value: '2,000+', label: 'Community of food lovers' },
  { value: 'FSSAI', label: 'Certified kitchen' },
]

const galleryStrip = [
  { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
  { src: '/images/gallery-houseparty.jpg', alt: 'Buffet spread at a home celebration' },
  { src: '/images/gallery-diwali.jpg', alt: 'Live service at a festive gathering' },
  { src: '/images/gallery-spread.jpg', alt: 'Quesadillas from our grazing menu' },
  { src: '/images/gallery-event.jpg', alt: 'Dabeli sliders styled on a grazing board' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-16 pt-14 md:flex-row md:items-center md:gap-16 md:px-8 md:pb-24 md:pt-20">
          <div className="flex-1">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
                Cloud kitchen — {site.location}
              </p>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink text-balance md:text-6xl">
                Food that turns gatherings into memories.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                For ten years, our Kolkata kitchen has crafted grazing tables,
                party menus and meal boxes with one obsession — food your
                guests talk about long after the plates are cleared.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <WhatsAppButton
                  message={defaultWhatsappMessage}
                  label="Start planning on WhatsApp"
                  size="large"
                />
                <Link
                  href="/grazing-tables"
                  className="text-sm font-medium text-ink underline-offset-4 transition-colors hover:text-terracotta hover:underline"
                >
                  See our signature grazing tables
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={150} className="flex-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[3/4]">
              <Image
                src="/images/gallery-houseparty.jpg"
                alt="An Urban Rasoi buffet spread, styled and ready for guests"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section aria-label="Why Urban Rasoi" className="border-y border-border bg-cream">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 md:grid-cols-4 md:px-8 md:py-12">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <p className="font-serif text-2xl font-semibold text-ink md:text-3xl">
                {s.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-ink-soft">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-20">
          <Reveal className="flex-1">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/gallery-founder.jpg"
                alt="The founder and team at Urban Rasoi, passionate about food"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
          <div className="flex-1">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
                Our story
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink text-balance md:text-4xl">
                Ten years of one simple belief: food made with passion tastes
                different.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                Urban Rasoi began in 2015 with a founder who could not stop
                cooking for people. What started as a small kitchen in Salt
                Lake grew into one of Kolkata&apos;s most loved cloud kitchens
                — not by chasing trends, but by perfecting the food itself.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                Homestyle Indian, Bengali classics, South Indian, Indo-Chinese,
                Continental and desserts — six cuisines, one standard: would we
                serve this at our own table?
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              What we craft
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight tracking-tight text-ink text-balance md:text-4xl">
              Four ways to bring Urban Rasoi to your table.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <Link
                  href={`/${p.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-card transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.cardImage}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-xs uppercase tracking-widest text-terracotta">
                      {`0${i + 1}`} — {p.eyebrow}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {p.promise}
                    </p>
                    <p className="mt-5 text-sm font-medium text-ink transition-colors group-hover:text-terracotta">
                      Explore {p.shortName.toLowerCase()} →
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section aria-label="From our kitchen" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                From our kitchen, lately.
              </h2>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
              >
                Follow {site.instagramHandle} →
              </a>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
            {galleryStrip.map((img, i) => (
              <Reveal
                key={img.src}
                delay={i * 80}
                className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(min-width: 768px) 20vw, 50vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink py-20 text-background md:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Let&apos;s plan something delicious
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance md:text-5xl">
              One message is all it takes.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-background/70">
              Tell us your occasion, date and guest count on WhatsApp — we will
              take it from there, the way we have for ten years.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton
                message={defaultWhatsappMessage}
                label="Chat with Urban Rasoi"
                size="large"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
