import crypto from 'crypto'

const KEYLEN = 64
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const

export function verifyAdminPasswordHash(plain: string, saltHex: string, storedHashHex: string): boolean {
  let salt: Buffer
  let expected: Buffer
  try {
    salt = Buffer.from(saltHex, 'hex')
    expected = Buffer.from(storedHashHex, 'hex')
  } catch {
    return false
  }
  if (salt.length === 0 || expected.length !== KEYLEN) return false
  const derived = crypto.scryptSync(plain, salt, KEYLEN, SCRYPT_OPTS)
  return crypto.timingSafeEqual(derived, expected)
}

/** Для скриптов смены пароля */
export function hashAdminPassword(plain: string): { saltHex: string; hashHex: string } {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(plain, salt, KEYLEN, SCRYPT_OPTS)
  return { saltHex: salt.toString('hex'), hashHex: hash.toString('hex') }
}
