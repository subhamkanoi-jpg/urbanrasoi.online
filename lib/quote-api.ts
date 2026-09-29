import { NextResponse } from 'next/server'
import { isSignedIn } from './quote-auth'
import { QuoteStoreNotConfigured } from './quote-db'

/** Shared plumbing for the /api/quotes routes. */

export async function requireStaff(): Promise<NextResponse | null> {
  if (await isSignedIn()) return null
  return NextResponse.json({ ok: false, error: 'signed-out' }, { status: 401 })
}

export function storeError(error: unknown, where: string): NextResponse {
  if (error instanceof QuoteStoreNotConfigured) {
    return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 503 })
  }
  console.error(`[quotes] ${where} failed`, error)
  return NextResponse.json({ ok: false, error: 'store-error' }, { status: 500 })
}

export const noStore = { 'Cache-Control': 'no-store' }
