// Плавающие кнопки связи — GET/PUT /api/widgets/chat-widget

import { apiFetch } from './http'

export interface ChatWidgetData {
  /** Номер для отображения и ссылки tel: */
  phoneText: string
  /** Полная ссылка, например https://t.me/username */
  telegramUrl: string
  /** Email (без mailto — подставится при клике) */
  emailText: string
}

export const defaultChatWidgetData: ChatWidgetData = {
  phoneText: '+7 (960) 166 30-30',
  telegramUrl: 'https://t.me/',
  emailText: 'otadoya@mail.ru',
}

export function normalizeChatWidgetData(raw: unknown): ChatWidgetData {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    phoneText:
      typeof r.phoneText === 'string' && r.phoneText.trim() ? r.phoneText.trim() : defaultChatWidgetData.phoneText,
    telegramUrl:
      typeof r.telegramUrl === 'string' && r.telegramUrl.trim()
        ? r.telegramUrl.trim()
        : defaultChatWidgetData.telegramUrl,
    emailText:
      typeof r.emailText === 'string' && r.emailText.trim()
        ? r.emailText.trim()
        : defaultChatWidgetData.emailText,
  }
}

export function mailtoHrefFromChatEmail(text: string): string {
  const t = text.trim()
  if (!t) return '#'
  if (/^mailto:/i.test(t)) return t
  return `mailto:${t}`
}

export async function getChatWidgetEditable(): Promise<ChatWidgetData | null> {
  try {
    const response = await apiFetch('/api/widgets/chat-widget')
    if (!response.ok) return null
    return normalizeChatWidgetData(await response.json())
  } catch {
    return null
  }
}

/**
 * Для виджета на сайте: при отсутствии записи в БД — дефолты.
 */
export async function getChatWidget(): Promise<ChatWidgetData> {
  try {
    const response = await apiFetch('/api/widgets/chat-widget')
    if (!response.ok) return defaultChatWidgetData
    const raw = await response.json()
    return normalizeChatWidgetData(raw)
  } catch {
    return defaultChatWidgetData
  }
}

export async function updateChatWidget(data: ChatWidgetData): Promise<ChatWidgetData | null> {
  try {
    const payload = normalizeChatWidgetData(data)
    const response = await apiFetch('/api/widgets/chat-widget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('Failed to update chat widget')
    return normalizeChatWidgetData(await response.json())
  } catch (error) {
    console.error('Error updating chat widget:', error)
    return null
  }
}
