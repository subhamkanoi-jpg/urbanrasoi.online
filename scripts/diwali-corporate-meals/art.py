"""Brand art: the orange box sleeve, sleeve doodles, marigolds and diyas."""
import math, random

def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')

ORANGE, ORANGE_DEEP, AMBER, CREAM, INK = '#ec6424', '#c94d16', '#f6b233', '#f6f1e8', '#1b1917'

# ── sleeve doodles: white line icons in the style of the real box print ──
DOODLES = {
    'bowl': '<path d="M6 22h36a18 15 0 0 1-36 0z"/><path d="M16 16c-3-4 3-6 0-10M24 16c-3-4 3-6 0-10M32 16c-3-4 3-6 0-10"/><path d="M14 40h20"/>',
    'diya': '<path d="M6 26h36c-2 9-9 14-18 14S8 35 6 26z"/><path d="M24 6c4 6 5 9 3 13-1 2-5 2-6 0-2-4-1-7 3-13z"/><path d="M12 32h24"/>',
    'roti': '<ellipse cx="24" cy="30" rx="18" ry="7"/><ellipse cx="24" cy="24" rx="18" ry="7"/><ellipse cx="24" cy="18" rx="18" ry="7"/><path d="M16 17l3 1M28 20l3-1M22 15l2 2"/>',
    'kulhad': '<path d="M12 12h24l-4 28H16z"/><path d="M12 12c4 3 20 3 24 0"/><path d="M18 6c-2-3 2-4 0-7M28 6c-2-3 2-4 0-7"/>',
    'spoon': '<ellipse cx="14" cy="14" rx="7" ry="10" transform="rotate(-40 14 14)"/><path d="M19 20l20 20"/><path d="M30 6v12M34 6v12M38 6v12M30 18c0 4 8 4 8 0M34 22v20"/>',
    'ladoo': '<circle cx="16" cy="34" r="7"/><circle cx="32" cy="34" r="7"/><circle cx="24" cy="21" r="7"/><path d="M4 42h40"/>',
    'tiffin': '<rect x="10" y="14" width="28" height="9" rx="2"/><rect x="10" y="23" width="28" height="9" rx="2"/><rect x="10" y="32" width="28" height="9" rx="2"/><path d="M16 14V7h16v7"/>',
    'chilli': '<path d="M10 14c4 18 18 26 30 24-10-4-18-12-22-26z"/><path d="M12 13c-1-4 2-7 6-6"/>',
    'leaf': '<path d="M8 40C8 20 22 8 40 8c0 18-12 32-32 32z"/><path d="M8 40L32 16"/>',
    'handi': '<path d="M10 18h28c4 6 4 14-2 20H12c-6-6-6-14-2-20z"/><path d="M8 18h32M16 12h16v6H16z"/>',
}

def doodle_pattern(pid, colour='#ffffff', opacity=0.22, size=300, stroke=2.2, seed=3):
    rng = random.Random(seed)
    names = list(DOODLES)
    g = []
    cells = 4
    step = size / cells
    for i in range(cells):
        for j in range(cells):
            n = names[(i * cells + j + seed) % len(names)]
            x = j * step + rng.random() * step * .3
            y = i * step + rng.random() * step * .3
            s = 1.15 + rng.random() * .35
            g.append('<g transform="translate(%s %s) rotate(%d 24 24) scale(%s)">%s</g>' % (f(x), f(y), rng.randint(-35, 35), f(s), DOODLES[n]))
    return ('<pattern id="%s" width="%d" height="%d" patternUnits="userSpaceOnUse"><g fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" opacity="%s">%s</g></pattern>'
            % (pid, size, size, colour, stroke, opacity, ''.join(g)))

# ── marigolds, leaves, diyas (shared with the printed quotes) ──
def marigold(sym_id, rings):
    parts = []
    for n, rad, r, fill, stroke in rings:
        for i in range(n):
            a = 2 * math.pi * i / n + rad * 0.07
            parts.append('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="1"/>' % (f(rad * math.cos(a)), f(rad * math.sin(a)), f(r), fill, stroke))
    return '<symbol id="%s" viewBox="-50 -50 100 100">%s<circle r="5" fill="#c4560c" opacity=".55"/></symbol>' % (sym_id, ''.join(parts))

