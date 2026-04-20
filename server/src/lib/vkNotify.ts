import { VK } from 'vk-io'
import { logger } from './logger.js'

const vkSubscriberPeerIds = new Set<number>()

type VkEventType = 'price_clarification' | 'chat_message'

interface VkDailyStats {
  dateKey: string
  totalLeads: number
  urgentChats: number
  priceClarifications: number
}

let dailyStats: VkDailyStats = {
  dateKey: getDateKey(),
  totalLeads: 0,
  urgentChats: 0,
  priceClarifications: 0,
}

function getDateKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function ensureDailyStatsCurrent(): void {
  const currentDateKey = getDateKey()
  if (dailyStats.dateKey === currentDateKey) return
  dailyStats = {
    dateKey: currentDateKey,
    totalLeads: 0,
    urgentChats: 0,
    priceClarifications: 0,
  }
}

function registerLead(eventType: VkEventType): void {
  ensureDailyStatsCurrent()
  dailyStats.totalLeads += 1
  if (eventType === 'chat_message') {
    dailyStats.urgentChats += 1
    return
  }
  dailyStats.priceClarifications += 1
}

function normalizeBaseUrl(url: string): string | null {
  const value = url.trim()
  if (!value) return null
  if (!/^https?:\/\//i.test(value)) return null
  return value.replace(/\/$/, '')
}

function adminBaseUrl(): string | null {
  const explicit = process.env.VK_MANAGER_PANEL_URL?.trim()
  if (explicit) return normalizeBaseUrl(explicit)

  const publicBase = process.env.PUBLIC_BASE_URL?.trim()
  if (publicBase) return normalizeBaseUrl(publicBase)

  return null
}

function buildAdminChatUrl(chatId?: number): string | null {
  const base = adminBaseUrl()
  if (!base) return null
  if (!Number.isFinite(chatId) || !chatId || chatId <= 0) return `${base}/admin`

  const params = new URLSearchParams({ tab: 'messages', chatId: String(chatId) })
  return `${base}/admin?${params.toString()}`
}

function buildInlineKeyboard(adminUrl: string | null): string | undefined {
  if (!adminUrl) return undefined
  return JSON.stringify({
    inline: true,
    buttons: [
      [
        {
          action: {
            type: 'open_link',
            link: adminUrl,
            label: 'Открыть чат на сайте',
          },
        },
      ],
    ],
  })
}

function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null
  const raw = phone.trim()
  if (!raw) return null

  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10) return raw

  const normalizedDigits = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits.startsWith('7')
      ? digits
      : digits

  const cc = normalizedDigits[0] ?? '7'
  const p1 = normalizedDigits.slice(1, 4)
  const p2 = normalizedDigits.slice(4, 7)
  const p3 = normalizedDigits.slice(7, 9)
  const p4 = normalizedDigits.slice(9, 11)
  const pretty = `+${cc} (${p1}) ${p2}-${p3}-${p4}`.replace(/[-\s()]+$/g, '')

  return pretty
}

function clickablePhoneUrl(phone?: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return null
  const normalizedDigits = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits.startsWith('7')
      ? digits
      : digits
  return `tel:+${normalizedDigits}`
}

function eventMeta(source: 'site' | 'admin', eventType: VkEventType): { marker: string; typeLabel: string } {
  if (source === 'admin') {
    return { marker: '🔵', typeLabel: 'Ответ менеджера в чате' }
  }
  if (eventType === 'price_clarification') {
    return { marker: '🟢', typeLabel: 'Уточнение цены' }
  }
  return { marker: '🔴', typeLabel: 'Сообщение в чате' }
}

export function addVkSubscriber(peerId: number): void {
  if (Number.isFinite(peerId) && peerId > 0) vkSubscriberPeerIds.add(peerId)
}

export function removeVkSubscriber(peerId: number): void {
  vkSubscriberPeerIds.delete(peerId)
}

export function isVkSubscriber(peerId: number): boolean {
  return vkSubscriberPeerIds.has(peerId)
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
  eventType?: VkEventType
  clientName?: string | null
  clientPhone?: string | null
  productName?: string | null
  productUrl?: string | null
  pageUrl?: string | null
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

  const eventType: VkEventType = params.eventType ?? 'chat_message'
  const { marker, typeLabel } = eventMeta(params.source, eventType)
  const adminUrl = buildAdminChatUrl(params.chatId)
  const keyboard = buildInlineKeyboard(adminUrl)

  const clientName = params.clientName?.trim() || params.userName?.trim() || 'Не указано'
  const phoneLabel = normalizePhone(params.clientPhone)
  const phoneLink = clickablePhoneUrl(params.clientPhone)

  if (params.source === 'site') {
    registerLead(eventType)
  }

  const lines = [
    '🔔 Новая заявка с сайта!',
    `${marker} Тип: ${typeLabel}`,
    params.chatId !== undefined ? `Chat ID: ${params.chatId}` : null,
    `Клиент ${clientName} ждет ответа`,
    '',
    'Данные клиента:',
    `• Имя: ${clientName}`,
    phoneLabel ? `• Телефон: ${phoneLabel}` : '• Телефон: не указан',
    phoneLink ? `• Позвонить: ${phoneLink}` : null,
    '',
    'Контекст:',
    params.productName?.trim() ? `• Модель: ${params.productName.trim()}` : null,
    params.productUrl?.trim() ? `• Товар: ${params.productUrl.trim()}` : null,
    params.pageUrl?.trim() ? `• Страница: ${params.pageUrl.trim()}` : null,
    '',
    'Сообщение клиента:',
    '',
    params.text,
    adminUrl ? '' : null,
    adminUrl ? 'Открыть чат на сайте:' : null,
    adminUrl,
  ].filter(Boolean) as string[]

  const message = lines.join('\n')

  const results = await Promise.allSettled(
    recipients.map((peerId) =>
      vk.api.messages.send({
        peer_id: peerId,
        random_id: Date.now() + peerId,
        message,
        keyboard,
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

export function getVkDailyStats(): { dateKey: string; totalLeads: number; urgentChats: number; priceClarifications: number } {
  ensureDailyStatsCurrent()
  return {
    dateKey: dailyStats.dateKey,
    totalLeads: dailyStats.totalLeads,
    urgentChats: dailyStats.urgentChats,
    priceClarifications: dailyStats.priceClarifications,
  }
}

export function getVkAdminBaseUrl(): string | null {
  return adminBaseUrl()
}

