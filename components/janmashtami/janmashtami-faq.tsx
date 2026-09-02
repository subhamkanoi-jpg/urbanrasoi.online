'use client'

import { useState } from 'react'
import { Reveal } from '@/components/reveal'

const faqs = [
  {
    q: 'When can I order?',
    a: 'Orders are accepted only on 3rd and 4th September.',
  },
  {
    q: 'Is this available only for Janmashtami?',
    a: 'Yes. This is a limited Janmashtami special by Urban Rasoi.',
  },
  {
    q: 'Is Urban Rasoi vegetarian?',
    a: 'Yes. Urban Rasoi operates a 100% vegetarian kitchen.',
  },
  {
    q: 'Where do you deliver?',
    a: 'Across Kolkata, subject to delivery availability for the supplied pincode.',
  },
  {
    q: 'Can I choose my delivery date?',
    a: 'Yes. Customers can choose 3rd or 4th September, subject to available delivery slots.',
  },
  {
    q: 'Can I place an order for multiple boxes?',
    a: 'Yes. Quantity should be selectable during checkout.',
  },
]

export function JanmashtamiFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx))
  }

  return (
    <section id="faq" className="bg-cream py-20 md:py-28" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
              Questions & Answers
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm text-ink-soft md:text-base">
              Everything you need to know about our Janmashtami offering.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.q} delay={i * 50}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-cream/40"
                  >
                    <span className="font-serif text-lg font-semibold text-ink sm:text-xl">
                      {faq.q}
                    </span>
                    <span
                      className={`ml-4 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-terracotta text-primary-foreground border-terracotta' : 'bg-background'
                      }`}
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className="border-t border-border/60 bg-cream/30 px-6 py-5"
                    >
                      <p className="text-base leading-relaxed text-ink-soft">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
