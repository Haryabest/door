/**
 * Единый публичный origin сайта: canonical / OG / JSON-LD.
 * Перед выпуском на новый домен задайте VITE_SITE_URL (без закрывающего слэша), например: https://example.com
 */

const FALLBACK_ORIGIN = 'https://otadoya.ru'

function normalizeOrigin(raw: string | undefined): string {
  const t = raw?.trim() ?? ''
  if (!t) return FALLBACK_ORIGIN
  try {
    const u = new URL(t.includes('://') ? t : `https://${t}`)
    return u.origin
  } catch {
    return FALLBACK_ORIGIN
  }
}

export const SITE_URL: string = normalizeOrigin(import.meta.env.VITE_SITE_URL)
