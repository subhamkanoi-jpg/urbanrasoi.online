import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { structuredWhatsappMessage } from '@/lib/site'

const trustPoints = [
  { value: 'Since 2015', label: 'Cooking for Kolkata' },
  { value: '2,000+', label: 'Customers served' },
  { value: 'FSSAI', label: 'Licensed kitchen' },
  { value: 'Real events', label: 'Real customer stories' },
]

const steps = [
  { marker: '01', title: 'Tell us your plan', copy: 'Share your date, guest count, area and food preferences.' },
  { marker: '02', title: 'Receive your options', copy: 'We suggest a suitable menu and service style for your celebration.' },
  { marker: '03', title: 'Host without the rush', copy: 'We cook fresh and deliver or set up as agreed for your event.' },
]

const confidencePoints = [
  'FSSAI-licensed Kolkata kitchen',
  'Menus tailored to the occasion',
  'Portions planned around your guest count',
  'Delivery or event service agreed in advance',
  'Menus tailored to your preferences',
  'A written menu shared before confirmation',
]

export const faqItems = [
  {
    question: 'How is Urban Rasoi different from calling a maharaj?',
    answer: 'Everything is cooked fresh in our FSSAI-licensed Salt Lake kitchen and delivered or served at your venue — no one takes over your kitchen and there is no mess to clean up. Menus are chef-crafted across six cuisines and tailored to your occasion, so it is never the same 10 dishes, and the food is gourmet and balanced rather than heavy and oily. The entire headache is ours.',
  },
  {
    question: 'What kinds of events do you cater?',
    answer: 'Urban Rasoi caters get-togethers, house parties, private dinners, birthdays, festive gatherings, corporate meals, grazing tables and larger celebrations in Kolkata.',
  },
  {
    question: 'What is the minimum guest count?',
    answer: 'It depends on the service. Grazing tables start at 15 guests, corporate catering starts at 10 guests, and the Celebration Menu builder starts at 25 guests.',
  },
  {
    question: 'Can the menu be customised?',
    answer: 'Yes. Share your occasion, preferences and dietary requirements on WhatsApp, and we will suggest suitable options from our Kolkata kitchen.',
  },
  {
    question: 'Can you accommodate dietary requirements?',
    answer: 'Share any allergies or dietary requirements when you enquire, and our team will guide you through suitable menu options.',
  },
  {
    question: 'Do you provide setup and serving staff?',
    answer: 'Selected services can include food delivery, semi-catering with kitchen and serving staff, or full catering with staff, cutlery, crockery and setup. Final inclusions are confirmed with your quote.',
  },
  {
    question: 'How do I get a menu and quote?',
    answer: 'Send your occasion, date, guest count, area, dietary preference and preferred service style on WhatsApp. This gives our team enough context to suggest the right next step.',
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

export function EarlyProof() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <Reveal>
          <div className="rounded-2xl bg-ink p-7 text-primary-foreground md:p-10">
            <p className="section-label text-terracotta-light">From a recent host</p>
            <blockquote className="mt-4 font-serif text-2xl font-semibold leading-snug text-balance md:text-4xl">
              “The food was very nice and the service staff was very helpful. Everyone seemed to be enjoying the food.”
            </blockquote>
            <p className="mt-5 text-sm text-primary-foreground/70">Prirti · customer message shared with permission</p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 md:p-10">
            <div>
              <span className="section-label" aria-hidden="true">Urban Rasoi</span>
              <h2 className="mt-5 font-serif text-3xl font-semibold text-ink text-balance">Built for hosts who want to enjoy their own event.</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">Real food, practical planning and a team that understands the details behind feeding a room full of guests.</p>
            </div>
            <a href="#celebrations" className="mt-7 inline-flex items-center gap-2 font-semibold text-terracotta hover:text-terracotta-deep">
              See real celebrations <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="section-label">Simple from the first message</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-ink text-balance md:text-5xl"><span className="md:hidden">Plan in three easy steps.</span><span className="hidden md:inline">A celebration should not begin with a complicated ordering process.</span></h2>
        </Reveal>
        <ol className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <li className="h-full rounded-2xl border border-border bg-card p-5 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="section-label">Step</span>
                  <span className="font-serif text-2xl text-terracotta/30 md:text-3xl">{step.marker}</span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-ink md:mt-8">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft md:mt-3 md:text-base">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ConfidenceSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-10">
        <Reveal>
          <div>
            <p className="section-label">Order with confidence</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Clear details before the cooking begins.</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">We use your guest count, occasion and service preference to guide the conversation—so expectations are aligned before confirmation.</p>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {confidencePoints.map((point, index) => (
            <Reveal key={point} delay={index * 45}>
              <div className="flex h-full gap-3 rounded-xl bg-cream p-5">
                <span className="mt-0.5 font-semibold text-terracotta" aria-hidden="true">✓</span>
                <p className="font-medium leading-relaxed text-ink">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.7fr_1.3fr] md:px-10">
        <Reveal>
          <div>
            <p className="section-label">Before you message us</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink text-balance md:text-5xl">Questions hosts usually ask.</h2>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">
              Send the event details once, and we can respond with better context.
            </p>
          </div>
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

export function QuoteCTA({ dark = false }: { dark?: boolean }) {
  return (
    <div className={dark ? 'text-primary-foreground' : 'text-ink'}>
      <WhatsAppButton
        message={structuredWhatsappMessage}
        label="Check availability & get menus"
        size="large"
        className="justify-center"
      />
    </div>
  )
}
