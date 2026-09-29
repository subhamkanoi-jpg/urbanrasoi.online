'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, hasAdConsent } from '@/lib/cookie-consent'
import { captureAttribution } from '@/lib/meta-tracking'
import { getProduct } from '@/lib/products'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

function trackPath(pathname: string) {
  if (!window.fbq) return
  // Staff tool: our own visits must not land in ad audiences.
  if (pathname.startsWith('/quote-builder')) return
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
  } else if (pathname === '/plan') {
    window.fbq('track', 'ViewContent', {
      content_name: 'Party Planner',
      content_category: 'Catering',
    })
  } else if (pathname === '/order') {
    window.fbq('track', 'ViewContent', {
      content_name: 'À la carte menu',
      content_category: 'Catering',
      content_type: 'product_group',
    })
  } else if (pathname === '/rudrabhishek-catering') {
    window.fbq('track', 'ViewContent', {
      content_name: 'Rudrabhishek Puja Catering',
      content_category: 'Catering',
    })
  } else if (pathname === '/rakhi') {
    window.fbq('track', 'ViewContent', {
      content_name: 'Raksha Bandhan Festive Menu',
      content_category: 'Catering',
      content_type: 'product_group',
    })
  }
}

export function MetaPixel() {
  const pathname = usePathname()
  const [pixelId, setPixelId] = useState<string | null>(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(hasAdConsent())
    function onConsent(event: Event) {
      const detail = (event as CustomEvent<string>).detail
      setAllowed(detail === 'accepted')
    }
    window.addEventListener(CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(CONSENT_EVENT, onConsent)
  }, [])

  useEffect(() => {
    if (!allowed) return
    let cancelled = false
    fetch('/api/meta/config')
      .then((res) => res.json())
      .then((data: { pixelId?: string | null }) => {
        if (!cancelled && data.pixelId && /^\d+$/.test(data.pixelId)) setPixelId(data.pixelId)
      })
      .catch(() => {
        // Keep the build-time ID if the config route is down.
      })
    return () => {
      cancelled = true
    }
  }, [allowed])

  useEffect(() => {
    captureAttribution()
  }, [pathname])

  useEffect(() => {
    if (!allowed || !pixelId) return
    trackPath(pathname)
  }, [pathname, allowed, pixelId])

  if (!allowed || !pixelId) return null

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
