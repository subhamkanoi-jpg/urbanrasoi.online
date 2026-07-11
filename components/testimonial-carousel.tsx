'use client'

import { useEffect, useRef, useState } from 'react'
import { customerStories, type QuoteStory } from '@/lib/customer-stories'
import { cn } from '@/lib/utils'

const testimonials = customerStories.filter(
  (story): story is QuoteStory => story.type === 'quote',
)

export function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [paused])

  function move(direction: number) {
    setActive((current) => (current + direction + testimonials.length) % testimonials.length)
  }

  return (
    <section
      aria-labelledby="testimonials-title"
      className="overflow-hidden bg-ink py-12 text-primary-foreground md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return
        const distance = event.changedTouches[0].clientX - touchStart.current
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1)
        touchStart.current = null
      }}
    >
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-label text-terracotta-light">Loved by Kolkata hosts</p>
            <h2 id="testimonials-title" className="mt-2 font-serif text-3xl font-semibold text-balance md:text-5xl">
              Their words, not ours.
            </h2>
          </div>
          <p className="hidden text-sm text-primary-foreground/60 md:block">All customer notes</p>
        </div>

        <div className="relative mt-8 min-h-64 md:min-h-72" aria-live="polite">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.id}
              aria-hidden={active !== index}
              className={cn(
                'absolute inset-0 flex flex-col justify-between rounded-2xl bg-background p-6 text-ink transition-all duration-500 md:p-10',
                active === index ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-6 opacity-0',
              )}
            >
              <blockquote className="font-serif text-2xl font-semibold leading-snug text-pretty md:text-4xl">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{testimonial.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label="Choose testimonial">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-light',
                  active === index ? 'w-8 bg-terracotta-light' : 'w-2.5 bg-primary-foreground/35',
                )}
                aria-label={`Show testimonial ${index + 1} of ${testimonials.length}`}
                aria-current={active === index ? 'true' : undefined}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} className="flex size-11 items-center justify-center rounded-full border border-primary-foreground/25 text-xl" aria-label="Previous testimonial">←</button>
            <button type="button" onClick={() => move(1)} className="flex size-11 items-center justify-center rounded-full border border-primary-foreground/25 text-xl" aria-label="Next testimonial">→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
