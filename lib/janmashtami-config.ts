/**
 * Centralized Configuration for Urban Rasoi Janmashtami Special Campaign
 * 
 * IMPORTANT:
 * - Pricing, piece count per box, and delivery fee are configurable.
 * - If set to null, the UI adapts gracefully without displaying fabricated amounts.
 * - Delivery dates are strictly restricted to 3rd and 4th September.
 */

export interface JanmashtamiProductConfig {
  name: string
  edition: string
  eyebrow: string
  headline: string
  subheading: string
  heroSupport: string
  orderDates: readonly ['3 September', '4 September']
  orderDateRestrictionNotice: string
  pricePerBox: number | null
  /** Exact and verifiable, unlike the piece count. */
  boxWeightGrams: number
  /**
   * Left null on purpose: laddu are rolled by hand, so a fixed number would
   * become a promise. `piecesPerBoxRange` is what the page shows instead.
   */
  piecesPerBox: number | null
  piecesPerBoxRange: readonly [number, number]
  /**
   * No flat fee exists. Salt Lake is free above `freeDeliveryMinBoxes`;
   * everywhere else is the actual Porter fare, which is not knowable here.
   */
  deliveryFee: number | null
  freeDeliveryArea: string
  freeDeliveryMinBoxes: number
  deliveryNote: string
  minBoxes: number
  maxBoxes: number
  quickQuantities: number[]
  deliverySlots: string[]
  kitchenLocation: string
  kitchenAddress: string
  deliveryAreas: string[]
  urgencyText: string
  urgencySubtext: string
}

export const JANMASHTAMI_CONFIG: JanmashtamiProductConfig = {
  name: 'Nariyal ke Laddu',
  edition: 'Janmashtami Special',
  eyebrow: 'JANMASHTAMI SPECIAL',
  headline: 'Nariyal ke Laddu,\nmade for Janmashtami.',
  subheading: 'A simple coconut laddu, made extra special for Janmashtami.',
  heroSupport:
    'Soft, coconut-rich and freshly prepared in the Urban Rasoi kitchen — available for Janmashtami for two days only.',
  orderDates: ['3 September', '4 September'] as const,
  orderDateRestrictionNotice:
    'Janmashtami orders are available only on 3rd & 4th September.',
  pricePerBox: 379,
  boxWeightGrams: 250,
  piecesPerBox: null,
  piecesPerBoxRange: [8, 10] as const,
  deliveryFee: null,
  freeDeliveryArea: 'Salt Lake',
  freeDeliveryMinBoxes: 2,
  deliveryNote:
    'Free delivery in Salt Lake on 2 boxes or more. Anywhere else in Kolkata, delivery is charged at the actual Porter fare.',
  minBoxes: 1,
  maxBoxes: 20,
  quickQuantities: [1, 2, 4, 6],
  deliverySlots: [
    'Morning Slot (9:00 AM – 1:00 PM)',
    'Evening Slot (2:00 PM – 7:00 PM)',
  ],
  kitchenLocation: 'Salt Lake, Kolkata',
  kitchenAddress: 'AE-287, Salt Lake Sector 1, Kolkata',
  deliveryAreas: [
    'Salt Lake',
    'New Town',
    'Rajarhat',
    'South Kolkata',
    'Sector V',
    'Alipore',
    'Ballygunge',
    'Gariahat',
    'Tollygunge',
    'Howrah',
    'Dum Dum',
  ],
  urgencyText: 'ONLY 3rd & 4th SEPTEMBER',
  urgencySubtext: 'Janmashtami special · Limited production',
}

export interface JanmashtamiOrderPayload {
  orderRef: string
  fullName: string
  mobileNumber: string
  deliveryAddress: string
  area: string
  pincode: string
  deliveryDate: '3 September' | '4 September'
  deliverySlot: string
  quantity: number
  specialInstructions?: string
  subtotal: number | null
  deliveryFee: number | null
  totalAmount: number | null
  timestamp: string
}

export function generateJanmashtamiOrderRef(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `UR-JAN-${randomSuffix}`
}

export function formatWhatsAppOrderMessage(order: JanmashtamiOrderPayload): string {
  const priceDisplay =
    order.totalAmount !== null
      ? `\n*Total:* ₹${order.totalAmount}`
      : '\n*Pricing:* As per confirmed box rate'

  return `*Janmashtami Order Request — Urban Rasoi*
*Ref:* ${order.orderRef}
------------------------------
*Product:* ${JANMASHTAMI_CONFIG.name} (${JANMASHTAMI_CONFIG.edition})
*Quantity:* ${order.quantity} Box${order.quantity > 1 ? 'es' : ''}${priceDisplay}

*Customer Details:*
*Name:* ${order.fullName}
*Phone:* ${order.mobileNumber}
*Delivery Date:* ${order.deliveryDate}
*Delivery Slot:* ${order.deliverySlot}
*Delivery Address:* ${order.deliveryAddress}, ${order.area}, Kolkata - ${order.pincode}
${order.specialInstructions ? `*Special Notes:* ${order.specialInstructions}\n` : ''}------------------------------
_Order submitted via urbanrasoi.online/janmashtami_`
}
