import type { Metadata } from 'next'
import Image from 'next/image'
import { PujaBooking } from '@/components/puja-booking'
import { ReelPlayer } from '@/components/reel-player'
import { Reveal } from '@/components/reveal'
import { TelLink, WhatsAppLink } from '@/components/tracked-links'
import { BASE_PAX, BASE_PRICE, STEP_PRICE, STEP_PAX, formatINR, inclusions, pujaMenu } from '@/lib/puja-menu'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Rudra Abhishek Puja Catering in Kolkata | Satvik Menu from ₹30,000 — Urban Rasoi',
  description:
    'Satvik family get-together catering for Rudra Abhishek and Sawan pujas in Kolkata. No onion, no garlic. ₹30,000 for 40 guests including 2 kitchen staff, 2 stewards and disposables. Check your date on WhatsApp.',
  alternates: { canonical: '/rudrabhishek-catering' },
  openGraph: {
    title: 'Rudra Abhishek Puja Catering in Kolkata | Urban Rasoi',
    description:
      'You stay in the puja. We take care of the bhojan. Satvik family get-together catering from ₹30,000 for 40 guests — staff and disposables included.',
    url: '/rudrabhishek-catering',
    images: ['/images/gallery-diwali.jpg'],
  },
}

const whatsappMessage = `Hi Urban Rasoi! 🙏 I am planning a Rudra Abhishek puja at home and would like the Sawan family get-together menu.

🗓️ Puja date:
👥 Approx. guests:
📍 Area in Kolkata:

Please share availability and details.`

const gallery = [
  { src: '/images/gallery-diwali.jpg', alt: 'Festive home puja gathering catered by Urban Rasoi' },
  { src: '/images/gallery-bengali.jpg', alt: 'Traditional satvik dishes served at a home puja' },
  { src: '/images/gallery-houseparty.jpg', alt: 'Family get-together spread laid out at home' },
  { src: '/images/gallery-spread.jpg', alt: 'Urban Rasoi festive spread' },
]

const trustPoints = [
  { value: 'Satvik', label: 'No onion, no garlic' },
  { value: 'Since 2015', label: 'Cooking for Kolkata' },
  { value: site.community, label: 'Families served' },
  { value: 'FSSAI', label: 'Licensed kitchen' },
]

const faqs = [
  {
    question: 'What exactly is included in the price?',
    answer: `The full menu for your guest count, 2 kitchen staff who cook and finish on-site, 2 stewards who serve your guests, and all disposables — plates, cutlery and serveware. ${formatINR(BASE_PRICE)} covers ${BASE_PAX} guests, and every additional ${STEP_PAX} guests is ${formatINR(STEP_PRICE)}.`,
  },
  {
    question: 'Is the food strictly satvik?',
    answer: 'Yes. Everything on this menu is pure vegetarian and cooked without onion or garlic, so it is suitable to serve after the puja. Ekadashi (vrat) cuisine is available on request.',
  },
  {
    question: 'Can you serve right after the puja finishes?',
    answer: 'Yes. Tell us your muhurat and we plan backwards from it — our team arrives early, sets up quietly and is ready to serve the moment the puja ends.',
  },
  {
    question: 'Can the menu be changed?',
    answer: 'The menu is designed to balance a Sawan gathering, but we can swap dishes for family preferences, allergies or regional tastes. Mention it on WhatsApp and we will adjust.',
  },
  {
    question: 'How far in advance should we book?',
    answer: 'Sawan Mondays and Ekadashi dates fill fastest, so as early as you can. Send your date and we will confirm availability straight away.',
  },
  {
    question: 'Do you cater outside central Kolkata?',
    answer: 'We serve across Kolkata. For locations well outside the centre, a small travel charge may apply — we will tell you upfront before you confirm.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Sawan · Rudra Abhishek Family Get-Together Catering',
  description:
    'Satvik (no onion, no garlic) family get-together catering for Rudra Abhishek and Sawan pujas in Kolkata. Includes 2 kitchen staff, 2 stewards and disposables.',
  brand: { '@type': 'Brand', name: site.name },
  image: `${site.url}/images/gallery-diwali.jpg`,
  offers: {
    '@type': 'Offer',
    price: BASE_PRICE,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${site.url}/rudrabhishek-catering`,
    description: `${formatINR(BASE_PRICE)} for ${BASE_PAX} guests, ${formatINR(STEP_PRICE)} per additional ${STEP_PAX} guests`,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function RudrabhishekCateringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative min-h-[600px] overflow-hidden md:min-h-[660px]">
        <Image
          src="/images/gallery-diwali.jpg"
          alt="Satvik food served at a home puja in Kolkata"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-end px-5 pb-10 pt-28 md:min-h-[660px] md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">Sawan · Rudra Abhishek · Kolkata</p>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1.05] text-primary-foreground text-balance md:text-6xl">
              You stay in the puja. We take care of the bhojan.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              Satvik family get-together catering — no onion, no garlic. {formatINR(BASE_PRICE)} for {BASE_PAX} guests,
              with kitchen staff, stewards and disposables included.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#book"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                See menu & price <span aria-hidden="true">→</span>
              </a>
              <WhatsAppLink
                placement="puja-hero"
                occasion="Rudra Abhishek Puja"
                message={whatsappMessage}
                className="flex items-center justify-center rounded-full border border-primary-foreground/40 px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-ink"
              >
                Check my date
              </WhatsAppLink>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary-foreground/85">
              <li className="flex items-center gap-2"><span className="text-terracotta-light" aria-hidden="true">✓</span> Satvik kitchen</li>
              <li className="flex items-center gap-2"><span className="text-terracotta-light" aria-hidden="true">✓</span> Staff & disposables included</li>
              <li className="flex items-center gap-2"><span className="text-terracotta-light" aria-hidden="true">✓</span> Limited Sawan dates</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="Why families choose Urban Rasoi" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.value} className="border-border px-3 py-4 text-center odd:border-r md:border-r md:px-5 md:py-5 md:last:border-r-0">
              <p className="font-serif text-lg font-semibold text-ink md:text-xl">{point.value}</p>
              <p className="mt-1 text-xs text-ink-soft md:text-sm">{point.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu + booking */}
      <PujaBooking />

      {/* What's included */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-4xl">
            One price. Nothing left for you to arrange.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inclusions.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 md:p-6">
                <span className="font-serif text-2xl text-terracotta/30">0{index + 1}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof: photos + reel */}
      <section className="bg-cream py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="section-label">From our kitchen to your puja</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
              How the table looks when we are done.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {gallery.map((image, index) => (
                <Reveal key={image.src} delay={index * 60}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="img-zoom object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <ReelPlayer
                src="/media/house-party-reel.mp4"
                poster="/images/gallery-houseparty.jpg"
                caption="How our house party catering works"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Good to know.</h2>
          </Reveal>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 md:px-7">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-ink marker:content-none">
                  {faq.question}
                  <span className="text-terracotta transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pt-3 leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <Image src="/images/gallery-bengali.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/82" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-28">
          <Reveal>
            <p className="section-label text-terracotta-light">Sawan dates fill fast</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-primary-foreground text-balance md:text-6xl">
              {pujaMenu.closingLine[0]}
              <br />
              {pujaMenu.closingLine[1]}
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#book"
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Book my date <span aria-hidden="true">→</span>
              </a>
              <TelLink placement="puja-final" className="flex items-center justify-center rounded-full border border-primary-foreground/30 px-6 py-4 font-medium text-primary-foreground hover:bg-primary-foreground/10">
                Call {site.phone}
              </TelLink>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/55">{site.fssai} · {site.location}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
