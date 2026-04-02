import { Router } from 'express'
import { requireAdminToken } from '../middleware/authMutations.js'
import { upload } from '../lib/multerUpload.js'
import { HttpError } from '../lib/httpError.js'

export const uploadRouter = Router()

const publicBase = process.env.PUBLIC_BASE_URL ?? ''

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
    const url = `${publicBase}/uploads/${req.file.filename}`
    res.json({ url })
  })
})
