/**
 * One place for NAP, JSON-LD and the metadata helpers every page should use.
 * Keep schema honest: only facts that appear on the site, no invented ratings.
 */

import { serviceAreas, type ServiceArea } from './areas'
import { products, type Product } from './products'
import { site } from './site'
import seoRedirectsJson from './seo-redirects.json'

export const businessId = `${site.url}/#business`
export const websiteId = `${site.url}/#website`
export const kitchenId = `${site.url}/#kitchen`
export const kolkataId = `${site.url}/#kolkata`
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

function postalAddress() {
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  }
}

function geoCoordinates(geo: { latitude: number; longitude: number } = site.geo) {
  return {
    '@type': 'GeoCoordinates' as const,
    latitude: geo.latitude,
    longitude: geo.longitude,
  }
}

export function kitchenPlace() {
  return {
    '@type': 'Place' as const,
    '@id': kitchenId,
    name: 'Urban Rasoi kitchen',
    description: 'Vegetarian production kitchen in Salt Lake Sector 1 — not a walk-in restaurant.',
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: site.mapsUrl,
    containedInPlace: { '@id': kolkataId },
  }
}

export function kolkataPlace() {
  return {
    '@type': 'City' as const,
    '@id': kolkataId,
    name: 'Kolkata',
    containedInPlace: {
      '@type': 'State',
      name: 'West Bengal',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
  }
}

export function deliveryCircle() {
  return {
    '@type': 'GeoCircle' as const,
    geoMidpoint: geoCoordinates(),
    geoRadius: site.deliveryRadiusKm * 1000,
    description: `Vegetarian catering delivery within about ${site.deliveryRadiusKm} km of the Salt Lake kitchen.`,
  }
}

export function areaPlace(area: ServiceArea) {
  return {
    '@type': 'Place' as const,
    '@id': `${absoluteUrl(`/${area.slug}`)}#place`,
    name: area.name,
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: area.name,
      addressRegion: 'West Bengal',
      postalCode: area.pin,
      addressCountry: 'IN',
    },
    geo: geoCoordinates(area.geo),
    containedInPlace: { '@id': kolkataId },
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
    address: postalAddress(),
    geo: geoCoordinates(),
    location: { '@id': kitchenId },
    hasMap: site.mapsUrl,
    containedInPlace: { '@id': kolkataId },
    areaServed: [{ '@id': kolkataId }, deliveryCircle(), ...serviceAreas.map(areaPlace)],
    serviceArea: deliveryCircle(),
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
      'Salt Lake catering',
      'New Town catering',
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
    '@graph': [cateringBusiness(), kitchenPlace(), kolkataPlace(), {
      '@type': 'WebSite',
      '@id': websiteId,
      url: site.url,
      name: site.name,
      description: site.tagline,
      inLanguage: 'en-IN',
      publisher: { '@id': businessId },
    }],
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
    areaServed: { '@id': kolkataId },
    url: absoluteUrl(`/${product.slug}`),
    image: absoluteUrl(product.heroImage),
  }
}

export function areaServiceNode(area: ServiceArea) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(`/${area.slug}`)}#service`,
    name: `Vegetarian catering in ${area.name}`,
    serviceType: 'Vegetarian catering',
    description: area.metaDescription,
    provider: { '@id': businessId },
    areaServed: areaPlace(area),
    url: absoluteUrl(`/${area.slug}`),
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
