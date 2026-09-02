'use client'

import Link from 'next/link'
import Image from 'next/image'

export function JanmashtamiHeader() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Urban Rasoi logo"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-semibold tracking-tight text-ink">
              Urban Rasoi
            </span>
            <span className="text-[10px] uppercase tracking-widest text-terracotta">
              Janmashtami Special
            </span>
          </div>
        </Link>

        <nav aria-label="Janmashtami page navigation" className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('delivery')}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
          >
            Delivery
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('faq')}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('order-section')}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-background transition-all hover:bg-terracotta"
          >
            Order Now
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => scrollToSection('order-section')}
            className="rounded-full bg-terracotta px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            Order Now
          </button>
        </div>
      </div>
    </header>
  )
}
