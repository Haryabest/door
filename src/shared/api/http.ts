/** Базовый fetch к API: VITE_API_URL, Bearer из env или localStorage (опционально), cookie-сессия с credentials. */

const ORIGIN = import.meta.env.VITE_API_URL ?? ''

/** Ключ localStorage — только для опционального Bearer (скрипты, без входа по паролю) */
export const ADMIN_API_TOKEN_STORAGE_KEY = 'doors_admin_api_token'

function getAdminBearerToken(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_API_TOKEN ?? ''
  if (fromEnv) return fromEnv
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(ADMIN_API_TOKEN_STORAGE_KEY) ?? ''
  }
  return ''
}

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${ORIGIN}${p}`
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  const token = getAdminBearerToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  })
}

/**
 * Публичные эндпоинты (чат на сайте и т.п.): без Bearer и без cookie.
 * Иначе при API на другом origin + CORS с credentials публичный фронт не получает ответ.
 */
export function publicApiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    credentials: 'omit',
  })
}
