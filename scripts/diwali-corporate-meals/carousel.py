import sys
sys.path.insert(0, sys.argv[1])
from art import defs_svg, sleeve, toran, f

OUT = sys.argv[2]
TOTAL = 8

BOXES = [
    dict(no='01', kind='North Indian', title='The Diwali Thali', line='a royal festive feast, boxed', theme='cream', photo='box-1.jpg',
         items=['Shahi Malai Kofta', 'Creamy Black Dal', 'Paneer Makhani', 'Jeera Rice', 'Paratha', 'Kebab Croquette', 'Dahi Vada', 'Kesariya Rasmalai']),
    dict(no='02', kind='Bengali', title='The Bengali Bhoj', line='Kolkata\u2019s festive table, packed to go', theme='deep', photo='box-2.jpg',
         items=['Aloo Dum', 'Cholar Dal', 'Chhanar Dalna', 'Basanti Pulao', 'Luchi', 'Veg Chop', 'Tomato Khejur Chutney', 'Rajbhog']),
    dict(no='03', kind='North Indian', title='The Festive Classic', line='all the classics, none of the fuss', theme='cream', photo='box-3.jpg',
         items=['Veg Kofta Curry', 'Kadhai Paneer', 'Dahi Vada', 'Veg Pulao', 'Paratha', 'Beetroot Cutlet', 'Gur Sandesh']),
    dict(no='04', kind='Indo-Chinese', title='The China Town Box', line='for the team that votes noodles, every time', theme='deep', photo='box-4.jpg',
         items=['Hakka Noodles', 'Schezwan Fried Rice', 'Veg Manchurian', 'Chilli Paneer']),
    dict(no='05', kind='Indo-Continental', title='The Fusion Box', line='a little desi, a little continental', theme='cream', photo='box-5.jpg',
         items=['Fusilli Arrabbiata', 'Chana Chaat', 'Jeera Rice', 'Aloo Tikki (2)', 'Paratha', 'Chocolate Bar']),
]

LOGO = '<div class="badge"><img src="/images/quote/logo.png" alt="Urban Rasoi"></div>'

def corner_flowers():
    return ('<svg class="corner tl" viewBox="0 0 160 160" aria-hidden="true"><use href="#lf" x="70" y="18" width="18" height="40" transform="rotate(60 79 38)"/>'
            '<use href="#lf" x="20" y="64" width="18" height="40" transform="rotate(-20 29 84)"/><use href="#mo" x="8" y="8" width="62" height="62"/>'
            '<use href="#my" x="58" y="34" width="40" height="40"/><use href="#my" x="30" y="62" width="34" height="34"/></svg>'
            '<svg class="corner br" viewBox="0 0 160 160" aria-hidden="true"><use href="#lf" x="70" y="18" width="18" height="40" transform="rotate(60 79 38)"/>'
            '<use href="#lf" x="20" y="64" width="18" height="40" transform="rotate(-20 29 84)"/><use href="#mo" x="8" y="8" width="62" height="62"/>'
            '<use href="#my" x="58" y="34" width="40" height="40"/><use href="#my" x="30" y="62" width="34" height="34"/></svg>')

def box_slide(i, b):
    art = ('<div class="shot"><svg class="peek" viewBox="0 0 600 400" aria-hidden="true">%s</svg>'
           '<figure><img src="%s" alt="%s, as packed by Urban Rasoi"></figure></div>') % (sleeve(plain=True), b['photo'], b['title'])
    items = ''.join('<span>%s</span>' % it for it in b['items'] + ['Cutlery'])
    return '''<section class="slide box %s">
  <div class="frame"></div>%s%s
  <p class="pill">Diwali Corporate Meals</p>
  <p class="kicker">Box %s · %s</p>
  <h2>%s</h2>
  <p class="line">%s</p>
  %s
  <div class="inbox"><h3>In the box</h3><p>%s</p></div>
  <p class="foot">Customisable for bulk orders<i></i>20 to 500+ boxes</p>
  <p class="count">%02d / %02d</p>
</section>''' % (b['theme'], corner_flowers(), LOGO, b['no'], b['kind'], b['title'], b['line'], art, items, i, TOTAL)

