import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { Reveal } from '@/components/reveal'
import { faqNode, webPageNode } from '@/lib/seo'
import { products } from '@/lib/products'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Vegetarian Catering in Kolkata | 100% Veg Kitchen — Urban Rasoi',
  description:
    '100% vegetarian catering in Kolkata from a dedicated veg kitchen in Salt Lake. House parties, grazing tables, offices and pujas — no meat, no shared tandoor. From ₹749 a guest.',
  alternates: { canonical: '/vegetarian-catering-kolkata' },
  openGraph: {
    title: 'Vegetarian Catering in Kolkata | Urban Rasoi',
    description:
      'A vegetarian-only FSSAI kitchen in Salt Lake cooking for house parties, grazing tables and offices across Kolkata since 2015.',
    url: '/vegetarian-catering-kolkata',
    type: 'article',
    locale: 'en_IN',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Vegetarian catering by Urban Rasoi in Kolkata' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vegetarian Catering in Kolkata | Urban Rasoi',
    description: '100% vegetarian party catering from a Salt Lake kitchen. From ₹749 a guest.',
    images: ['/images/og-image.jpg'],
  },
}

const faqs = [
  {
    question: 'Is Urban Rasoi completely vegetarian?',
    answer:
      'Yes. We have never cooked meat. The kitchen, tandoor, fryers and delivery boxes are vegetarian-only — which is why Kolkata families book us for pujas, birthdays and mixed-diet parties where the veg side has to be trusted.',
  },
  {
    question: 'Where is the kitchen?',
    answer: `AE-287, Salt Lake Sector 1, Kolkata 700064. Food is cooked here and delivered across ${site.areasServed.slice(0, 8).join(', ')} and the rest of the city.`,
  },
  {
    question: 'Do you cater non-veg if asked?',
    answer:
      'No. We stay vegetarian-only so the kitchen never has to be “cleaned down” between orders. If your party needs both, hosts usually book us for the vegetarian spread and a second kitchen for the rest.',
  },
  {
    question: 'What is the starting price?',
    answer: `Party menus start at ${site.partyMenusFrom} a guest. À la carte is priced by the piece with no minimum. Grazing tables from 15 guests.`,
  },
]

export default function VegetarianCateringPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageNode({
              path: '/vegetarian-catering-kolkata',
              name: 'Vegetarian Catering in Kolkata | Urban Rasoi',
              description: metadata.description as string,
            }),
            {
              '@type': 'Service',
              name: 'Vegetarian catering in Kolkata',
              serviceType: 'Vegetarian catering',
              provider: { '@id': `${site.url}/#business` },
              areaServed: { '@type': 'City', name: 'Kolkata' },
              url: `${site.url}/vegetarian-catering-kolkata`,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: '749',
                description: 'Party menus from ₹749 a guest',
              },
            },
            faqNode(faqs),
          ],
        }}
      />

      <div className="pt-16 md:pt-[4.5rem]">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Vegetarian catering', path: '/vegetarian-catering-kolkata' },
          ]}
        />
      </div>

      <article>
        <header className="mx-auto max-w-3xl px-5 pb-8 pt-10 md:px-8 md:pt-14">
          <p className="section-label">Salt Lake · Since 2015</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] text-ink text-balance md:text-6xl">
            Vegetarian catering in Kolkata.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            A 100% vegetarian kitchen in Salt Lake cooking for house parties, grazing tables, offices and pujas —
            no meat, no shared tandoor, no “veg option” afterthoughts.
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/images/gallery-houseparty.jpg"
              alt="Vegetarian house party spread by Urban Rasoi in Kolkata"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 px-5 py-10 text-base leading-relaxed text-ink-soft md:px-8 md:text-lg">
          <Reveal>
            <p>
              Most Kolkata “veg catering” is a mixed kitchen that cooks the paneer after the mutton. Hosts who keep a
              vegetarian house — or who are feeding grandparents, Jain friends, or a puja — can taste the difference,
              even when the menu looks fine on paper.
            </p>
          </Reveal>
          <Reveal>
            <p>
              Urban Rasoi does not cook meat. Not as a special request, not on a second burner. The FSSAI-licensed
              kitchen at {site.address.street} has been vegetarian since we opened in {site.foundedYear}. That is the
              whole product: chef-crafted party food that happens to be vegetarian because the kitchen is.
            </p>
          </Reveal>
        </div>

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">What we cook</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Homestyle Indian, Bengali, Rajasthani, South Indian, Indo-Chinese, Continental and desserts. Finger food
              priced by the piece; trays in 500 and 750 ml. Build a menu yourself or let us plan one around your guest
              count.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/${product.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 font-semibold text-ink transition-colors hover:border-terracotta/50"
                  >
                    {product.shortName}
                    <span aria-hidden="true" className="text-terracotta">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep"
              >
                Order à la carte
              </Link>
              <Link
                href="/plan?src=veg-page"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-card"
              >
                Plan a party menu
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Where we deliver</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Cooked in Salt Lake, delivered across Kolkata. Typical areas include {site.areasServed.join(', ')}.
            Tell us your pin code with the order — we will confirm timing the same day.
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            Kitchen: {site.address.line} · {site.phone} · {site.fssai}
          </p>
        </section>

        <section className="bg-card py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Questions hosts actually ask</h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background px-5">
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
          </div>
        </section>
      </article>
    </>
  )
}
