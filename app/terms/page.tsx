import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of use | Urban Rasoi',
  description: 'Terms for using urbanrasoi.online and booking catering with Urban Rasoi in Kolkata.',
  alternates: { canonical: '/terms' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <p className="section-label">Urban Rasoi</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Terms of use</h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: August 2026</p>

      <p className="mt-6 leading-relaxed text-ink-soft">
        By using {site.url.replace('https://', '')} or sending us an enquiry you agree to these terms. Urban Rasoi
        provides vegetarian catering from our kitchen in {site.location}.
      </p>

      <Section title="Orders and quotes">
        <p>
          Sending an order or party plan on WhatsApp is a request, not a confirmed booking. We confirm availability,
          the final menu and the price on WhatsApp before we cook. Totals shown on the site are estimates and exclude
          delivery unless we say otherwise.
        </p>
      </Section>

      <Section title="Your responsibilities">
        <ul className="ml-5 list-disc space-y-2">
          <li>Give us a reachable number, the event date, guest count and area.</li>
          <li>Tell us about allergies and dietary needs before we confirm.</li>
          <li>Be ready to receive delivery or collect pickup at the time we agree.</li>
        </ul>
      </Section>

      <Section title="Photos">
        <p>
          We may photograph food and events for our website and social channels. Tell us before the event if you do
          not want faces or your home to appear.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          WhatsApp or call {site.phone}. {site.location}. {site.fssai}.
        </p>
      </Section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-terracotta">
        <Link href="/" className="underline-offset-2 hover:underline">← Home</Link>
        <Link href="/privacy" className="underline-offset-2 hover:underline">Privacy</Link>
        <Link href="/refund" className="underline-offset-2 hover:underline">Refunds</Link>
      </div>
    </main>
  )
}