DIYAS = ('<svg class="diyas" viewBox="0 0 1080 120" aria-hidden="true">'
         + ''.join('<use href="#%s" x="%d" y="%d" width="%d" height="%d"/>' % s for s in [
             ('diya', 40, 40, 100, 72), ('my', 150, 82, 28, 28), ('mo', 186, 86, 24, 24), ('diya', 880, 40, 100, 72), ('mo', 900 - 50, 84, 28, 28), ('my', 820, 88, 24, 24)])
         + '</svg>')

COVER = '''<section class="slide orange cover">
  <svg class="toran" viewBox="0 -6 1080 160" aria-hidden="true">%s</svg>
  <div class="mark"><img src="/images/quote/logo.png" alt="Urban Rasoi"></div>
  <p class="hello">Hello Homesome!</p>
  <h1><span>Diwali</span>Corporate Meals</h1>
  <p class="copy">Light up the office this Diwali with festive meal boxes for the whole team, cooked fresh that morning in our 100%% vegetarian kitchen.</p>
  <figure class="photo"><img src="box-crop.jpg" alt="The Urban Rasoi meal box with its orange sleeve"></figure>
  <p class="sticker">our real box, sleeve &amp; all!<svg viewBox="0 0 120 70" aria-hidden="true"><path d="M6 8c30 4 70 18 96 50" fill="none" stroke="#f9c537" stroke-width="4" stroke-linecap="round"/><path d="M84 54l20 6-2-20" fill="none" stroke="#f9c537" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
  <p class="swipe">Swipe for 5 festive boxes <b>→</b></p>
  %s
</section>''' % (toran(), DIYAS)

ICONS = {
    'leaf': '<path d="M10 38C10 20 22 10 38 10c0 16-10 28-28 28z"/><path d="M10 38L30 18"/>',
    'sun': '<circle cx="24" cy="28" r="8"/><path d="M24 12v4M10 28H6M42 28h-4M14 18l3 3M34 18l-3 3M8 38h32"/>',
    'boxes': '<rect x="8" y="24" width="14" height="14" rx="2"/><rect x="26" y="24" width="14" height="14" rx="2"/><rect x="17" y="8" width="14" height="14" rx="2"/>',
    'seal': '<path d="M24 6l14 6v10c0 9-6 16-14 20-8-4-14-11-14-20V12z"/><path d="M17 24l5 5 9-10"/>',
    'pin': '<path d="M24 42s-13-13-13-23a13 13 0 0 1 26 0c0 10-13 23-13 23z"/><circle cx="24" cy="19" r="5"/>',
    'star': '<path d="M24 7l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>',
}

def tile(icon, title, detail):
    return '<li><svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">%s</g></svg><b>%s</b><span>%s</span></li>' % (ICONS[icon], title, detail)

WHY = '''<section class="slide box cream why">
  <div class="frame"></div>%s%s
  <p class="pill">Diwali Corporate Meals</p>
  <h2>Why teams order from us</h2>
  <p class="line">homesome food, on your office clock</p>
  <ul class="tiles">%s</ul>
  <div class="real"><h3>Real dishes from our kitchen</h3><ul>%s</ul></div>
  <ol class="steps"><li><b>1</b>Pick a box</li><li><b>2</b>Share headcount &amp; date</li><li><b>3</b>Delivered fresh, on your slot</li></ol>
  <p class="count">07 / %02d</p>
</section>''' % (corner_flowers(), LOGO, ''.join([
    tile('leaf', '100% vegetarian', 'A dedicated veg-only kitchen'),
    tile('sun', 'Cooked that morning', 'Delivered by mealtime'),
    tile('boxes', '20 to 500+ boxes', 'One team or every floor'),
    tile('seal', 'Leak-proof boxes', 'Hygienic, food-grade packing'),
    tile('pin', 'FSSAI kitchen', 'Salt Lake, Kolkata · since 2015'),
    tile('star', 'Rated 4.9', 'By the hosts we cook for'),
]), ''.join('<li><img src="/images/menu/rakhi/%s.jpg" alt=""><span>%s</span></li>' % p for p in [
    ('exotic-veg-stroganoff-rice', 'Veg Stroganoff'), ('spaghetti-au-gratin', 'Spaghetti Au Gratin'),
    ('cheesy-veg-cigar-rolls', 'Cheesy Cigar Rolls'), ('crunchy-thai-cabbage-salad', 'Thai Cabbage Salad')]), TOTAL)

