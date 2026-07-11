import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, Check, MessageCircle, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react'
import { CampaignWhatsappLink } from '@/components/campaign-whatsapp-link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Celebration Catering in Kolkata | Urban Rasoi',
  description: 'Plan birthdays, anniversaries, house parties, festive gatherings and corporate events in Kolkata with Urban Rasoi. Enquire on WhatsApp for a tailored menu.',
  alternates: { canonical: '/kolkata-catering' },
  openGraph: {
    title: 'Celebration Catering in Kolkata | Urban Rasoi',
    description: 'Fresh menus, thoughtful service and celebration catering across Kolkata. Tell us your date, guests and area on WhatsApp.',
    url: '/kolkata-catering',
    images: ['/images/og-image.jpg'],
  },
}

const occasions = [
  { title: 'Birthdays', image: '/images/gallery-minipartay.jpg' },
  { title: 'Anniversaries', image: '/images/gallery-spread.jpg' },
  { title: 'House parties', image: '/images/gallery-houseparty.jpg' },
  { title: 'Festive gatherings', image: '/images/gallery-diwali.jpg' },
  { title: 'Corporate events', image: '/images/gallery-corporate.jpg' },
  { title: 'Grazing tables', image: '/images/gallery-grazing.jpg' },
  { title: 'Packed meals', image: '/images/gallery-packedmeal.jpg' },
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
          <CampaignWhatsappLink
            placement="header"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-foreground/35 bg-ink/25 px-4 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-ink/45"
          >
            <MessageCircle aria-hidden="true" />
            WhatsApp
          </CampaignWhatsappLink>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[690px] overflow-hidden md:min-h-[760px]">
          <Image
            src="/images/gallery-event.jpg"
            alt="Urban Rasoi celebration catering setup in Kolkata"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/65" />
          <div className="relative mx-auto flex min-h-[690px] max-w-6xl items-end px-5 pb-12 pt-28 md:min-h-[760px] md:px-8 md:pb-20">
            <div className="max-w-3xl">
              <p className="section-label text-terracotta-light">Kolkata · Since 2015</p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.02] text-primary-foreground text-balance md:text-7xl">
                Food your celebration will be remembered for.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                Tailored menus, dependable delivery and thoughtful event service for gatherings across Kolkata.
              </p>
              <CampaignWhatsappLink
                placement="hero"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep sm:w-auto"
              >
                Plan my celebration
                <ArrowRight aria-hidden="true" />
              </CampaignWhatsappLink>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary-foreground/85">
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> Tailored menus</li>
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> 10+ years in Kolkata</li>
                <li className="flex items-center gap-2"><Check aria-hidden="true" /> FSSAI certified</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-background py-14 md:py-20" aria-labelledby="occasions-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="section-label">What are you planning?</p>
            <h2 id="occasions-title" className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">One message. A menu made around your occasion.</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {occasions.map((occasion, index) => (
                <CampaignWhatsappLink
                  key={occasion.title}
                  placement="occasion-card"
                  occasion={occasion.title}
                  className={index === occasions.length - 1 ? 'group relative col-span-2 min-h-44 overflow-hidden rounded-2xl md:col-span-1 md:min-h-60' : 'group relative min-h-44 overflow-hidden rounded-2xl md:min-h-60'}
                >
                  <Image src={occasion.image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-ink/45" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 font-serif text-lg font-semibold text-primary-foreground md:p-5 md:text-xl">
                    {occasion.title}
                    <ArrowRight aria-hidden="true" />
                  </span>
                </CampaignWhatsappLink>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream py-14 md:py-20" aria-labelledby="proof-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <div>
                <p className="section-label">Why hosts choose us</p>
                <h2 id="proof-title" className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Calm planning. Generous food. Reliable service.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">2015</p><p className="mt-1 text-xs text-ink-soft">Established</p></div>
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">7</p><p className="mt-1 text-xs text-ink-soft">Formats</p></div>
                  <div className="rounded-2xl bg-card p-4 text-center"><p className="font-serif text-2xl font-semibold text-ink">Kolkata</p><p className="mt-1 text-xs text-ink-soft">Based</p></div>
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
            <p className="section-label">Simple from here</p>
            <h2 id="steps-title" className="mt-3 font-serif text-3xl font-semibold text-ink md:text-5xl">Plan in three easy steps.</h2>
            <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
              {[
                { icon: MessageCircle, title: 'Tell us the basics', copy: 'Share your occasion, date, guest count and area on WhatsApp.' },
                { icon: UtensilsCrossed, title: 'Shape your menu', copy: 'We suggest food and service formats around your gathering.' },
                { icon: Sparkles, title: 'Enjoy the occasion', copy: 'We confirm the details and handle the food with care.' },
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
            <p className="section-label mt-5 text-terracotta-light">Your date starts with one message</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-balance md:text-6xl">Let&apos;s plan something your guests will love.</h2>
            <p className="mt-5 max-w-xl text-primary-foreground/75">Tell us the date, guest count and Kolkata area. We&apos;ll guide you to the right menu and service format.</p>
            <CampaignWhatsappLink
              placement="final-cta"
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep sm:w-auto"
            >
              Enquire on WhatsApp
              <ArrowRight aria-hidden="true" />
            </CampaignWhatsappLink>
            <p className="mt-5 text-xs text-primary-foreground/55">FSSAI 12823013000353 · Kolkata</p>
          </div>
        </section>
      </main>
    </>
  )
}
