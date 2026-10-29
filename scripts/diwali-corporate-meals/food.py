"""Flat, top-down food illustrations for meal-box compartments.

Every painter takes (x, y, w, h, rng) in tray units and returns SVG markup; the caller clips
it to the compartment. Textures are built from many small seeded shapes so they read as food
rather than flat fills, while staying in the flat-illustration style of the box sleeve.
"""
import math

def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')

def scatter(rng, x, y, w, h, n, pad=0):
    for _ in range(n):
        yield x + pad + rng.random() * (w - 2 * pad), y + pad + rng.random() * (h - 2 * pad)

def base(x, y, w, h, c1, c2):
    gid = 'g%d' % (abs(hash((x, y, w, h, c1))) % 10**8)
    return ('<defs><radialGradient id="%s" cx=".45" cy=".4" r=".8"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient></defs>'
            '<rect x="%s" y="%s" width="%s" height="%s" fill="url(#%s)"/>') % (gid, c1, c2, f(x), f(y), f(w), f(h), gid)

def grains(rng, x, y, w, h, n, cols, size=(7, 2.6)):
    out = []
    for gx, gy in scatter(rng, x, y, w, h, n):
        out.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" transform="rotate(%d %s %s)"/>' % (
            f(gx), f(gy), f(size[0] * (0.8 + rng.random() * 0.4)), f(size[1]), rng.choice(cols), rng.randint(0, 180), f(gx), f(gy)))
    return ''.join(out)

def bits(rng, x, y, w, h, n, cols, r=(3, 6), shape='circle'):
    out = []
    for bx, by in scatter(rng, x, y, w, h, n, 6):
        c = rng.choice(cols)
        rr = r[0] + rng.random() * (r[1] - r[0])
        if shape == 'circle':
            out.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (f(bx), f(by), f(rr), c))
        else:
            out.append('<rect x="%s" y="%s" width="%s" height="%s" rx="1.5" fill="%s" transform="rotate(%d %s %s)"/>' % (
                f(bx - rr), f(by - rr), f(rr * 2), f(rr * 2), c, rng.randint(0, 90), f(bx), f(by)))
    return ''.join(out)

def leaves(rng, x, y, w, h, n, col='#3f7a2a'):
    out = []
    for lx, ly in scatter(rng, x, y, w, h, n, 10):
        a = rng.randint(0, 360)
        out.append('<path d="M%s %sc3-5 9-6 12-3-3 5-9 6-12 3z" fill="%s" transform="rotate(%d %s %s)"/>' % (f(lx), f(ly), col, a, f(lx), f(ly)))
    return ''.join(out)

def swirl(cx, cy, r, col='#fff8ec', width=5):
    pts = []
    for i in range(70):
        t = i / 69 * 4.2 * math.pi
        rr = r * (0.15 + 0.85 * i / 69)
        pts.append('%s %s' % (f(cx + rr * math.cos(t)), f(cy + rr * math.sin(t) * 0.8)))
    return '<path d="M%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round" opacity=".9"/>' % (' L'.join(pts), col, width)

def cubes(rng, x, y, w, h, n, col='#fbefd6', edge='#e2b27a', s=(22, 30)):
    out = []
    for cx, cy in scatter(rng, x, y, w, h, n, 26):
        sz = s[0] + rng.random() * (s[1] - s[0])
        a = rng.randint(-25, 25)
        out.append('<g transform="rotate(%d %s %s)"><rect x="%s" y="%s" width="%s" height="%s" rx="4" fill="%s"/>'
                   '<rect x="%s" y="%s" width="%s" height="%s" rx="3" fill="%s" opacity=".55"/></g>' % (
                       a, f(cx), f(cy), f(cx - sz / 2), f(cy - sz / 2), f(sz), f(sz), edge,
                       f(cx - sz / 2 + 2), f(cy - sz / 2 + 2), f(sz - 6), f(sz - 6), col))
    return ''.join(out)

