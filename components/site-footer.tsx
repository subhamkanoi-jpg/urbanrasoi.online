import Link from 'next/link'
import { products } from '@/lib/products'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl font-semibold">Urban Rasoi</p>
            <p className="mt-3 text-sm leading-relaxed text-background/70">
              {site.tagline}
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-background/50">
              Since {site.foundedYear} — {site.location}
            </p>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav aria-label="Offerings">
              <p className="text-xs uppercase tracking-widest text-background/50">
                Offerings
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${p.slug}`}
                      className="text-sm text-background/80 transition-colors hover:text-terracotta"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-xs uppercase tracking-widest text-background/50">
                Connect
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, '')}`}
                    className="text-sm text-background/80 transition-colors hover:text-terracotta"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/80 transition-colors hover:text-terracotta"
                  >
                    Instagram {site.instagramHandle}
                  </a>
                </li>
                <li>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/80 transition-colors hover:text-terracotta"
                  >
                    Facebook /urbanrasoi
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-background/15 pt-8 text-xs text-background/50 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Urban Rasoi. All rights reserved.
          </p>
          <p>{site.fssai}</p>
        </div>
      </div>
    </footer>
  )
}
