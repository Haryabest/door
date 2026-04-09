import { VK } from 'vk-io'
import { logger } from './logger.js'

const vkSubscriberPeerIds = new Set<number>()

export function addVkSubscriber(peerId: number): void {
  if (Number.isFinite(peerId) && peerId > 0) vkSubscriberPeerIds.add(peerId)
}

export function removeVkSubscriber(peerId: number): void {
  vkSubscriberPeerIds.delete(peerId)
}

function getVkNotifyConfig(): { token: string } | null {
  const token = process.env.VK_GROUP_TOKEN?.trim()

  if (!token) return null
  return { token }
}

export async function sendVkNotification(params: {
  source: 'site' | 'admin'
  chatId?: number
  userName?: string | null
  text: string
}): Promise<void> {
  const cfg = getVkNotifyConfig()
  if (!cfg) {
    logger.warn('VK notify is not configured: set VK_GROUP_TOKEN')
    return
  }

  const recipients = [...vkSubscriberPeerIds]
  if (!recipients.length) {
    logger.warn('No VK subscribers yet: users should send "start" to the community bot')
    return
  }

  const vk = new VK({ token: cfg.token })

  const header = params.source === 'site' ? '💬 Сообщение с сайта' : '💬 Сообщение в чате'
  const lines = [
    header,
    params.chatId !== undefined ? `Chat ID: ${params.chatId}` : null,
    `Клиент: ${params.userName?.trim() || 'Неизвестно'}`,
    '',
    params.text,
  ].filter(Boolean) as string[]

  const message = lines.join('\n')

  const results = await Promise.allSettled(
    recipients.map((peerId) =>
      vk.api.messages.send({
        peer_id: peerId,
        random_id: Date.now() + peerId,
        message,
      })
    )
  )

  const failedCount = results.filter((r) => r.status === 'rejected').length
  if (failedCount > 0) {
    logger.warn({ failedCount, recipientsCount: recipients.length }, 'Failed to send VK notification to some recipients')
  } else {
    logger.info({ recipientsCount: recipients.length }, 'VK notification sent')
  }
}

