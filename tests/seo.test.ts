import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { faqItems } from '../components/conversion-sections'
import { products } from '../lib/products'
import {
  absoluteUrl,
  cateringBusiness,
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
    assert.ok(business.areaServed.some((area) => 'name' in area && area.name === 'Salt Lake'))
    assert.ok(business.makesOffer.length === products.length)
  })

  it('emits a website + business graph with stable ids', () => {
    const graph = siteGraph()
    const types = graph['@graph'].map((node) => node['@type'])
    assert.deepEqual(types, ['CateringBusiness', 'WebSite'])
    assert.equal(absoluteUrl('/vegetarian-catering-kolkata'), `${site.url}/vegetarian-catering-kolkata`)
  })
})

describe('copy', () => {
  it('answers the vegetarian question on the homepage FAQ', () => {
    assert.ok(faqItems.some((item) => /vegetarian/i.test(item.question)))
  })

  it('puts vegetarian in every product meta title', () => {
    for (const product of products) {
      assert.match(product.metaTitle, /Vegetarian/i)
      assert.match(product.metaDescription, /vegetarian/i)
      assert.match(product.metaTitle, /Kolkata/)
    }
  })
})

describe('discovery', () => {
  it('lists the vegetarian landing page first after home', () => {
    const urls = sitemap().map((entry) => entry.url)
    assert.equal(urls[1], `${site.url}/vegetarian-catering-kolkata`)
    assert.ok(urls.every((url) => url.startsWith(site.url)))
    assert.ok(sitemap().every((entry) => entry.lastModified instanceof Date))
  })

  it('aliases keyword URLs onto real pages', () => {
    const bySource = Object.fromEntries(seoRedirects.map((rule) => [rule.source, rule.destination]))
    assert.equal(bySource['/vegetarian-catering'], '/vegetarian-catering-kolkata')
    assert.equal(bySource['/house-party-catering-kolkata'], '/house-parties')
    assert.equal(bySource['/corporate-catering-kolkata'], '/corporate')
  })
})
