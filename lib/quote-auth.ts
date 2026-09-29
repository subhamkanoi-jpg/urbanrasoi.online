import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Staff sign-in for the quote builder.
 *
 * One shared password, set as QUOTE_BUILDER_PASSWORD in Vercel. Signing in
 * sets an httpOnly cookie holding an expiry and an HMAC of it, so there is no
 * session table to keep. Changing the password (or QUOTE_SESSION_SECRET)
 * signs everyone out.
 */

export const QUOTE_COOKIE = 'ur_quote_session'
export const SESSION_DAYS = 30

function secret(): string | null {
  const password = process.env.QUOTE_BUILDER_PASSWORD
  if (!password) return null
  return `${process.env.QUOTE_SESSION_SECRET ?? ''}:${password}`
}

export const isAuthConfigured = () => Boolean(process.env.QUOTE_BUILDER_PASSWORD)

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function checkPassword(attempt: string): boolean {
  const password = process.env.QUOTE_BUILDER_PASSWORD
  if (!password) return false
  // Compare digests so the check takes the same time whatever the length.
  const digest = (value: string) => createHmac('sha256', 'ur-quote-password').update(value).digest('base64url')
  return safeEqual(digest(attempt), digest(password))
}

export function createSessionToken(now = Date.now()): string | null {
  const key = secret()
  if (!key) return null
  const expires = String(now + SESSION_DAYS * 24 * 60 * 60 * 1000)
  return `${expires}.${sign(expires, key)}`
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  const key = secret()
  if (!key || !token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || !/^\d+$/.test(expires)) return false
  if (Number(expires) < now) return false
  return safeEqual(signature, sign(expires, key))
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(QUOTE_COOKIE)?.value)
}
