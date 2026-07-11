'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { captureAttribution } from '@/lib/meta-tracking'
import { getProduct } from '@/lib/products'

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

export function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    captureAttribution()
  }, [pathname])

  useEffect(() => {
    if (!pixelId || !window.fbq) return
    window.fbq('track', 'PageView')

    const product = getProduct(pathname.replace(/^\//, ''))
    if (product) {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: 'Catering',
        content_type: 'product',
      })
    } else if (pathname === '/kolkata-catering') {
      window.fbq('track', 'ViewContent', {
        content_name: 'Kolkata Catering Landing',
        content_category: 'Catering',
      })
    }
  }, [pathname])

  if (!pixelId) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          className="hidden"
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
