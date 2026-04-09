import { logger } from './logger.js'

type TelegramMessagePayload = {
  chat_id: string
  text: string
  disable_web_page_preview?: boolean
}

type TelegramResponse<T> = {
  ok: boolean
  result?: T
  description?: string
}

type TelegramUpdate = {
  update_id: number
  message?: {
    text?: string
    chat?: {
      id?: number
    }
  }
}

const telegramSubscriberChatIds = new Set<string>()
let lastTelegramUpdateId = 0
let isPollingTelegram = false
let telegramPollingStarted = false

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const defaultChatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token) return null

  return { token, defaultChatId }
}

async function telegramApi<T>(token: string, method: string, payload: Record<string, unknown>): Promise<T> {
  const timeoutMs = Number(process.env.TELEGRAM_HTTP_TIMEOUT_MS ?? 20_000)
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`Telegram API error: ${response.status} ${responseText}`)
  }

  const data = (await response.json()) as TelegramResponse<T>
  if (!data.ok || data.result === undefined) {
    throw new Error(`Telegram API error: ${data.description ?? 'Unknown error'}`)
  }

  return data.result
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  const payload: TelegramMessagePayload = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  }

  await telegramApi(token, 'sendMessage', payload)
}

async function ensurePollingMode(token: string): Promise<void> {
  // If a webhook is set, getUpdates will not receive messages.
  await telegramApi(token, 'deleteWebhook', { drop_pending_updates: true })
}

function getNotificationRecipients(defaultChatId?: string): string[] {
  const recipients = new Set(telegramSubscriberChatIds)
  if (defaultChatId) recipients.add(defaultChatId)
  return [...recipients]
}

async function syncTelegramSubscribersFromUpdates(): Promise<void> {
  const cfg = getTelegramConfig()
  if (!cfg || isPollingTelegram) return

  isPollingTelegram = true
  try {
    const updates = await telegramApi<TelegramUpdate[]>(cfg.token, 'getUpdates', {
      offset: lastTelegramUpdateId,
      timeout: 0,
      allowed_updates: ['message'],
    })

    for (const update of updates) {
      if (update.update_id >= lastTelegramUpdateId) {
        lastTelegramUpdateId = update.update_id + 1
      }

      const chatId = update.message?.chat?.id
      const text = update.message?.text?.trim()
      if (!chatId || !text) continue

      // Telegram can send "/start <payload>" or "/start@botname"
      const firstToken = text.split(/\s+/, 1)[0] ?? ''
      const command = firstToken.replace(/@.+$/, '')

      if (command === '/start') {
        const chatIdString = String(chatId)
        telegramSubscriberChatIds.add(chatIdString)
        await sendTelegramMessage(cfg.token, chatIdString, 'Привет')
      }
    }
  } finally {
    isPollingTelegram = false
  }
}

export function startTelegramUpdatesPolling(): void {
  const cfg = getTelegramConfig()
  if (!cfg || telegramPollingStarted) return

  telegramPollingStarted = true

  void ensurePollingMode(cfg.token).catch((error) => {
    logger.warn({ err: error }, 'Failed to delete Telegram webhook; polling may not receive updates')
  })

  void syncTelegramSubscribersFromUpdates().catch((error) => {
    logger.warn({ err: error }, 'Failed to sync Telegram subscribers on startup')
  })

  const intervalMs = Number(process.env.TELEGRAM_POLL_INTERVAL_MS ?? 5_000)
  const timer = setInterval(() => {
    void syncTelegramSubscribersFromUpdates().catch((error) => {
      logger.warn({ err: error }, 'Failed to sync Telegram subscribers')
    })
  }, intervalMs)

  timer.unref()
}

export async function sendTelegramChatNotification(params: {
  chatId: number
  userName?: string | null
  text: string
}): Promise<void> {
  const cfg = getTelegramConfig()
  if (!cfg) return

  try {
    await syncTelegramSubscribersFromUpdates()
  } catch (error) {
    // Updates sync is best-effort; notifications should still go to TELEGRAM_CHAT_ID if set.
    logger.warn({ err: error }, 'Failed to sync Telegram updates before notification')
  }

  const recipients = getNotificationRecipients(cfg.defaultChatId)
  if (!recipients.length) return

  const messageLines = [
    '💬 Новое сообщение в чате',
    `Chat ID: ${params.chatId}`,
    `Клиент: ${params.userName?.trim() || 'Неизвестно'}`,
    '',
    params.text,
  ]

  const messageText = messageLines.join('\n')
  const sendResults = await Promise.allSettled(
    recipients.map((recipientChatId) => sendTelegramMessage(cfg.token, recipientChatId, messageText))
  )

  const failedCount = sendResults.filter((result) => result.status === 'rejected').length
  if (failedCount > 0) {
    throw new Error(`Telegram notifications failed for ${failedCount} recipient(s)`)
  }
}

export async function notifyTelegramAboutChatMessage(params: {
  chatId: number
  userName?: string | null
  text: string
}): Promise<void> {
  try {
    await sendTelegramChatNotification(params)
  } catch (error) {
    logger.warn({ err: error, chatId: params.chatId }, 'Failed to send Telegram notification')
  }
}
