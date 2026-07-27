import { formatINR, pujaMenu } from '@/lib/puja-menu'
import { site } from '@/lib/site'

/**
 * Renders the Sawan menu as a portrait JPG the host can save and forward to
 * family on WhatsApp. Personalised with guest count, price and date when set.
 */

const W = 1080
const H = 1920

const CREAM = '#FBF5EC'
const RUST = '#C0522C'
const INK = '#2B2018'
const MUTED = '#7C6A5B'
const GOLD = '#A98B45'
const OLIVE = '#6E7A4F'

type CardOptions = {
  pax?: number
  price?: number
  dateLabel?: string
  includeChai?: boolean
}

function fontStack(cssVar: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const probe = document.createElement('span')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.fontFamily = `var(${cssVar})`
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).fontFamily
  probe.remove()
  return resolved && resolved !== 'var(' + cssVar + ')' ? resolved : fallback
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Splits text into lines that each fit maxWidth with the current font. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Draws centred text, wrapping as needed. Returns the y after the last line. */
function centredLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  let cursor = y
  for (const entry of wrapLines(ctx, text, maxWidth)) {
    ctx.fillText(entry, W / 2, cursor)
    cursor += lineHeight
  }
  return cursor
}

function letterspacedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  const chars = [...text]
  return chars.reduce((sum, char) => sum + ctx.measureText(char).width + spacing, 0) - spacing
}

function letterspaced(ctx: CanvasRenderingContext2D, text: string, y: number, spacing: number) {
  const chars = [...text]
  const total = letterspacedWidth(ctx, text, spacing)
  let x = (W - total) / 2
  for (const char of chars) {
    ctx.fillText(char, x + ctx.measureText(char).width / 2, y)
    x += ctx.measureText(char).width + spacing
  }
}

function cornerBrackets(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = RUST
  ctx.lineWidth = 4
  const m = 46
  const len = 62
  const corners: [number, number, number, number][] = [
    [m, m + len, m, m], [m, m, m + len, m],
    [W - m - len, m, W - m, m], [W - m, m, W - m, m + len],
    [m, H - m - len, m, H - m], [m, H - m, m + len, H - m],
    [W - m - len, H - m, W - m, H - m], [W - m, H - m - len, W - m, H - m],
  ]
  for (const [x1, y1, x2, y2] of corners) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
}

