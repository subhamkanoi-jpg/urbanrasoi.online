import { NextResponse } from 'next/server'
import { sanitizeQuote } from '@/lib/quote-calc'
import { createQuote, listQuotes } from '@/lib/quote-db'
import { noStore, requireStaff, storeError } from '@/lib/quote-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Saved quotes, most recently edited first. `?q=` searches client and quote number. */
export async function GET(request: Request) {
  const denied = await requireStaff()
  if (denied) return denied
  const search = new URL(request.url).searchParams.get('q') ?? ''
  try {
    const quotes = await listQuotes(search.slice(0, 80))
    return NextResponse.json({ ok: true, quotes }, { headers: noStore })
  } catch (error) {
    return storeError(error, 'list')
  }
}

/** Saves a new quote and gives it the next quote number for today. */
export async function POST(request: Request) {
  const denied = await requireStaff()
  if (denied) return denied
  const data = sanitizeQuote(await request.json().catch(() => null))
  if (!data) return NextResponse.json({ ok: false, error: 'bad-payload' }, { status: 400 })
  try {
    const quote = await createQuote(data)
    return NextResponse.json({ ok: true, quote }, { headers: noStore })
  } catch (error) {
    return storeError(error, 'create')
  }
}
