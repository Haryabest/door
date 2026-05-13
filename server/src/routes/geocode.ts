import { Router } from 'express'
import { requireAdminToken } from '../middleware/authMutations.js'

/** Прокси к Nominatim (OSM): только для админки, см. https://operations.osmfoundation.org/policies/nominatim/ */
export const geocodeRouter = Router()

const UA =
  process.env.GEOCODE_USER_AGENT?.trim() ??
  'DoorShopSiteAdmin/1.0'

geocodeRouter.get('/geocode', requireAdminToken, async (req, res) => {
  const raw = String(req.query.q ?? '').trim()
  if (raw.length < 4) {
    res.status(400).json({ error: 'Запрос слишком короткий', code: 'bad_request' })
    return
  }
  if (raw.length > 400) {
    res.status(400).json({ error: 'Запрос слишком длинный', code: 'bad_request' })
    return
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', raw)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'ru')

    const upstream = await fetch(url.toString(), {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json',
      },
    })

    if (!upstream.ok) {
      res.status(502).json({ error: 'Сервис геокодирования недоступен', code: 'upstream' })
      return
    }

    const data = (await upstream.json()) as { lat?: string; lon?: string }[]
    const first = Array.isArray(data) ? data[0] : undefined
    if (!first?.lat || !first?.lon) {
      res.status(404).json({ error: 'Адрес не найден', code: 'not_found' })
      return
    }

    const lat = Number(first.lat)
    const lng = Number(first.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      res.status(404).json({ error: 'Адрес не найден', code: 'not_found' })
      return
    }

    res.json({ lat, lng })
  } catch {
    res.status(502).json({ error: 'Ошибка геокодирования', code: 'upstream' })
  }
})
