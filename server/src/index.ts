import 'dotenv/config'
import 'express-async-errors'
import { createApp } from './app.js'
import { assertDatabaseConfigured, closePool } from './db.js'
import { logger } from './lib/logger.js'

assertDatabaseConfigured()

const port = Number(process.env.PORT) || 3001
const app = createApp()
const server = app.listen(port, () => {
  logger.info({ port }, 'Doors API listening')
})

async function shutdown(signal: string) {
  logger.info({ signal }, 'shutdown')
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
  await closePool()
  process.exit(0)
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))
