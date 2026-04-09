import { Router } from 'express'
import { validateBody } from '../middleware/validateBody.js'
import { z } from 'zod'
import { sendTelegramChatNotification } from '../lib/telegram.js'
import { logger } from '../lib/logger.js'

const str = (max: number) => z.string().max(max).trim()

const telegramContactSchema = z.object({
  text: str(8000).min(1),
  userName: str(200).optional(),
})

export const telegramPublicRouter = Router()

/**
 * Public endpoint for site chat widget:
 * sends a Telegram notification to TELEGRAM_CHAT_ID (and/or subscribers).
 */
telegramPublicRouter.post('/telegram/contact', validateBody(telegramContactSchema), async (req, res) => {
  const b = req.body as z.infer<typeof telegramContactSchema>

  logger.info({ hasUserName: Boolean(b.userName), textLength: b.text.length }, 'Incoming site contact message')
  await sendTelegramChatNotification({
    chatId: 0,
    userName: b.userName ?? 'Сайт',
    text: b.text,
  })

  res.json({ ok: true })
})

