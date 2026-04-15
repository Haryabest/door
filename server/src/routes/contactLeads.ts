import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import type { z } from 'zod'
import { pool } from '../db.js'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import { contactLeadCreateSchema } from '../validation/schemas.js'

export const contactLeadsRouter = Router()

const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много заявок, попробуйте позже', code: 'rate_limit' },
})

contactLeadsRouter.post(
  '/contact-leads',
  contactFormLimiter,
  validateBody(contactLeadCreateSchema),
  async (req, res) => {
    const b = req.body as z.infer<typeof contactLeadCreateSchema>
    const email = b.email?.trim() ? b.email.trim() : null
    const { rows } = await pool.query<{ id: number; created_at: Date }>(
      `INSERT INTO contact_leads (name, phone, email, message) VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [b.name.trim(), b.phone.trim(), email, b.message.trim()]
    )
    const row = rows[0]
    if (!row) {
      res.status(500).json({ error: 'Не удалось сохранить заявку', code: 'insert_failed' })
      return
    }
    res.status(201).json({ ok: true, id: row.id, createdAt: row.created_at.toISOString() })
  }
)

contactLeadsRouter.get('/contact-leads', requireAdminToken, async (_req, res) => {
  const { rows } = await pool.query<{
    id: number
    name: string
    phone: string
    email: string | null
    message: string
    created_at: Date
  }>(
    `SELECT id, name, phone, email, message, created_at
     FROM contact_leads
     ORDER BY created_at DESC
     LIMIT 500`
  )
  res.json({
    items: rows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      createdAt: r.created_at.toISOString(),
    })),
  })
})
