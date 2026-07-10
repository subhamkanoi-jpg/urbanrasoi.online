'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { products } from '@/lib/products'
import { site, whatsappUrl, defaultWhatsappMessage } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-18 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 z-10"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.jpg"
              alt="Urban Rasoi"
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-2 ring-cream/50"
            />
            <span
              className={cn(
                'font-serif text-lg font-semibold tracking-tight transition-colors duration-300',
                scrolled ? 'text-ink' : 'text-background',
              )}
            >
              Urban Rasoi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-terracotta',
                  pathname === `/${p.slug}`
                    ? 'text-terracotta'
                    : scrolled
                      ? 'text-ink-soft'
                      : 'text-background/85',
                )}
              >
                {p.shortName}
              </Link>
            ))}
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-terracotta-deep hover:-translate-y-0.5"
            >
              Order Now
            </a>
          </nav>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={cn(
              'relative z-10 flex size-10 flex-col items-center justify-center gap-[5px] rounded-full transition-colors md:hidden',
              open ? 'bg-cream' : scrolled ? 'bg-cream' : 'bg-white/15',
            )}
          >
            <span
              className={cn(
                'h-[2px] w-5 rounded-full transition-all duration-300',
                open
                  ? 'translate-y-[7px] rotate-45 bg-ink'
                  : scrolled
                    ? 'bg-ink'
                    : 'bg-white',
              )}
            />
            <span
              className={cn(
                'h-[2px] w-5 rounded-full transition-all duration-300',
                open ? 'opacity-0' : scrolled ? 'bg-ink' : 'bg-white',
              )}
            />
            <span
              className={cn(
                'h-[2px] w-5 rounded-full transition-all duration-300',
                open
                  ? '-translate-y-[7px] -rotate-45 bg-ink'
                  : scrolled
                    ? 'bg-ink'
                    : 'bg-white',
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-cream transition-all duration-500 md:hidden',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!open}
      >
        {/* Top bar placeholder height */}
        <div className="h-16 shrink-0" />

        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col justify-between px-6 py-8"
        >
          <ul className="flex flex-col gap-1">
            {products.map((p, i) => (
              <li
                key={p.slug}
                style={{
                  transitionDelay: open ? `${i * 60 + 80}ms` : '0ms',
                }}
                className={cn(
                  'transition-all duration-500',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
              >
                <Link
                  href={`/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-4 py-4 text-xl font-serif font-semibold text-ink transition-colors active:bg-cream-dark',
                    pathname === `/${p.slug}` && 'text-terracotta',
                  )}
                >
                  {p.name}
                  <span className="text-ink-soft text-base font-sans font-normal">→</span>
                </Link>
                <div className="mx-4 h-px bg-border" />
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? '320ms' : '0ms' }}
            className={cn(
              'transition-all duration-500',
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
          >
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-terracotta py-4 text-base font-semibold text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </a>
            <div className="mt-6 flex flex-col gap-1 text-center">
              <p className="text-xs uppercase tracking-widest text-ink-soft">{site.location}</p>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="text-sm font-medium text-ink"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
