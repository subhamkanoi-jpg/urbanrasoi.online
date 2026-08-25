import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbList, type Crumb } from '@/lib/seo'

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', ...breadcrumbList(items) }} />
      <nav aria-label="Breadcrumb" className="border-b border-border bg-cream/60">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-5 py-2.5 text-xs text-ink-soft md:px-10">
          {items.map((item, index) => {
            const last = index === items.length - 1
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-ink-lighter">
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-terracotta">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
