import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductLanding } from '@/components/product-landing'
import { getProduct, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: `/${product.slug}` },
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `/${product.slug}`,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: product.heroImage, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle,
      description: product.metaDescription,
      images: [product.heroImage],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return <ProductLanding product={product} />
}
