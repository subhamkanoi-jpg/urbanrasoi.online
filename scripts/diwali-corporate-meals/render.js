const { chromium } = require('playwright');
(async () => {
  const [url, outdir] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1160, height: 1430 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const slides = await p.locator('.slide').all();
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: `${outdir}/slide-${String(i + 1).padStart(2, '0')}.png` });
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: outdir + '/carousel.pdf', width: '1080px', height: '1350px', printBackground: true });
  await b.close();
})();
