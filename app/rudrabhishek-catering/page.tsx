import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { TelLink, WhatsAppLink } from '@/components/tracked-links'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Rudrabhishek Puja Catering in Kolkata | Satvik Bhog & Prasad — Urban Rasoi',
  description:
    'Satvik bhog, prasad and no onion–no garlic guest meals for Rudrabhishek and Rudra Abhishek puja at home in Kolkata. Delivered fresh before your muhurat — khichuri bhog, niramish thalis and packed prasad boxes.',
  alternates: { canonical: '/rudrabhishek-catering' },
  openGraph: {
    title: 'Rudrabhishek Puja Catering in Kolkata | Urban Rasoi',
    description:
      'Satvik bhog, prasad and guest meals for Rudrabhishek at home — no onion, no garlic, delivered before your muhurat.',
    url: '/rudrabhishek-catering',
    images: ['/images/gallery-diwali.jpg'],
  },
}

const whatsappMessage = `Hi Urban Rasoi! 🙏 I am planning a Rudrabhishek puja at home.

🗓️ Puja date:
🕐 Muhurat / delivery time:
👥 Guests:
🍽️ Need: Bhog & prasad / Guest thalis / Packed prasad boxes
📍 Area in Kolkata:

Please share the satvik menu and pricing.`

const bhogMenu = [
  { name: 'Bhoger Khichuri', detail: 'Gobindobhog rice & sona moong dal' },
  { name: 'Labra', detail: 'Slow-cooked mixed vegetables' },
  { name: 'Beguni & Aloo Bhaja', detail: 'Crisp, fried fresh' },
  { name: 'Tomato Khejur Chutney', detail: 'Sweet date & tomato' },
  { name: 'Payesh', detail: 'Gobindobhog rice kheer' },
  { name: 'Fruit & Mishti Platter', detail: 'For offering & prasad' },
]

const thaliMenu = [
  { name: 'Radhaballavi & Puri', detail: 'Soft, dal-stuffed' },
  { name: 'Chholar Dal', detail: 'With coconut slivers' },
  { name: 'Niramish Aloo Dum', detail: 'No onion, no garlic' },
  { name: 'Shahi Paneer', detail: 'Satvik, cream-rich' },
  { name: 'Basanti Pulao / Jeera Rice', detail: 'Fragrant, festive' },
  { name: 'Papad & Chutney', detail: 'The right crunch' },
  { name: 'Mishti Doi · Rasgulla · Halwa', detail: 'To end on a sweet note' },
]

const addOns = [
  'Brahmin bhojan thalis',
  'Packed prasad boxes · 20 to 500+',
  'Tea & snacks for visiting guests',
]

const promises = [
  'No onion, no garlic — pure satvik',
  'Cooked fresh on puja morning',
  'Delivered before your muhurat',
  'FSSAI-licensed kitchen',
]

const steps = [
  { marker: '01', title: 'Share your puja date', copy: 'Date, muhurat, guest count and area — one WhatsApp.' },
  { marker: '02', title: 'Lock the menu', copy: 'Bhog, guest thalis and prasad boxes, tailored to your family.' },
  { marker: '03', title: 'You devote, we deliver', copy: 'Food arrives fresh, on time, ready to offer and serve.' },
]

