'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { products } from '@/lib/products'
import { site, whatsappUrl, defaultWhatsappMessage } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.jpg"
            alt="Urban Rasoi logo"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Urban Rasoi
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className={cn(
                'text-sm transition-colors hover:text-terracotta',
                pathname === `/${p.slug}` ? 'text-terracotta' : 'text-ink-soft',
              )}
            >
              {p.shortName}
            </Link>
          ))}
          <a
            href={whatsappUrl(defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-terracotta"
          >
            Enquire
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              'h-0.5 w-5 bg-ink transition-transform',
              open && 'translate-y-1 rotate-45',
            )}
          />
          <span
            className={cn(
              'h-0.5 w-5 bg-ink transition-transform',
              open && '-translate-y-1 -rotate-45',
            )}
          />
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-ink transition-colors hover:bg-cream"
                >
                  {p.name}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-ink px-5 py-3 text-center text-base font-medium text-background"
              >
                Enquire on WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
