import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { KitchenMap } from '@/components/kitchen-map'
import { alsoDelivered, hubPath, serviceAreas } from '@/lib/areas'
import { breadcrumbList, faqNode, webPageNode } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Catering Across Kolkata | Salt Lake Kitchen — Urban Rasoi',
  description:
    'Vegetarian catering delivered across Kolkata from AE-287, Salt Lake Sector 1. Salt Lake, New Town, South Kolkata, Howrah and Dum Dum — about 20 km from the kitchen. From ₹749 a guest.',
  alternates: { canonical: hubPath },
  openGraph: {
    title: 'Catering Across Kolkata | Urban Rasoi',
    description:
      'We cook in Salt Lake Sector 1 and deliver vegetarian party food across Kolkata. Check your neighbourhood and send the pin code.',
    url: hubPath,
    type: 'article',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Urban Rasoi delivers vegetarian catering across Kolkata' }],
  },
}

const faqs = [
  {
    question: 'How far from Salt Lake do you deliver?',
    answer: `About ${site.deliveryRadiusKm} km from the kitchen at ${site.address.street} — Salt Lake, New Town, Rajarhat, South Kolkata, Howrah and Dum Dum. WhatsApp the pin code and we confirm the slot.`,
  },
  {
    question: 'Is there an extra charge for far areas?',
    answer:
      'Published menu prices stay the same. Longer runs (South Kolkata, Howrah) just leave the kitchen earlier so the food is still hot. If a pin is outside our usual radius we will say so before you order.',
  },
  {
    question: 'Can I pick up from the kitchen?',
    answer:
      'Yes, by arrangement. AE-287 is a production kitchen, not a restaurant — message us on WhatsApp and we will set a pickup window.',
  },
]

export default function CateringAcrossKolkataPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Across Kolkata', path: hubPath },
  ]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageNode({
              path: hubPath,
              name: metadata.title as string,
              description: metadata.description as string,
            }),
            breadcrumbList(crumbs),
            faqNode(faqs),
          ],
        }}
      />

      <div className="pt-16 md:pt-[4.5rem]">
        <Breadcrumbs items={crumbs} />
      </div>

      <article>
        <header className="mx-auto max-w-3xl px-5 pb-8 pt-10 md:px-8 md:pt-14">
          <p className="section-label">Kitchen in Salt Lake Sector 1</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] text-ink text-balance md:text-6xl">
            Vegetarian catering, delivered across Kolkata.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            One kitchen at {site.address.street}. A delivery radius of about {site.deliveryRadiusKm} km. House
            parties, grazing tables and offices — timed for your pin code, not a city-wide guess.
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <KitchenMap />
        </div>

        <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Pick your side of the city</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Three pages, because Salt Lake is not New Town and South Kolkata is a longer run. The menu is the same
            vegetarian kitchen; the clock is not.
          </p>
          <ul className="mt-8 grid gap-5">
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/${area.slug}`}
                  className="group grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-[8rem_1fr]"
                >
                  <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-[7.5rem]">
                    <Image src={area.heroImage} alt={area.heroAlt} fill className="object-cover" sizes="160px" />
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">{area.regionLabel}</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold text-ink">{area.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{area.driveMins}</p>
                    <span className="mt-3 inline-flex text-sm font-semibold text-terracotta group-hover:text-terracotta-deep">
                      Catering in {area.name} →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Also on the regular run</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Not every neighbourhood needs its own page. We still deliver to {alsoDelivered.join(', ')} — send the
              pin with the order and we will confirm timing.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.areasServed.map((place) => (
                <li key={place} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink">
                  {place}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/plan?src=areas-hub"
                className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep"
              >
                Plan my party
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-background"
              >
                Order à la carte
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Before you book the slot</h2>
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card px-5">
            {faqs.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-ink marker:content-none">
                  {item.question}
                  <span className="text-terracotta transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pt-3 leading-relaxed text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </>
  )
}
