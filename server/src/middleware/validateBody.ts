import type { RequestHandler } from 'express'
import type { z } from 'zod'

export function validateBody<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'Ошибка валидации',
        code: 'validation_error',
        details: parsed.error.flatten(),
      })
      return
    }
    req.body = parsed.data as unknown as typeof req.body
    next()
  }
}
