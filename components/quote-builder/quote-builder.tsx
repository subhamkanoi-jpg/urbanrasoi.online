'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { QUOTE_COURSES, QUOTE_MENU, QUOTE_MENU_SECTIONS, findQuoteMenuItem, MIN_PORTIONS, type QuoteCourse, type QuoteUnit } from '@/lib/quote-menu'
import {
  formatInr,
  lineAmount,
  lineFromMenu,
  newLineId,
  portionLabel,
  quantityLabel,
  quoteTotals,
  starterQuote,
  discountLabel,
  type QuoteData,
  type QuoteLine,
  type Rounding,
} from '@/lib/quote-calc'
import type { QuoteSummary, SavedQuote } from '@/lib/quote-db'
import { QuoteSheet, type QuoteSheetHandle } from './quote-sheet'
import s from './quote-builder.module.css'

/**
 * Staff quote builder.
 *
 * Every quote is saved to the database. A new quote is saved the first time
 * it gets a client name, or earlier if you save, download, share or copy it;
 * after that every change is saved a moment after you stop typing. The quote
 * on screen is also kept in this browser so a closed tab loses nothing.
 */

type Meta = { id: string; quoteNo: string; updatedAt: string } | null
type SaveState = 'new' | 'dirty' | 'saving' | 'saved' | 'error' | 'offline'

const DRAFT_KEY = 'ur-quote-builder-draft'
const AUTOSAVE_MS = 1500

