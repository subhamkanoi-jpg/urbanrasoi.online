/**
 * One place for NAP, JSON-LD and the metadata helpers every page should use.
 * Keep schema honest: only facts that appear on the site, no invented ratings.
 */

import { products, type Product } from './products'
import { site } from './site'
import seoRedirectsJson from './seo-redirects.json'

export const businessId = `${site.url}/#business`
export const websiteId = `${site.url}/#website`
export const seoRedirects: { source: string; destination: string }[] = seoRedirectsJson

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export type Crumb = { name: string; path: string }

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  if (path === '/') return site.url
  return `${site.url}${path}`
}

export function breadcrumbList(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function cateringBusiness() {
  return {
    '@type': 'CateringBusiness',
    '@id': businessId,
    name: site.name,
    url: site.url,
    logo: absoluteUrl('/images/logo.jpg'),
    image: [absoluteUrl('/images/og-image.jpg'), absoluteUrl('/images/logo.jpg')],
    telephone: site.phoneE164,
    description:
      '100% vegetarian party catering in Kolkata — house parties, grazing tables, corporate meals and packed boxes, cooked in our FSSAI-licensed Salt Lake kitchen since 2015.',
    foundingDate: String(site.foundedYear),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.line)}`,
    areaServed: [
      { '@type': 'City', name: 'Kolkata' },
      ...site.areasServed.map((name) => ({ '@type': 'AdministrativeArea' as const, name })),
    ],
    servesCuisine: ['Indian', 'Bengali', 'Rajasthani', 'South Indian', 'Indo-Chinese', 'Continental', 'Vegetarian'],
    suitableForDiet: 'https://schema.org/VegetarianDiet',
    hasMenu: absoluteUrl('/order'),
    menu: absoluteUrl('/order'),
    knowsAbout: [
      'Vegetarian catering',
      'House party catering',
      'Grazing tables',
      'Corporate catering',
      'Bengali catering',
      'Puja catering',
    ],
    identifier: {
      '@type': 'PropertyValue',
      name: 'FSSAI License',
      value: site.fssaiNumber,
    },
    sameAs: [site.instagram, site.facebook],
    makesOffer: products.map((product) => ({
      '@type': 'Offer',
      url: absoluteUrl(`/${product.slug}`),
      itemOffered: {
        '@type': 'Service',
        name: product.name,
        url: absoluteUrl(`/${product.slug}`),
      },
    })),
  }
}

export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      cateringBusiness(),
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.url,
        name: site.name,
        description: site.tagline,
        inLanguage: 'en-IN',
        publisher: { '@id': businessId },
      },
    ],
  }
}

export function webPageNode({
  path,
  name,
  description,
}: {
  path: string
  name: string
  description: string
}) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
    inLanguage: 'en-IN',
  }
}

export function serviceNode(product: Product) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(`/${product.slug}`)}#service`,
    name: product.name,
    serviceType: 'Vegetarian catering',
    description: product.metaDescription,
    provider: { '@id': businessId },
    areaServed: { '@type': 'City', name: 'Kolkata' },
    url: absoluteUrl(`/${product.slug}`),
    image: absoluteUrl(product.heroImage),
  }
}

export function faqNode(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
