import type { RequestHandler } from 'express'

/**
 * Если задан ADMIN_API_TOKEN — требует заголовок Authorization: Bearer <token>.
 * Если не задан — пропускает (удобно для локальной разработки).
 */
export const requireAdminToken: RequestHandler = (req, res, next) => {
  const expected = process.env.ADMIN_API_TOKEN?.trim()
  if (!expected) {
    next()
    return
  }

  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация', code: 'unauthorized' })
    return
  }

  const token = auth.slice(7).trim()
  if (token !== expected) {
    res.status(403).json({ error: 'Недостаточно прав', code: 'forbidden' })
    return
  }

  next()
}
