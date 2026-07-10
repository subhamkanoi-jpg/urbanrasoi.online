import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'
import { site, whatsappUrl, defaultWhatsappMessage } from '@/lib/site'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-background/85">
      {/* Top portion */}
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-20 md:pb-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_auto]">

          {/* Brand column */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Urban Rasoi logo"
                width={44}
                height={44}
                className="size-11 rounded-full object-cover ring-2 ring-white/10"
              />
              <p className="font-serif text-xl font-semibold text-background">Urban Rasoi</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-background/60">
              {site.tagline}
            </p>
            {/* Social + contact */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-background/70 transition-colors hover:border-terracotta hover:text-terracotta"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-background/70 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="ml-2 text-sm text-background/60 transition-colors hover:text-terracotta"
              >
                {site.phone}
              </a>
            </div>
          </div>

          {/* Offerings */}
          <nav aria-label="Offerings" className="min-w-[140px]">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40">
              Offerings
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="text-sm text-background/70 transition-colors hover:text-terracotta"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Order CTA */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40">
              Order now
            </p>
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-terracotta-deep hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
            <div className="text-xs text-background/40 leading-relaxed">
              <p>{site.location}</p>
              <p className="mt-1">{site.fssai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 mx-auto max-w-7xl px-5 py-5 md:px-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-background/35">
            &copy; {new Date().getFullYear()} Urban Rasoi. All rights reserved.
          </p>
          <p className="text-xs text-background/35">
            Crafted food experiences — Kolkata
          </p>
        </div>
      </div>
    </footer>
  )
}
