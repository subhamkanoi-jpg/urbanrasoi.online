import { NextResponse } from 'next/server'

/**
 * Exposes the (already public) Meta Pixel ID so the browser pixel can load
 * after cookie consent, including when only META_PIXEL_ID is set on the server.
 */
export async function GET() {
  return NextResponse.json({
    pixelId: process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null,
  })
}
