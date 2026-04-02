import type { ErrorRequestHandler, RequestHandler } from 'express'
import multer from 'multer'
import { mapPgError } from '../lib/pgErrors.js'
import { HttpError } from '../lib/httpError.js'
import { logger } from '../lib/logger.js'

export const notFoundApi: RequestHandler = (req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found', code: 'not_found' })
    return
  }
  next()
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  const requestId = req.id

  if (err instanceof multer.MulterError) {
    const msg =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Файл слишком большой'
        : err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Неожиданное поле файла'
          : err.message
    logger.warn({ err: err.code, requestId }, msg)
    res.status(400).json({ error: msg, code: err.code, requestId })
    return
  }

  if (err instanceof HttpError) {
    logger.warn({ requestId, status: err.status }, err.message)
    res.status(err.status).json({
      error: err.message,
      ...(err.code && { code: err.code }),
      requestId,
    })
    return
  }

  const mapped = mapPgError(err)
  if (mapped) {
    if (mapped.logDetail) {
      logger.error({ requestId, pg: mapped.code }, mapped.logDetail)
    }
    res.status(mapped.status).json({
      error: mapped.message,
      ...(mapped.code && { code: mapped.code }),
      requestId,
    })
    return
  }

  const status =
    typeof err === 'object' && err && 'status' in err
      ? Number((err as { status?: number }).status)
      : typeof err === 'object' && err && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 500

  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'Internal Server Error'

  logger.error({ requestId, err }, message)

  const code = status >= 400 && status < 600 ? status : 500
  const body: Record<string, unknown> = {
    requestId,
    error:
      process.env.NODE_ENV === 'production' && code === 500
        ? 'Internal Server Error'
        : message,
  }
  if (process.env.NODE_ENV !== 'production' && err instanceof Error && err.stack) {
    body.stack = err.stack
  }
  res.status(code).json(body)
}
