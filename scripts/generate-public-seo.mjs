/**
 * Перед vite build записывает public/robots.txt и public/sitemap.xml с финальным доменом.
 * Задаётся переменной VITE_SITE_URL или SITE_URL (например в CI или .env перед сборкой).
 */
import { writeFileSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

/** Подтягиваем домен из корневого .env (vite при сборке тоже читает его). Node сам по себе .env не грузит. */
function hydrateSiteUrlFromEnvFile() {
  const p = path.join(ROOT, '.env')
  if (!existsSync(p)) return
  try {
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      if (key !== 'VITE_SITE_URL' && key !== 'SITE_URL') continue
      let val = t.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      process.env[key] = val
    }
  } catch {
    //
  }
}

hydrateSiteUrlFromEnvFile()
const FALLBACK = 'https://otadoya.ru'

const raw =
  typeof process.env.VITE_SITE_URL === 'string'
    ? process.env.VITE_SITE_URL
    : typeof process.env.SITE_URL === 'string'
      ? process.env.SITE_URL
      : FALLBACK

let origin = FALLBACK
try {
  const s = raw.trim()
  origin = new URL(s.includes('://') ? s : `https://${s}`).origin
} catch {
  origin = FALLBACK
}

const entries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/catalog', changefreq: 'daily', priority: '0.9' },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contacts', changefreq: 'monthly', priority: '0.7' },
]

const sitemapUrls = entries
  .map(
    (e) => `  <url>
    <loc>${origin}${e.path}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`

const robotsTxt = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin-login

Sitemap: ${origin}/sitemap.xml
`

writeFileSync(path.join(ROOT, 'public', 'robots.txt'), robotsTxt, 'utf8')
writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemapXml, 'utf8')

const llmsTxt = `# От А до Я — двери и фурнитура в Нижнем Новгороде

Официальный сайт компании «От А до Я»: межкомнатные и входные двери, фурнитура, консультация, замер, доставка и установка.

## Основные разделы

- [Главная](${origin}/)
- [Каталог продукции](${origin}/catalog)
- [Портфолио работ](${origin}/portfolio)
- [О компании](${origin}/about)
- [Контакты и адреса салонов](${origin}/contacts)

## Контакты

Телефон: +7 (960) 166-30-30
Город: Нижний Новгород
`

writeFileSync(path.join(ROOT, 'public', 'llms.txt'), llmsTxt, 'utf8')
console.log('[generate-public-seo] origin=%s', origin)
