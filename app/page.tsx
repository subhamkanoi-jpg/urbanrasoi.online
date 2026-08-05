import Image from 'next/image'
import Link from 'next/link'
import { FAQSection, HowItWorks, TrustStrip } from '@/components/conversion-sections'
import { Reveal } from '@/components/reveal'
import { TelLink } from '@/components/tracked-links'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { products } from '@/lib/products'
import { site, structuredWhatsappMessage } from '@/lib/site'

const serviceFacts: Record<string, string> = {
  'house-parties': `From ${site.partyMenusFrom}/guest`,
  corporate: '10–200+ guests',
  'packed-meals': '20–500+ boxes',
}

const foodPhotos = [
  { src: '/images/gallery-spread.jpg', alt: 'Fresh quesadillas served with salsa' },
  { src: '/images/gallery-bengali.jpg', alt: 'A Bengali meal prepared by Urban Rasoi' },
  { src: '/images/gallery-baguette.jpg', alt: 'Freshly baked cheesy baguettes' },
]

export default function HomePage() {
  return (
    <>
      <main>
        <section className="relative min-h-[680px] overflow-hidden md:min-h-[720px]">
          <Image
            src="/images/gallery-diwali.jpg"
            alt="Urban Rasoi serving guests at a home celebration in Kolkata"
            fill
            priority
            quality={78}
            className="object-cover object-[center_42%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />

          <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-12 pt-28 md:min-h-[720px] md:px-10 md:pb-16">
            <Reveal>
              <div className="max-w-3xl">
                <p className="section-label text-terracotta-light">Home celebrations · Kolkata</p>
                <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-primary-foreground text-balance md:text-7xl">
                  Good food. No kitchen chaos.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                  Fresh party menus for get-togethers at home, delivered warm and ready to serve.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/plan?src=home-hero"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
                  >
                    Plan a get-together <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/order"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/50 bg-ink/20 px-7 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground hover:text-ink"
                  >
                    Order à la carte <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-primary-foreground/70">
                  Tell us your date and guest count. We usually reply within hours.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <TrustStrip />

        <Link
          href="/rakhi"
          className="group flex items-center justify-center gap-2 bg-terracotta px-5 py-3.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep"
        >
          Raksha Bandhan orders for 28 August
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
          <Reveal>
            <p className="section-label">Start here</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
              Pick the right fit for your gathering.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
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
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm font-semibold text-terracotta">{serviceFacts[product.slug]}</p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{product.shortName}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-semibold text-ink transition-all group-hover:gap-3 group-hover:text-terracotta">
                      View details <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-cream py-14 md:py-20" aria-labelledby="food-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-label">From our kitchen</p>
                  <h2 id="food-heading" className="mt-3 font-serif text-3xl font-semibold text-ink md:text-5xl">
                    Food your guests will remember.
                  </h2>
                </div>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-terracotta hover:text-terracotta-deep"
                >
                  See more on Instagram →
                </a>
              </div>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {foodPhotos.map((photo, index) => (
                <Reveal key={photo.src} delay={index * 60}>
                  <div className={`relative overflow-hidden rounded-2xl ${index === 2 ? 'col-span-2 aspect-[16/9] md:col-span-1 md:aspect-square' : 'aspect-square'}`}>
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 768px) 33vw, 50vw" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />
        <FAQSection />

        <section className="relative overflow-hidden">
          <Image
            src="/images/gallery-diwali.jpg"
            alt="Urban Rasoi catering at a home celebration"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/80" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-28">
            <Reveal>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-primary-foreground text-balance md:text-6xl">
                Tell us about your gathering.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
                Share your date, guest count and food preferences. We will suggest a menu that fits.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/plan?src=home-final"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
                >
                  Plan a get-together <span aria-hidden="true">→</span>
                </Link>
                <WhatsAppButton message={structuredWhatsappMessage} label="Chat on WhatsApp" placement="home-final-cta" variant="light" size="large" className="justify-center" />
              </div>
              <p className="mt-4 text-sm text-primary-foreground/60">
                Prefer to call? <TelLink placement="home-final-cta" className="font-semibold underline-offset-2 hover:underline">{site.phone}</TelLink>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  )
}
