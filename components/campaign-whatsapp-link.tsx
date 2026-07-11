'use client'

import { useCallback, type MouseEvent, type ReactNode } from 'react'

const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const

type CampaignWhatsappLinkProps = {
  children: ReactNode
  className?: string
  placement: string
  occasion?: string
  message?: string
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function CampaignWhatsappLink({
  children,
  className,
  placement,
  occasion = 'Celebration catering',
  message,
}: CampaignWhatsappLinkProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const params = new URLSearchParams(window.location.search)
    const attribution = attributionKeys.flatMap((key) => {
      const value = params.get(key)
      return value ? [[key, value] as const] : []
    })

    const details = message ?? [
      'Hi Urban Rasoi, I am planning a celebration in Kolkata.',
      `Occasion: ${occasion}`,
      'Date:',
      'Guest count:',
      'Area:',
      'Please share suitable menu and service options.',
    ].join('\n')

    const attributionText = attribution.length
      ? `\n\nCampaign reference: ${attribution.map(([key, value]) => `${key}=${value}`).join(' | ')}`
      : ''

    window.fbq?.('trackCustom', 'WhatsAppEnquiry', {
      placement,
      occasion,
      campaign: params.get('utm_campaign') ?? 'direct',
    })

    window.open(
      `https://wa.me/919830725556?text=${encodeURIComponent(details + attributionText)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [message, occasion, placement])

  return (
    <a
      href="https://wa.me/919830725556"
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}
