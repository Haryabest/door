import express, { type Express } from 'express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { pinoHttp } from 'pino-http'
import { corsMiddlewareOptions } from '../lib/corsConfig.js'
import { logger } from '../lib/logger.js'
import { correlationId } from '../middleware/correlationId.js'

export function setupMiddleware(app: Express) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1))

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )
  app.use(compression())

  app.use(correlationId)

  if (process.env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        genReqId: (req) => req.id,
        customLogLevel: (_req, res, err) => {
          if (err || res.statusCode >= 500) return 'error'
          if (res.statusCode >= 400) return 'warn'
          return 'info'
        },
      })
    )
  }

  app.use(cors(corsMiddlewareOptions()))

  const apiLimiter = rateLimit({
    windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
    max: Number(process.env.API_RATE_LIMIT_MAX ?? 400),
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      if (req.method === 'OPTIONS') return true
      const path = (req.originalUrl ?? req.url ?? '').split('?')[0] ?? ''
      return path === '/api/health' || path.endsWith('/api/health')
    },
    message: { error: 'Слишком много запросов, попробуйте позже', code: 'rate_limit' },
  })
  app.use('/api', apiLimiter)

  app.use(express.json({ limit: '10mb' }))
}
