import Image from 'next/image'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/whatsapp-button'
import type { Campaign } from '@/lib/seasonal'
import { site, structuredWhatsappMessage } from '@/lib/site'

/**
 * Shown in place of a festive order form once the occasion has passed.
 * The route stays alive because ads and forwarded WhatsApp links keep
 * arriving long after the date — a dead end here is a lost enquiry.
 */
export function CampaignClosed({ campaign }: { campaign: Campaign }) {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-24">
      <Image
        src="/images/gallery-grazing.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/85" />

      <div className="relative mx-auto w-full max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Urban Rasoi"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-2 ring-white/25"
          />
          <span className="font-serif text-xl font-semibold text-primary-foreground">Urban Rasoi</span>
        </Link>

        <h1 className="mt-8 font-serif text-3xl font-semibold leading-tight text-primary-foreground text-balance md:text-5xl">
          {campaign.closedTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-primary-foreground/70">
          {campaign.closedBody}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/plan?src=${campaign.id}-closed`}
            className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep"
          >
            Plan my party <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/order"
            className="flex items-center justify-center gap-2 rounded-full border border-primary-foreground/40 px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-ink"
          >
            Order à la carte <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <WhatsAppButton
            message={structuredWhatsappMessage}
            label="Ask about a date"
            placement={`${campaign.id}-closed`}
            variant="light"
          />
        </div>

        <p className="mt-8 text-sm text-primary-foreground/50">
          {site.location} · {site.fssai}
        </p>
      </div>
    </section>
  )
}
