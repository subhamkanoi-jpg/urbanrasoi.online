'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { site } from '@/lib/site'
import { QUOTE_COURSES } from '@/lib/quote-menu'
import { discountLabel, formatInr, lineAmount, quantityLabel, quoteTotals, type QuoteData, type QuoteLine } from '@/lib/quote-calc'
import s from './quote-builder.module.css'

/**
 * The client-facing quote, laid out on A4 pages (794 × 1123 px, which is
 * 210 × 297 mm at 96 dpi). Every block is measured off-screen first, then
 * dealt onto pages so a long menu flows onto page two instead of being cut.
 */

export const PAGE_W = 794
export const PAGE_H = 1123

export type QuoteSheetHandle = {
  /** Renders each A4 page to a canvas at 2× for the image and PDF exports. */
  capture: () => Promise<HTMLCanvasElement[]>
}

type Block = { key: string; node: ReactNode }

const fmtDate = (value: string) => {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ItemRow({ line, showPrices }: { line: QuoteLine; showPrices: boolean }) {
  const service = line.course === 'Service'
  return (
    <div className={s.sIt}>
      <div className={s.sName}>{line.name}</div>
      <div className={s.sQty}>
        {quantityLabel(line)}
        {!service && line.unit !== 'portion' ? ` · ${line.portions} portions` : ''}
        {showPrices ? ` × ₹${line.rate.toLocaleString('en-IN')}` : ''}
      </div>
      {showPrices && <div className={s.sPrice}>{formatInr(lineAmount(line))}</div>}
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1d1a17"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
      />
    </svg>
  )
}

type Props = { data: QuoteData; quoteNo: string; onPageCount?: (pages: number) => void }

export const QuoteSheet = forwardRef<QuoteSheetHandle, Props>(function QuoteSheet({ data, quoteNo, onPageCount }, ref) {
  const totals = quoteTotals(data)
  const live = data.lines.filter((line) => line.portions > 0)

  const blocks: Block[] = []
  for (const course of QUOTE_COURSES) {
    const lines = live.filter((line) => line.course === course)
    if (!lines.length) continue
    blocks.push({
      key: `h-${course}`,
      node: (
        <div>
          <div className={s.sHead}>
            <h4>{course === 'Service' ? 'Service staff · 3–4 hrs' : course}</h4>
            <div className={s.sRule} />
          </div>
          <ItemRow line={lines[0]} showPrices={data.showPrices} />
        </div>
      ),
    })
    for (const line of lines.slice(1)) blocks.push({ key: line.id, node: <ItemRow line={line} showPrices={data.showPrices} /> })
  }

  const notes = data.notes.split('\n').map((n) => n.trim()).filter(Boolean)
  const rounded = data.rounding !== 'none' && Math.round(totals.final) !== Math.round(totals.total)
  blocks.push({
    key: 'summary',
    node: (
      <div className={s.sSum}>
        <ul className={s.sNotes}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <div className={s.sBox}>
          <div className={s.sBoxHead}>Your total</div>
          <table>
            <tbody>
              <tr>
                <td>Food</td>
                <td className={s.r}>{formatInr(totals.food)}</td>
              </tr>
              {totals.service > 0 && (
                <tr>
                  <td>Service staff</td>
                  <td className={s.r}>{formatInr(totals.service)}</td>
                </tr>
              )}
              {totals.discount > 0 && (
                <tr className={s.sDisc}>
                  <td>{discountLabel(data, totals)}</td>
                  <td className={s.r}>−{formatInr(totals.discount)}</td>
                </tr>
              )}
              <tr className={s.sTot}>
                <td>Total</td>
                <td className={s.r}>{formatInr(totals.total)}</td>
              </tr>
            </tbody>
          </table>
          <div className={s.sFinal}>
            <span>{rounded ? 'Final quote (rounded)' : 'Final quote'}</span>
            <b>{formatInr(totals.final)}</b>
          </div>
          {totals.discount > 0 && <div className={s.sSave}>You save {formatInr(totals.discount)}</div>}
        </div>
      </div>
    ),
  })

  const details = (
    [
      ['Prepared for', data.client],
      ['Event date', fmtDate(data.eventDate)],
      ['Guests', data.guests],
      ['Venue', data.venue],
      ['Quote date', fmtDate(data.quoteDate)],
    ] as const
  ).filter(([, value]) => String(value || '').trim())

  const top = (
    <div className={s.sTop}>
      <div className={s.sTab}>
        <span>QUOTE</span>
        <b>{quoteNo.replace(/^UR-/, '')}</b>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.sBowl} src="/images/quote/dal-bowl.jpg" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.sLeaf1} src="/images/quote/leaf-1.png" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.sLeaf2} src="/images/quote/leaf-2.png" alt="" />
      <div className={s.sBrand}>
        <div className={s.sLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/quote/logo.png" alt="Urban Rasoi" />
          <span>urban rasoi</span>
        </div>
        <div className={s.sTitle}>
          <span className={s.sTitleA}>HOUSE PARTY</span>
          <span className={s.sTitleB}>quote</span>
        </div>
      </div>
      <div className={s.sFor}>
        {details.map(([label, value]) => (
          <div key={label}>
            <div className={s.sK}>{label}</div>
            <div className={s.sV}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const cont = (
    <div className={s.sCont}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/quote/logo.png" alt="" />
      <span>House party quote</span>
      <small>
        {quoteNo}
        {data.client ? ` · ${data.client}` : ''} · continued
      </small>
    </div>
  )

  const foot = (page: number, of: number) => (
    <div className={s.sFoot}>
      <div className={s.sCall}>
        <div className={s.sCallIcon}>
          <PhoneIcon />
        </div>
        <div>
          <div className={s.sK2}>To confirm your order</div>
          <div className={s.sPhone}>{site.phone.replace('+91 ', '')}</div>
        </div>
      </div>
      <div className={s.sMeta}>
        <span>
          <b>{site.instagramHandle}</b> · www.urbanrasoi.online
        </span>
        <span>{site.address.line}</span>
        <span>{site.fssai}</span>
      </div>
      <div className={s.sTag}>
        <span>Your party. Our kitchen.</span>
        {of > 1 && <em>Page {page} of {of}</em>}
      </div>
    </div>
  )

  // ── Pagination: measure off-screen, then deal blocks onto pages ──
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<number[][]>([blocks.map((_, i) => i)])
  const [fontsTick, setFontsTick] = useState(0)
  const layoutKey = JSON.stringify([data, quoteNo, fontsTick])

  useEffect(() => {
    document.fonts?.ready.then(() => setFontsTick((t) => t + 1)).catch(() => {})
  }, [])

  useLayoutEffect(() => {
    const root = measureRef.current
    if (!root) return
    const h = (sel: string) => (root.querySelector(sel) as HTMLElement | null)?.offsetHeight ?? 0
    const topH = h('[data-m="top"]')
    const contH = h('[data-m="cont"]')
    const footH = h('[data-m="foot"]')
    const heights = Array.from(root.querySelectorAll<HTMLElement>('[data-m="block"]')).map((el) => el.offsetHeight)
    const pad = 6
    const room = (first: boolean) => PAGE_H - (first ? topH : contH) - footH - pad

    const out: number[][] = [[]]
    let used = 0
    heights.forEach((height, index) => {
      const current = out[out.length - 1]
      if (current.length && used + height > room(out.length === 1)) {
        out.push([index])
        used = height
      } else {
        current.push(index)
        used += height
      }
    })
    setPages((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey])

  // ── Fit the 794 px pages to whatever width the screen gives us ──
  const boxRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [innerH, setInnerH] = useState(PAGE_H)
  const fit = useCallback(() => {
    const box = boxRef.current
    const inner = pagesRef.current
    if (!box || !inner) return
    setScale(Math.min(1, box.clientWidth / PAGE_W))
    setInnerH(inner.offsetHeight)
  }, [])
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [fit])
  useLayoutEffect(fit, [fit, pages, layoutKey])
  useEffect(() => onPageCount?.(pages.length), [pages.length, onPageCount])

  useImperativeHandle(ref, () => ({
    async capture() {
      const html2canvas = (await import('html2canvas')).default
      await document.fonts?.ready
      const nodes = Array.from(pagesRef.current?.querySelectorAll<HTMLElement>('[data-page]') ?? [])
      const canvases: HTMLCanvasElement[] = []
      for (const node of nodes) {
        canvases.push(
          await html2canvas(node, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            width: PAGE_W,
            height: PAGE_H,
            windowWidth: 1280,
            // The preview is scaled down to fit the phone; render the copy at full size.
            onclone: (doc) => {
              const inner = doc.querySelector<HTMLElement>('[data-pages]')
              if (inner) inner.style.transform = 'none'
              const box = doc.querySelector<HTMLElement>('[data-sheetbox]')
              if (box) {
                box.style.height = 'auto'
                box.style.overflow = 'visible'
              }
            },
          }),
        )
      }
      return canvases
    },
  }))

  const pageClass = `${s.page} ${data.showPrices ? '' : s.noPrice}`

  return (
    <>
      <div ref={measureRef} className={s.measure} aria-hidden="true">
        <div className={pageClass}>
          <div data-m="top">{top}</div>
          <div data-m="cont">{cont}</div>
          <div className={s.sBody}>
            {blocks.map((block) => (
              <div key={block.key} data-m="block">
                {block.node}
              </div>
            ))}
          </div>
          <div data-m="foot">{foot(1, 2)}</div>
        </div>
      </div>

      <div ref={boxRef} data-sheetbox className={s.sheetBox} style={{ height: innerH * scale }}>
        <div ref={pagesRef} data-pages className={s.pages} style={{ transform: `scale(${scale})` }}>
          {pages.map((indexes, p) => (
            <div key={p} data-page className={pageClass}>
              {p === 0 ? top : cont}
              <div className={s.sBody}>
                {indexes.map((i) => (blocks[i] ? <div key={blocks[i].key}>{blocks[i].node}</div> : null))}
              </div>
              {foot(p + 1, pages.length)}
            </div>
          ))}
        </div>
      </div>
    </>
  )
})
