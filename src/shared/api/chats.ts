// API для работы с сообщениями (заглушки для БД)

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

export async function sendMessage(chatId: number, text: string): Promise<Message | null> {
  console.log('POST /api/chats', chatId, text)
  return null
}

export async function markChatAsRead(id: number): Promise<boolean> {
  console.log('PUT /api/chats', id)
  return true
}