def balls(rng, cx_list, r, c1, c2, shine='#ffffff'):
    out = []
    for cx, cy in cx_list:
        gid = 'b%d' % (abs(hash((cx, cy, c1))) % 10**8)
        out.append('<defs><radialGradient id="%s" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient></defs>'
                   '<circle cx="%s" cy="%s" r="%s" fill="url(#%s)"/><ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity=".35"/>' % (
                       gid, c1, c2, f(cx), f(cy), f(r), gid, f(cx - r * .35), f(cy - r * .4), f(r * .28), f(r * .16), shine))
    return ''.join(out)

def discs(rng, centers, r, c1, c2, spots, spot_n=14, rings=0):
    """Fried breads, kebabs, papad: a filled disc with browned spots and an optional layered edge."""
    out = []
    for cx, cy in centers:
        gid = 'd%d' % (abs(hash((cx, cy, c1, r))) % 10**8)
        out.append('<defs><radialGradient id="%s" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient></defs>'
                   '<circle cx="%s" cy="%s" r="%s" fill="url(#%s)" stroke="%s" stroke-width="1.5"/>' % (gid, c1, c2, f(cx), f(cy), f(r), gid, c2))
        for k in range(rings):
            out.append('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.6" opacity=".55"/>' % (f(cx), f(cy), f(r * (0.82 - k * 0.2)), c2))
        for _ in range(spot_n):
            a, d = rng.random() * 6.28, rng.random() * r * .85
            out.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity=".7"/>' % (
                f(cx + d * math.cos(a)), f(cy + d * math.sin(a)), f(1.5 + rng.random() * 3.5), f(1.2 + rng.random() * 2.4), spots))
    return ''.join(out)

def cup(cx, cy, r, sauce, rim='#2c2826', bits_col=None, rng=None):
    out = '<circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (f(cx), f(cy), f(r), rim, f(cx), f(cy), f(r - 4), sauce)
    if bits_col and rng:
        out += bits(rng, cx - r * .6, cy - r * .6, r * 1.2, r * 1.2, 8, bits_col, (1.5, 3))
    return out

# ── painters ──

def pulao(x, y, w, h, rng, colour='white'):
    if colour == 'yellow':
        out = base(x, y, w, h, '#f7d36a', '#e9b53c') + grains(rng, x, y, w, h, int(w * h / 55), ['#fbe08a', '#f3c652', '#fff1b8'])
        out += bits(rng, x, y, w, h, int(w * h / 1800), ['#5a2a1a'], (2.5, 4))  # raisins
    else:
        out = base(x, y, w, h, '#f6ecd6', '#e6d6b4') + grains(rng, x, y, w, h, int(w * h / 55), ['#fffaf0', '#f3e7cc', '#ffffff'])
        out += bits(rng, x, y, w, h, int(w * h / 1300), ['#6aa33c', '#5d9433'], (4, 5.5))  # peas
    # cashews and fried onions
    for cx, cy in scatter(rng, x, y, w, h, int(w * h / 4200), 14):
        out += '<path d="M%s %sc6-9 18-9 22 0-4-4-16-4-22 0z" fill="#f0d29a" stroke="#c99c55" stroke-width="1" transform="rotate(%d %s %s)"/>' % (f(cx), f(cy), rng.randint(0, 360), f(cx), f(cy))
    for cx, cy in scatter(rng, x, y, w, h, int(w * h / 2500), 10):
        out += '<path d="M%s %sq6 -6 12 0t12 0" fill="none" stroke="#8a4a1c" stroke-width="2.4" stroke-linecap="round" transform="rotate(%d %s %s)"/>' % (f(cx), f(cy), rng.randint(0, 360), f(cx), f(cy))
    return out + leaves(rng, x, y, w, h, int(w * h / 6000) + 1)

def herbed_rice(x, y, w, h, rng):
    out = base(x, y, w, h, '#f6efe0', '#e3d6bb') + grains(rng, x, y, w, h, int(w * h / 55), ['#fffaf0', '#f2e8d2', '#ffffff'])
    return out + bits(rng, x, y, w, h, int(w * h / 500), ['#4f8a2c', '#6aa33c', '#3f7a2a'], (1.2, 2.4))