const faqs = [
  {
    question: 'Is the food strictly satvik?',
    answer: 'Yes — everything for puja orders is pure vegetarian and cooked without onion or garlic, prepared fresh on the morning of your puja.',
  },
  {
    question: 'Can you deliver before the muhurat?',
    answer: 'Yes. We confirm a delivery slot ahead of your muhurat, including early-morning slots for Shravan Mondays.',
  },
  {
    question: 'What group sizes do you serve?',
    answer: 'Bhog and guest thalis for intimate family pujas to large gatherings, and packed prasad boxes from 20 to 500+.',
  },
  {
    question: 'Can the menu be customised?',
    answer: 'Fully. These menus are indicative — tell us your family traditions and preferences on WhatsApp and we will shape the menu around them.',
  },
]

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Rudrabhishek Puja Catering Menu',
  description: 'Satvik bhog, prasad and no onion–no garlic guest meals for Rudrabhishek puja at home in Kolkata.',
  provider: { '@type': 'FoodEstablishment', name: site.name, url: site.url, telephone: site.phone },
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Bhog & Prasad',
      hasMenuItem: bhogMenu.map((item) => ({ '@type': 'MenuItem', name: item.name, description: item.detail })),
    },
    {
      '@type': 'MenuSection',
      name: 'Satvik Guest Thali',
      hasMenuItem: thaliMenu.map((item) => ({ '@type': 'MenuItem', name: item.name, description: item.detail })),
    },
  ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative min-h-[560px] overflow-hidden md:min-h-[640px]">
        <Image
          src="/images/gallery-diwali.jpg"
          alt="Festive satvik food served at a home puja in Kolkata"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-5 pb-10 pt-28 md:min-h-[640px] md:px-10 md:pb-16">
          <Reveal>
            <p className="section-label text-terracotta-light">Rudrabhishek · Shravan · Home pujas</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-primary-foreground text-balance md:text-6xl">
              You focus on the puja. The bhog is on us.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              Satvik bhog, prasad and guest meals — no onion, no garlic, delivered before your muhurat.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppLink
                placement="puja-hero"
                occasion="Rudrabhishek Puja"
                message={whatsappMessage}
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Get the puja menu <span aria-hidden="true">→</span>
              </WhatsAppLink>
              <TelLink placement="puja-hero" className="flex items-center justify-center rounded-full border border-primary-foreground/40 px-6 py-4 font-semibold text-primary-foreground hover:bg-primary-foreground hover:text-ink">
                Call {site.phone}
              </TelLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-label="Our satvik promise" className="border-b border-border bg-card">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {promises.map((promise) => (
            <li key={promise} className="flex items-center gap-2.5 border-border px-4 py-4 odd:border-r md:border-r md:px-6 md:py-5 md:last:border-r-0">
              <span className="shrink-0 font-semibold text-terracotta" aria-hidden="true">✓</span>
              <p className="text-sm font-medium text-ink">{promise}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20" aria-labelledby="menu-title">
        <Reveal>
          <p className="section-label">The puja menu</p>
          <h2 id="menu-title" className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            Bhog for the deity. Thalis for your guests.
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="section-label text-terracotta">Bhog & Prasad</p>
              <ul className="mt-5 divide-y divide-border">
                {bhogMenu.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
                    <p className="font-serif text-lg font-semibold text-ink">{item.name}</p>
                    <p className="text-right text-sm text-ink-soft">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="section-label text-terracotta">Satvik Guest Thali · No onion, no garlic</p>
              <ul className="mt-5 divide-y divide-border">
                {thaliMenu.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
                    <p className="font-serif text-lg font-semibold text-ink">{item.name}</p>
                    <p className="text-right text-sm text-ink-soft">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl bg-cream p-6 md:flex-row md:items-center md:p-7">
            <div>
              <p className="font-serif text-xl font-semibold text-ink">Add-ons</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium text-ink-soft">
                {addOns.map((addOn) => (
                  <li key={addOn} className="flex items-center gap-2">
                    <span className="text-terracotta" aria-hidden="true">✦</span> {addOn}
                  </li>
                ))}
              </ul>
            </div>
            <p className="shrink-0 text-sm text-ink-soft">Menus are indicative — fully customisable.</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-cream py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Three steps. Full devotion.</h2>
          </Reveal>
          <ol className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 70}>
                <li className="h-full rounded-2xl border border-border bg-card p-5 md:p-8">
                  <span className="font-serif text-2xl text-terracotta/30 md:text-3xl">{step.marker}</span>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-ink md:mt-6">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{step.copy}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

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

      <section className="relative overflow-hidden">
        <Image src="/images/gallery-bengali.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-28">
          <Reveal>
            <p className="section-label text-terracotta-light">Shravan Mondays fill fast</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-primary-foreground text-balance md:text-6xl">
              Your muhurat. Our kitchen.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppLink
                placement="puja-final-cta"
                occasion="Rudrabhishek Puja"
                message={whatsappMessage}
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Get the puja menu <span aria-hidden="true">→</span>
              </WhatsAppLink>
              <Link
                href="/plan?occasion=festive&src=puja-page"
                className="flex items-center justify-center rounded-full border border-primary-foreground/30 px-6 py-4 font-medium text-primary-foreground hover:bg-primary-foreground/10"
              >
                Plan a bigger celebration
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
