import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Urban Rasoi',
  description:
    'How Urban Rasoi collects and uses your information, including cookies used for analytics and advertising.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const updated = 'August 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <p className="section-label">Urban Rasoi</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: {updated}</p>

      <p className="mt-6 leading-relaxed text-ink-soft">
        Urban Rasoi (“we”, “us”) runs {site.url.replace('https://', '')} and provides catering across Kolkata. This
        page explains what information we collect when you use our website, how we use it, and the choices you have.
      </p>

      <Section title="Information you give us">
        <p>
          When you send an enquiry or place an order — through our WhatsApp button, the order and planning tools, or by
          phone — you share details such as your name, contact number, event date, guest count, area and any
          preferences or notes. We use these only to respond to you and to arrange your order.
        </p>
      </Section>

      <Section title="Information collected automatically">
        <p>
          Like most websites, we collect some technical information automatically when you visit — such as your device
          type, browser, approximate location and the pages you view. This helps us keep the site working well and
          understand what our visitors find useful.
        </p>
      </Section>

      <Section title="Cookies and similar technologies">
        <p>
          Cookies are small files stored on your device. We use them for two purposes:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong className="text-ink">Essential cookies</strong> that remember your progress — for example, an order
            you are building — so the site works as you expect.
          </li>
          <li>
            <strong className="text-ink">Analytics and advertising cookies</strong>, including the Meta (Facebook) Pixel,
            which help us measure how our Facebook and Instagram ads perform and show relevant ads to people who may be
            interested in our catering.
          </li>
        </ul>
        <p>
          You can control or delete cookies through your browser settings, and you can manage the ads you see from Meta
          in your{' '}
          <a
            href="https://www.facebook.com/adpreferences"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-terracotta underline-offset-2 hover:underline"
          >
            Facebook ad preferences
          </a>
          . Blocking cookies may affect how parts of the site work.
        </p>
      </Section>

      <Section title="How we use your information">
        <ul className="ml-5 list-disc space-y-2">
          <li>To respond to your enquiries and fulfil your orders.</li>
          <li>To improve our website, menus and service.</li>
          <li>To measure and improve our advertising, and to show ads to relevant audiences.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="Who we share it with">
        <p>
          We share information only with the services that help us run the business: Meta Platforms (for Facebook and
          Instagram advertising and WhatsApp messaging), and our website hosting provider. These providers process data
          on our behalf and under their own privacy terms.
        </p>
      </Section>

      <Section title="Keeping your information">
        <p>
          We keep enquiry and order details only as long as needed to serve you and to keep proper business records,
          after which they are deleted or anonymised.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. To make a
          request, or for anything about this policy, contact us on the details below.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          WhatsApp or call{' '}
          <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="font-semibold text-terracotta underline-offset-2 hover:underline">
            {site.phone}
          </a>
          . Urban Rasoi, {site.location}. {site.fssai}.
        </p>
      </Section>

      <p className="mt-10 text-sm text-ink-soft">
        We may update this policy from time to time; the date above shows when it last changed.
      </p>

      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-terracotta underline-offset-2 hover:underline">
          ← Back to Urban Rasoi
        </Link>
      </div>
    </main>
  )
}
