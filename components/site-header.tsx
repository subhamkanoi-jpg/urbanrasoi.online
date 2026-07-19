'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { products } from '@/lib/products'
import { trackContact } from '@/lib/meta-tracking'
import { site } from '@/lib/site'
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
            <Link
              href="/plan?src=header"
              className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-terracotta-deep hover:-translate-y-0.5"
            >
              Plan my party
            </Link>
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
          className="flex flex-1 flex-col justify-between px-5 py-5"
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
                    'flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-serif font-semibold text-ink transition-colors active:bg-cream-dark',
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
            <Link
              href="/plan?src=mobile-menu"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-terracotta py-4 text-base font-semibold text-white"
            >
              Plan my party <span aria-hidden="true">→</span>
            </Link>
            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              onClick={() => trackContact('mobile-menu')}
              className="mt-4 block text-center text-sm font-medium text-ink"
            >
              Call {site.phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
