import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { pool } from '../db.js'
import { mapMessage } from '../mapRow.js'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import { sendVkNotification } from '../lib/vkNotify.js'
import { chatMessageSchema, chatPublicMessageSchema } from '../validation/schemas.js'

export const chatsRouter = Router()

const str = (max: number) => z.string().max(max).trim()

const chatPublicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много сообщений', code: 'rate_limit' },
})

/** Сообщение с сайта: создаёт чат или пишет в существующий */
chatsRouter.post(
  '/chats/public/message',
  chatPublicLimiter,
  validateBody(chatPublicMessageSchema),
  async (req, res) => {
    const b = req.body as z.infer<typeof chatPublicMessageSchema>
    const text = b.text

    if (b.chatId != null && b.clientToken) {
      const { rows: chatRows } = await pool.query<{ id: number; user_name: string }>(
        `SELECT id, user_name FROM chats WHERE id = $1 AND client_token = $2`,
        [b.chatId, b.clientToken]
      )
      if (chatRows.length === 0) {
        res.status(404).json({ error: 'Чат не найден', code: 'chat_not_found' })
        return
      }
      const chatId = chatRows[0]!.id
      const { rows: msgRows } = await pool.query(
        `INSERT INTO chat_messages (chat_id, text, is_user) VALUES ($1, $2, true) RETURNING *`,
        [chatId, text]
      )
      await pool.query(`UPDATE chats SET unread_count = unread_count + 1 WHERE id = $1`, [chatId])
      try {
        await sendVkNotification({
          source: 'site',
          chatId,
          userName: chatRows[0]!.user_name,
          text,
        })
      } catch {
        /* VK не должен ломать чат */
      }
      const m = mapMessage(msgRows[0])
      res.status(201).json({
        chatId,
        clientToken: b.clientToken,
        message: m,
      })
      return
    }

    const userName = `Посетитель ${Math.random().toString(36).slice(2, 8)}`
    const { rows: ins } = await pool.query<{ id: number; client_token: string }>(
      `INSERT INTO chats (user_name, unread_count, client_token)
       VALUES ($1, 1, gen_random_uuid()::text)
       RETURNING id, client_token`,
      [userName]
    )
    const row = ins[0]!
    const chatId = row.id
    const clientToken = row.client_token

    const { rows: msgRows } = await pool.query(
      `INSERT INTO chat_messages (chat_id, text, is_user) VALUES ($1, $2, true) RETURNING *`,
      [chatId, text]
    )
    try {
      await sendVkNotification({
        source: 'site',
        chatId,
        userName,
        text,
      })
    } catch {
      /* VK не должен ломать чат */
    }
    const m = mapMessage(msgRows[0])
    res.status(201).json({
      chatId,
      clientToken,
      message: m,
    })
  }
)

/** История сообщений для виджета (по id + секрету) */
chatsRouter.get('/chats/public/:chatId/messages', async (req, res) => {
  const chatId = Number(req.params.chatId)
  const token = String(req.query.token ?? '').trim()
  if (Number.isNaN(chatId) || !token) {
    res.status(400).json({ error: 'Нужны chatId и token', code: 'bad_request' })
    return
  }
  const { rows: chatRows } = await pool.query(
    `SELECT id FROM chats WHERE id = $1 AND client_token = $2`,
    [chatId, token]
  )
  if (chatRows.length === 0) {
    res.status(404).json({ error: 'Не найдено', code: 'not_found' })
    return
  }
  const { rows: msgRows } = await pool.query(
    `SELECT id, chat_id, text, is_user, created_at FROM chat_messages
     WHERE chat_id = $1 ORDER BY created_at ASC`,
    [chatId]
  )
  res.json({ messages: msgRows.map(mapMessage) })
})

/** Список чатов — только для авторизованного админа */
chatsRouter.get('/chats', requireAdminToken, async (_req, res) => {
  const { rows: chatRows } = await pool.query(
    'SELECT id, user_name, unread_count, created_at FROM chats ORDER BY id ASC'
  )
  const result = []
  for (const c of chatRows) {
    const chatId = c.id as number
    const { rows: msgRows } = await pool.query(
      `SELECT id, chat_id, text, is_user, created_at FROM chat_messages
       WHERE chat_id = $1 ORDER BY created_at ASC`,
      [chatId]
    )
    const messages = msgRows.map(mapMessage)
    const last = messages.length ? messages[messages.length - 1]!.text : ''
    result.push({
      id: chatId,
      userName: c.user_name,
      lastMessage: last,
      unread: c.unread_count,
      messages,
    })
  }
  res.json(result)
})

chatsRouter.post('/chats', requireAdminToken, validateBody(chatMessageSchema), async (req, res) => {
  const b = req.body as { chatId: number; text: string }
  const { rows } = await pool.query(
    `INSERT INTO chat_messages (chat_id, text, is_user) VALUES ($1, $2, false) RETURNING *`,
    [b.chatId, b.text]
  )
  const { rows: chatRows } = await pool.query(`SELECT user_name FROM chats WHERE id = $1`, [b.chatId])
  await pool.query(`UPDATE chats SET unread_count = 0 WHERE id = $1`, [b.chatId])
  await sendVkNotification({
    source: 'admin',
    chatId: b.chatId,
    userName: (chatRows[0]?.user_name as string | null | undefined) ?? null,
    text: b.text,
  })
  const m = mapMessage(rows[0])
  res.status(201).json(m)
})

chatsRouter.put('/chats/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  await pool.query('UPDATE chats SET unread_count = 0 WHERE id = $1', [id])
  res.json({ ok: true })
})
