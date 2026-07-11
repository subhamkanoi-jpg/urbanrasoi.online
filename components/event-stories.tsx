'use client'

import { useRef, useState } from 'react'
import { customerStories, storyCategories, type StoryCategory, type VideoStory } from '@/lib/customer-stories'
import { openWhatsapp } from '@/lib/meta-tracking'
import { site } from '@/lib/site'

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

function VideoCard({ story, prominent, onPlay }: { story: VideoStory; prominent: boolean; onPlay: (video: HTMLVideoElement) => void }) {
  return (
    <article className={prominent ? 'snap-start md:col-span-2 md:row-span-2' : 'snap-start'}>
      <div className="group relative h-full overflow-hidden rounded-2xl bg-ink shadow-[0_12px_40px_rgba(30,20,11,0.14)]">
        <video
          className={`h-full w-full object-cover ${prominent ? 'aspect-[4/5] md:aspect-[16/12]' : 'aspect-[4/5]'}`}
          src={story.src}
          poster={story.poster}
          preload="metadata"
          playsInline
          controls
          onPlay={(event) => onPlay(event.currentTarget)}
          aria-label={`${story.title}. ${story.caption}`}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm">
            {story.categories[0]}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-12 bg-ink/80 px-5 py-4 text-background backdrop-blur-sm">
          <h3 className="font-serif text-xl font-semibold text-balance">{story.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-background/80">{story.caption}</p>
        </div>
      </div>
    </article>
  )
}

export function EventStories() {
  const [activeCategory, setActiveCategory] = useState<StoryCategory>('All')
  const playingVideo = useRef<HTMLVideoElement | null>(null)

  const visibleStories = activeCategory === 'All'
    ? customerStories
    : customerStories.filter((story) => story.categories.includes(activeCategory))

  function handlePlay(video: HTMLVideoElement) {
    if (playingVideo.current && playingVideo.current !== video) playingVideo.current.pause()
    playingVideo.current = video
  }

  return (
    <section aria-labelledby="event-stories-title" className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="section-label">Real parties. Real hosts.</p>
            <h2 id="event-stories-title" className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink text-balance md:text-6xl">
              See it, hear it, taste it.
            </h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-terracotta px-5 py-3 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <InstagramGlyph className="size-4" />
            More on Instagram
          </a>
        </div>

        <div className="mt-8 overflow-x-auto pb-2" aria-label="Filter customer stories by event type">
          <div className="flex min-w-max gap-2" role="group">
            {storyCategories.map((category) => {
              const isActive = category === activeCategory
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${isActive ? 'bg-ink text-background' : 'border border-border bg-background text-ink hover:border-terracotta hover:text-terracotta'}`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-4" aria-live="polite">
          {visibleStories.map((story, index) => story.type === 'video' ? (
            <VideoCard key={story.id} story={story} prominent={activeCategory === 'All' && index === 0} onPlay={handlePlay} />
          ) : (
            <article key={story.id} className="flex min-h-72 snap-start flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-[0_8px_30px_rgba(30,20,11,0.07)] md:min-h-80">
              <span className="font-serif text-5xl leading-none text-terracotta" aria-hidden="true">“</span>
              <blockquote className="mt-4 font-serif text-xl font-medium leading-relaxed text-ink text-pretty md:text-2xl">
                {story.quote}
              </blockquote>
              <footer className="mt-8 border-t border-border pt-4">
                <p className="font-semibold text-ink">{story.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{story.detail}</p>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-start justify-between gap-5 border-t border-border pt-7 md:mt-10 md:flex-row md:items-center md:pt-8">
          <p className="max-w-xl font-serif text-xl font-semibold text-ink text-balance md:text-3xl">
            Want yours next?
          </p>
          <a
            href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hi Urban Rasoi! I saw your event stories and would like to plan catering for my celebration.')}`}
            onClick={(event) => {
              event.preventDefault()
              openWhatsapp('Hi Urban Rasoi! I saw your event stories and would like to plan catering for my celebration.', { placement: 'event-stories' })
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Plan an event like this
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
