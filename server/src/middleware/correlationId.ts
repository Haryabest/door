import { randomUUID } from 'crypto'
import type { RequestHandler } from 'express'

export const correlationId: RequestHandler = (req, res, next) => {
  const fromHeader = typeof req.headers['x-request-id'] === 'string' ? req.headers['x-request-id'].trim() : ''
  req.id = fromHeader || randomUUID()
  res.setHeader('x-request-id', req.id)
  next()
}