def fried_rice(x, y, w, h, rng):
    out = base(x, y, w, h, '#e9d3a6', '#cfae74') + grains(rng, x, y, w, h, int(w * h / 50), ['#f2e1bb', '#e3c58f', '#f6ead0'])
    out += bits(rng, x, y, w, h, int(w * h / 900), ['#6aa33c', '#e8742a', '#f1c232'], (3, 4.5), 'rect')
    return out + bits(rng, x, y, w, h, int(w * h / 1400), ['#7fb446'], (2, 3))

def gravy(x, y, w, h, rng, c1, c2, items='', cream=True, n=5):
    out = base(x, y, w, h, c1, c2)
    out += bits(rng, x, y, w, h, int(w * h / 700), [c2], (2, 5))  # texture
    if items == 'paneer':
        out += cubes(rng, x, y, w, h, n)
    elif items == 'potato':
        out += balls(rng, list(scatter(rng, x, y, w, h, n, 34)), 28, '#f3c25a', '#c97d22', '#fff3c2')
    elif items == 'veg':
        out += bits(rng, x, y, w, h, n * 3, ['#3d7a2a', '#e46b21', '#f2c84b', '#f7f0d8'], (6, 10), 'rect')
    if cream:
        out += swirl(x + w / 2, y + h / 2, min(w, h) * .3)
    return out + leaves(rng, x, y, w, h, 4)

def dal(x, y, w, h, rng, kind='makhani'):
    if kind == 'makhani':
        out = base(x, y, w, h, '#6b3420', '#43200f') + bits(rng, x, y, w, h, int(w * h / 260), ['#2e150a', '#57291a'], (2, 4))
        out += swirl(x + w / 2, y + h / 2, min(w, h) * .3)
        out += '<rect x="%s" y="%s" width="16" height="14" rx="3" fill="#ffe08a"/>' % (f(x + w / 2 - 8), f(y + h / 2 - 7))
    else:  # narkel cholar dal
        out = base(x, y, w, h, '#f1c04a', '#d99a20') + bits(rng, x, y, w, h, int(w * h / 320), ['#e8b034', '#f6d579'], (3, 6))
        out += bits(rng, x, y, w, h, int(w * h / 900), ['#fff8e6'], (2, 4), 'rect')  # coconut
        out += bits(rng, x, y, w, h, int(w * h / 2400), ['#5a2a1a'], (2.5, 3.5))  # raisins
    return out + leaves(rng, x, y, w, h, 3)

def breads(x, y, w, h, rng, kind='puri', n=4):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    r = min(w, h) * (0.38 if n <= 2 else 0.3)
    cs = []
    if n <= 2:
        cs = [(x + w * .42, y + h * .4), (x + w * .58, y + h * .62)]
    else:
        for i in range(n):
            cs.append((x + w / 2 + (i - (n - 1) / 2) * r * .55, y + h * .3 + i * (h * .4 / (n - 1))))
    if kind == 'paratha':
        out += discs(rng, cs, r, '#e9b65e', '#a8662a', '#7a3f14', 22, rings=3)
    elif kind == 'radhavallabhi':
        out += discs(rng, cs, r, '#f2c06a', '#b97528', '#8a4a18', 10)
    else:
        out += discs(rng, cs, r, '#f4c56d', '#c07a2a', '#8f4f1a', 8)
    return out

def kebab(x, y, w, h, rng):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    out += discs(rng, [(x + w * .34, y + h * .38), (x + w * .62, y + h * .62)], min(w, h) * .26, '#6f8a37', '#3d5420', '#2a3a14', 30)
    out += cup(x + w * .74, y + h * .26, min(w, h) * .15, '#5fa33f', bits_col=['#e9f5d8'], rng=rng)
    return out

def salad(x, y, w, h, rng):
    out = base(x, y, w, h, '#f4efe2', '#e2dac4')
    for cx, cy in scatter(rng, x, y, w, h, 4, 22):
        out += '<circle cx="%s" cy="%s" r="16" fill="#e7f2c8" stroke="#4d8a2e" stroke-width="3"/><circle cx="%s" cy="%s" r="4" fill="#cfe39a"/>' % (f(cx), f(cy), f(cx), f(cy))
    for cx, cy in scatter(rng, x, y, w, h, 4, 22):
        out += '<circle cx="%s" cy="%s" r="15" fill="none" stroke="#b03a6e" stroke-width="3"/><circle cx="%s" cy="%s" r="9" fill="none" stroke="#d784ae" stroke-width="2.4"/>' % (f(cx), f(cy), f(cx), f(cy))
    out += bits(rng, x, y, w, h, 7, ['#ef7f2c'], (4, 6), 'rect')
    cx, cy = x + w * .72, y + h * .7
    out += '<path d="M%s %sa16 16 0 0 1 32 0z" fill="#f4e04d" stroke="#cdb22a" stroke-width="2" transform="rotate(-20 %s %s)"/>' % (f(cx - 16), f(cy), f(cx), f(cy))
    return out

