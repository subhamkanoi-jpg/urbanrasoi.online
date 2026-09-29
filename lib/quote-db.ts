import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { formatQuoteNumber, quoteTotals, todayInKolkata, type QuoteData } from './quote-calc'

/**
 * Saved quotes, in the Neon Postgres database connected through Vercel
 * (Storage → Neon). The integration sets DATABASE_URL; POSTGRES_URL is read
 * as a fallback for projects connected the older way.
 *
 * The table is created on first use, so connecting the database is the only
 * setup step. Every save keeps the full quote as JSON plus a few columns the
 * saved-quotes list searches and sorts on.
 */

export type QuoteSummary = {
  id: string
  quoteNo: string
  client: string
  eventDate: string | null
  finalTotal: number
  createdAt: string
  updatedAt: string
}

export type SavedQuote = QuoteSummary & { data: QuoteData }

export class QuoteStoreNotConfigured extends Error {
  constructor() {
    super('Quote storage is not connected (DATABASE_URL is not set).')
  }
}

let sqlClient: NeonQueryFunction<false, false> | null = null
let schemaReady: Promise<void> | null = null

function db(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) throw new QuoteStoreNotConfigured()
  sqlClient ??= neon(url)
  return sqlClient
}

export const isStoreConfigured = () => Boolean(process.env.DATABASE_URL ?? process.env.POSTGRES_URL)

async function ready(): Promise<NeonQueryFunction<false, false>> {
  const sql = db()
  schemaReady ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS quotes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      quote_no text NOT NULL UNIQUE,
      client text NOT NULL DEFAULT '',
      event_date date,
      final_total integer NOT NULL DEFAULT 0,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`
    await sql`CREATE INDEX IF NOT EXISTS quotes_updated_at_idx ON quotes (updated_at DESC)`
  })().catch((error) => {
    schemaReady = null
    throw error
  })
  await schemaReady
  return sql
}

type Row = {
  id: string
  quote_no: string
  client: string
  event_date: string | Date | null
  final_total: number
  created_at: string | Date
  updated_at: string | Date
  data?: QuoteData
}

const iso = (value: string | Date) => (value instanceof Date ? value.toISOString() : value)
// event_date is always selected as to_char(..., 'YYYY-MM-DD') text: a Postgres
// date parsed into a JS Date can land on the wrong day in some timezones.
const day = (value: string | Date | null) => (typeof value === 'string' && value ? value.slice(0, 10) : null)

function toSummary(row: Row): QuoteSummary {
  return {
    id: row.id,
    quoteNo: row.quote_no,
    client: row.client,
    eventDate: day(row.event_date),
    finalTotal: Number(row.final_total),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isQuoteId = (value: string) => UUID.test(value)

export async function listQuotes(search = '', limit = 100): Promise<QuoteSummary[]> {
  const sql = await ready()
  const term = `%${search.trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`
  const rows = (await sql`
    SELECT id, quote_no, client, to_char(event_date, 'YYYY-MM-DD') AS event_date, final_total, created_at, updated_at
    FROM quotes
    WHERE ${search.trim()} = '' OR client ILIKE ${term} OR quote_no ILIKE ${term}
    ORDER BY updated_at DESC
    LIMIT ${Math.min(Math.max(limit, 1), 500)}
  `) as Row[]
  return rows.map(toSummary)
}

export async function getQuote(id: string): Promise<SavedQuote | null> {
  if (!isQuoteId(id)) return null
  const sql = await ready()
  const rows = (await sql`SELECT *, to_char(event_date, 'YYYY-MM-DD') AS event_date FROM quotes WHERE id = ${id}`) as Row[]
  const row = rows[0]
  return row ? { ...toSummary(row), data: row.data as QuoteData } : null
}

function columns(data: QuoteData) {
  return {
    client: data.client.trim(),
    eventDate: data.eventDate || null,
    finalTotal: Math.round(quoteTotals(data).final),
  }
}

export async function createQuote(data: QuoteData): Promise<SavedQuote> {
  const sql = await ready()
  const today = todayInKolkata()
  const prefix = formatQuoteNumber(today, 0).slice(0, -2)
  const { client, eventDate, finalTotal } = columns(data)

  // Two people saving at the same moment can pick the same number; the
  // unique constraint catches it and the next attempt takes the one after.
  for (let attempt = 0; attempt < 5; attempt++) {
    const counted = (await sql`SELECT count(*)::int AS n FROM quotes WHERE quote_no LIKE ${prefix + '%'}`) as { n: number }[]
    const quoteNo = formatQuoteNumber(today, (counted[0]?.n ?? 0) + 1 + attempt)
    try {
      const rows = (await sql`
        INSERT INTO quotes (quote_no, client, event_date, final_total, data)
        VALUES (${quoteNo}, ${client}, ${eventDate}::date, ${finalTotal}, ${JSON.stringify(data)}::jsonb)
        RETURNING *, to_char(event_date, 'YYYY-MM-DD') AS event_date
      `) as Row[]
      return { ...toSummary(rows[0]), data: rows[0].data as QuoteData }
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error
    }
  }
  throw new Error('Could not allocate a quote number')
}

export async function updateQuote(id: string, data: QuoteData): Promise<SavedQuote | null> {
  if (!isQuoteId(id)) return null
  const sql = await ready()
  const { client, eventDate, finalTotal } = columns(data)
  const rows = (await sql`
    UPDATE quotes
    SET client = ${client}, event_date = ${eventDate}::date, final_total = ${finalTotal},
        data = ${JSON.stringify(data)}::jsonb, updated_at = now()
    WHERE id = ${id}
    RETURNING *, to_char(event_date, 'YYYY-MM-DD') AS event_date
  `) as Row[]
  const row = rows[0]
  return row ? { ...toSummary(row), data: row.data as QuoteData } : null
}
