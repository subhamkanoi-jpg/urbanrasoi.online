import Image from 'next/image'

const shots = [
  '/images/ig-1.png',
  '/images/gallery-houseparty.jpg',
  '/images/ig-2.png',
  '/images/gallery-spread.jpg',
  '/images/ig-3.png',
  '/images/gallery-diwali.jpg',
  '/images/ig-4.png',
  '/images/gallery-baguette.jpg',
  '/images/ig-5.png',
  '/images/gallery-bengali.jpg',
  '/images/ig-6.png',
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
