import { apiFetch } from './http'

export type GeocodeResult = { lat: number; lng: number }

/** Геокодирование адреса (только для авторизованной админки; запрос уходит через сервер). */
export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const q = query.trim()
  if (q.length < 4) return null

  const response = await apiFetch(`/api/geocode?q=${encodeURIComponent(q)}`)
  if (!response.ok) return null

  try {
    const data = (await response.json()) as { lat?: unknown; lng?: unknown }
    const lat = Number(data.lat)
    const lng = Number(data.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { lat, lng }
  } catch {
    return null
  }
}
