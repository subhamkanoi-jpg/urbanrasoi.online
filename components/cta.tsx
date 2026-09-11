import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'accent' | 'light' | 'ghost' | 'ghost-light'
type Size = 'default' | 'large'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-background hover:bg-terracotta-deep',
  accent: 'bg-terracotta text-background hover:bg-terracotta-deep',
  light: 'bg-background text-ink hover:bg-cream',
  ghost: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-background',
  'ghost-light': 'border border-background/45 text-background hover:bg-background hover:text-ink',
}

const sizes: Record<Size, string> = {
  default: 'min-h-11 px-6 text-sm',
  large: 'min-h-13 px-8 text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'default', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
    variants[variant],
    sizes[size],
    className,
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'default',
  className,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  )
}

/** Small right-arrow used after CTA labels. */
export function Arrow() {
  return <span aria-hidden='true'>→</span>
}
