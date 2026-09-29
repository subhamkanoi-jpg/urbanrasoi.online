import { NextResponse } from 'next/server'
import { sanitizeQuote } from '@/lib/quote-calc'
import { getQuote, updateQuote } from '@/lib/quote-db'
import { noStore, requireStaff, storeError } from '@/lib/quote-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Context) {
  const denied = await requireStaff()
  if (denied) return denied
  const { id } = await params
  try {
    const quote = await getQuote(id)
    if (!quote) return NextResponse.json({ ok: false, error: 'not-found' }, { status: 404 })
    return NextResponse.json({ ok: true, quote }, { headers: noStore })
  } catch (error) {
    return storeError(error, 'get')
  }
}

/** Saves edits to an existing quote. Quotes are never deleted. */
export async function PUT(request: Request, { params }: Context) {
  const denied = await requireStaff()
  if (denied) return denied
  const { id } = await params
  const data = sanitizeQuote(await request.json().catch(() => null))
  if (!data) return NextResponse.json({ ok: false, error: 'bad-payload' }, { status: 400 })
  try {
    const quote = await updateQuote(id, data)
    if (!quote) return NextResponse.json({ ok: false, error: 'not-found' }, { status: 404 })
    return NextResponse.json({ ok: true, quote }, { headers: noStore })
  } catch (error) {
    return storeError(error, 'update')
  }
}
