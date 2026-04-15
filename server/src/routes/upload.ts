import { Router } from 'express'
import type { Request } from 'express'
import { requireAdminToken } from '../middleware/authMutations.js'
import { upload } from '../lib/multerUpload.js'
import { HttpError } from '../lib/httpError.js'

export const uploadRouter = Router()

/** Полный публичный origin для ссылок на файлы: env или Host за reverse proxy */
function publicUploadBase(req: Request): string {
  const fromEnv = process.env.PUBLIC_BASE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0]?.trim() || 'https'
  const host = (req.get('x-forwarded-host') || req.get('host') || '').split(',')[0]?.trim()
  if (!host) return ''
  return `${proto}://${host}`
}

uploadRouter.post('/upload', requireAdminToken, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      next(err)
      return
    }
    if (!req.file) {
      next(new HttpError(400, 'Файл обязателен (поле file)', 'missing_file'))
      return
    }
    const base = publicUploadBase(req)
    const url = base ? `${base}/uploads/${req.file.filename}` : `/uploads/${req.file.filename}`
    res.json({ url })
  })
})
