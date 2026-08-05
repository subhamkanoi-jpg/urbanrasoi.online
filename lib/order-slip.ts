'use client'

import { openWhatsapp } from '@/lib/meta-tracking'
import { site } from '@/lib/site'

/**
 * Shared order-slip renderer.
 *
 * Every ordering flow on the site (à la carte, party planner, puja booking,
 * Rakhi) sends the customer's order to WhatsApp as a branded image plus a text
 * summary. This module owns the canvas drawing and the share/fallback dance so
 * the flows stay consistent and only describe *what* is on the slip.
 */

export type SlipTheme = 'brand' | 'rakhi'

export type SlipRow = {
  /** Dish or line label. Truncated with an ellipsis if it overflows. */
  name: string
  /** Short right-aligned qty, e.g. "x2" or "25 guests". */
  qty?: string
  /** Unit price column. Omit for non-priced lines. */
  price?: string
  /** Line total column. Omit for non-priced lines. */
  total?: string
}

export type SlipGroup = {
  heading: string
  rows: SlipRow[]
}

export type OrderSlip = {
  /** Small caps line under the brand name, e.g. "A LA CARTE ORDER". */
  eyebrow: string
  /** Name/phone/date lines printed under the header rule. */
  facts?: string[]
  groups: SlipGroup[]
  totalLabel?: string
  totalValue?: string
  /** Free-text note from the customer, printed in italics near the bottom. */
  note?: string
  theme?: SlipTheme
}

type Palette = {
  bg: string
  band: string
  ink: string
  muted: string
  rowAlt: string
  rule: string
}

const PALETTES: Record<SlipTheme, Palette> = {
  brand: {
    bg: '#fdf8f1',
    band: '#d4521a',
    ink: '#1e140b',
    muted: '#6b5343',
    rowAlt: '#f4ead8',
    rule: '#d8c3a6',
  },
  rakhi: {
    bg: '#fdf5e6',
    band: '#c8621a',
    ink: '#2d1a0a',
    muted: '#7a5535',
    rowAlt: '#faebd0',
    rule: '#c9973a',
  },
}

/** Drawn at 2x then scaled down by the viewer, so text stays crisp. */
const SCALE = 2
const WIDTH = 820
const PAD = 48
const ROW_H = 34
const GROUP_HEAD_H = 34

function dashedRule(ctx: CanvasRenderingContext2D, y: number, colour: string) {
  ctx.save()
  ctx.strokeStyle = colour
  ctx.lineWidth = 1
  ctx.setLineDash([3, 6])
  ctx.beginPath()
  ctx.moveTo(PAD, y)
  ctx.lineTo(WIDTH - PAD, y)
  ctx.stroke()
  ctx.restore()
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let out = text
  while (out.length > 6 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1)
  return `${out}…`
}

