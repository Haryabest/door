/**
 * После vite build: preload LCP-кадра и шрифта в dist/index.html.
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

const hints = []
if (lcpImage) {
  hints.push(`<link rel="preload" href="/assets/${lcpImage}" as="image" type="image/avif" fetchpriority="high" />`)
}
if (mainFont) {
  hints.push(`<link rel="preload" href="/assets/${mainFont}" as="font" type="font/woff2" crossorigin />`)
}

let html = readFileSync(INDEX, 'utf8')

if (!/<title>[^<]+<\/title>/i.test(html)) {
  html = html.replace(
    '<head>',
    '<head>\n    <title>От А до Я — Двери и фурнитура в Нижнем Новгороде</title>'
  )
}

if (hints.length > 0 && !html.includes('rel="preload"')) {
  html = html.replace('</head>', `    ${hints.join('\n    ')}\n  </head>`)
}

writeFileSync(INDEX, html, 'utf8')
console.log('[inject-dist-html-hints] lcp=%s font=%s', lcpImage ?? '—', mainFont ?? '—')
