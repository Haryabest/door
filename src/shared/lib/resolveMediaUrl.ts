/**
 * Приводит ссылки на файлы с /uploads/ к относительному пути на текущем origin (HTTPS на проде).
 * Старые записи вида http://IP/uploads/... иначе блокируются как mixed content.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  if (/^(blob:|data:)/i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed

  try {
    const parsed = new URL(trimmed)
    const uploadsPath = parsed.pathname.match(/\/uploads\/[^/]+/)?.[0]
    if (uploadsPath) {
      return uploadsPath + parsed.search
    }
    if (parsed.protocol === 'http:') {
      parsed.protocol = 'https:'
      return parsed.toString()
    }
    return trimmed
  } catch {
    return trimmed
  }
}
