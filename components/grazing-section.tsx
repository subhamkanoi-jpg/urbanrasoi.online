import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const proofPoints = [
  { label: 'From 15 guests', detail: 'Intimate or large — we scale the table to your gathering.' },
  { label: 'Styled & set up', detail: 'We arrive, arrange and leave it looking like a magazine shoot.' },
  { label: 'Delivered ready', detail: 'No assembly required. Just open the door and host.' },
]

export function GrazingSection() {
  return (
    <section
      className="bg-ink py-14 text-primary-foreground md:py-20"
      aria-labelledby="grazing-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-14 lg:gap-20">
          {/* Image */}
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:h-full md:min-h-[420px]">
              <Image
                src="/images/gallery-grazing.jpg"
                alt="A lush Urban Rasoi vegetarian grazing table styled for a Kolkata gathering"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={80}>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-terracotta-light">Signature experience</p>
              <h2
                id="grazing-heading"
                className="mt-4 font-serif text-3xl font-semibold leading-[1.06] text-primary-foreground text-balance md:text-5xl"
              >
                The table everyone gathers around.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/75 md:text-lg">
                Composed like a still life, grazed like a feast. Our vegetarian grazing boards are designed,
                delivered and styled — you just open the door.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {proofPoints.map((point) => (
                  <li key={point.label} className="flex gap-4">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-primary-foreground">{point.label}</p>
                      <p className="mt-0.5 text-sm text-primary-foreground/65">{point.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/grazing-tables"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-terracotta-deep hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  Explore grazing tables <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/plan?occasion=grazing&src=home-grazing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  Plan my grazing table
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
