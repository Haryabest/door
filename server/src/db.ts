import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

if (!process.env.DATABASE_URL?.trim()) {
  console.warn('Warning: DATABASE_URL is not set. Copy server/.env.example to server/.env')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX ?? 20),
  idleTimeoutMillis: Number(process.env.PG_IDLE_MS ?? 30_000),
  connectionTimeoutMillis: Number(process.env.PG_CONNECT_TIMEOUT_MS ?? 10_000),
  allowExitOnIdle: true,
})

export function assertDatabaseConfigured(): void {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is not set. Copy server/.env.example to server/.env')
  }
}

export async function closePool(): Promise<void> {
  await pool.end()
}