const num = (value: string) => {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function NumberInput({
  value,
  onChange,
  ...rest
}: { value: number; onChange: (value: number) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const [text, setText] = useState(String(value))
  useEffect(() => {
    if (num(text) !== value) setText(String(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <input
      {...rest}
      type="number"
      inputMode="decimal"
      value={text}
      onChange={(event) => {
        setText(event.target.value)
        onChange(num(event.target.value))
      }}
    />
  )
}

function MenuOptions() {
  return (
    <>
      {QUOTE_MENU_SECTIONS.map((section) => (
        <optgroup key={section} label={section}>
          {QUOTE_MENU.filter((item) => item.section === section).map((item) => (
            <option key={item.name} value={item.name}>
              {item.name} · ₹{item.rate}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  )
}

function readDraft(): { data: QuoteData; meta: Meta } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data?: QuoteData; meta?: Meta }
    return parsed?.data && Array.isArray(parsed.data.lines) ? { data: parsed.data, meta: parsed.meta ?? null } : null
  } catch {
    return null
  }
}

function writeDraft(data: QuoteData, meta: Meta) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, meta }))
  } catch {
    // Private browsing: the database copy is what matters.
  }
}

const fileSafe = (value: string) => value.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim()

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export function QuoteBuilder({ storeConfigured }: { storeConfigured: boolean }) {
  const [data, setData] = useState<QuoteData>(() => starterQuote())
  const [meta, setMeta] = useState<Meta>(null)
  const [saveState, setSaveState] = useState<SaveState>(storeConfigured ? 'new' : 'offline')
  const [status, setStatus] = useState('')
  const [pageCount, setPageCount] = useState(1)
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sheetRef = useRef<QuoteSheetHandle>(null)

  // Restore whatever was on screen last time.
  useEffect(() => {
    const draft = readDraft()
    if (draft) {
      setData(draft.data)
      setMeta(draft.meta)
      if (storeConfigured) setSaveState(draft.meta ? 'saved' : 'new')
    }
    setLoaded(true)
  }, [storeConfigured])

  useEffect(() => {
    if (loaded) writeDraft(data, meta)
  }, [data, meta, loaded])

  // ── Saving ──
  const dataRef = useRef(data)
  dataRef.current = data
  const metaRef = useRef(meta)
  metaRef.current = meta
  const inflight = useRef<Promise<Meta> | null>(null)

  const saveNow = useCallback(async (): Promise<Meta> => {
    if (!storeConfigured) return metaRef.current
    if (inflight.current) await inflight.current.catch(() => null)
    const current = metaRef.current
    const payload = dataRef.current
    setSaveState('saving')
    const run = (async () => {
      const response = await fetch(current ? `/api/quotes/${current.id}` : '/api/quotes', {
        method: current ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        window.location.reload()
        throw new Error('signed-out')
      }
      const body = (await response.json().catch(() => null)) as { ok?: boolean; quote?: SavedQuote; error?: string } | null
      if (!response.ok || !body?.quote) throw new Error(body?.error ?? `HTTP ${response.status}`)
      const next: Meta = { id: body.quote.id, quoteNo: body.quote.quoteNo, updatedAt: body.quote.updatedAt }
      setMeta(next)
      metaRef.current = next
      // Only mark clean if nothing changed while the request was in flight.
      setSaveState(dataRef.current === payload ? 'saved' : 'dirty')
      return next
    })()
    inflight.current = run
    try {
      return await run
    } catch (error) {
      if ((error as Error).message === 'not-configured') setSaveState('offline')
      else setSaveState('error')
      return metaRef.current
    } finally {
      if (inflight.current === run) inflight.current = null
    }
  }, [storeConfigured])

  const firstRender = useRef(true)
  useEffect(() => {
    if (!loaded) return
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!storeConfigured) return
    // New quotes wait for a client name so a quick look around saves nothing.
    if (!metaRef.current && !data.client.trim()) {
      setSaveState('new')
      return
    }
    setSaveState((state) => (state === 'saving' ? state : 'dirty'))
    const timer = setTimeout(() => void saveNow(), AUTOSAVE_MS)
    return () => clearTimeout(timer)
  }, [data, loaded, storeConfigured, saveNow])

  // ── Editing ──
  const update = (patch: Partial<QuoteData>) => setData((d) => ({ ...d, ...patch }))
  const updateLine = (id: string, patch: Partial<QuoteLine>) =>
    setData((d) => ({ ...d, lines: d.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)) }))
  const removeLine = (id: string) => setData((d) => ({ ...d, lines: d.lines.filter((line) => line.id !== id) }))

  function swapLine(id: string, name: string) {
    const item = findQuoteMenuItem(name)
    const line = data.lines.find((l) => l.id === id)
    if (!item || !line) return
    updateLine(id, { name: item.name, course: item.course, per: item.per, unit: item.unit, rate: item.rate, onMenu: true })
    setStatus(`Swapped ${line.name} for ${item.name}.`)
  }

  const [addName, setAddName] = useState('')
  const [addPortions, setAddPortions] = useState(8)
  function addFromMenu() {
    if (!findQuoteMenuItem(addName)) {
      setStatus('Choose a dish from the menu first.')
      return
    }
    setData((d) => ({ ...d, lines: [...d.lines, lineFromMenu(addName, addPortions || MIN_PORTIONS)] }))
    setStatus(`Added ${addName}.`)
    setAddName('')
  }

  const [custom, setCustom] = useState({ name: '', course: 'Mains' as QuoteCourse, per: 500, unit: 'ml' as QuoteUnit, rate: 0 })
  function addCustom(event: React.FormEvent) {
    event.preventDefault()
    const name = custom.name.trim()
    if (!name) return
    setData((d) => ({
      ...d,
      lines: [...d.lines, { id: newLineId(), name, course: custom.course, per: custom.per || 1, unit: custom.unit, rate: custom.rate, portions: addPortions || MIN_PORTIONS, onMenu: false }],
    }))
    setCustom((c) => ({ ...c, name: '', rate: 0 }))
    setStatus(`Added ${name}.`)
  }

  // ── Saved quotes ──
  const [listOpen, setListOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [quotes, setQuotes] = useState<QuoteSummary[] | null>(null)
  const [listError, setListError] = useState('')

  useEffect(() => {
    if (!listOpen || !storeConfigured) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/quotes?q=${encodeURIComponent(search)}`, { signal: controller.signal })
        const body = (await response.json()) as { quotes?: QuoteSummary[]; error?: string }
        if (!response.ok) throw new Error(body.error)
        setQuotes(body.quotes ?? [])
        setListError('')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setListError('Could not load saved quotes. Try again in a moment.')
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [listOpen, search, storeConfigured, meta?.updatedAt])

  async function openQuote(id: string) {
    if (saveState === 'dirty' || saveState === 'saving') await saveNow()
    setBusy(true)
    try {
      const response = await fetch(`/api/quotes/${id}`)
      const body = (await response.json()) as { quote?: SavedQuote }
      if (!response.ok || !body.quote) throw new Error()
      firstRender.current = true
      setData(body.quote.data)
      setMeta({ id: body.quote.id, quoteNo: body.quote.quoteNo, updatedAt: body.quote.updatedAt })
      setSaveState('saved')
      setListOpen(false)
      setStatus(`Opened ${body.quote.quoteNo}.`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('Could not open that quote. Try again.')
    }
    setBusy(false)
  }

  const [confirmNew, setConfirmNew] = useState(false)
  async function startNew() {
    const unsavedNew = !meta && storeConfigured
    if (unsavedNew && !confirmNew) {
      setConfirmNew(true)
      setTimeout(() => setConfirmNew(false), 4000)
      return
    }
    if (meta && saveState !== 'saved') await saveNow()
    setConfirmNew(false)
    firstRender.current = true
    setData(starterQuote())
    setMeta(null)
    setSaveState(storeConfigured ? 'new' : 'offline')
    setStatus('Started a new quote from the standard house party spread.')
  }

  async function duplicate() {
    if (meta && saveState !== 'saved') await saveNow()
    firstRender.current = true
    setData((d) => ({ ...d, lines: d.lines.map((line) => ({ ...line, id: newLineId() })), quoteDate: starterQuote().quoteDate }))
    setMeta(null)
    setSaveState(storeConfigured ? 'new' : 'offline')
    setStatus('Copied into a new quote. It gets its own number when saved.')
  }

  async function signOut() {
    if (saveState === 'dirty') await saveNow()
    await fetch('/api/quotes/logout', { method: 'POST' }).catch(() => null)
    window.location.reload()
  }

  // ── Output ──
  const totals = quoteTotals(data)
  const quoteNo = meta?.quoteNo ?? 'Draft'
  const baseName = () => fileSafe(`Urban Rasoi Quote ${metaRef.current?.quoteNo ?? 'Draft'}${data.client ? ` ${data.client}` : ''}`)

  async function ensureSaved() {
    if (!storeConfigured) return
    if (!metaRef.current || saveState === 'dirty' || saveState === 'error') await saveNow()
  }

  async function makePdf(): Promise<Blob> {
    const canvases = await sheetRef.current!.capture()
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    canvases.forEach((canvas, i) => {
      if (i) pdf.addPage('a4', 'portrait')
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297)
    })
    return pdf.output('blob')
  }

  async function makePng(): Promise<Blob> {
    const canvases = await sheetRef.current!.capture()
    let canvas = canvases[0]
    if (canvases.length > 1) {
      const gap = 24
      canvas = document.createElement('canvas')
      canvas.width = canvases[0].width
      canvas.height = canvases.reduce((h, c) => h + c.height, 0) + gap * (canvases.length - 1)
      const g = canvas.getContext('2d')!
      g.fillStyle = '#e9e4dd'
      g.fillRect(0, 0, canvas.width, canvas.height)
      let y = 0
      for (const c of canvases) {
        g.drawImage(c, 0, y)
        y += c.height + gap
      }
    }
    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'))
  }

  async function run(label: string, task: () => Promise<void>) {
    setBusy(true)
    setStatus(label)
    try {
      await ensureSaved()
      await task()
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setStatus('Something went wrong making the file. Try again.')
    }
    setBusy(false)
  }

  const savePdf = () =>
    run('Preparing A4 PDF…', async () => {
      downloadBlob(await makePdf(), `${baseName()}.pdf`)
      setStatus('A4 PDF downloaded.')
    })
  const savePng = () =>
    run('Preparing image…', async () => {
      downloadBlob(await makePng(), `${baseName()}.png`)
      setStatus('Image downloaded.')
    })

  const [canShare, setCanShare] = useState(false)
  useEffect(() => {
    try {
      setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [new File(['x'], 'x.pdf', { type: 'application/pdf' })] }))
    } catch {
      setCanShare(false)
    }
  }, [])
  const share = () =>
    run('Preparing to share…', async () => {
      const file = new File([await makePdf()], `${baseName()}.pdf`, { type: 'application/pdf' })
      await navigator.share({ files: [file], title: `Urban Rasoi quote ${quoteNo}` })
      setStatus('')
    })

  function whatsappText(): string {
    const lines: string[] = [`*Urban Rasoi · House Party Quote ${metaRef.current?.quoteNo ?? ''}*`.replace(/ \*$/, '*')]
    if (data.client) lines.push(`Prepared for: ${data.client}`)
    if (data.eventDate) lines.push(`Event date: ${new Date(`${data.eventDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`)
    if (data.guests) lines.push(`Guests: ${data.guests}`)
    if (data.venue) lines.push(`Venue: ${data.venue}`)
    for (const course of QUOTE_COURSES) {
      const items = data.lines.filter((l) => l.course === course && l.portions > 0)
      if (!items.length) continue
      lines.push('', `_${course === 'Service' ? 'Service staff' : course}_`)
      for (const l of items) lines.push(`• ${l.name} – ${quantityLabel(l)}${data.showPrices ? ` – ${formatInr(lineAmount(l))}` : ''}`)
    }
    lines.push('', `Food: ${formatInr(totals.food)}`)
    if (totals.service) lines.push(`Service staff: ${formatInr(totals.service)}`)
    if (totals.discount > 0) lines.push(`${discountLabel(data, totals)}: −${formatInr(totals.discount)}`)
    lines.push(`Total: ${formatInr(totals.total)}`, `*Final quote: ${formatInr(totals.final)}*`)
    const notes = data.notes.split('\n').map((n) => n.trim()).filter(Boolean)
    if (notes.length) lines.push('', ...notes.map((n) => `– ${n}`))
    lines.push('', '📞 98307 25556 · www.urbanrasoi.online')
    return lines.join('\n')
  }
  const copyText = () =>
    run('Copying…', async () => {
      await navigator.clipboard.writeText(whatsappText())
      setStatus('Quote copied. Paste it into WhatsApp.')
    })

  const saveLabel: Record<SaveState, string> = {
    new: 'Not saved yet · saves once you add a client name',
    dirty: 'Unsaved changes',
    saving: 'Saving…',
    saved: meta ? `Saved ${timeLabel(meta.updatedAt)}` : 'Saved',
    error: 'Could not save. Check your connection.',
    offline: 'Saving is off until the database is connected in Vercel',
  }

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <header className={s.top}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/quote/logo.png" alt="Urban Rasoi" width={46} height={46} />
          <div className={s.brand}>
            <span className={s.brandW}>urban rasoi</span>
            <span className={s.brandT}>
              House party<em>quote</em>
            </span>
          </div>
          <div className={s.topActions}>
            <button className={s.btn} type="button" onClick={() => setListOpen((o) => !o)} aria-expanded={listOpen}>
              Saved quotes
            </button>
            <button className={s.btn} type="button" onClick={startNew}>
              {confirmNew ? 'Discard this and start new?' : 'New quote'}
            </button>
            <button className={`${s.btn} ${s.ghost}`} type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>

        <div className={s.saveRow}>
          <span className={s.quoteNo}>{meta ? meta.quoteNo : 'New quote'}</span>
          <span className={`${s.saveState} ${saveState === 'error' || saveState === 'offline' ? s.saveBad : ''}`}>{saveLabel[saveState]}</span>
          <span className={s.saveActions}>
            {storeConfigured && (saveState === 'new' || saveState === 'dirty' || saveState === 'error') && (
              <button className={`${s.btn} ${s.small}`} type="button" onClick={() => void saveNow()}>
                Save now
              </button>
            )}
            {meta && (
              <button className={`${s.btn} ${s.small} ${s.ghost}`} type="button" onClick={duplicate}>
                Duplicate as new
              </button>
            )}
          </span>
        </div>

        {listOpen && (
          <section className={s.panel} aria-labelledby="qb-saved">
            <div className={s.phead}>
              <h2 className={s.ph} id="qb-saved">
                Saved quotes
              </h2>
              <input
                id="qb-search"
                className={s.search}
                placeholder="Search by client or quote number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {!storeConfigured ? (
              <p className={s.note}>Connect the Neon database in Vercel to keep every quote here.</p>
            ) : listError ? (
              <p className={s.error}>{listError}</p>
            ) : quotes === null ? (
              <p className={s.note}>Loading…</p>
            ) : quotes.length === 0 ? (
              <p className={s.note}>{search ? 'No quotes match that search.' : 'No saved quotes yet. Quotes appear here once they have a client name.'}</p>
            ) : (
              <ul className={s.qlist}>
                {quotes.map((q) => (
                  <li key={q.id}>
                    <button type="button" className={`${s.qrow} ${meta?.id === q.id ? s.qcurrent : ''}`} onClick={() => openQuote(q.id)} disabled={busy}>
                      <span className={s.qno}>{q.quoteNo}</span>
                      <span className={s.qclient}>{q.client || 'No client name'}</span>
                      <span className={s.qdate}>
                        {q.eventDate ? `Event ${new Date(`${q.eventDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'No event date'}
                      </span>
                      <span className={s.qtotal}>{formatInr(q.finalTotal)}</span>
                      <span className={s.qedit}>Edited {timeLabel(q.updatedAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className={s.panel} aria-labelledby="qb-details">
          <div className={s.phead}>
            <h2 className={s.ph} id="qb-details">
              Event details
            </h2>
          </div>
          <div className={s.details}>
            <label className={s.field}>
              <span className={s.lbl}>Client name</span>
              <input id="qb-client" value={data.client} onChange={(e) => update({ client: e.target.value })} placeholder="e.g. Mrs. Banerjee" />
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Event date</span>
              <input id="qb-event-date" type="date" value={data.eventDate} onChange={(e) => update({ eventDate: e.target.value })} />
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Guests</span>
              <input id="qb-guests" inputMode="numeric" value={data.guests} onChange={(e) => update({ guests: e.target.value })} placeholder="e.g. 16" />
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Venue / area</span>
              <input id="qb-venue" value={data.venue} onChange={(e) => update({ venue: e.target.value })} placeholder="e.g. Salt Lake Sector 3" />
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Quote date</span>
              <input id="qb-quote-date" type="date" value={data.quoteDate} onChange={(e) => update({ quoteDate: e.target.value })} />
            </label>
          </div>
        </section>

        <section className={s.panel} aria-labelledby="qb-menu">
          <div className={s.phead}>
            <div>
              <h2 className={s.ph} id="qb-menu">
                Menu &amp; quantities
              </h2>
              <p className={s.psub}>Rates are per portion from the house party menu. Tap Swap to replace a dish.</p>
            </div>
          </div>

          {QUOTE_COURSES.map((course) => {
            const lines = data.lines.filter((line) => line.course === course)
            if (!lines.length) return null
            return (
              <div key={course}>
                <div className={s.chead}>{course}</div>
                {lines.map((line) => {
                  const service = line.course === 'Service'
                  const low = !service && line.portions > 0 && line.portions < MIN_PORTIONS
                  return (
                    <div key={line.id} className={s.row}>
                      <div className={s.cName}>
                        <div className={s.nm}>{line.name}</div>
                        <div className={s.meta}>
                          <span>{portionLabel(line)}</span>
                          <span>·</span>
                          <b>{quantityLabel(line)}</b>
                          {!line.onMenu && <span className={s.flag}>Not on current menu</span>}
                          {low && <span className={s.warn}>Menu minimum is {MIN_PORTIONS} portions</span>}
                        </div>
                      </div>
                      <div className={s.cPort}>
                        <span className={s.rowLbl}>{service ? 'People' : 'Portions'}</span>
                        <div className={s.step}>
                          <button type="button" aria-label="Fewer" onClick={() => updateLine(line.id, { portions: Math.max(0, line.portions - 1) })}>
                            −
                          </button>
                          <NumberInput
                            id={`qb-p-${line.id}`}
                            min={0}
                            value={line.portions}
                            onChange={(v) => updateLine(line.id, { portions: Math.max(0, v) })}
                            aria-label={`${service ? 'People' : 'Portions'} for ${line.name}`}
                          />
                          <button type="button" aria-label="More" onClick={() => updateLine(line.id, { portions: line.portions + 1 })}>
                            +
                          </button>
                        </div>
                      </div>
                      <div className={s.cRate}>
                        <span className={s.rowLbl}>Rate ₹</span>
                        <NumberInput
                          id={`qb-r-${line.id}`}
                          min={0}
                          value={line.rate}
                          onChange={(v) => updateLine(line.id, { rate: Math.max(0, v) })}
                          aria-label={`Rate for ${line.name}`}
                        />
                      </div>
                      <div className={s.amt}>{formatInr(lineAmount(line))}</div>
                      <div className={s.cSwap}>
                        <label className={s.swap}>
                          ⇄ Swap
                          <select
                            id={`qb-s-${line.id}`}
                            value=""
                            onChange={(e) => swapLine(line.id, e.target.value)}
                            aria-label={`Swap ${line.name} with another dish`}
                          >
                            <option value="" disabled>
                              Swap with…
                            </option>
                            <MenuOptions />
                          </select>
                        </label>
                      </div>
                      <button className={s.del} type="button" onClick={() => removeLine(line.id)} aria-label={`Remove ${line.name}`}>
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {data.lines.length === 0 && <p className={s.note}>No dishes yet. Add them from the menu below.</p>}

          <div className={s.addbar}>
            <label className={s.field}>
              <span className={s.lbl}>Add from menu</span>
              <select id="qb-add-item" value={addName} onChange={(e) => setAddName(e.target.value)}>
                <option value="" disabled>
                  Choose a dish…
                </option>
                <MenuOptions />
              </select>
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Portions</span>
              <NumberInput id="qb-add-portions" min={0} value={addPortions} onChange={setAddPortions} />
            </label>
            <button className={`${s.btn} ${s.primary}`} type="button" onClick={addFromMenu}>
              Add dish
            </button>
          </div>
          <details className={s.custom}>
            <summary>Add an item that isn&apos;t on the menu</summary>
            <form className={s.cgrid} onSubmit={addCustom} autoComplete="off">
              <label className={`${s.field} ${s.wide}`}>
                <span className={s.lbl}>Item</span>
                <input id="qb-c-name" required value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} placeholder="e.g. Dal Makhani" />
              </label>
              <label className={s.field}>
                <span className={s.lbl}>Course</span>
                <select id="qb-c-course" value={custom.course} onChange={(e) => setCustom({ ...custom, course: e.target.value as QuoteCourse })}>
                  {QUOTE_COURSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className={s.field}>
                <span className={s.lbl}>Per portion</span>
                <NumberInput id="qb-c-per" min={0} value={custom.per} onChange={(v) => setCustom({ ...custom, per: v })} />
              </label>
              <label className={s.field}>
                <span className={s.lbl}>Unit</span>
                <select id="qb-c-unit" value={custom.unit} onChange={(e) => setCustom({ ...custom, unit: e.target.value as QuoteUnit })}>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                  <option value="portion">portion</option>
                  <option value="person">person</option>
                </select>
              </label>
              <label className={s.field}>
                <span className={s.lbl}>Rate ₹</span>
                <NumberInput id="qb-c-rate" min={0} value={custom.rate} onChange={(v) => setCustom({ ...custom, rate: v })} required />
              </label>
              <button className={s.btn} type="submit">
                Add
              </button>
            </form>
          </details>
        </section>

        <section className={s.panel} aria-labelledby="qb-options">
          <div className={s.phead}>
            <div>
              <h2 className={s.ph} id="qb-options">
                Discount &amp; options
              </h2>
              <p className={s.psub}>The discount shows once on the quote, never against a dish.</p>
            </div>
          </div>
          <div className={s.opts}>
            <label className={s.field}>
              <span className={s.lbl}>Discount %</span>
              <NumberInput id="qb-discount" min={0} max={100} step={0.5} value={data.discountPct} onChange={(v) => update({ discountPct: v })} />
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Discount applies to</span>
              <select id="qb-discount-on" value={data.discountOn} onChange={(e) => update({ discountOn: e.target.value as QuoteData['discountOn'] })}>
                <option value="food">Food only</option>
                <option value="all">Food and service</option>
              </select>
            </label>
            <label className={s.field}>
              <span className={s.lbl}>Rounding</span>
              <select id="qb-rounding" value={data.rounding} onChange={(e) => update({ rounding: e.target.value as Rounding })}>
                <option value="none">No rounding</option>
                <option value="n10">Nearest ₹10</option>
                <option value="n50">Nearest ₹50</option>
                <option value="n100">Nearest ₹100</option>
                <option value="d100">Round down to ₹100</option>
              </select>
            </label>
            <label className={s.check}>
              <input id="qb-show-prices" type="checkbox" checked={data.showPrices} onChange={(e) => update({ showPrices: e.target.checked })} /> Show dish prices to client
            </label>
          </div>
          <label className={s.field} style={{ marginTop: 12 }}>
            <span className={s.lbl}>Notes on the quote (one per line)</span>
            <textarea id="qb-notes" rows={4} value={data.notes} onChange={(e) => update({ notes: e.target.value })} />
          </label>
        </section>

        <section className={s.sheetSection} aria-labelledby="qb-quote">
          <div className={s.phead}>
            <div>
              <h2 className={s.ph} id="qb-quote">
                Client quote
              </h2>
              <p className={s.psub}>Exactly what the client receives · {pageCount > 1 ? `${pageCount} A4 pages` : '1 A4 page'}</p>
            </div>
            <div className={s.actions}>
              {canShare && (
                <button className={`${s.btn} ${s.primary}`} type="button" onClick={share} disabled={busy}>
                  Share PDF
                </button>
              )}
              <button className={`${s.btn} ${canShare ? '' : s.primary}`} type="button" onClick={savePdf} disabled={busy}>
                Save A4 PDF
              </button>
              <button className={s.btn} type="button" onClick={savePng} disabled={busy}>
                Save image
              </button>
              <button className={s.btn} type="button" onClick={copyText} disabled={busy}>
                Copy for WhatsApp
              </button>
            </div>
          </div>
          <div className={s.status} role="status">
            {status}
          </div>
          <QuoteSheet ref={sheetRef} data={data} quoteNo={quoteNo} onPageCount={setPageCount} />
        </section>
      </div>

      <div className={s.bar} aria-label="Totals">
        <div className={s.barIn}>
          <div className={s.nums}>
            <span>
              Food <b>{formatInr(totals.food)}</b>
            </span>
            {totals.service > 0 && (
              <span>
                Service <b>{formatInr(totals.service)}</b>
              </span>
            )}
            <span>
              Discount <b>−{formatInr(totals.discount)}</b>
            </span>
            <span>
              Total <b>{formatInr(totals.total)}</b>
            </span>
          </div>
          <div className={s.big}>
            <small>Final</small>
            {formatInr(totals.final)}
          </div>
        </div>
      </div>
    </div>
  )
}
