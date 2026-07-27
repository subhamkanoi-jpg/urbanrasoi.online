# Open Graph link-preview images

`rudrabhishek.html` is the source for `public/images/og-rudrabhishek.jpg` — the
thumbnail shown when the Rudra Abhishek page is shared on WhatsApp, Facebook or
Instagram DMs.

Edit the HTML (price, headline, photo) and re-render at exactly 1200×630:

```js
// node regenerate.mjs  — requires playwright-core and a Chromium binary
import { chromium } from 'playwright-core'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + process.cwd() + '/scripts/og/rudrabhishek.html', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/images/og-rudrabhishek.jpg', type: 'jpeg', quality: 88 })
await browser.close()
```

Keep it at 1200×630 and under ~300 KB — WhatsApp skips previews for heavy images.
After changing the file, re-share the link through
[Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/) to
clear the cached preview.
