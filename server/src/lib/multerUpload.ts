import multer from 'multer'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Request } from 'express'
import { HttpError } from './httpError.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const uploadDir = join(__dirname, '..', '..', 'uploads')
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    cb(
      new HttpError(
        400,
        `Недопустимый тип файла. Разрешены только изображения: JPEG, PNG, WebP, GIF`,
        'invalid_file_type'
      )
    )
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter,
})

export const uploadDirPath = uploadDir
