import Image from 'next/image'

const shots = [
  '/images/gallery-grazing.jpg',
  '/images/gallery-event.jpg',
  '/images/gallery-houseparty.jpg',
  '/images/gallery-spread.jpg',
  '/images/gallery-diwali.jpg',
  '/images/gallery-baguette.jpg',
  '/images/gallery-bengali.jpg',
  '/images/gallery-minipartay.jpg',
]

/** Slow, continuous film strip of real food — brand-building with zero copy. */
export function ImageTicker() {
  return (
    <div className="ticker-wrap bg-background py-5 md:py-7" aria-hidden="true">
      <div className="ticker-inner gap-3 pr-3 md:gap-4 md:pr-4" style={{ animationDuration: '55s' }}>
        {[...shots, ...shots].map((src, index) => (
          <div key={index} className="relative h-40 w-56 shrink-0 overflow-hidden rounded-xl md:h-52 md:w-80">
            <Image src={src} alt="" fill sizes="(min-width: 768px) 320px, 224px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
