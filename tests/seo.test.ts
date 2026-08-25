import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { faqItems } from '../components/conversion-sections'
import { serviceAreas } from '../lib/areas'
import { products } from '../lib/products'
import {
  cateringBusiness,
  deliveryCircle,
  seoRedirects,
  serializeJsonLd,
  siteGraph,
} from '../lib/seo'
import { site } from '../lib/site'
import sitemap from '../app/sitemap'

describe('NAP', () => {
  it('publishes a full Salt Lake street address', () => {
    assert.match(site.address.street, /AE-287/)
    assert.equal(site.address.postalCode, '700064')
    assert.ok(site.geo.latitude > 22 && site.geo.latitude < 23)
    assert.ok(site.geo.longitude > 88 && site.geo.longitude < 89)
  })
})

describe('JSON-LD', () => {
  it('escapes script-breaking characters', () => {
    assert.equal(serializeJsonLd({ x: '</script>' }), '{"x":"\\u003c/script>"}')
  })

  it('describes a vegetarian catering business in Kolkata', () => {
    const business = cateringBusiness()
    assert.equal(business['@type'], 'CateringBusiness')
    assert.equal(business.address.streetAddress, site.address.street)
    assert.equal(business.suitableForDiet, 'https://schema.org/VegetarianDiet')
    assert.equal(business.hasMenu, `${site.url}/order`)
    assert.equal(business.telephone, site.phoneE164)
    assert.equal(business.hasMap, site.mapsUrl)
    assert.ok(business.areaServed.some((area) => 'name' in area && area.name === 'Salt Lake'))
    assert.ok(business.makesOffer.length === products.length)
  })

  it('pins a 20 km delivery circle on the Salt Lake kitchen', () => {
    const circle = deliveryCircle()
    assert.equal(circle['@type'], 'GeoCircle')
    assert.equal(circle.geoRadius, 20000)
    assert.equal(circle.geoMidpoint.latitude, site.geo.latitude)
    assert.equal(cateringBusiness().serviceArea.geoRadius, 20000)
  })

  it('emits kitchen, city, business and website nodes', () => {
    const types = siteGraph()['@graph'].map((node) => node['@type'])
    assert.deepEqual(types, ['CateringBusiness', 'Place', 'City', 'WebSite'])
  })
})

describe('copy', () => {
  it('answers the vegetarian and delivery-area questions on the homepage FAQ', () => {
    assert.ok(faqItems.some((item) => /vegetarian/i.test(item.question)))
    assert.ok(faqItems.some((item) => /kolkata/i.test(item.question) && /deliver/i.test(item.question)))
  })

  it('puts vegetarian in every product meta title', () => {
    for (const product of products) {
      assert.match(product.metaTitle, /Vegetarian/i)
      assert.match(product.metaDescription, /vegetarian/i)
      assert.match(product.metaTitle, /Kolkata/)
    }
  })

  it('keeps locality pages unique instead of cloning one template sentence', () => {
    const ledes = serviceAreas.map((area) => area.lede)
    const h1s = serviceAreas.map((area) => area.h1)
    assert.equal(new Set(ledes).size, serviceAreas.length)
    assert.equal(new Set(h1s).size, serviceAreas.length)
    assert.ok(serviceAreas.every((area) => area.body.join(' ').length > 280))
    assert.match(serviceAreas[0].metaTitle, /Salt Lake/)
    assert.match(serviceAreas[1].metaTitle, /New Town/)
    assert.match(serviceAreas[2].metaTitle, /South Kolkata/)
  })
})

describe('discovery', () => {
  it('lists the vegetarian page, then the geo hub and locality pages', () => {
    const urls = sitemap().map((entry) => entry.url)
    assert.equal(urls[1], `${site.url}/vegetarian-catering-kolkata`)
    assert.ok(urls.includes(`${site.url}/catering-across-kolkata`))
    for (const area of serviceAreas) {
      assert.ok(urls.includes(`${site.url}/${area.slug}`))
    }
    assert.ok(urls.every((url) => url.startsWith(site.url)))
    assert.ok(sitemap().every((entry) => entry.lastModified instanceof Date))
  })

  it('aliases keyword and neighbourhood URLs onto real pages', () => {
    const bySource = Object.fromEntries(seoRedirects.map((rule) => [rule.source, rule.destination]))
    assert.equal(bySource['/vegetarian-catering'], '/vegetarian-catering-kolkata')
    assert.equal(bySource['/bidhannagar-catering'], '/salt-lake-catering')
    assert.equal(bySource['/rajarhat-catering'], '/new-town-catering')
    assert.equal(bySource['/alipore-catering'], '/south-kolkata-catering')
    assert.equal(bySource['/areas'], '/catering-across-kolkata')
  })
})
