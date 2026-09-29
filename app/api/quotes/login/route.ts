import { NextResponse } from 'next/server'
import { checkPassword, createSessionToken, isAuthConfigured, QUOTE_COOKIE, SESSION_DAYS } from '@/lib/quote-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!checkPassword(password)) {
    // A short pause makes guessing the password by script slow.
    await new Promise((resolve) => setTimeout(resolve, 800))
    return NextResponse.json({ ok: false, error: 'wrong-password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(QUOTE_COOKIE, createSessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
  return response
}
