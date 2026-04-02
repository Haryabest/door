import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db.js'
import { verifyAdminPasswordHash } from '../lib/adminPasswordHash.js'
import {
  buildSessionClearCookie,
  buildSessionSetCookie,
  createSessionToken,
  getSessionFromRequest,
  verifySessionToken,
} from '../lib/adminSession.js'

export const authRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток входа', code: 'rate_limit' },
})

/** POST /api/auth/admin/login */
authRouter.post('/auth/admin/login', loginLimiter, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  const { rows } = await pool.query<{ password_hash: string; salt: string }>(
    'SELECT password_hash, salt FROM admin_credential WHERE id = 1'
  )
  const row = rows[0]
  if (!row) {
    res.status(503).json({
      error: 'Учётные данные админа не созданы. Выполните миграции БД (npm run migrate)',
      code: 'admin_credential_missing',
    })
    return
  }

  if (!verifyAdminPasswordHash(password, row.salt, row.password_hash)) {
    res.status(401).json({ error: 'Неверный пароль', code: 'invalid_password' })
    return
  }

  const token = createSessionToken()
  res.setHeader('Set-Cookie', buildSessionSetCookie(token))
  res.json({ ok: true })
})

/** POST /api/auth/admin/logout */
authRouter.post('/auth/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', buildSessionClearCookie())
  res.json({ ok: true })
})

/** GET /api/auth/admin/me */
authRouter.get('/auth/admin/me', (req, res) => {
  const raw = getSessionFromRequest(req.headers.cookie)
  const ok = raw ? verifySessionToken(raw) : false
  res.json({ authenticated: ok })
})
