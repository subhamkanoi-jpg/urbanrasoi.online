import { NextResponse } from 'next/server'

/**
 * Exposes the (already public) Meta Pixel ID to static pages like
 * /menu.html that can't read build-time environment variables.
 */
export async function GET() {
  return NextResponse.json({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null,
  })
}
