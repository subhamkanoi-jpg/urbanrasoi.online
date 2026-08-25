import { site } from '@/lib/site'

export function KitchenMap() {
  const { latitude, longitude } = site.geo
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02}%2C${latitude - 0.015}%2C${longitude + 0.02}%2C${latitude + 0.015}&layer=mapnik&marker=${latitude}%2C${longitude}`

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <iframe
        title="Map of Urban Rasoi kitchen, AE-287 Salt Lake Sector 1, Kolkata"
        src={src}
        className="h-64 w-full border-0 md:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-ink-soft">
        <span>{site.address.line}</span>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-terracotta hover:text-terracotta-deep"
        >
          Open in Google Maps
        </a>
      </figcaption>
    </figure>
  )
}
