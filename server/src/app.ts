import express from 'express'
import { setupMiddleware } from './http/setupMiddleware.js'
import { uploadDirPath } from './lib/multerUpload.js'
import { errorHandler, notFoundApi } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { chatsRouter } from './routes/chats.js'
import { healthRouter } from './routes/health.js'
import { pagesRouter } from './routes/pages.js'
import { portfolioRouter } from './routes/portfolio.js'
import { productsRouter } from './routes/products.js'
import { vkPublicRouter } from './routes/vkPublic.js'
import { uploadRouter } from './routes/upload.js'
import { contactLeadsRouter } from './routes/contactLeads.js'

export function createApp() {
  const app = express()

  setupMiddleware(app)

  app.use('/uploads', express.static(uploadDirPath))

  app.use('/api', authRouter)
  app.use('/api', healthRouter)
  app.use('/api', productsRouter)
  app.use('/api', uploadRouter)
  app.use('/api', portfolioRouter)
  app.use('/api', pagesRouter)
  app.use('/api', chatsRouter)
  app.use('/api', contactLeadsRouter)
  app.use('/api', vkPublicRouter)

  app.use(notFoundApi)
  app.use(errorHandler)

  return app
}