CTA = '''<section class="slide orange cta">
  <svg class="toran" viewBox="0 -6 1080 160" aria-hidden="true">%s</svg>
  <div class="mark"><img src="/images/quote/logo.png" alt="Urban Rasoi"></div>
  <h2>Make Diwali <em>delicious</em> for your entire team</h2>
  <div class="rule"><svg viewBox="0 0 100 72" aria-hidden="true"><use href="#diya"/></svg></div>
  <p class="serve">Serving teams of<b>20 to 500+ employees</b></p>
  <p class="ask">WhatsApp us for menus &amp; rates</p>
  <ul class="contact">
    <li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/></svg>98307 25556</li>
    <li><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></g><circle cx="17.3" cy="6.7" r="1.2" fill="#fff"/></svg>@urbanrasoi_kolkata</li>
    <li><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></g></svg>urbanrasoi.online</li>
  </ul>
  <p class="legal">100%% vegetarian · FSSAI Lic. No. 12823013000353 · AE-287, Salt Lake Sector 1, Kolkata</p>
  %s
</section>''' % (toran(), DIYAS)

CSS = '''
:root { --orange: #ec6424; --orange-deep: #c94d16; --amber: #f6b233; --yellow: #f9c537; --cream: #f6f1e8; --card: #fdfaf5; --ink: #1b1917;
  --soft: #57514a; --terracotta: #9a4b2c; --deep: #7a321a; --rule: #e2d9ca;
  --display: 'Fraunces', Georgia, serif; --body: 'Manrope', system-ui, sans-serif; --hand: 'Kalam', 'Comic Sans MS', cursive; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { background: #d9d0c2; font-family: var(--body); color: var(--ink); -webkit-font-smoothing: antialiased; }
.slide { width: 1080px; height: 1350px; margin: 40px auto; position: relative; overflow: hidden; text-align: center; break-after: page;
  print-color-adjust: exact; -webkit-print-color-adjust: exact; }
.slide:last-child { break-after: auto; }
.slide p, .slide h1, .slide h2, .slide h3, .slide ul, .slide ol { margin: 0; }

/* backgrounds */
.cream { background: var(--cream); }
.orange { background: linear-gradient(160deg, #f2702c, #e05a1c 70%, #d24f15); color: #fff; }
.deep { background: radial-gradient(120% 90% at 50% 30%, #93401f, #6c2a13 75%); color: var(--cream); }
.bgpat { position: absolute; inset: 0; width: 100%; height: 100%; }

/* box slides */
.frame { position: absolute; inset: 40px; border: 2px solid var(--orange); border-radius: 30px; opacity: .55; }
.deep .frame { border-color: var(--amber); }
.corner { position: absolute; width: 150px; height: 150px; }
.corner.tl { left: 10px; top: 10px; }
.corner.br { right: 10px; bottom: 10px; transform: rotate(180deg); }
.badge { position: absolute; right: 64px; top: 64px; width: 112px; height: 112px; border-radius: 50%; background: #fff; display: grid; place-items: center;
  box-shadow: 0 8px 22px rgba(60, 25, 5, .22); border: 4px solid var(--amber); }
.badge img { width: 74px; height: 74px; }
.pill { display: inline-block; margin-top: 92px !important; padding: 14px 30px; border-radius: 999px; background: var(--orange); color: #fff;
  font: 800 22px var(--body); letter-spacing: .14em; text-transform: uppercase; }
.deep .pill { background: var(--amber); color: var(--ink); }
.kicker { margin-top: 30px !important; font: 700 19px var(--body); letter-spacing: .32em; text-transform: uppercase; color: var(--terracotta); }
.deep .kicker { color: var(--yellow); }
.box h2 { margin-top: 6px !important; font: 800 92px/1 var(--display); letter-spacing: -.02em; font-variation-settings: 'SOFT' 50, 'WONK' 0; }
.line { margin-top: 10px !important; font: 700 36px var(--hand); color: var(--orange); }
.deep .line { color: var(--yellow); }
.shot { position: absolute; left: 0; right: 0; top: 372px; height: 596px; }
.peek { position: absolute; left: 84px; top: 44px; width: 540px; height: 360px; transform: rotate(-7deg); }
.shot figure { position: absolute; left: 50%; top: 14px; width: 780px; margin: 0 0 0 -372px; padding: 12px; background: #fff; border-radius: 26px;
  transform: rotate(2deg); box-shadow: 0 26px 46px rgba(60, 20, 0, .32); }
.shot img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 16px; }
.inbox { position: absolute; left: 90px; right: 90px; top: 990px; }
.inbox h3 { font: 800 21px var(--body); letter-spacing: .3em; text-transform: uppercase; color: var(--terracotta); }
.deep .inbox h3 { color: var(--yellow); }
.inbox p { margin-top: 16px !important; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 30px; font: 600 28px/1.35 var(--body); color: var(--soft); }
.deep .inbox p { color: #f6e6d6; }
.inbox span { white-space: nowrap; display: inline-flex; align-items: center; gap: 12px; }
.inbox span::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: var(--orange); flex: none; }
.deep .inbox span::before { background: var(--amber); }
.foot i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--orange); margin: 0 14px; vertical-align: middle; }
.deep .foot i { background: var(--amber); }
.foot { position: absolute; left: 0; right: 0; bottom: 92px; font: 700 19px var(--body); letter-spacing: .2em; text-transform: uppercase; color: var(--terracotta); }
.deep .foot { color: var(--yellow); }
.count { position: absolute; left: 74px; bottom: 58px; font: 700 15px var(--body); letter-spacing: .2em; color: var(--soft); opacity: .7; }
.deep .count { color: var(--cream); }

/* cover + cta */
.toran { position: absolute; left: 0; top: 0; width: 1080px; height: 166px; }
.mark { width: 132px; height: 132px; margin: 118px auto 0; border-radius: 50%; background: #fff; display: grid; place-items: center;
  box-shadow: 0 12px 30px rgba(80, 25, 0, .3); border: 5px solid var(--yellow); position: relative; z-index: 1; }
.mark img { width: 88px; height: 88px; }
.hello { margin-top: 18px !important; font: 700 44px var(--hand); color: var(--yellow); transform: rotate(-3deg); }
.cover h1 { margin-top: 0 !important; font: 800 94px/.95 var(--display); letter-spacing: -.02em; }
.cover h1 span { display: block; font: italic 600 132px/1 var(--display); color: #ffe3ad; letter-spacing: -.01em; }
.copy { width: 780px; margin: 22px auto 0 !important; font: 500 28px/1.45 var(--body); color: #fff4ea; text-wrap: balance; }
.photo { position: absolute; left: 50%; top: 768px; width: 480px; margin: 0 0 0 -210px; padding: 14px; background: #fff; border-radius: 18px;
  transform: rotate(-3deg); box-shadow: 0 30px 50px rgba(70, 20, 0, .35); }
.photo img { display: block; width: 100%; border-radius: 10px; }
.sticker { position: absolute; left: 70px; top: 840px; width: 230px; font: 700 38px/1.1 var(--hand); color: var(--yellow); transform: rotate(-8deg); }
.sticker svg { display: block; width: 120px; height: 70px; margin: 8px 0 0 90px; }
.swipe { position: absolute; left: 50%; bottom: 74px; transform: translateX(-50%); padding: 18px 40px; border-radius: 999px; background: var(--yellow); color: var(--ink);
  font: 800 27px var(--body); letter-spacing: .04em; white-space: nowrap; box-shadow: 0 10px 24px rgba(80, 25, 0, .25); z-index: 2; }
.swipe b { margin-left: 8px; }
.diyas { position: absolute; left: 0; bottom: 30px; width: 1080px; height: 120px; }

.cta h2 { margin: 54px auto 0 !important; width: 900px; font: 800 92px/1.02 var(--display); letter-spacing: -.02em; }
.cta h2 em { font-style: italic; font-weight: 600; color: #ffe3ad; }
.rule { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 34px; }
.rule::before, .rule::after { content: ''; width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #ffd38a); }
.rule::after { background: linear-gradient(90deg, #ffd38a, transparent); }
.rule svg { width: 96px; height: 70px; }
.serve { margin-top: 30px !important; font: 600 30px var(--body); letter-spacing: .14em; text-transform: uppercase; color: #fff4ea; }
.serve b { display: block; margin-top: 6px; font: 800 52px var(--body); letter-spacing: .02em; color: #fff; }
.ask { display: inline-block; margin-top: 46px !important; padding: 22px 46px; border-radius: 999px; background: var(--yellow); color: var(--ink);
  font: 800 32px var(--body); box-shadow: 0 12px 26px rgba(80, 25, 0, .25); }
.contact { list-style: none; padding: 0; margin-top: 52px !important; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.contact li { display: flex; align-items: center; gap: 16px; font: 700 36px var(--body); color: #fff; }
.contact svg { width: 40px; height: 40px; }
.legal { position: absolute; left: 0; right: 0; bottom: 160px; font: 600 18px var(--body); letter-spacing: .06em; color: #ffe1c8; }

/* why */
.why h2 { margin-top: 28px !important; font: 800 80px/1 var(--display); letter-spacing: -.02em; }
.tiles { list-style: none; padding: 0; width: 900px; margin: 44px auto 0 !important; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; }
.tiles li { display: grid; grid-template-columns: 84px 1fr; grid-template-rows: auto auto; column-gap: 20px; align-items: center; padding: 22px 24px;
  background: var(--card); border: 1.5px solid var(--rule); border-radius: 22px; }
.tiles svg { grid-row: span 2; width: 84px; height: 84px; padding: 16px; border-radius: 50%; background: var(--orange); }
.tiles b { font: 800 29px/1.15 var(--body); align-self: end; }
.tiles span { font: 500 21px/1.35 var(--soft); color: var(--soft); font-family: var(--body); align-self: start; margin-top: 4px; }
.real { margin-top: 40px; }
.real h3 { font: 800 20px var(--body); letter-spacing: .3em; text-transform: uppercase; color: var(--terracotta); }
.real ul { list-style: none; padding: 0; margin-top: 20px !important; display: flex; justify-content: center; gap: 30px; }
.real li { width: 190px; }
.real img { width: 170px; height: 170px; border-radius: 50%; object-fit: cover; object-position: 50% 70%; border: 6px solid #fff; box-shadow: 0 10px 22px rgba(60, 25, 5, .18); }
.real span { display: block; margin-top: 10px; font: 700 19px/1.25 var(--body); color: var(--soft); }
.steps { list-style: none; padding: 0; position: absolute; left: 70px; right: 70px; bottom: 112px; display: flex; justify-content: center; gap: 12px; }
.steps li { display: flex; align-items: center; gap: 12px; padding: 14px 22px 14px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--rule);
  font: 700 20px var(--body); white-space: nowrap; }
.steps b { width: 40px; height: 40px; border-radius: 50%; background: var(--yellow); display: grid; place-items: center; font: 800 21px var(--body); }

@media print { @page { size: 1080px 1350px; margin: 0; } body { background: none; } .slide { margin: 0; } }
'''