def papad(x, y, w, h, rng):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    r = min(w, h) * .42
    for i, (dx, dy) in enumerate([(-.12, -.06), (.1, .08)]):
        out += discs(rng, [(x + w / 2 + dx * w, y + h / 2 + dy * h)], r, '#f6e2a8', '#d8b66a', '#9a6a2a', 26)
    return out

def onion(x, y, w, h, rng):
    out = base(x, y, w, h, '#f6e9ee', '#e9d2dc')
    for cx, cy in scatter(rng, x, y, w, h, 9, 14):
        out += '<path d="M%s %sq14 -10 28 0" fill="none" stroke="#c0457e" stroke-width="3.2" stroke-linecap="round" transform="rotate(%d %s %s)"/>' % (f(cx - 14), f(cy), rng.randint(0, 360), f(cx), f(cy))
    out += leaves(rng, x, y, w, h, 3)
    cx, cy = x + w * .3, y + h * .72
    return out + '<path d="M%s %sa14 14 0 0 1 28 0z" fill="#9fcb52" stroke="#6e9a2a" stroke-width="2"/>' % (f(cx - 14), f(cy))

def syrup_sweet(x, y, w, h, rng, kind='gulab'):
    if kind == 'gulab':
        out = base(x, y, w, h, '#c98a3a', '#8e5420')
        r = min(w, h) * .26
        out += balls(rng, [(x + w * .36, y + h * .45), (x + w * .64, y + h * .58)], r, '#8a3f1c', '#4a1c0a')
        out += bits(rng, x, y, w, h, 6, ['#9cc55a'], (2, 3), 'rect')  # pistachio
    else:  # baked gur rasogolla
        out = base(x, y, w, h, '#c47a2c', '#7e4214')
        r = min(w, h) * .25
        out += balls(rng, [(x + w * .36, y + h * .42), (x + w * .64, y + h * .6)], r, '#e2a75a', '#a5601f', '#fff2cf')
    return out

def chutney(x, y, w, h, rng):
    out = base(x, y, w, h, '#b8321e', '#7d1c0e') + bits(rng, x, y, w, h, int(w * h / 500), ['#5a1a0c', '#d8572e'], (2, 4))
    return out + bits(rng, x, y, w, h, 6, ['#6b3a1a'], (5, 7))  # dates

def noodles(x, y, w, h, rng):
    out = base(x, y, w, h, '#e3c27f', '#c9a05a')
    for _ in range(int(w * h / 260)):
        sx, sy = x + rng.random() * w, y + rng.random() * h
        a = rng.random() * 6.28
        pts = []
        for k in range(7):
            pts.append('%s %s' % (f(sx + k * 9 * math.cos(a) + 5 * math.sin(k * 1.6)), f(sy + k * 9 * math.sin(a) + 5 * math.cos(k * 1.6))))
        out += '<path d="M%s" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % (' L'.join(pts), rng.choice(['#f2d593', '#e8c272', '#f7e2ad', '#dcb15e']))
    for _ in range(int(w * h / 1600)):
        sx, sy = x + rng.random() * w, y + rng.random() * h
        a = rng.randint(0, 180)
        out += '<rect x="%s" y="%s" width="26" height="4" rx="2" fill="%s" transform="rotate(%d %s %s)"/>' % (f(sx), f(sy), rng.choice(['#d8342a', '#4f9a2e', '#f2c232', '#7fbf4a']), a, f(sx), f(sy))
    return out

