import crypto from 'crypto'

const COOKIE_NAME = 'door_admin_sess'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim()
  if (s) return s
  const t = process.env.ADMIN_API_TOKEN?.trim()
  if (t) return t
  return 'dev-only-insecure-admin-session'
}

export function sessionCookieName(): string {
  return COOKIE_NAME
}

export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_MS
  const payload = Buffer.from(JSON.stringify({ v: 1 as const, exp }), 'utf8').toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string): boolean {
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
  const a = Buffer.from(sig, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  if (!crypto.timingSafeEqual(a, b)) return false
  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf8')
    const data = JSON.parse(raw) as { v?: number; exp?: number }
    if (typeof data.exp !== 'number' || data.exp <= Date.now()) return false
    return true
  } catch {
    return false
  }
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    if (k) out[k] = decodeURIComponent(v)
  }
  return out
}

export function getSessionFromRequest(cookieHeader: string | undefined): string | null {
  const cookies = parseCookies(cookieHeader)
  const raw = cookies[COOKIE_NAME]
  return raw ?? null
}

/** Только при HTTPS; на HTTP оставьте false (по умолчанию). */
function cookieSecure(): boolean {
  return process.env.ADMIN_COOKIE_SECURE === 'true'
}

/** Set-Cookie для успешного входа */
export function buildSessionSetCookie(value: string): string {
  const maxAgeSec = Math.floor(MAX_AGE_MS / 1000)
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (cookieSecure()) parts.push('Secure')
  return parts.join('; ')
}

/** Сброс сессии */
export function buildSessionClearCookie(): string {
  const parts = [`${COOKIE_NAME}=`, 'Path=/', 'Max-Age=0', 'HttpOnly', 'SameSite=Lax']
  if (cookieSecure()) parts.push('Secure')
  return parts.join('; ')
}
