/**
 * После vite build: preload LCP, async CSS, статичный hero в HTML.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const INDEX = path.join(DIST, 'index.html')
const ASSETS = path.join(DIST, 'assets')

if (!existsSync(INDEX)) {
  console.warn('[inject-dist-html-hints] dist/index.html not found, skip')
  process.exit(0)
}

const assetFiles = existsSync(ASSETS) ? readdirSync(ASSETS) : []
const lcpImage = assetFiles.find((f) => /^door1-.+\.avif$/i.test(f))
const mainFont = assetFiles.find((f) => /^dm-sans-latin-wght-normal-.+\.woff2$/i.test(f))
const mainJs = assetFiles.find((f) => /^index-.+\.js$/i.test(f))
const lcpHref = lcpImage ? `/assets/${lcpImage}` : '/hero-lcp.avif'

let html = readFileSync(INDEX, 'utf8')

const PAGE_TITLE = 'От А до Я — Двери и фурнитура в Нижнем Новгороде'
if (/<title[\s\S]*?<\/title>/i.test(html)) {
  html = html.replace(/<title[\s\S]*?<\/title>/i, `<title id="document-title">${PAGE_TITLE}</title>`)
} else {
  html = html.replace('<head>', `<head>\n    <title id="document-title">${PAGE_TITLE}</title>`)
}

const headHints = []
if (!html.includes(lcpHref)) {
  headHints.push(
    `<link rel="preload" href="${lcpHref}" as="image" type="image/avif" fetchpriority="high" />`
  )
}
if (mainFont && !html.includes(mainFont)) {
  headHints.push(
    `<link rel="preload" href="/assets/${mainFont}" as="font" type="font/woff2" crossorigin />`
  )
}
if (mainJs && !html.includes(`modulepreload" href="/assets/${mainJs}`)) {
  headHints.push(`<link rel="modulepreload" href="/assets/${mainJs}" crossorigin />`)
}
// react-vendor грузится вместе с entry — подсказка браузеру
const reactVendor = assetFiles.find((f) => /^react-vendor-.+\.js$/i.test(f))
if (reactVendor && !html.includes(reactVendor)) {
  headHints.push(`<link rel="modulepreload" href="/assets/${reactVendor}" crossorigin />`)
}
if (headHints.length > 0) {
  html = html.replace('</head>', `    ${headHints.join('\n    ')}\n  </head>`)
}

html = html.replace(
  /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/,
  `<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n    <noscript><link rel="stylesheet" href="$1" /></noscript>`
)

const staticHeroStyle =
  'position:fixed;left:0;right:0;top:5rem;bottom:0;z-index:0;pointer-events:none;overflow:hidden;background:#0f3c65'

const staticHeroBlock = `<div id="static-hero-lcp" style="${staticHeroStyle}">
      <img src="${lcpHref}" alt="" width="1920" height="1080" fetchpriority="high" decoding="sync" style="width:100%;height:100%;object-fit:cover" />
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.5)"></div>
      <div data-static-hero-copy style="position:relative;z-index:1;height:100%;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center;color:#fff;font-family:system-ui,sans-serif">
        <div>
          <h1 style="margin:0 0 12px;font-size:clamp(2rem,10vw,4.5rem);font-weight:700;line-height:1.1">От А до Я</h1>
          <p style="margin:0 0 8px;font-size:clamp(1rem,4vw,1.75rem);opacity:.92">Премиум двери и фурнитура</p>
          <p style="margin:0;font-size:clamp(.9rem,3vw,1.25rem);opacity:.8">Нижний Новгород</p>
        </div>
      </div>
    </div>`

if (!html.includes('id="static-hero-lcp"')) {
  html = html.replace('<div id="root">', `${staticHeroBlock}\n    <div id="root">`)
} else {
  html = html.replace(/src="[^"]*door1[^"]*\.avif"/, `src="${lcpHref}"`)
}

html = html.replace(/src="\/hero-lcp\.avif"/g, `src="${lcpHref}"`)

writeFileSync(INDEX, html, 'utf8')
console.log('[inject-dist-html-hints] lcp=%s js=%s', lcpHref, mainJs ?? '—')
