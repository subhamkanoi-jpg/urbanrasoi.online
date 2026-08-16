import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Refund policy | Urban Rasoi',
  description: 'How cancellations and refunds work for Urban Rasoi catering orders in Kolkata.',
  alternates: { canonical: '/refund' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <p className="section-label">Urban Rasoi</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Refund policy</h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: August 2026</p>

      <Section title="Before we confirm">
        <p>
          Enquiries and WhatsApp drafts are free to change or drop. Nothing is charged until we confirm the order
          with you.
        </p>
      </Section>

      <Section title="After confirmation">
        <p>
          Full refund if you cancel at least 48 hours before the agreed delivery or pickup time. Inside 48 hours we
          may keep the cost of ingredients already bought. No-shows and same-day cancellations are not refunded.
        </p>
      </Section>

      <Section title="If we cancel">
        <p>
          If we cannot fulfil a confirmed order we refund any advance in full and help you find another date if you
          want one.
        </p>
      </Section>

      <Section title="How to ask">
        <p>
          WhatsApp or call {site.phone} with the name and date on the order. Refunds of any advance go back the same
          way they were paid, usually within 5–7 business days after we approve them.
        </p>
      </Section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-terracotta">
        <Link href="/" className="underline-offset-2 hover:underline">← Home</Link>
        <Link href="/terms" className="underline-offset-2 hover:underline">Terms</Link>
        <Link href="/privacy" className="underline-offset-2 hover:underline">Privacy</Link>
      </div>
    </main>
  )
}
