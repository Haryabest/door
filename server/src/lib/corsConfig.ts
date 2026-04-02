export function corsOrigins(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN
  if (!raw || raw === '*') return true
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean)
  return list.length === 1 ? list[0]! : list
}

/** Для cookie-сессии нужен credentials + конкретный origin (не *). */
export function corsMiddlewareOptions(): {
  origin: string | string[] | boolean
  credentials: boolean
} {
  const origin = corsOrigins()
  const credentials = origin !== true
  return { origin, credentials }
}