def bg(kind):
    pid = {'cream': 'doodink', 'deep': 'doodcream', 'orange': 'dood'}[kind]
    return '<svg class="bgpat" aria-hidden="true"><rect width="100%%" height="100%%" fill="url(#%s)"/></svg>' % pid

def with_bg(html, kind):
    i = html.index('>') + 1
    return html[:i] + bg(kind) + html[i:]

slides = [with_bg(COVER, 'orange')]
for n, b in enumerate(BOXES, start=2):
    slides.append(with_bg(box_slide(n, b), b['theme']))
slides.append(with_bg(WHY, 'cream'))
slides.append(with_bg(CTA, 'orange'))

html = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080">
<meta name="robots" content="noindex, nofollow">
<title>Diwali Corporate Meals · Urban Rasoi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,600..900,0..100,0..1;1,9..144,500..700,0..100,0..1&family=Manrope:wght@500;600;700;800&family=Kalam:wght@700&display=swap">
<style>%s</style>
</head>
<body>
<!-- Diwali corporate meal-box carousel: seven 1080x1350 Instagram slides in the Urban Rasoi box-sleeve
     style (orange, cream and terracotta with white food doodles). Each box is a real photo (box-N.jpg);
     the cover uses the real branded box photo. Rendered to JPG slides and a PDF by the build script. -->
%s
%s
</body>
</html>''' % (CSS, defs_svg(), '\n'.join(slides))
open(OUT, 'w').write(html)