def rolls(x, y, w, h, rng, n=3):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    for i in range(n):
        cy = y + h * (0.24 + i * 0.22)
        cx = x + w * .44
        L, R = w * .62, 15
        out += ('<g transform="rotate(%d %s %s)"><rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="#dfa34c" stroke="#a96a22" stroke-width="2"/>'
                '<path d="M%s %sv%s M%s %sv%s" stroke="#b87a30" stroke-width="2"/>'
                '<ellipse cx="%s" cy="%s" rx="6" ry="%s" fill="#7fa043" stroke="#a96a22" stroke-width="2"/></g>') % (
            rng.randint(-14, 14), f(cx), f(cy), f(cx - L / 2), f(cy - R), f(L), f(2 * R), f(R),
            f(cx - L / 6), f(cy - R + 3), f(2 * R - 6), f(cx + L / 6), f(cy - R + 3), f(2 * R - 6),
            f(cx + L / 2 - 2), f(cy), f(R - 2))
    out += cup(x + w * .82, y + h * .82, min(w, h) * .13, '#d8402a', bits_col=['#f6c35a'], rng=rng)
    return out

def brownie(x, y, w, h, rng):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    s = min(w, h) * .72
    bx, by = x + (w - s) / 2, y + (h - s) / 2
    out += '<rect x="%s" y="%s" width="%s" height="%s" rx="8" fill="#4a2414" stroke="#2c130a" stroke-width="2"/>' % (f(bx), f(by), f(s), f(s))
    for k in range(5):
        yy = by + s * (0.18 + k * 0.16)
        out += '<path d="M%s %sq%s -10 %s 0t%s 0" fill="none" stroke="#2a1006" stroke-width="3" stroke-linecap="round"/>' % (f(bx + 8), f(yy), f(s * .2), f(s * .4), f(s * .4))
    return out + bits(rng, bx, by, s, s, 6, ['#c9a06a'], (3, 5), 'rect')

def stroganoff(x, y, w, h, rng):
    out = herbed_rice(x, y, w * .48, h, rng)
    sx = x + w * .44
    out += '<path d="M%s %sq-14 %s 0 %s H%s V%s z" fill="#e8d2a8"/>' % (f(sx), f(y), f(h / 2), f(h), f(x + w), f(y))
    out += bits(rng, sx + 6, y, w * .56, h, int(w * h / 900), ['#d6bb8c', '#f2e2c2'], (2, 5))
    for cx, cy in scatter(rng, sx + 10, y, w * .54, h, 9, 18):
        out += '<path d="M%s %sa13 11 0 0 1 26 0h-9v9h-8v-9z" fill="#a77a4e" stroke="#7a5432" stroke-width="1.5" transform="rotate(%d %s %s)"/>' % (f(cx - 13), f(cy), rng.randint(0, 360), f(cx), f(cy))
    out += bits(rng, sx + 10, y, w * .54, h, 10, ['#e46b21', '#6aa33c', '#f2c84b'], (4, 6), 'rect')
    return out + leaves(rng, sx, y, w * .56, h, 3)

def au_gratin(x, y, w, h, rng):
    out = base(x, y, w, h, '#f1c56a', '#d4923a')
    for cx, cy in scatter(rng, x, y, w, h, int(w * h / 600), 8):
        out += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity=".75"/>' % (f(cx), f(cy), f(4 + rng.random() * 10), f(3 + rng.random() * 6), rng.choice(['#b8661f', '#c97a28', '#a35418', '#f7dc8f']))
    return out + bits(rng, x, y, w, h, 10, ['#4f8a2c'], (1.5, 2.5))

def quesadilla(x, y, w, h, rng):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    tri = [(x + w * .1, y + h * .2, 0), (x + w * .38, y + h * .5, 180)]
    for tx, ty, a in tri:
        s = min(w, h) * .62
        out += ('<g transform="rotate(%d %s %s)"><path d="M%s %sl%s 0 l-%s %sz" fill="#ecbf5d" stroke="#b47a26" stroke-width="2"/>'
                '<path d="M%s %sl%s %s M%s %sl%s %s" stroke="#9a5a1c" stroke-width="3" opacity=".6"/></g>') % (
            a, f(tx + s / 2), f(ty + s * .4), f(tx), f(ty), f(s), f(s / 2), f(s * .85),
            f(tx + s * .25), f(ty + s * .1), f(s * .2), f(s * .4), f(tx + s * .5), f(ty + s * .1), f(s * .2), f(s * .4))
    out += cup(x + w * .8, y + h * .25, min(w, h) * .15, '#cf3a22', bits_col=['#f7e7b0', '#4f9a2e'], rng=rng)
    return out

