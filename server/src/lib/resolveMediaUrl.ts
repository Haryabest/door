/** См. src/shared/lib/resolveMediaUrl.ts — та же логика для ответов API. */
const OUR_UPLOAD_FILE =
  /^\/uploads\/(\d{10,}-[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp|gif|avif|svg))$/i

export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  if (/^(blob:|data:)/i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed

  try {
    const parsed = new URL(trimmed)
    const ownUpload = parsed.pathname.match(OUR_UPLOAD_FILE)
    if (ownUpload) {
      return ownUpload[0] + parsed.search
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
