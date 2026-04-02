import { Router } from 'express'
import type { z } from 'zod'
import { pool } from '../db.js'
import { mapProduct } from '../mapRow.js'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import { productCreateSchema, productUpdateSchema } from '../validation/schemas.js'

export const productsRouter = Router()

productsRouter.get('/products/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  if (!q) {
    res.json([])
    return
  }
  const like = `%${q}%`
  const { rows } = await pool.query(
    `SELECT * FROM products
     WHERE name ILIKE $1 OR description ILIKE $1 OR material ILIKE $1 OR color ILIKE $1
     ORDER BY name ASC
     LIMIT 50`,
    [like]
  )
  res.json(rows.map(mapProduct))
})

productsRouter.get('/products', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id ASC')
  res.json(rows.map(mapProduct))
})

productsRouter.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id', code: 'bad_request' })
    return
  }
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(mapProduct(rows[0]))
})

productsRouter.post('/products', requireAdminToken, validateBody(productCreateSchema), async (req, res) => {
  const b = req.body as z.infer<typeof productCreateSchema>
  const { rows } = await pool.query(
    `INSERT INTO products (name, price, old_price, description, features, material, color, image, category, slug)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      b.name,
      b.price,
      b.oldPrice ?? null,
      b.description ?? null,
      b.features ?? [],
      b.material,
      b.color,
      b.image,
      b.category,
      b.slug,
    ]
  )
  res.status(201).json(mapProduct(rows[0]))
})

productsRouter.put(
  '/products/:id',
  requireAdminToken,
  validateBody(productUpdateSchema),
  async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid id', code: 'bad_request' })
      return
    }
    const b = req.body as z.infer<typeof productUpdateSchema>
    const { rows: cur } = await pool.query('SELECT * FROM products WHERE id = $1', [id])
    if (cur.length === 0) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const prev = mapProduct(cur[0])
    const name = b.name !== undefined ? b.name : prev.name
    const price = b.price !== undefined ? b.price : prev.price
    let oldPrice: number | null = prev.oldPrice ?? null
    if (b.oldPrice !== undefined) {
      oldPrice = b.oldPrice
    }
    const description = b.description !== undefined ? b.description : prev.description ?? null
    const features = b.features !== undefined ? b.features : prev.features ?? []
    const material = b.material !== undefined ? b.material : prev.material
    const color = b.color !== undefined ? b.color : prev.color
    const image = b.image !== undefined ? b.image : prev.image
    const category = b.category !== undefined ? b.category : prev.category
    const slug = b.slug !== undefined ? b.slug : prev.slug
    const { rows } = await pool.query(
      `UPDATE products SET
        name = $1, price = $2, old_price = $3, description = $4, features = $5,
        material = $6, color = $7, image = $8, category = $9, slug = $10
      WHERE id = $11
      RETURNING *`,
      [name, price, oldPrice, description, features, material, color, image, category, slug, id]
    )
    res.json(mapProduct(rows[0]))
  }
)

productsRouter.delete('/products/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id])
  if (!rowCount) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.status(204).send()
})
