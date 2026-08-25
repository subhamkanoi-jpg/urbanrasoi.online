import type { MetadataRoute } from 'next'
import { hubPath, serviceAreas } from '@/lib/areas'
import { products } from '@/lib/products'
import { liveCampaigns } from '@/lib/seasonal'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const lastModified = now
  return [
    { url: site.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/vegetarian-catering-kolkata`, lastModified, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${site.url}${hubPath}`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...serviceAreas.map((area) => ({
      url: `${site.url}/${area.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${site.url}/plan`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/order`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/kolkata-catering`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    ...liveCampaigns(now).map((campaign) => ({
      url: `${site.url}${campaign.href}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${site.url}/${product.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${site.url}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/refund`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
