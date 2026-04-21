// API для работы с сообщениями

import { apiFetch, publicApiFetch } from './http'

export interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  chatId: number
}

export interface Chat {
  id: number
  userName: string
  lastMessage: string
  unread: number
  messages: Message[]
}

export interface PublicChatMeta {
  eventType?: 'price_clarification' | 'chat_message'
  clientName?: string
  clientPhone?: string
  productName?: string
  productUrl?: string
  pageUrl?: string
}

function normalizeChat(raw: Record<string, unknown>): Chat {
  const messages = (raw.messages as Record<string, unknown>[]) ?? []
  return {
    id: raw.id as number,
    userName: raw.userName as string,
    lastMessage: raw.lastMessage as string,
    unread: raw.unread as number,
    messages: messages.map((m) => ({
      id: m.id as number,
      text: m.text as string,
      isUser: m.isUser as boolean,
      timestamp: new Date(m.timestamp as string | number | Date),
      chatId: m.chatId as number,
    })),
  }
}

export async function getChats(): Promise<Chat[]> {
  const response = await apiFetch('/api/chats')
  if (!response.ok) return []
  const data = (await response.json()) as Record<string, unknown>[]
  return data.map(normalizeChat)
}

export async function sendMessage(chatId: number, text: string): Promise<Message | null> {
  const response = await apiFetch('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, text }),
  })
  if (!response.ok) return null
  const m = (await response.json()) as Record<string, unknown>
  return {
    id: m.id as number,
    text: m.text as string,
    isUser: m.isUser as boolean,
    timestamp: new Date(m.timestamp as string | number | Date),
    chatId: m.chatId as number,
  }
}

export async function markChatAsRead(id: number): Promise<boolean> {
  const response = await apiFetch(`/api/chats/${id}`, { method: 'PUT' })
  return response.ok
}

const CHAT_ID_KEY = 'door_public_chat_id'
const CHAT_TOKEN_KEY = 'door_public_chat_token'

export function getStoredChatSession(): { chatId: number; clientToken: string } | null {
  if (typeof localStorage === 'undefined') return null
  const id = localStorage.getItem(CHAT_ID_KEY)
  const token = localStorage.getItem(CHAT_TOKEN_KEY)
  if (!id || !token) return null
  const n = Number(id)
  if (Number.isNaN(n)) return null
  return { chatId: n, clientToken: token }
}

export function setStoredChatSession(chatId: number, clientToken: string): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CHAT_ID_KEY, String(chatId))
  localStorage.setItem(CHAT_TOKEN_KEY, clientToken)
}

/** Сообщение с сайта (без админ-сессии) */
export async function postPublicChatMessage(
  text: string,
  session: { chatId: number; clientToken: string } | null,
  meta?: PublicChatMeta
): Promise<{ chatId: number; clientToken: string; message: Message } | null> {
  const body: {
    text: string
    chatId?: number
    clientToken?: string
    eventType?: 'price_clarification' | 'chat_message'
    clientName?: string
    clientPhone?: string
    productName?: string
    productUrl?: string
    pageUrl?: string
  } = { text }

  if (meta) {
    body.eventType = meta.eventType
    body.clientName = meta.clientName
    body.clientPhone = meta.clientPhone
    body.productName = meta.productName
    body.productUrl = meta.productUrl
    body.pageUrl = meta.pageUrl
  }

  if (session) {
    body.chatId = session.chatId
    body.clientToken = session.clientToken
  }
  const response = await publicApiFetch('/api/chats/public/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) return null
  const data = (await response.json()) as {
    chatId: number
    clientToken: string
    message: Record<string, unknown>
  }
  const m = data.message
  return {
    chatId: data.chatId,
    clientToken: data.clientToken,
    message: {
      id: m.id as number,
      text: m.text as string,
      isUser: m.isUser as boolean,
      timestamp: new Date(m.timestamp as string | number | Date),
      chatId: m.chatId as number,
    },
  }
}

export async function fetchPublicChatMessages(
  chatId: number,
  clientToken: string
): Promise<Message[]> {
  const response = await publicApiFetch(
    `/api/chats/public/${chatId}/messages?token=${encodeURIComponent(clientToken)}`
  )
  if (!response.ok) return []
  const data = (await response.json()) as { messages: Record<string, unknown>[] }
  return (data.messages ?? []).map((m) => ({
    id: m.id as number,
    text: m.text as string,
    isUser: m.isUser as boolean,
    timestamp: new Date(m.timestamp as string | number | Date),
    chatId: m.chatId as number,
  }))
}
