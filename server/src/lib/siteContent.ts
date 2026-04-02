import { pool } from '../db.js'

export async function getSiteJson(key: string): Promise<unknown | null> {
  const { rows } = await pool.query('SELECT data FROM site_content WHERE key = $1', [key])
  if (rows.length === 0) return null
  return rows[0].data
}

export async function putSiteJson(key: string, data: unknown) {
  await pool.query(
    `INSERT INTO site_content (key, data, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, JSON.stringify(data)]
  )
}

export function nextArrayId<T extends { id: number }>(items: T[]): number {
  if (!items.length) return 1
  return Math.max(...items.map((i) => i.id)) + 1
}
