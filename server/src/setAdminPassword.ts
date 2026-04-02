/**
 * Смена пароля админа в БД: npm run set-admin-password -- 'новый_пароль'
 */
import dotenv from 'dotenv'
import pg from 'pg'
import { hashAdminPassword } from './lib/adminPasswordHash.js'

dotenv.config()

async function main() {
  const pwd = process.argv[2]?.trim()
  if (!pwd) {
    console.error('Usage: npm run set-admin-password -- <new-password>')
    process.exit(1)
  }
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is required')
    process.exit(1)
  }
  const { saltHex, hashHex } = hashAdminPassword(pwd)
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    const { rowCount } = await client.query(
      `UPDATE admin_credential SET salt = $1, password_hash = $2, updated_at = now() WHERE id = 1`,
      [saltHex, hashHex]
    )
    if (rowCount === 0) {
      console.error('No row in admin_credential. Run npm run migrate first.')
      process.exit(1)
    }
    console.log('Password updated.')
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
