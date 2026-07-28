'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Full-bleed hero background that plays an ambient, muted, looping video over a
 * still poster. The poster paints instantly and always stays behind the video,
 * so there is never a blank frame while the file loads. Visitors who ask for
 * reduced motion keep the still image and never fetch the video.
 */
export function HeroVideo({
  src,
  poster,
  alt,
  positionClassName,
}: {
  src: string
  poster: string
  alt: string
  positionClassName?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion) setShowVideo(true)
  }, [])

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        className={cn('object-cover', positionClassName)}
        sizes="100vw"
      />
      {showVideo && (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-700',
            positionClassName,
            ready ? 'opacity-100' : 'opacity-0',
          )}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
        />
      )}
    </>
  )
}
