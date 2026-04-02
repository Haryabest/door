import { Router } from 'express'
import { pool } from '../db.js'

export const healthRouter = Router()

healthRouter.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, database: 'up' })
  } catch {
    res.status(503).json({ ok: false, database: 'down' })
  }
})
