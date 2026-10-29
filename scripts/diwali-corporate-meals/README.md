# Diwali corporate meals carousel

Eight 1080×1350 Instagram slides in the Urban Rasoi box-sleeve style: a cover,
five meal boxes (real photos, `box-1.jpg` … `box-5.jpg`), why-us, and a contact slide. Output lives in
`public/menus/diwali-corporate-meals/` (`slide-01.jpg` … `slide-08.jpg`, the
PDF, and `index.html` to view them all in a browser).

- `carousel.py` holds the copy, the box menus and which photo each box uses. Edit here.
- `art.py` draws the orange sleeve, doodles, marigolds and diyas.
- To swap a box photo, replace `box-N.jpg` (4:3, about 1600×1200) and re-render.
- `render.js` screenshots each slide (needs Playwright with Chromium).

To rebuild, from the repo root:

```sh
python3 scripts/diwali-corporate-meals/carousel.py scripts/diwali-corporate-meals public/menus/diwali-corporate-meals/index.html
(cd public && python3 -m http.server 8765) &
node scripts/diwali-corporate-meals/render.js http://localhost:8765/menus/diwali-corporate-meals/index.html /tmp/slides
```

Then convert `/tmp/slides/slide-*.png` to JPG (quality 90) and combine them
into the PDF.
