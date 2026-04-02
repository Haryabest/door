// API для работы с сообщениями

import { apiFetch } from './http'

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
