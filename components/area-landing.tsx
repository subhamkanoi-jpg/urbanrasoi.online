import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { KitchenMap } from '@/components/kitchen-map'
import { Reveal } from '@/components/reveal'
import { hubPath, serviceAreas, type ServiceArea } from '@/lib/areas'
import { areaServiceNode, breadcrumbList, faqNode, webPageNode } from '@/lib/seo'
import { site } from '@/lib/site'

export function AreaLanding({ area }: { area: ServiceArea }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Across Kolkata', path: hubPath },
    { name: area.name, path: `/${area.slug}` },
  ]
  const siblings = serviceAreas.filter((item) => item.slug !== area.slug)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageNode({
              path: `/${area.slug}`,
              name: area.metaTitle,
              description: area.metaDescription,
            }),
            areaServiceNode(area),
            breadcrumbList(crumbs),
            faqNode(area.faqs),
          ],
        }}
      />

      <div className="pt-16 md:pt-[4.5rem]">
        <Breadcrumbs items={crumbs} />
      </div>

      <article>
        <header className="mx-auto max-w-3xl px-5 pb-8 pt-10 md:px-8 md:pt-14">
          <p className="section-label">{area.regionLabel}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] text-ink text-balance md:text-6xl">
            {area.h1}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{area.lede}</p>
          <p className="mt-3 text-sm font-medium text-ink">
            From the Salt Lake kitchen · {area.driveMins}
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={area.heroImage}
              alt={area.heroAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 px-5 py-10 text-base leading-relaxed text-ink-soft md:px-8 md:text-lg">
          {area.body.map((paragraph) => (
            <Reveal key={paragraph.slice(0, 24)}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Neighbourhoods we cook for</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{area.typical}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {area.neighborhoods.map((place) => (
                <li key={place} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink">
                  {place}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/plan?src=${area.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep"
              >
                Plan a party in {area.name}
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-card"
              >
                Order à la carte
              </Link>
            </div>
          </div>
        </section>

        {area.slug === 'salt-lake-catering' && (
          <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">The kitchen</h2>
            <p className="mt-3 mb-6 leading-relaxed text-ink-soft">
              {site.address.line}. Production kitchen — pickup by arrangement, not a walk-in counter.
            </p>
            <KitchenMap />
          </section>
        )}

        <section className="bg-card py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">Questions from {area.name}</h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background px-5">
              {area.faqs.map((item) => (
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

        <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <h2 className="font-serif text-2xl font-semibold text-ink">Elsewhere in the city</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {siblings.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 font-semibold text-ink transition-colors hover:border-terracotta/50"
                >
                  {item.name}
                  <span aria-hidden="true" className="text-terracotta">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={hubPath} className="mt-4 inline-flex text-sm font-semibold text-terracotta hover:text-terracotta-deep">
            All areas we deliver to →
          </Link>
        </section>
      </article>
    </>
  )
}
