import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { liveCampaigns } from '@/lib/seasonal'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: site.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/plan`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/order`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/kolkata-catering`, changeFrequency: 'weekly', priority: 0.9 },
    ...liveCampaigns(now).map((campaign) => ({
      url: `${site.url}${campaign.href}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${site.url}/${product.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/refund`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
