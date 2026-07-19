import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react'
import { MaharajComparison } from '@/components/maharaj-comparison'
import { WhatsAppLink } from '@/components/tracked-links'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Get-Together & Party Catering in Kolkata | Urban Rasoi',
  description:
    'Skip the maharaj. Gourmet, chef-crafted party food for get-togethers, birthdays and house parties across Kolkata — delivered or fully served, your kitchen stays spotless. Enquire on WhatsApp.',
  alternates: { canonical: '/kolkata-catering' },
  openGraph: {
    title: 'Get-Together & Party Catering in Kolkata | Urban Rasoi',
    description:
      'Gourmet party food without the maharaj headache — chef-crafted menus, spotless execution and dependable service across Kolkata. Tell us your date, guests and area on WhatsApp.',
    url: '/kolkata-catering',
    images: ['/images/og-image.jpg'],
  },
}

const occasions = [
  { title: 'Get-togethers', image: '/images/gallery-houseparty.jpg', planner: 'house-party' },
  { title: 'Birthdays', image: '/images/gallery-minipartay.jpg', planner: 'birthday' },
  { title: 'Anniversaries', image: '/images/gallery-spread.jpg', planner: 'anniversary' },
  { title: 'Festive gatherings', image: '/images/gallery-diwali.jpg', planner: 'festive' },
  { title: 'Corporate events', image: '/images/gallery-corporate.jpg', planner: 'office' },
  { title: 'Grazing tables', image: '/images/gallery-grazing.jpg', planner: 'grazing' },
  { title: 'Packed meals', image: '/images/gallery-packedmeal.jpg', planner: null },
]

const testimonials = [
  { quote: 'The quantity was sufficient, the flavours were perfect, and everyone enjoyed the meal.', name: 'Abhinav' },
  { quote: 'Everything was delicious and well packed. Delivery was smooth and on time.', name: 'Asha' },
  { quote: 'The food was very nice, and the service staff was very helpful.', name: 'Prirti' },
]

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: site.name,
  url: `${site.url}/kolkata-catering`,
  telephone: site.phone,
  image: `${site.url}/images/og-image.jpg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'City', name: 'Kolkata' },
  servesCuisine: ['Indian', 'Continental', 'Vegetarian'],
  slogan: 'Crafted food experiences in Kolkata since 2015',
}

export default function KolkataCateringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />

      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <a href="#top" className="font-serif text-xl font-semibold text-primary-foreground md:text-2xl">Urban Rasoi</a>
          <WhatsAppLink
            placement="campaign-header"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-foreground/35 bg-ink/25 px-4 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-ink/45"
          >
            <MessageCircle aria-hidden="true" />
            WhatsApp
          </WhatsAppLink>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[690px] overflow-hidden md:min-h-[760px]">
          <Image
            src="/images/gallery-event.jpg"
            alt="Urban Rasoi gourmet party catering setup in Kolkata"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/65" />
          <div className="relative mx-auto flex min-h-[690px] max-w-6xl items-end px-5 pb-12 pt-28 md:min-h-[760px] md:px-8 md:pb-20">
            <div className="max-w-3xl">
              <p className="section-label text-terracotta-light">Party catering in Kolkata · Since 2015</p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.02] text-primary-foreground text-balance md:text-7xl">
                Skip the maharaj. Host in style.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                Gourmet party menus from {site.partyMenusFrom} a guest — delivered or served, zero kitchen chaos.
              </p>
              <Link
                href="/plan?src=campaign-hero"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep sm:w-auto"
              >
                Plan my party in 30 seconds
                <ArrowRight aria-hidden="true" />
              </Link>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary-foreground/85">
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> Never the same 10 dishes</li>
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> Kitchen stays spotless</li>
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> FSSAI · Since 2015</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-background py-14 md:py-20" aria-labelledby="occasions-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="section-label">What are you planning?</p>
            <h2 id="occasions-title" className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">One message. A menu made around your occasion.</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {occasions.map((occasion, index) => {
                const cardClass = index === occasions.length - 1 ? 'group relative col-span-2 min-h-44 overflow-hidden rounded-2xl md:col-span-1 md:min-h-60' : 'group relative min-h-44 overflow-hidden rounded-2xl md:min-h-60'
                const inner = (
                  <>
                    <Image src={occasion.image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-ink/45" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 font-serif text-lg font-semibold text-primary-foreground md:p-5 md:text-xl">
                      {occasion.title}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </>
                )
                return occasion.planner ? (
                  <Link key={occasion.title} href={`/plan?occasion=${occasion.planner}&src=campaign-card`} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <WhatsAppLink
                    key={occasion.title}
                    placement="occasion-card"
                    occasion={occasion.title}
                    message={`Hi Urban Rasoi, I am planning a celebration in Kolkata.\nOccasion: ${occasion.title}\nDate:\nGuest count:\nArea:\nPlease share suitable menu and service options.`}
                    className={cardClass}
                  >
                    {inner}
                  </WhatsAppLink>
                )
              })}
            </div>
          </div>
        </section>

        <MaharajComparison placement="campaign-comparison" />

        <section className="bg-cream py-14 md:py-20" aria-labelledby="proof-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <div>
                <p className="section-label">Why hosts choose us</p>
                <h2 id="proof-title" className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Calm planning. Generous food. Reliable service.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">2015</p><p className="mt-1 text-xs text-ink-soft">Established</p></div>
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">6</p><p className="mt-1 text-xs text-ink-soft">Cuisines</p></div>
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">2,000+</p><p className="mt-1 text-xs text-ink-soft">Hosts served</p></div>
                </div>
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
                {testimonials.map((testimonial) => (
                  <blockquote key={testimonial.name} className="flex min-w-[82%] snap-start flex-col justify-between rounded-2xl border border-border bg-card p-6 md:min-w-0">
                    <p className="font-serif text-xl leading-relaxed text-ink">“{testimonial.quote}”</p>
                    <footer className="mt-6 text-sm font-semibold text-terracotta">{testimonial.name}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-14 md:py-20" aria-labelledby="steps-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 id="steps-title" className="mt-3 font-serif text-3xl font-semibold text-ink md:text-5xl">Three steps. Zero stress.</h2>
            <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
              {[
                { icon: MessageCircle, title: 'Say hello', copy: 'WhatsApp us your date, guests and area.' },
                { icon: UtensilsCrossed, title: 'Pick your menu', copy: 'We tailor it. You approve it.' },
                { icon: Sparkles, title: 'Enjoy your party', copy: 'We cook, deliver and serve.' },
              ].map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-border bg-card p-5 md:p-7">
                  <div className="flex items-center justify-between text-terracotta"><step.icon aria-hidden="true" /><span className="font-serif text-2xl text-terracotta/35">0{index + 1}</span></div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-ink py-14 text-primary-foreground md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-5 text-center md:px-8">
            <ShieldCheck aria-hidden="true" className="text-terracotta-light" />
            <p className="section-label mt-5 text-terracotta-light">One message is all it takes</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-balance md:text-6xl">Your date. Our kitchen.</h2>
            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/plan?src=campaign-final"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep sm:w-auto"
              >
                Plan my party
                <ArrowRight aria-hidden="true" />
              </Link>
              <WhatsAppLink
                placement="campaign-final-cta"
                occasion="Get-together"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/35 px-7 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto"
              >
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
            <p className="mt-5 text-xs text-primary-foreground/55">FSSAI 12823013000353 · Kolkata</p>
          </div>
        </section>
      </main>
    </>
  )
}
