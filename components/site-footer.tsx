import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'
import { TelLink, WhatsAppLink } from '@/components/tracked-links'
import { getCampaign, type CampaignId } from '@/lib/seasonal'
import { site } from '@/lib/site'

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

export function SiteFooter({ liveCampaigns = [] }: { liveCampaigns?: CampaignId[] }) {
  const rakhi = getCampaign('rakhi')
  const puja = getCampaign('rudrabhishek')
  return (
    <footer className="bg-ink text-background/80">
      {/* Top portion */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-10 md:pb-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Urban Rasoi logo"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover ring-1 ring-white/10"
              />
              <p className="font-serif text-xl font-semibold text-background">Urban Rasoi</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/55">
              Premium vegetarian catering for house parties and celebrations across Kolkata, since {site.foundedYear}.
            </p>
            {/* Social + contact */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Urban Rasoi on Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-white/12 text-background/60 transition-colors hover:border-terracotta hover:text-terracotta"
              >
                <InstagramIcon className="size-4" />
              </a>
              <WhatsAppLink
                placement="footer-social"
                ariaLabel="Chat on WhatsApp"
                className="flex size-9 items-center justify-center rounded-full border border-white/12 text-background/60 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-4" />
              </WhatsAppLink>
            </div>
            <div className="mt-5 space-y-1 text-xs text-background/40">
              <p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-terracotta"
                >
                  {site.address.line}
                </a>
              </p>
              <p>
                <TelLink placement="footer" className="transition-colors hover:text-terracotta">
                  {site.phone}
                </TelLink>
              </p>
              <p>{site.fssai}</p>
            </div>
          </div>

          {/* Offerings */}
          <nav aria-label="Offerings">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/35">
              Offerings
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/vegetarian-catering-kolkata"
                  className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
                >
                  Vegetarian catering
                </Link>
              </li>
              <li>
                <Link
                  href="/catering-across-kolkata"
                  className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
                >
                  Across Kolkata
                </Link>
              </li>
              {liveCampaigns.includes('rakhi') && (
                <li>
                  <Link
                    href={rakhi.href}
                    className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
                  >
                    {rakhi.label}
                  </Link>
                </li>
              )}
              {liveCampaigns.includes('rudrabhishek') && (
                <li>
                  <Link
                    href={puja.href}
                    className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
                  >
                    Rudra Abhishek Puja Catering
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Plan / Order */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/35">
              Get started
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/plan?src=footer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-terracotta-deep hover:-translate-y-0.5"
              >
                Plan my party <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/order"
                className="inline-block py-1 text-sm text-background/65 transition-colors hover:text-terracotta"
              >
                Order à la carte →
              </Link>
              <WhatsAppLink
                placement="footer-cta"
                className="inline-flex items-center gap-2 py-1 text-sm text-background/65 transition-colors hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-4" />
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-background/35">
              <Link href="/salt-lake-catering" className="py-0.5 hover:text-terracotta">Salt Lake</Link>
              <Link href="/new-town-catering" className="py-0.5 hover:text-terracotta">New Town</Link>
              <Link href="/south-kolkata-catering" className="py-0.5 hover:text-terracotta">South Kolkata</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 mx-auto max-w-7xl px-5 py-5 md:px-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-background/30">
            <span>&copy; {new Date().getFullYear()} Urban Rasoi. All rights reserved.</span>
            <Link href="/privacy" className="py-1 underline-offset-2 transition-colors hover:text-terracotta hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="py-1 underline-offset-2 transition-colors hover:text-terracotta hover:underline">
              Terms
            </Link>
            <Link href="/refund" className="py-1 underline-offset-2 transition-colors hover:text-terracotta hover:underline">
              Refunds
            </Link>
          </div>
          <p className="text-xs text-background/30">
            Crafted food experiences — Kolkata
          </p>
        </div>
      </div>
    </footer>
  )
}