def thai_salad(x, y, w, h, rng):
    out = base(x, y, w, h, '#eef2dc', '#d6dfb6')
    for _ in range(int(w * h / 120)):
        sx, sy = x + rng.random() * w, y + rng.random() * h
        out += '<path d="M%s %sq8 -4 18 2" fill="none" stroke="%s" stroke-width="2.6" stroke-linecap="round" transform="rotate(%d %s %s)"/>' % (
            f(sx), f(sy), rng.choice(['#8a3f86', '#a64f9c', '#7fb446', '#e2862e', '#f2f2e0']), rng.randint(0, 360), f(sx), f(sy))
    return out + bits(rng, x, y, w, h, 12, ['#c9a06a'], (2.5, 4))  # peanuts

def monte_carlo(x, y, w, h, rng):
    out = base(x, y, w, h, '#f6ecd8', '#e6d4b2')
    for _ in range(int(w * h / 90)):
        sx, sy = x + rng.random() * w, y + rng.random() * h
        out += '<path d="M%s %sl7 -3 2 6z" fill="%s" transform="rotate(%d %s %s)"/>' % (f(sx), f(sy), rng.choice(['#3a1a0c', '#5a2c14', '#2a1208']), rng.randint(0, 360), f(sx), f(sy))
    return out

def garlic_bread(x, y, w, h, rng):
    out = base(x, y, w, h, '#2a2624', '#1f1c1a')
    for i in range(2):
        cx, cy = x + w * (.32 + i * .36), y + h / 2
        out += '<g transform="rotate(%d %s %s)"><rect x="%s" y="%s" width="%s" height="%s" rx="14" fill="#c98a3a"/><rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="#f2cf72"/></g>' % (
            -12 + i * 20, f(cx), f(cy), f(cx - w * .16), f(cy - h * .36), f(w * .32), f(h * .72), f(cx - w * .13), f(cy - h * .32), f(w * .26), f(h * .64))
        out += bits(rng, cx - w * .1, cy - h * .28, w * .2, h * .56, 12, ['#4f8a2c', '#d99a3a'], (1.5, 2.5))
    return out

PAINTERS = {
    'pulao': pulao, 'basanti': lambda *a: pulao(*a, colour='yellow'), 'herbed_rice': herbed_rice, 'fried_rice': fried_rice,
    'paneer_makhani': lambda x, y, w, h, r: gravy(x, y, w, h, r, '#e8742c', '#c24a18', 'paneer', True, 6),
    'jalfrezi': lambda x, y, w, h, r: gravy(x, y, w, h, r, '#d9722e', '#a84a1c', 'veg', False, 6),
    'aloo_dum': lambda x, y, w, h, r: gravy(x, y, w, h, r, '#c8521f', '#8f3312', 'potato', False, 8),
    'hot_garlic': lambda x, y, w, h, r: gravy(x, y, w, h, r, '#a62b17', '#6e160a', 'veg', False, 7),
    'dal_makhani': dal, 'cholar_dal': lambda *a: dal(*a, kind='cholar'),
    'puri': breads, 'paratha': lambda *a: breads(*a, kind='paratha', n=2), 'radhavallabhi': lambda *a: breads(*a, kind='radhavallabhi', n=4),
    'kebab': kebab, 'salad': salad, 'papad': papad, 'onion': onion, 'gulab': syrup_sweet, 'gur_rasogolla': lambda *a: syrup_sweet(*a, kind='gur'),
    'chutney': chutney, 'noodles': noodles, 'rolls': rolls, 'brownie': brownie, 'stroganoff': stroganoff, 'au_gratin': au_gratin,
    'quesadilla': quesadilla, 'thai_salad': thai_salad, 'monte_carlo': monte_carlo, 'garlic_bread': garlic_bread,
}
