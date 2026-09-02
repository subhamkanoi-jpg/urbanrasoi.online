import { NextResponse } from 'next/server'
import {
  JANMASHTAMI_CONFIG,
  generateJanmashtamiOrderRef,
  type JanmashtamiOrderPayload,
} from '@/lib/janmashtami-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      mobileNumber,
      deliveryAddress,
      area,
      pincode,
      deliveryDate,
      deliverySlot,
      quantity,
      specialInstructions,
    } = body

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 },
      )
    }

    const cleanMobile = (mobileNumber || '').replace(/\D/g, '')
    if (cleanMobile.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 },
      )
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a complete delivery address.' },
        { status: 400 },
      )
    }

    if (!area || typeof area !== 'string' || area.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please specify your area in Kolkata.' },
        { status: 400 },
      )
    }

    const cleanPincode = (pincode || '').replace(/\D/g, '')
    if (cleanPincode.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit Kolkata pincode.' },
        { status: 400 },
      )
    }

    if (
      !deliveryDate ||
      !JANMASHTAMI_CONFIG.orderDates.includes(deliveryDate as '3 September' | '4 September')
    ) {
      return NextResponse.json(
        {
          error: JANMASHTAMI_CONFIG.orderDateRestrictionNotice,
        },
        { status: 400 },
      )
    }

    const qty = parseInt(quantity, 10)
    if (
      isNaN(qty) ||
      qty < JANMASHTAMI_CONFIG.minBoxes ||
      qty > JANMASHTAMI_CONFIG.maxBoxes
    ) {
      return NextResponse.json(
        {
          error: `Please select a quantity between ${JANMASHTAMI_CONFIG.minBoxes} and ${JANMASHTAMI_CONFIG.maxBoxes} boxes.`,
        },
        { status: 400 },
      )
    }

    // Pricing calculation (only if price configured)
    const pricePerBox = JANMASHTAMI_CONFIG.pricePerBox
    const deliveryFee = JANMASHTAMI_CONFIG.deliveryFee
    const subtotal = pricePerBox ? pricePerBox * qty : null
    const totalAmount =
      subtotal !== null ? subtotal + (deliveryFee || 0) : null

    const orderRef = generateJanmashtamiOrderRef()
    const orderPayload: JanmashtamiOrderPayload = {
      orderRef,
      fullName: fullName.trim(),
      mobileNumber: cleanMobile,
      deliveryAddress: deliveryAddress.trim(),
      area: area.trim(),
      pincode: cleanPincode,
      deliveryDate: deliveryDate as '3 September' | '4 September',
      deliverySlot: deliverySlot || JANMASHTAMI_CONFIG.deliverySlots[0],
      quantity: qty,
      specialInstructions: specialInstructions ? specialInstructions.trim() : undefined,
      subtotal,
      deliveryFee,
      totalAmount,
      timestamp: new Date().toISOString(),
    }

    // Modular dispatch: ready for DB save, webhook, email, or payment gateway creation.
    // In production, log or persist to database:
    console.log('[JANMASHTAMI ORDER RECEIVED]', orderPayload)

    return NextResponse.json({
      success: true,
      orderRef,
      order: orderPayload,
      message: 'Order received successfully.',
    })
  } catch (error) {
    console.error('Janmashtami order processing error:', error)
    return NextResponse.json(
      { error: 'Something went wrong processing your order. Please try again.' },
      { status: 500 },
    )
  }
}
