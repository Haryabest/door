import { Router } from 'express'
import { pool } from '../db.js'
import { mapMessage } from '../mapRow.js'
import { requireAdminToken } from '../middleware/authMutations.js'
import { validateBody } from '../middleware/validateBody.js'
import { chatMessageSchema } from '../validation/schemas.js'

export const chatsRouter = Router()

chatsRouter.get('/chats', async (_req, res) => {
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
  await pool.query(`UPDATE chats SET unread_count = 0 WHERE id = $1`, [b.chatId])
  const m = mapMessage(rows[0])
  res.status(201).json(m)
})

chatsRouter.put('/chats/:id', requireAdminToken, async (req, res) => {
  const id = Number(req.params.id)
  await pool.query('UPDATE chats SET unread_count = 0 WHERE id = $1', [id])
  res.json({ ok: true })
})
