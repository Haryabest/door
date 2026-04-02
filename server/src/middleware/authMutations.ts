import type { RequestHandler } from 'express'
import { getSessionFromRequest, verifySessionToken } from '../lib/adminSession.js'

/**
 * Доступ к мутациям:
 * - Bearer === ADMIN_API_TOKEN (если задан), или
 * - валидная сессия (cookie после POST /api/auth/admin/login), или
 * - dev без токена: пропуск (удобно для локальной разработки; в production задайте ADMIN_API_TOKEN и/или сессию).
 */
export const requireAdminToken: RequestHandler = (req, res, next) => {
  const bearerExpected = process.env.ADMIN_API_TOKEN?.trim()
  const devOpen = !bearerExpected && process.env.NODE_ENV !== 'production'

  if (bearerExpected) {
    const auth = req.headers.authorization
    if (auth?.startsWith('Bearer ')) {
      const token = auth.slice(7).trim()
      if (token === bearerExpected) {
        next()
        return
      }
    }
  }

  const raw = getSessionFromRequest(req.headers.cookie)
  if (raw && verifySessionToken(raw)) {
    next()
    return
  }

  if (devOpen) {
    next()
    return
  }

  res.status(401).json({ error: 'Требуется авторизация', code: 'unauthorized' })
}
