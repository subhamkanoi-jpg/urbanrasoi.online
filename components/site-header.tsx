'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { products } from '@/lib/products'
import { trackContact } from '@/lib/meta-tracking'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string; highlight?: boolean }

const navItems: NavItem[] = [
  ...products.map((p) => ({ label: p.shortName, href: `/${p.slug}` })),
  { label: 'Puja Catering', href: '/rudrabhishek-catering' },
  { label: 'Order Online', href: '/order' },
  { label: 'Rakhi Order', href: '/rakhi', highlight: true },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
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
        <Link href="/" className="flex items-center gap-2.5 z-10">
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

        {/* Right side: phone + menu trigger */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            onClick={() => trackContact('header')}
            className={cn(
              'hidden text-sm font-medium transition-colors md:block',
              scrolled ? 'text-ink-soft hover:text-ink' : 'text-white/80 hover:text-white',
            )}
          >
            {site.phone}
          </a>

          {/* Desktop menu button */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                scrolled
                  ? 'bg-cream text-ink hover:bg-cream-dark'
                  : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm',
              )}
            >
              Menu
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={cn('transition-transform duration-200', open && 'rotate-180')}
                aria-hidden="true"
              >
                <path d="M2 4l5 5 5-5" />
              </svg>
            </button>

            {/* Dropdown */}
            {open && (
              <nav
                aria-label="Site navigation"
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-background shadow-xl overflow-hidden"
              >
                <ul className="py-1.5">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-cream',
                          pathname === item.href
                            ? item.highlight
                              ? 'text-rakhi-saffron font-semibold'
                              : 'text-terracotta font-semibold'
                            : item.highlight
                              ? 'text-rakhi-saffron font-medium'
                              : 'text-ink font-medium',
                        )}
                      >
                        {item.label}
                        {pathname === item.href && (
                          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                        )}
                      </Link>
                    </li>
                  ))}
                  <li className="mx-3 my-1.5 border-t border-border" />
                  <li>
                    <Link
                      href="/plan?src=nav-dropdown"
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-cream"
                    >
                      Plan my party
                      <span aria-hidden="true" className="text-xs opacity-60">→</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          {/* Mobile hamburger */}
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
                  : scrolled ? 'bg-ink' : 'bg-white',
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
                  : scrolled ? 'bg-ink' : 'bg-white',
              )}
            />
          </button>
        </div>
      </div>

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
        <div className="h-16 shrink-0" />
        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col justify-between px-5 py-5"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${i * 50 + 60}ms` : '0ms' }}
                className={cn(
                  'transition-all duration-500',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-3 text-base font-serif font-semibold transition-colors active:bg-cream-dark',
                    pathname === item.href
                      ? item.highlight ? 'text-rakhi-saffron' : 'text-terracotta'
                      : item.highlight ? 'text-rakhi-saffron' : 'text-ink',
                  )}
                >
                  {item.label}
                  <span className="text-ink-soft text-sm font-sans font-normal">→</span>
                </Link>
                <div className="mx-3 h-px bg-border" />
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? `${navItems.length * 50 + 80}ms` : '0ms' }}
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
    </header>
  )
}
