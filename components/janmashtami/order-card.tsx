'use client'

import { useState } from 'react'
import {
  JANMASHTAMI_CONFIG,
  type JanmashtamiOrderPayload,
} from '@/lib/janmashtami-config'
import { OrderConfirmationModal } from './order-confirmation-modal'

export function OrderCard() {
  const [quantity, setQuantity] = useState<number>(1)
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [area, setArea] = useState('')
  const [pincode, setPincode] = useState('')
  const [deliveryDate, setDeliveryDate] = useState<'3 September' | '4 September'>('3 September')
  const [deliverySlot, setDeliverySlot] = useState(JANMASHTAMI_CONFIG.deliverySlots[0])
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<JanmashtamiOrderPayload | null>(null)

  // Calculations
  const pricePerBox = JANMASHTAMI_CONFIG.pricePerBox
  const deliveryFee = JANMASHTAMI_CONFIG.deliveryFee
  const piecesPerBox = JANMASHTAMI_CONFIG.piecesPerBox

  const subtotal = pricePerBox !== null ? pricePerBox * quantity : null
  const total = subtotal !== null ? subtotal + (deliveryFee || 0) : null

  const handleQuantitySelect = (q: number) => {
    if (q >= JANMASHTAMI_CONFIG.minBoxes && q <= JANMASHTAMI_CONFIG.maxBoxes) {
      setQuantity(q)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Basic client validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter your full name.')
      return
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '')
    if (cleanMobile.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for order coordination.')
      return
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setFormError('Please enter your delivery street address / flat details.')
      return
    }

    if (!area.trim() || area.trim().length < 2) {
      setFormError('Please specify your Kolkata locality/area (e.g. Salt Lake, New Town, Alipore).')
      return
    }

    const cleanPincode = pincode.replace(/\D/g, '')
    if (cleanPincode.length !== 6) {
      setFormError('Please enter a 6-digit Kolkata delivery pincode.')
      return
    }

    if (deliveryDate !== '3 September' && deliveryDate !== '4 September') {
      setFormError(JANMASHTAMI_CONFIG.orderDateRestrictionNotice)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders/janmashtami', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber: cleanMobile,
          deliveryAddress,
          area,
          pincode: cleanPincode,
          deliveryDate,
          deliverySlot,
          quantity,
          specialInstructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order. Please try again.')
      }

      setCompletedOrder(data.order)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message)
      } else {
        setFormError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCompletedOrder(null)
    setQuantity(1)
    setFullName('')
    setMobileNumber('')
    setDeliveryAddress('')
    setArea('')
    setPincode('')
    setSpecialInstructions('')
    setFormError(null)
  }

  if (completedOrder) {
    return <OrderConfirmationModal order={completedOrder} onReset={handleReset} />
  }

  return (
    <div
      id="order-card"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all"
    >
      {/* Card Header */}
      <div className="border-b border-border bg-cream/60 px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
            <span className="size-1.5 rounded-full bg-terracotta animate-pulse" />
            3rd & 4th September Only
          </span>
          {pricePerBox !== null && (
            <span className="font-serif text-xl font-bold text-ink">
              ₹{pricePerBox} <span className="text-xs font-normal text-ink-soft">/ box</span>
            </span>
          )}
        </div>

        <h3 className="mt-4 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Order your Janmashtami box
        </h3>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          Orders accepted on 3rd & 4th September only. Freshly crafted in our Salt Lake kitchen.
        </p>

        {piecesPerBox !== null && (
          <p className="mt-2 text-xs font-medium text-terracotta">
            {piecesPerBox} laddus per box
          </p>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <svg
              className="mt-0.5 size-5 shrink-0 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="leading-snug">{formError}</p>
          </div>
        )}

        {/* 1. Quantity Selector */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase tracking-wider text-ink">
              1. Select Quantity
            </legend>
            <span className="text-xs text-ink-soft">
              {quantity} Box{quantity > 1 ? 'es' : ''}
              {piecesPerBox ? ` (${quantity * piecesPerBox} laddus)` : ''}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {JANMASHTAMI_CONFIG.quickQuantities.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuantitySelect(q)}
                className={`flex flex-col items-center justify-center rounded-xl border py-3 text-center transition-all ${
                  quantity === q
                    ? 'border-terracotta bg-terracotta text-primary-foreground shadow-sm'
                    : 'border-border bg-background text-ink hover:border-terracotta/50 hover:bg-cream'
                }`}
              >
                <span className="text-base font-bold sm:text-lg">{q}</span>
                <span className="text-[11px] font-medium opacity-90">
                  {q === 1 ? 'Box' : 'Boxes'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-ink-soft">Custom boxes:</span>
            <div className="inline-flex items-center rounded-lg border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => handleQuantitySelect(Math.max(JANMASHTAMI_CONFIG.minBoxes, quantity - 1))}
                aria-label="Decrease quantity"
                className="flex size-7 items-center justify-center rounded text-sm font-bold text-ink hover:bg-cream disabled:opacity-30"
                disabled={quantity <= JANMASHTAMI_CONFIG.minBoxes}
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-sm font-semibold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantitySelect(Math.min(JANMASHTAMI_CONFIG.maxBoxes, quantity + 1))}
                aria-label="Increase quantity"
                className="flex size-7 items-center justify-center rounded text-sm font-bold text-ink hover:bg-cream disabled:opacity-30"
                disabled={quantity >= JANMASHTAMI_CONFIG.maxBoxes}
              >
                +
              </button>
            </div>
          </div>
        </fieldset>

        {/* 2. Delivery Date Selection (Strictly 3rd & 4th Sept) */}
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold uppercase tracking-wider text-ink">
              2. Preferred Delivery Date
            </legend>
            <span className="text-[11px] font-medium text-terracotta">
              Strictly Janmashtami Window
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {JANMASHTAMI_CONFIG.orderDates.map((date) => (
              <label
                key={date}
                className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                  deliveryDate === date
                    ? 'border-terracotta bg-terracotta/5 text-ink ring-1 ring-terracotta'
                    : 'border-border bg-background text-ink-soft hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryDate"
                    value={date}
                    checked={deliveryDate === date}
                    onChange={() => setDeliveryDate(date)}
                    className="size-4 accent-terracotta"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink">{date}</span>
                    <span className="text-xs text-ink-soft">
                      {date === '3 September' ? 'Eve of Janmashtami' : 'Janmashtami Main Day'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Open
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-ink-soft/80">
            Note: Janmashtami orders are accepted exclusively for 3rd and 4th September.
          </p>
        </fieldset>

        {/* 3. Delivery Slot Selection */}
        <div className="space-y-3">
          <label htmlFor="delivery-slot" className="block text-sm font-semibold uppercase tracking-wider text-ink">
            3. Preferred Delivery Slot
          </label>
          <select
            id="delivery-slot"
            value={deliverySlot}
            onChange={(e) => setDeliverySlot(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            {JANMASHTAMI_CONFIG.deliverySlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Customer Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-border pt-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
              4. Delivery & Contact Details
            </h4>
            <span className="text-xs text-ink-soft">Delivery across Kolkata</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="full-name" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Banerjee"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <label htmlFor="mobile-number" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
                Mobile Number <span className="text-terracotta">*</span>
              </label>
              <input
                id="mobile-number"
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
          </div>

          <div>
            <label htmlFor="delivery-address" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
              Delivery Address <span className="text-terracotta">*</span>
            </label>
            <input
              id="delivery-address"
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Flat / House No., Building name, Street / Landmark"
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="delivery-area" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
                Kolkata Area / Locality <span className="text-terracotta">*</span>
              </label>
              <input
                id="delivery-area"
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Salt Lake, New Town, Alipore"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <label htmlFor="delivery-pincode" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
                Pincode <span className="text-terracotta">*</span>
              </label>
              <input
                id="delivery-pincode"
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit (e.g. 700064)"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
          </div>

          <div>
            <label htmlFor="special-instructions" className="block text-xs font-medium uppercase tracking-wider text-ink-soft">
              Special Instructions (Optional)
            </label>
            <input
              id="special-instructions"
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Puja timing notes, gate code, or gift message"
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>
        </div>

        {/* 5. Live Order Summary */}
        <div className="rounded-2xl border border-border bg-cream/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Order Summary
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between font-medium text-ink">
              <span>
                {JANMASHTAMI_CONFIG.name} × {quantity} {quantity === 1 ? 'box' : 'boxes'}
              </span>
              <span>{subtotal !== null ? `₹${subtotal}` : 'Conf. on request'}</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Delivery date:</span>
              <span className="font-semibold text-terracotta">{deliveryDate}</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Delivery area:</span>
              <span>{area ? `${area} (${pincode || 'Kolkata'})` : 'Kolkata'}</span>
            </div>
            {deliveryFee !== null && deliveryFee > 0 && (
              <div className="flex justify-between text-xs text-ink-soft">
                <span>Delivery:</span>
                <span>₹{deliveryFee}</span>
              </div>
            )}
            {total !== null && (
              <div className="flex items-center justify-between border-t border-border pt-3 font-serif text-lg font-bold text-ink">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-terracotta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="size-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing order...
              </span>
            ) : (
              'Place Order'
            )}
          </button>

          <p className="text-center text-xs text-ink-soft">
            No signup. Quick checkout. Delivery across Kolkata.
          </p>
        </div>
      </form>
    </div>
  )
}
