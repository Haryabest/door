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
const lcpHref = lcpImage ? `/assets/${lcpImage}` : '/hero-lcp.avif'

let html = readFileSync(INDEX, 'utf8')

if (!/<title>[^<]+<\/title>/i.test(html)) {
  html = html.replace(
    '<head>',
    '<head>\n    <title>От А до Я — Двери и фурнитура в Нижнем Новгороде</title>'
  )
}

const headHints = []
if (!html.includes('rel="preload"') || !html.includes('as="image"')) {
  headHints.push(
    `<link rel="preload" href="${lcpHref}" as="image" type="image/avif" fetchpriority="high" />`
  )
}
if (mainFont && !html.includes(mainFont)) {
  headHints.push(
    `<link rel="preload" href="/assets/${mainFont}" as="font" type="font/woff2" crossorigin />`
  )
}
if (headHints.length > 0) {
  html = html.replace('</head>', `    ${headHints.join('\n    ')}\n  </head>`)
}

html = html.replace(
  /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/,
  `<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n    <noscript><link rel="stylesheet" href="$1" /></noscript>`
)

if (!html.includes('id="static-hero-lcp"')) {
  const staticHero = `<div id="static-hero-lcp" aria-hidden="true" style="position:fixed;inset:0;z-index:0;pointer-events:none;background:#0f3c65">
      <img src="${lcpHref}" alt="" width="1920" height="1080" fetchpriority="high" decoding="async" style="width:100%;height:100%;object-fit:cover" />
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.5)"></div>
    </div>`
  html = html.replace('<div id="root">', `${staticHero}\n    <div id="root">`)
}

html = html.replace(/src="\/hero-lcp\.avif"/g, `src="${lcpHref}"`)

writeFileSync(INDEX, html, 'utf8')
console.log('[inject-dist-html-hints] lcp=%s css=async', lcpHref)
