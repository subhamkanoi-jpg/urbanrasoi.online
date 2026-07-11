import { Reveal } from '@/components/reveal'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { structuredWhatsappMessage } from '@/lib/site'

const oldWay = [
  'Your kitchen taken over for the day — and left in a mess',
  'The same 10 dishes at every single party',
  'Oily, heavy food that tastes the same everywhere',
  'You spend the evening supervising instead of hosting',
]

const newWay = [
  'Cooked in our FSSAI-licensed kitchen — yours stays untouched',
  'Chef-crafted menus across six cuisines, tailored to your occasion',
  'Gourmet, balanced food that looks as good as it tastes',
  'Delivery or full service — the entire headache is ours',
]

export function MaharajComparison({ placement = 'maharaj-comparison' }: { placement?: string }) {
  return (
    <section className="bg-ink py-14 text-primary-foreground md:py-20" aria-labelledby="comparison-title">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="section-label text-terracotta-light">The Urban Rasoi difference</p>
          <h2 id="comparison-title" className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-balance md:text-5xl">
            For ages, every get-together meant calling the maharaj. Not anymore.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-primary-foreground/75">
            Urban Rasoi is the change Kolkata&apos;s party food scene always needed — gourmet and fancy, yet warm and approachable. You host. We handle everything else.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 md:p-8">
              <p className="section-label text-primary-foreground/50">The old way</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-primary-foreground/80">Calling the maharaj</h3>
              <ul className="mt-6 flex flex-col gap-4">
                {oldWay.map((point) => (
                  <li key={point} className="flex gap-3 text-primary-foreground/65">
                    <span className="mt-0.5 shrink-0" aria-hidden="true">✕</span>
                    <p className="leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-2xl bg-terracotta p-6 md:p-8">
              <p className="section-label text-primary-foreground/70">The new way</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold">Urban Rasoi</h3>
              <ul className="mt-6 flex flex-col gap-4">
                {newWay.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-semibold" aria-hidden="true">✓</span>
                    <p className="font-medium leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-serif text-xl font-semibold text-balance md:text-2xl">
              Ready to retire the maharaj for your next get-together?
            </p>
            <WhatsAppButton
              message={structuredWhatsappMessage}
              label="Plan my get-together"
              placement={placement}
              size="large"
              className="justify-center"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
