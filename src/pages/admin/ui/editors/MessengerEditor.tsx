import { useState } from 'react'
import { Send } from 'lucide-react'
import type { ChatLocal } from '@/pages/admin/ui/AdminPage'
import { containsProfanity } from '@/shared/lib/profanity'

interface MessengerEditorProps {
  chats: ChatLocal[]
  selectedChat: number | null
  onSelectChat: (id: number) => void
  onSendMessage: (chatId: number, text: string) => void
}

export function MessengerEditor({
  chats,
  selectedChat,
  onSelectChat,
  onSendMessage,
}: MessengerEditorProps) {
  const [message, setMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const text = message.trim()
    if (!selectedChat || !text) return
    if (containsProfanity(text)) {
      setValidationError('Ответ с матом/бранью отправить нельзя.')
      return
    }

    setValidationError('')
    onSendMessage(selectedChat, text)
    setMessage('')
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет активных чатов</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Список чатов */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-primary">Чаты</h2>
        </div>
        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{chat.userName}</p>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Окно чата */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-primary">
                {chats.find(c => c.id === selectedChat)?.userName}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
              {(chats.find((c) => c.id === selectedChat)?.messages ?? [])
                .slice()
                .reverse()
                .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${!msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      !msg.isUser
                        ? 'bg-primary text-background'
                        : 'bg-gray-100 text-foreground'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{!msg.isUser ? 'Вы' : 'Клиент'}</p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {validationError && <p className="mt-2 text-xs text-red-500">{validationError}</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите чат для начала общения
          </div>
        )}
      </div>
    </div>
  )
}