/** Faint trishul watermark, echoing the printed menu. */
function trishul(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.strokeStyle = RUST
  ctx.globalAlpha = 0.07
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -120); ctx.lineTo(0, 190)
  ctx.moveTo(-52, -76); ctx.lineTo(-52, -140)
  ctx.moveTo(52, -76); ctx.lineTo(52, -140)
  ctx.moveTo(-52, -76); ctx.quadraticCurveTo(0, -30, 52, -76)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(0, 150, 34, 20, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function droplets(ctx: CanvasRenderingContext2D) {
  const spots: [number, number, number][] = [
    [96, 190, 9], [126, 246, 7], [88, 300, 6],
    [986, 620, 9], [946, 690, 7], [1000, 748, 6],
  ]
  ctx.fillStyle = '#9FC3D8'
  ctx.globalAlpha = 0.55
  for (const [x, y, r] of spots) {
    ctx.beginPath()
    ctx.ellipse(x, y, r * 0.75, r, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export async function renderPujaMenuJpg(options: CardOptions = {}): Promise<Blob> {
  const serif = fontStack('--font-playfair', 'Georgia, serif')
  const sans = fontStack('--font-jost', 'system-ui, sans-serif')

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      /* fall back to whatever is available */
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')

  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, W, H)
  cornerBrackets(ctx)
  droplets(ctx)
  trishul(ctx, 905, 1290, 1)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // Wordmark
  ctx.fillStyle = RUST
  ctx.beginPath()
  ctx.arc(W / 2, 138, 40, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `600 36px ${sans}`
  ctx.fillText('ur', W / 2, 151)
  ctx.fillStyle = INK
  ctx.font = `400 36px ${sans}`
  ctx.fillText('urban rasoi', W / 2, 222)
  ctx.fillStyle = MUTED
  ctx.font = `500 19px ${sans}`
  letterspaced(ctx, 'KOLKATA · PURE VEGETARIAN', 264, 4)

  // Badge — width measured with letterspacing so the text never overruns
  const badgeText = `☾  SAWAN · RUDRA ABHISHEK MENU`
  ctx.font = `600 23px ${sans}`
  const badgeWidth = letterspacedWidth(ctx, badgeText, 3) + 84
  ctx.fillStyle = RUST
  roundRect(ctx, (W - badgeWidth) / 2, 300, badgeWidth, 62, 31)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  letterspaced(ctx, badgeText, 339, 3)

  ctx.fillStyle = GOLD
  ctx.font = `600 20px ${sans}`
  letterspaced(ctx, 'LIMITED SAWAN BOOKINGS', 404, 4)

  // Title
  ctx.fillStyle = INK
  ctx.font = `700 72px ${serif}`
  ctx.fillText('Family Get-Together', W / 2, 490)
  ctx.fillStyle = RUST
  ctx.font = `italic 700 72px ${serif}`
  ctx.fillText('Catering', W / 2, 570)

  // Promise
  ctx.fillStyle = MUTED
  ctx.font = `italic 400 28px ${serif}`
  let y = centredLines(ctx, pujaMenu.promise, 628, 780, 40)

  // Divider
  y += 18
  ctx.strokeStyle = '#D9CDBC'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(310, y); ctx.lineTo(470, y)
  ctx.moveTo(610, y); ctx.lineTo(770, y)
  ctx.stroke()
  ctx.fillStyle = OLIVE
  ctx.font = `400 30px ${serif}`
  ctx.fillText('✿', W / 2, y + 11)

  const courses = options.includeChai
    ? [...pujaMenu.courses, pujaMenu.addOnCourse]
    : [...pujaMenu.courses]

  /* The bottom block is anchored to the footer, so measure the courses first
     and tighten them until everything clears. */
  const hasPlan = Boolean(options.pax && options.price)
  const bottomBlockHeight = 92 + (hasPlan ? 112 : 0) + 108 + 44
  const coursesTop = y + 58
  const coursesBudget = H - 110 - bottomBlockHeight - coursesTop

  const variants = [
    { font: 32, lineHeight: 44, labelGap: 42, gap: 26 },
    { font: 30, lineHeight: 41, labelGap: 39, gap: 20 },
    { font: 28, lineHeight: 38, labelGap: 36, gap: 15 },
    { font: 26, lineHeight: 35, labelGap: 33, gap: 11 },
  ]

  const measure = (v: (typeof variants)[number]): number => {
    let total = 0
    for (const course of courses) {
      ctx.font = `700 ${v.font}px ${serif}`
      const lines = wrapLines(ctx, course.items.join('  ·  '), 940)
      total += v.labelGap + lines.length * v.lineHeight + v.gap
    }
    return total
  }

  const layout = variants.find((v) => measure(v) <= coursesBudget) ?? variants[variants.length - 1]

  // Courses
  y = coursesTop
  for (const course of courses) {
    ctx.fillStyle = GOLD
    ctx.font = `600 20px ${sans}`
    letterspaced(ctx, `·  ${course.name.toUpperCase()}  ·`, y, 4)
    y += layout.labelGap
    ctx.fillStyle = INK
    ctx.font = `700 ${layout.font}px ${serif}`
    y = centredLines(ctx, course.items.join('  ·  '), y, 940, layout.lineHeight)
    y += layout.gap
  }

  /* Bottom block, anchored upward from the footer. */
  const footerY = H - 88
  let bottom = footerY - 44

  // Ekadashi note
  ctx.fillStyle = MUTED
  ctx.font = `italic 400 23px ${serif}`
  ctx.fillText(pujaMenu.ekadashiNote, W / 2, bottom)
  bottom -= 52

  // Closing lines (drawn bottom-up)
  ctx.fillStyle = INK
  ctx.font = `italic 400 36px ${serif}`
  for (const line of [...pujaMenu.closingLine].reverse()) {
    ctx.fillText(line, W / 2, bottom)
    bottom -= 48
  }
  bottom -= 12

  // Personalised plan
  if (hasPlan) {
    const bits = [`${options.pax} guests`, formatINR(options.price!)]
    if (options.dateLabel) bits.push(options.dateLabel)
    const planText = bits.join('   ·   ')
    ctx.fillStyle = MUTED
    ctx.font = `400 19px ${sans}`
    ctx.fillText('Staff & disposables included', W / 2, bottom)
    bottom -= 34
    ctx.font = `600 26px ${sans}`
    const planWidth = ctx.measureText(planText).width + 80
    ctx.fillStyle = '#F3E7D6'
    roundRect(ctx, (W - planWidth) / 2, bottom - 40, planWidth, 58, 14)
    ctx.fill()
    ctx.fillStyle = RUST
    ctx.font = `600 26px ${sans}`
    ctx.fillText(planText, W / 2, bottom)
    bottom -= 74
  }

  // Satvik pill
  ctx.font = `600 21px ${sans}`
  const satvik = pujaMenu.satvikNote.toUpperCase()
  const pillWidth = letterspacedWidth(ctx, satvik, 4) + 96
  ctx.strokeStyle = OLIVE
  ctx.lineWidth = 2
  roundRect(ctx, (W - pillWidth) / 2, bottom - 38, pillWidth, 56, 28)
  ctx.stroke()
  ctx.fillStyle = OLIVE
  letterspaced(ctx, satvik, bottom, 4)

  // Footer
  ctx.fillStyle = RUST
  ctx.font = `600 23px ${sans}`
  letterspaced(ctx, `TO BOOK · WHATSAPP ${site.phone.replace('+91 ', '')}`, footerY, 3)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not create image'))),
      'image/jpeg',
      0.92,
    )
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}
