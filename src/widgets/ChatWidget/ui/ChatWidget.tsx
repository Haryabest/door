import { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, MessageCircle } from 'lucide-react'
import { FiltersContext } from '@/App'
import { sanitizeInput, validateRequired } from '@/shared/lib/validation'
import {
  postPublicChatMessage,
  fetchPublicChatMessages,
  getStoredChatSession,
  setStoredChatSession,
} from '@/shared/api/chats'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

function mapApiToWidget(isUser: boolean): boolean {
  // DB: is_user true = посетитель; виджет: isBot true = менеджер слева
  return !isUser
}

const GREETING: Message = {
  id: -1,
  text: 'Здравствуйте! 👋 Чем могу помочь?',
  isBot: true,
  timestamp: new Date(),
}

export function ChatWidget() {
  const { isFiltersOpen, isChatWidgetHidden } = useContext(FiltersContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  /** Пусто до первой загрузки истории — чтобы не мигало приветствие при повторном заходе, если чат уже есть */
  const [messages, setMessages] = useState<Message[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>(messages)
  messagesRef.current = messages
  const hasShownSentConfirmationRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadHistory = useCallback(async () => {
    const session = getStoredChatSession()
    if (!session) {
      setMessages([{ ...GREETING, timestamp: new Date() }])
      setHistoryReady(true)
      return
    }
    const list = await fetchPublicChatMessages(session.chatId, session.clientToken)
    const mapped: Message[] = list.map((m) => ({
      id: m.id,
      text: m.text,
      isBot: mapApiToWidget(m.isUser),
      timestamp: m.timestamp,
    }))
    mapped.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    // Если в БД уже есть переписка — не дублируем локальное приветствие при каждом заходе на страницу
    if (mapped.length > 0) {
      setMessages(mapped)
    } else {
      setMessages([{ ...GREETING, timestamp: new Date() }])
    }
    setHistoryReady(true)
  }, [])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (!isOpen) {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      return
    }
    const session = getStoredChatSession()
    if (!session) return
    pollRef.current = setInterval(() => {
      void loadHistory()
    }, 3000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [isOpen, loadHistory])

  const sendToBackend = async (text: string): Promise<boolean> => {
    const session = getStoredChatSession()
    const result = await postPublicChatMessage(text, session)
    if (!result) return false
    setStoredChatSession(result.chatId, result.clientToken)
    const m = result.message
    setMessages((prev) => {
      const greeting = prev.filter((x) => x.id === -1)
      const rest = prev.filter((x) => x.id !== -1 && x.id !== m.id)
      const added: Message = {
        id: m.id,
        text: m.text,
        isBot: mapApiToWidget(m.isUser),
        timestamp: m.timestamp,
      }
      const merged = [...greeting, ...rest, added].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      return merged
    })
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const sanitizedMessage = sanitizeInput(message)
    if (!validateRequired(sanitizedMessage)) return

    setMessage('')

    setIsSending(true)
    try {
      const ok = await sendToBackend(sanitizedMessage)
      if (!ok) {
        throw new Error('Failed to send message')
      }

      if (!hasShownSentConfirmationRef.current) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: 'Спасибо! Сообщение отправлено менеджеру. 🕐',
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        hasShownSentConfirmationRef.current = true
      }
    } catch {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: 'Не удалось отправить сообщение. Попробуйте позже.',
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    if (isChatWidgetHidden && isOpen) {
      setIsOpen(false)
    }
  }, [isChatWidgetHidden, isOpen])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const chatMessage = params.get('chatMessage')

    if (!chatMessage) {
      return
    }

    const sanitizedMessage = sanitizeInput(chatMessage)
    if (!validateRequired(sanitizedMessage)) {
      params.delete('chatMessage')
      navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
      return
    }

    setIsOpen(true)
    const isDuplicate = messagesRef.current.some((msg) => !msg.isBot && msg.text === sanitizedMessage)
    if (!isDuplicate) {
      setIsSending(true)

      sendToBackend(sanitizedMessage)
        .then((ok) => {
          if (ok) {
            if (!hasShownSentConfirmationRef.current) {
              const botMessage: Message = {
                id: Date.now() + 1,
                text: 'Спасибо! Сообщение отправлено менеджеру. 🕐',
                isBot: true,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, botMessage])
              hasShownSentConfirmationRef.current = true
            }
            return
          }

          const botMessage: Message = {
            id: Date.now() + 1,
            text: 'Не удалось отправить сообщение. Попробуйте позже.',
            isBot: true,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        })
        .catch(() => {
          const botMessage: Message = {
            id: Date.now() + 1,
            text: 'Не удалось отправить сообщение. Попробуйте позже.',
            isBot: true,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        })
        .finally(() => {
          setIsSending(false)
        })
    }

    params.delete('chatMessage')
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
  }, [location.pathname, location.search, navigate])

  return (
    <>
      <AnimatePresence>
        {!isFiltersOpen && !isChatWidgetHidden && (
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
            aria-label="Открыть чат"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isChatWidgetHidden && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            <div className="bg-primary text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Чат с менеджером</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Мы онлайн
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-80 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {!historyReady && (
                  <p className="text-sm text-muted-foreground text-center py-4">Загрузка…</p>
                )}
                {historyReady && messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-end gap-2 ${
                      msg.isBot ? '' : 'flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                        msg.isBot ? 'bg-primary' : 'bg-gray-400'
                      }`}
                    >
                      {msg.isBot ? 'М' : 'Вы'}
                    </div>

                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.isBot
                          ? 'bg-white text-foreground rounded-bl-sm shadow-sm'
                          : 'bg-primary text-background rounded-br-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isBot ? 'text-muted-foreground' : 'text-background/70'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!message.trim() || isSending}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Отправить"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
