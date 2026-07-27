'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Click-to-play reel. The video file is large, so nothing is fetched until the
 * visitor actually asks for it — the poster carries the page until then.
 */
export function ReelPlayer({
  src,
  poster,
  caption,
}: {
  src: string
  poster: string
  caption: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl bg-ink shadow-[0_12px_40px_rgba(30,20,11,0.18)]">
      {playing ? (
        <video
          className="size-full object-cover"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          aria-label={caption}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true)
            window.fbq?.('trackCustom', 'ReelPlayed', { reel: 'house-party' })
          }}
          className="group absolute inset-0 size-full"
          aria-label={`Play video: ${caption}`}
        >
          <Image src={poster} alt="" fill sizes="(min-width: 768px) 384px, 100vw" className="object-cover" />
          <span className="absolute inset-0 bg-ink/35 transition-colors group-hover:bg-ink/25" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-2xl text-ink shadow-lg transition-transform group-hover:scale-105">
            ▶
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-medium text-primary-foreground">
            {caption}
          </span>
        </button>
      )}
    </div>
  )
}
