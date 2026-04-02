import { Router } from 'express'
import { pool } from '../db.js'
import { mapPortfolioItem } from '../mapRow.js'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import {
  portfolioItemCreateSchema,
  portfolioItemPatchSchema,
  portfolioPutSchema,
} from '../validation/schemas.js'

export const portfolioRouter = Router()

portfolioRouter.get('/pages/portfolio', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, image, title, description FROM portfolio_items ORDER BY sort_order ASC, id ASC'
  )
  res.json({ items: rows.map(mapPortfolioItem) })
})

portfolioRouter.put(
  '/pages/portfolio',
  requireAdminToken,
  validateBody(portfolioPutSchema),
  async (req, res) => {
    const body = req.body as { items: { image: string; title: string; description: string }[] }
    const items = body.items ?? []
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM portfolio_items')
      let order = 0
      for (const it of items) {
        order += 1
        await client.query(
          `INSERT INTO portfolio_items (image, title, description, sort_order) VALUES ($1, $2, $3, $4)`,
          [it.image, it.title, it.description, order]
        )
      }
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
    const { rows } = await pool.query(
      'SELECT id, image, title, description FROM portfolio_items ORDER BY sort_order ASC, id ASC'
    )
    res.json({ items: rows.map(mapPortfolioItem) })
  }
)

portfolioRouter.post(
  '/pages/portfolio/items',
  requireAdminToken,
  validateBody(portfolioItemCreateSchema),
  async (req, res) => {
    const b = req.body as { image: string; title: string; description: string }
    const { rows } = await pool.query(
      `INSERT INTO portfolio_items (image, title, description, sort_order)
       VALUES ($1, $2, $3, (SELECT COALESCE(MAX(sort_order),0)+1 FROM portfolio_items))
       RETURNING id, image, title, description`,
      [b.image, b.title, b.description]
    )
    res.status(201).json(mapPortfolioItem(rows[0]))
  }
)

portfolioRouter.delete('/pages/portfolio/items/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  const { rowCount } = await pool.query('DELETE FROM portfolio_items WHERE id = $1', [id])
  if (!rowCount) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.status(204).send()
})

portfolioRouter.put(
  '/pages/portfolio/items/:id',
  requireAdminToken,
  validateBody(portfolioItemPatchSchema),
  async (req, res) => {
    const id = Number(req.params.id)
    const b = req.body as { image?: string; title?: string; description?: string }
    const { rows } = await pool.query(
      `UPDATE portfolio_items SET
        image = COALESCE($1, image),
        title = COALESCE($2, title),
        description = COALESCE($3, description)
      WHERE id = $4
      RETURNING id, image, title, description`,
      [b.image ?? null, b.title ?? null, b.description ?? null, id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    res.json(mapPortfolioItem(rows[0]))
  }
)
