import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/kolkata-catering`, changeFrequency: 'weekly', priority: 0.9 },
    ...products.map((product) => ({
      url: `${site.url}/${product.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${site.url}/menu.html`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
