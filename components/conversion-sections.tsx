import { Reveal } from '@/components/reveal'
import { site } from '@/lib/site'

const trustPoints = [
  { value: 'Since 2015', label: 'Feeding Kolkata' },
  { value: site.community, label: 'Hosts served' },
  { value: `${site.rating}★`, label: 'Host rating' },
  { value: 'FSSAI', label: 'Licensed kitchen' },
]

const steps = [
  { marker: '01', title: 'Say hello', copy: 'WhatsApp us your date, guests and area.' },
  { marker: '02', title: 'Pick your menu', copy: 'We tailor it. You approve it.' },
  { marker: '03', title: 'Enjoy your party', copy: 'We cook, deliver and serve.' },
]

export const faqItems = [
  {
    question: 'How is Urban Rasoi different from calling a maharaj?',
    answer: 'Everything is cooked in our FSSAI-licensed kitchen and delivered or served at your venue. No mess, no repeats — chef-crafted menus across six cuisines, never oily-same-old.',
  },
  {
    question: 'What kinds of events do you cater?',
    answer: 'House parties, birthdays, anniversaries, festive gatherings, corporate meals, grazing tables and large celebrations — across Kolkata.',
  },
  {
    question: 'What is the minimum guest count?',
    answer: 'Grazing tables from 15 guests, corporate from 10, celebration menus from 25.',
  },
  {
    question: 'Can menus be customised for taste and diet?',
    answer: 'Yes — every menu is built around your occasion, preferences, allergies and dietary needs.',
  },
  {
    question: 'Do you provide setup and serving staff?',
    answer: 'Choose delivery, semi-catering, or full service with staff, crockery and setup.',
  },
  {
    question: 'How do I get a menu and quote?',
    answer: 'WhatsApp us your date, guest count and area — menu options and pricing usually follow within hours.',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Why customers choose Urban Rasoi" className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {trustPoints.map((point) => (
          <div key={point.value} className="border-border px-3 py-4 text-center odd:border-r md:border-r md:px-5 md:py-5 md:last:border-r-0">
            <p className="font-serif text-lg font-semibold text-ink md:text-xl">{point.value}</p>
            <p className="mt-1 text-xs text-ink-soft md:text-sm">{point.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <h2 className="max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">
            Three steps. Zero stress.
          </h2>
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
  )
}

export function FAQSection() {
  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[0.7fr_1.3fr] md:px-10">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Good to know.</h2>
        </Reveal>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 md:px-7">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-ink marker:content-none">
                {item.question}
                <span className="text-terracotta transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-2xl pt-3 leading-relaxed text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