SYMBOLS = (
    marigold('mo', [(17, 35, 12, '#d65a0e', '#a8430a'), (13, 25, 11, '#e9700f', '#bd520b'), (9, 15, 10, '#f38a18', '#cf6410'), (6, 6, 8, '#f9a92c', '#e07d14')]) +
    marigold('my', [(17, 35, 12, '#e99a06', '#b87604'), (13, 25, 11, '#f3b015', '#c98b08'), (9, 15, 10, '#f9c22e', '#d99d10'), (6, 6, 8, '#fdd352', '#e6ad1c')]) +
    '<symbol id="lf" viewBox="0 0 20 44"><path d="M10 0C18 10 19 26 10 44 1 26 2 10 10 0z" fill="#4f7d2a"/><path d="M10 3V41" stroke="#8fb34f" stroke-width="1"/></symbol>' +
    '''<symbol id="diya" viewBox="0 0 100 72">
<circle cx="50" cy="24" r="30" fill="url(#glow)"/>
<path d="M50 3C56 13 60 20 56 27c-2 4-10 4-12 0-4-7 0-14 6-24z" fill="url(#flame)"/>
<path d="M50 14c2 5 3 8 1.5 11-.8 1.4-2.2 1.4-3 0-1.5-3-.5-6 1.5-11z" fill="#fff6c8"/>
<path d="M48.6 28h2.8v6h-2.8z" fill="#3b2412"/>
<path d="M6 34h88c-3 19-21 30-44 30S9 53 6 34z" fill="url(#clay)"/>
<ellipse cx="50" cy="34" rx="44" ry="5.5" fill="#e48443"/>
<ellipse cx="50" cy="34" rx="36" ry="3.4" fill="#7a2f0c"/>
<path d="M14 44c6 4 12 4 18 0s12-4 18 0 12 4 18 0 12-4 18 0" fill="none" stroke="#f3c04a" stroke-width="1.6"/>
<g fill="#f3c04a"><circle cx="23" cy="52" r="1.8"/><circle cx="36" cy="55" r="1.8"/><circle cx="50" cy="56" r="1.8"/><circle cx="64" cy="55" r="1.8"/><circle cx="77" cy="52" r="1.8"/></g>
<path d="M38 64h24l-3 6H41z" fill="#8f3a12"/>
</symbol>''')

GRADIENTS = '''<radialGradient id="glow"><stop offset="0" stop-color="#ffd36b" stop-opacity=".75"/><stop offset=".45" stop-color="#ffc24a" stop-opacity=".25"/><stop offset="1" stop-color="#ffc24a" stop-opacity="0"/></radialGradient>
<linearGradient id="flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb21f"/><stop offset=".55" stop-color="#ff8a12"/><stop offset="1" stop-color="#e2500c"/></linearGradient>
<linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf6a2c"/><stop offset="1" stop-color="#8a3610"/></linearGradient>
<linearGradient id="sleeveg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2702c"/><stop offset="1" stop-color="#e05a1c"/></linearGradient>
<filter id="soft" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#2a1205" flood-opacity=".35"/></filter>
<filter id="softer" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2a1205" flood-opacity=".28"/></filter>'''

def defs_svg():
    return ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + GRADIENTS +
            doodle_pattern('dood', '#ffffff', .2, 300, 2.2, 3) + doodle_pattern('doodsm', '#ffffff', .55, 200, 2.6, 5) +
            doodle_pattern('doodink', '#9a4b2c', .1, 320, 2.2, 7) + doodle_pattern('doodcream', '#f6f1e8', .1, 320, 2.2, 9) +
            SYMBOLS + '</defs></svg>')

def sleeve(w=600, h=400, logo='/images/quote/logo.png', plain=False):
    if plain:
        return ('<g filter="url(#softer)"><rect width="%d" height="%d" rx="10" fill="url(#sleeveg)"/></g><rect width="%d" height="%d" rx="10" fill="url(#doodsm)"/>') % (w, h, w, h)
    return ('<g filter="url(#softer)"><rect width="%d" height="%d" rx="10" fill="url(#sleeveg)"/></g>'
            '<rect width="%d" height="%d" rx="10" fill="url(#doodsm)"/>'
            '<rect x="%d" y="0" width="%d" height="%d" fill="url(#sleeveg)"/>'
            '<image href="%s" x="%d" y="%d" width="64" height="64"/>'
            '<text x="%d" y="%d" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="500" font-size="22" fill="#fff" letter-spacing="1">urban rasoi</text>'
            '<text x="%d" y="%d" text-anchor="middle" font-family="Kalam, cursive" font-weight="700" font-size="30" fill="#f9c537">Hello Homesome!</text>'
            ) % (w, h, w, h, int(w * .52), int(w * .44), h, logo, int(w * .74 - 32), int(h * .2), int(w * .74), int(h * .2 + 92), int(w * .74), int(h * .2 + 140))

def toran(width=1080, strands=((30, 4), (96, 3), (162, 2), (228, 1)), flower=26, top=-6):
    g = ['<path d="M0 8H%d" stroke="#8a5a1f" stroke-width="1.6"/>' % width]
    step = flower * .82
    for x in range(14, width, 46):
        g.append('<use href="#lf" x="%d" y="12" width="12" height="26" transform="rotate(%d %d 12)"/>' % (x - 6, 18 if (x // 46) % 2 else -18, x))
    for sx, n in strands:
        for side in (sx, width - sx):
            g.append('<path d="M%d 12V%d" stroke="#8a5a1f" stroke-width="1.2"/>' % (side, 24 + n * 25))
            for k in range(n):
                g.append('<use href="#%s" x="%s" y="%s" width="26" height="26"/>' % ('my' if (k + side // 60) % 2 else 'mo', f(side - 13), f(24 + k * 25)))
            g.append('<use href="#lf" x="%d" y="%d" width="12" height="24"/>' % (side - 6, 22 + n * 25))
    i = 0
    x = flower / 2 - 4
    while x < width + flower:
        g.append('<use href="#%s" x="%s" y="%s" width="%d" height="%d"/>' % ('mo' if i % 2 else 'my', f(x - flower / 2), top, flower, flower))
        x += step
        i += 1
    return ''.join(g)
