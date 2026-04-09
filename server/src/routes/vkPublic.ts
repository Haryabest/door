import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../middleware/validateBody.js'
import { sendVkNotification } from '../lib/vkNotify.js'

const str = (max: number) => z.string().max(max).trim()

const vkContactSchema = z.object({
  text: str(8000).min(1),
  userName: str(200).optional(),
})

export const vkPublicRouter = Router()

vkPublicRouter.post('/vk/contact', validateBody(vkContactSchema), async (req, res) => {
  const b = req.body as z.infer<typeof vkContactSchema>

  await sendVkNotification({
    source: 'site',
    userName: b.userName ?? 'Сайт',
    text: b.text,
  })

  res.json({ ok: true })
})