/** Wrap into at most `maxLines` lines, ellipsising the last one. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
      if (lines.length === maxLines - 1) break
    } else {
      line = candidate
    }
  }
  const remaining = words.slice(lines.join(' ').split(/\s+/).filter(Boolean).length).join(' ')
  lines.push(lines.length === maxLines - 1 && remaining ? fit(ctx, remaining, maxWidth) : line)
  return lines.filter(Boolean).slice(0, maxLines)
}

function measureHeight(slip: OrderSlip, ctx: CanvasRenderingContext2D): number {
  let h = 96 // brand header
  if (slip.facts?.length) h += slip.facts.length * 22 + 18
  h += 14 // rule
  for (const group of slip.groups) {
    h += GROUP_HEAD_H
    h += group.rows.length * ROW_H
    h += 10
  }
  if (slip.totalValue) h += 60
  if (slip.note) {
    ctx.font = 'italic 500 14px system-ui, sans-serif'
    h += wrap(ctx, slip.note, WIDTH - PAD * 2, 3).length * 20 + 20
  }
  h += 92 // footer
  return h
}

/** Draw the slip and hand back a PNG blob. */
export function renderOrderSlip(slip: OrderSlip): Promise<Blob> {
  const palette = PALETTES[slip.theme ?? 'brand']
  const probe = document.createElement('canvas').getContext('2d')!
  const height = measureHeight(slip, probe)

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH * SCALE
  canvas.height = height * SCALE
  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)

  // Background + top band
  ctx.fillStyle = palette.bg
  ctx.fillRect(0, 0, WIDTH, height)
  ctx.fillStyle = palette.band
  ctx.fillRect(0, 0, WIDTH, 7)

  // Brand header
  ctx.textAlign = 'center'
  ctx.fillStyle = palette.ink
  ctx.font = 'bold 14px system-ui, sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText('URBAN RASOI', WIDTH / 2, 46)
  ctx.fillStyle = palette.band
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText(slip.eyebrow.toUpperCase(), WIDTH / 2, 70)
  ctx.letterSpacing = '0px'

  let y = 88
  dashedRule(ctx, y, palette.rule)
  y += 22

  // Facts (name, phone, date…)
  if (slip.facts?.length) {
    ctx.textAlign = 'left'
    for (const fact of slip.facts) {
      ctx.fillStyle = palette.ink
      ctx.font = '500 13px system-ui, sans-serif'
      ctx.fillText(fit(ctx, fact, WIDTH - PAD * 2), PAD, y)
      y += 22
    }
    y += 8
  }

  // Groups
  for (const group of slip.groups) {
    ctx.fillStyle = palette.rowAlt
    ctx.fillRect(0, y - 16, WIDTH, GROUP_HEAD_H)
    ctx.textAlign = 'left'
    ctx.fillStyle = palette.band
    ctx.font = '700 10px system-ui, sans-serif'
    ctx.letterSpacing = '1.6px'
    ctx.fillText(group.heading.toUpperCase(), PAD, y + 5)
    ctx.letterSpacing = '0px'
    y += GROUP_HEAD_H

    for (const row of group.rows) {
      const priced = Boolean(row.total)
      ctx.textAlign = 'left'
      ctx.fillStyle = palette.ink
      ctx.font = '500 13px system-ui, sans-serif'
      const nameWidth = priced ? WIDTH - PAD * 2 - 230 : WIDTH - PAD * 2 - (row.qty ? 120 : 0)
      ctx.fillText(fit(ctx, row.name, nameWidth), PAD, y + 4)

      ctx.textAlign = 'right'
      if (row.qty) {
        ctx.fillStyle = palette.muted
        ctx.font = '500 12px system-ui, sans-serif'
        ctx.fillText(row.qty, priced ? WIDTH - PAD - 170 : WIDTH - PAD, y + 4)
      }
      if (row.price) {
        ctx.fillStyle = palette.muted
        ctx.font = '500 12px system-ui, sans-serif'
        ctx.fillText(row.price, WIDTH - PAD - 90, y + 4)
      }
      if (row.total) {
        ctx.fillStyle = palette.band
        ctx.font = '600 13px system-ui, sans-serif'
        ctx.fillText(row.total, WIDTH - PAD, y + 4)
      }
      y += ROW_H
    }
    y += 10
  }

  // Total band
  if (slip.totalValue) {
    ctx.fillStyle = palette.band
    ctx.fillRect(0, y - 6, WIDTH, 50)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 12px system-ui, sans-serif'
    ctx.letterSpacing = '2px'
    ctx.fillText((slip.totalLabel ?? 'TOTAL').toUpperCase(), PAD, y + 24)
    ctx.letterSpacing = '0px'
    ctx.textAlign = 'right'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText(slip.totalValue, WIDTH - PAD, y + 26)
    y += 60
  }

  // Customer note
  if (slip.note) {
    ctx.textAlign = 'center'
    ctx.fillStyle = palette.muted
    ctx.font = 'italic 500 14px system-ui, sans-serif'
    for (const line of wrap(ctx, `“${slip.note}”`, WIDTH - PAD * 2, 3)) {
      ctx.fillText(line, WIDTH / 2, y + 6)
      y += 20
    }
    y += 14
  }

  // Footer
  dashedRule(ctx, y, palette.rule)
  ctx.textAlign = 'center'
  ctx.fillStyle = palette.muted
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText(`Pure Vegetarian  ·  ${site.fssai}`, WIDTH / 2, y + 28)
  ctx.fillStyle = palette.ink
  ctx.font = '600 13px system-ui, sans-serif'
  ctx.fillText(`urbanrasoi.online  |  ${site.phone}`, WIDTH / 2, y + 52)

  ctx.fillStyle = palette.band
  ctx.fillRect(0, height - 7, WIDTH, 7)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas'))), 'image/png')
  })
}

export type ShareOutcome = 'shared' | 'downloaded' | 'text-only' | 'cancelled'

type ShareOptions = {
  slip: OrderSlip
  /** Plain-text order summary that accompanies the image. */
  text: string
  fileName: string
  title: string
  tracking: {
    placement: string
    contentName: string
    occasion?: string
    value?: number
    currency?: string
  }
}

/**
 * Send the order to WhatsApp as an image + text.
 *
 * Mobile gets the native share sheet with the file attached. Desktop has no
 * way to attach a file to wa.me, so the slip downloads and WhatsApp opens with
 * the text. Returns 'cancelled' when the customer dismisses the share sheet so
 * callers know not to clear the basket.
 */
export async function shareOrderSlip({ slip, text, fileName, title, tracking }: ShareOptions): Promise<ShareOutcome> {
  let blob: Blob | null = null
  try {
    blob = await renderOrderSlip(slip)
  } catch {
    blob = null
  }

  if (blob) {
    const file = new File([blob], fileName, { type: 'image/png' })
    const canShareFiles =
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })

    if (canShareFiles) {
      try {
        await navigator.share({ files: [file], text, title })
        return 'shared'
      } catch (error) {
        // Dismissing the sheet is a deliberate "not yet" — don't fall through
        // to opening WhatsApp, and don't let the caller clear the order.
        if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
      }
    } else {
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(url)
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      openWhatsapp(text, tracking)
      return 'downloaded'
    }
  }

  openWhatsapp(text, tracking)
  return 'text-only'
}
