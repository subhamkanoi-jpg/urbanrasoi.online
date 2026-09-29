import { NextResponse } from 'next/server'
import { QUOTE_COOKIE } from '@/lib/quote-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(QUOTE_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return response
}
