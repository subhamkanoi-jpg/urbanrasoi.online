'use client'

import type { MouseEvent, ReactNode } from 'react'
import { site, whatsappUrl, defaultWhatsappMessage } from '@/lib/site'
import { openWhatsapp, trackContact } from '@/lib/meta-tracking'

type WhatsAppLinkProps = {
  children: ReactNode
  className?: string
  placement: string
  occasion?: string
  message?: string
  ariaLabel?: string
}

/**
 * Unstyled WhatsApp anchor that fires a Meta Lead event and appends campaign
 * attribution to the message before opening the chat.
 */
export function WhatsAppLink({
  children,
  className,
  placement,
  occasion,
  message = defaultWhatsappMessage,
  ariaLabel,
}: WhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    openWhatsapp(message, { placement, occasion })
  }

  return (
    <a
      href={whatsappUrl(message)}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}

type TelLinkProps = {
  children: ReactNode
  className?: string
  placement: string
}

/** Phone anchor that fires a Meta Contact event on tap. */
export function TelLink({ children, className, placement }: TelLinkProps) {
  return (
    <a
      href={`tel:${site.phone.replace(/\s/g, '')}`}
      onClick={() => trackContact(placement)}
      className={className}
    >
      {children}
    </a>
  )
}
