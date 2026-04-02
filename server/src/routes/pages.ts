import { Router } from 'express'
import type { z } from 'zod'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import { getSiteJson, nextArrayId, putSiteJson } from '../lib/siteContent.js'
import {
  aboutAdvantageCreateSchema,
  aboutAdvantagePatchSchema,
  aboutStatCreateSchema,
  aboutStatPatchSchema,
  contactLocationCreateSchema,
  contactLocationPatchSchema,
  jsonPageDocument,
} from '../validation/schemas.js'

export const pagesRouter = Router()

// --- Home ---
pagesRouter.get('/pages/home', async (_req, res) => {
  const data = await getSiteJson('home')
  if (!data) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(data)
})

pagesRouter.put('/pages/home', requireAdminToken, validateBody(jsonPageDocument), async (req, res) => {
  await putSiteJson('home', req.body)
  res.json(req.body)
})

// --- About ---
pagesRouter.get('/pages/about', async (_req, res) => {
  const data = await getSiteJson('about')
  if (!data) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(data)
})

pagesRouter.put('/pages/about', requireAdminToken, validateBody(jsonPageDocument), async (req, res) => {
  await putSiteJson('about', req.body)
  res.json(req.body)
})

pagesRouter.post(
  '/pages/about/stats',
  requireAdminToken,
  validateBody(aboutStatCreateSchema),
  async (req, res) => {
    const cur = (await getSiteJson('about')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const stats = (cur.stats as { id: number }[]) ?? []
    const id = nextArrayId(stats)
    const row = { id, ...(req.body as z.infer<typeof aboutStatCreateSchema>) }
    const nextStats = [...stats, row]
    cur.stats = nextStats
    await putSiteJson('about', cur)
    res.status(201).json(row)
  }
)

pagesRouter.delete('/pages/about/stats/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  const cur = (await getSiteJson('about')) as Record<string, unknown> | null
  if (!cur) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  const stats = (cur.stats as { id: number }[]) ?? []
  cur.stats = stats.filter((s) => s.id !== id)
  await putSiteJson('about', cur)
  res.status(204).send()
})

pagesRouter.put(
  '/pages/about/stats/:id',
  requireAdminToken,
  validateBody(aboutStatPatchSchema),
  async (req, res) => {
    const id = Number(req.params.id)
    const cur = (await getSiteJson('about')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const stats = (cur.stats as Record<string, unknown>[]) ?? []
    const idx = stats.findIndex((s) => Number(s.id) === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    stats[idx] = { ...stats[idx], ...req.body, id }
    cur.stats = stats
    await putSiteJson('about', cur)
    res.json(stats[idx])
  }
)

pagesRouter.post(
  '/pages/about/advantages',
  requireAdminToken,
  validateBody(aboutAdvantageCreateSchema),
  async (req, res) => {
    const cur = (await getSiteJson('about')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const list = (cur.advantages as { id: number }[]) ?? []
    const id = nextArrayId(list)
    const row = { id, ...(req.body as z.infer<typeof aboutAdvantageCreateSchema>) }
    cur.advantages = [...list, row]
    await putSiteJson('about', cur)
    res.status(201).json(row)
  }
)

pagesRouter.delete('/pages/about/advantages/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  const cur = (await getSiteJson('about')) as Record<string, unknown> | null
  if (!cur) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  const list = (cur.advantages as { id: number }[]) ?? []
  cur.advantages = list.filter((s) => s.id !== id)
  await putSiteJson('about', cur)
  res.status(204).send()
})

pagesRouter.put(
  '/pages/about/advantages/:id',
  requireAdminToken,
  validateBody(aboutAdvantagePatchSchema),
  async (req, res) => {
    const id = Number(req.params.id)
    const cur = (await getSiteJson('about')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const list = (cur.advantages as Record<string, unknown>[]) ?? []
    const idx = list.findIndex((s) => Number(s.id) === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    list[idx] = { ...list[idx], ...req.body, id }
    cur.advantages = list
    await putSiteJson('about', cur)
    res.json(list[idx])
  }
)

// --- Contacts ---
pagesRouter.get('/pages/contacts', async (_req, res) => {
  const data = await getSiteJson('contacts')
  if (!data) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(data)
})

pagesRouter.put('/pages/contacts', requireAdminToken, validateBody(jsonPageDocument), async (req, res) => {
  await putSiteJson('contacts', req.body)
  res.json(req.body)
})

pagesRouter.post(
  '/pages/contacts/locations',
  requireAdminToken,
  validateBody(contactLocationCreateSchema),
  async (req, res) => {
    const cur = (await getSiteJson('contacts')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const locs = (cur.locations as { id: number }[]) ?? []
    const id = nextArrayId(locs)
    const row = { id, ...(req.body as z.infer<typeof contactLocationCreateSchema>) }
    cur.locations = [...locs, row]
    await putSiteJson('contacts', cur)
    res.status(201).json(row)
  }
)

pagesRouter.delete('/pages/contacts/locations/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  const cur = (await getSiteJson('contacts')) as Record<string, unknown> | null
  if (!cur) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  const locs = (cur.locations as { id: number }[]) ?? []
  cur.locations = locs.filter((s) => s.id !== id)
  await putSiteJson('contacts', cur)
  res.status(204).send()
})

pagesRouter.put(
  '/pages/contacts/locations/:id',
  requireAdminToken,
  validateBody(contactLocationPatchSchema),
  async (req, res) => {
    const id = Number(req.params.id)
    const cur = (await getSiteJson('contacts')) as Record<string, unknown> | null
    if (!cur) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    const locs = (cur.locations as Record<string, unknown>[]) ?? []
    const idx = locs.findIndex((s) => Number(s.id) === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Not found', code: 'not_found' })
      return
    }
    locs[idx] = { ...locs[idx], ...req.body, id }
    cur.locations = locs
    await putSiteJson('contacts', cur)
    res.json(locs[idx])
  }
)

// --- Catalog ---
pagesRouter.get('/pages/catalog', async (_req, res) => {
  const data = await getSiteJson('catalog')
  if (!data) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(data)
})

pagesRouter.put('/pages/catalog', requireAdminToken, validateBody(jsonPageDocument), async (req, res) => {
  await putSiteJson('catalog', req.body)
  res.json(req.body)
})

// --- Header widget ---
pagesRouter.get('/widgets/header', async (_req, res) => {
  const data = await getSiteJson('header')
  if (!data) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  res.json(data)
})

pagesRouter.put('/widgets/header', requireAdminToken, validateBody(jsonPageDocument), async (req, res) => {
  await putSiteJson('header', req.body)
  res.json(req.body)
})
