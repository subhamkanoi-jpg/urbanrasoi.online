'use client'

import { site, whatsappUrl } from '@/lib/site'
import {
  JANMASHTAMI_CONFIG,
  formatWhatsAppOrderMessage,
  type JanmashtamiOrderPayload,
} from '@/lib/janmashtami-config'

interface OrderConfirmationProps {
  order: JanmashtamiOrderPayload
  onReset: () => void
}

export function OrderConfirmationModal({ order, onReset }: OrderConfirmationProps) {
  const whatsappMsg = formatWhatsAppOrderMessage(order)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-heading"
      className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            Janmashtami Limited Edition
          </span>
          <h3 id="confirmation-heading" className="font-serif text-2xl font-bold text-ink sm:text-3xl">
            Order received.
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
        Thank you for choosing Urban Rasoi for Janmashtami. We have received your order details and our kitchen team is scheduling preparation.
      </p>

      {/* Order Summary Receipt Box */}
      <div className="mt-6 rounded-2xl border border-border bg-cream/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-soft">
              Order Reference
            </p>
            <p className="font-mono text-lg font-bold tracking-tight text-ink">
              {order.orderRef}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-terracotta/10 px-3 py-1 text-xs font-medium text-terracotta">
            Orders open: 3rd & 4th Sept only
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-soft">Product</dt>
            <dd className="font-medium text-ink">{JANMASHTAMI_CONFIG.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft">Quantity</dt>
            <dd className="font-medium text-ink">
              {order.quantity} Box{order.quantity > 1 ? 'es' : ''}
              {JANMASHTAMI_CONFIG.piecesPerBox
                ? ` (${order.quantity * JANMASHTAMI_CONFIG.piecesPerBox} laddus)`
                : ''}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft">Delivery Date</dt>
            <dd className="font-semibold text-terracotta">{order.deliveryDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft">Preferred Slot</dt>
            <dd className="font-medium text-ink">{order.deliverySlot}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-soft">Deliver to</dt>
            <dd className="font-medium text-ink">
              {order.fullName} · {order.mobileNumber}
              <br />
              {order.deliveryAddress}, {order.area}, Kolkata — {order.pincode}
            </dd>
          </div>
          {order.specialInstructions && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-soft">Special Instructions</dt>
              <dd className="font-medium text-ink">{order.specialInstructions}</dd>
            </div>
          )}
          {order.totalAmount !== null && (
            <div className="border-t border-border pt-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-semibold text-ink">Estimated Total</dt>
                <dd className="font-serif text-xl font-bold text-ink">
                  ₹{order.totalAmount}
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappUrl(whatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20ba5a]"
        >
          <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share on WhatsApp (Optional)
        </a>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-border bg-background px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
        >
          Place Another Order
        </button>
      </div>

      {/* Support Microcopy */}
      <div className="mt-6 flex flex-col gap-1 border-t border-border pt-4 text-xs text-ink-soft">
        <p>
          Need to make changes to your delivery? Call our Salt Lake kitchen directly at{' '}
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className="font-medium text-ink underline underline-offset-2 hover:text-terracotta"
          >
            {site.phone}
          </a>
          .
        </p>
        <p>Urban Rasoi · {JANMASHTAMI_CONFIG.kitchenAddress}</p>
      </div>
    </div>
  )
}
