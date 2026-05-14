import { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, MessageCircle, AlertTriangle, Phone } from 'lucide-react'
import { FiltersContext } from '@/App'
import { sanitizeInput, validateRequired } from '@/shared/lib/validation'
import { containsProfanity } from '@/shared/lib/profanity'
import {
  postPublicChatMessage,
  fetchPublicChatMessages,
  getStoredChatSession,
  setStoredChatSession,
  type PublicChatMeta,
} from '@/shared/api/chats'
import {
  defaultChatWidgetData,
  getChatWidget,
  mailtoHrefFromChatEmail,
  type ChatWidgetData,
} from '@/shared/api/chatWidget'
import { telHrefFromPhoneText } from '@/shared/lib/telHref'
import { useVpnDetection } from '@/shared/lib/vpnDetection'
import telegramIcon from '@/assets/telegram.jpg'

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

const VPN_WARNING: Message = {
  id: -2,
  text: '⚠️Включённый VPN может негативно влиять на работу чата.',
  isBot: true,
  timestamp: new Date(),
}

function FabMailLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  )
}

export function ChatWidget() {
  const { isFiltersOpen, isChatWidgetHidden } = useContext(FiltersContext)
  const location = useLocation()
  const navigate = useNavigate()
  const { isVpn } = useVpnDetection()
  const [isOpen, setIsOpen] = useState(false)
  /** Меню из 4 кнопок до открытия чата */
  const [fabMenuOpen, setFabMenuOpen] = useState(false)
  const [fabSettings, setFabSettings] = useState<ChatWidgetData>(defaultChatWidgetData)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [validationError, setValidationError] = useState('')
  /** Пусто до первой загрузки истории — чтобы не мигало приветствие при повторном заходе, если чат уже есть */
  const [messages, setMessages] = useState<Message[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const [vpnWarningShown, setVpnWarningShown] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(0)
  const messagesRef = useRef<Message[]>(messages)
  messagesRef.current = messages
  const hasShownSentConfirmationRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    if (!isOpen || !historyReady) return
    const hasNewMessage = messages.length > prevMessagesLengthRef.current
    const frame = requestAnimationFrame(() => {
      scrollToBottom(hasNewMessage ? 'smooth' : 'auto')
    })
    prevMessagesLengthRef.current = messages.length
    return () => cancelAnimationFrame(frame)
  }, [messages, isOpen, historyReady, scrollToBottom])

  useEffect(() => {
    if (!isOpen || !historyReady) return
    const frame = requestAnimationFrame(() => {
      scrollToBottom('auto')
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen, historyReady, scrollToBottom])

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
    void getChatWidget().then(setFabSettings)
  }, [])

  useEffect(() => {
    if (isOpen) setFabMenuOpen(false)
  }, [isOpen])

  useEffect(() => {
    if (isVpn === true && !vpnWarningShown && messages.length > 0) {
      setMessages((prev) => {
        const hasWarning = prev.some((msg) => msg.id === -2)
        if (!hasWarning) {
          setVpnWarningShown(true)
          return [...prev, { ...VPN_WARNING, timestamp: new Date() }]
        }
        return prev
      })
    }
  }, [isVpn, vpnWarningShown, messages.length])

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

  const sendToBackend = async (text: string, meta?: PublicChatMeta): Promise<boolean> => {
    const session = getStoredChatSession()
    const result = await postPublicChatMessage(text, session, meta)
    if (!result) return false
    setStoredChatSession(result.chatId, result.clientToken)
    const m = result.message
    setMessages((prev) => {
      const greeting = prev.filter((x) => x.id === -1)
      const vpnWarning = prev.filter((x) => x.id === -2)
      const rest = prev.filter((x) => x.id !== -1 && x.id !== -2 && x.id !== m.id)
      const added: Message = {
        id: m.id,
        text: m.text,
        isBot: mapApiToWidget(m.isUser),
        timestamp: m.timestamp,
      }
      const merged = [...greeting, ...vpnWarning, ...rest, added].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      return merged
    })
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const sanitizedMessage = sanitizeInput(message)
    if (!validateRequired(sanitizedMessage)) {
      setValidationError('Введите сообщение')
      return
    }
    if (containsProfanity(sanitizedMessage)) {
      setValidationError('Пожалуйста, без мата и оскорблений.')
      return
    }

    setValidationError('')

    setMessage('')

    setIsSending(true)
    try {
      const ok = await sendToBackend(sanitizedMessage, {
        eventType: 'chat_message',
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      })
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
    const leadType = params.get('leadType')
    const productName = params.get('productName')
    const productUrl = params.get('productUrl')
    const clientName = params.get('clientName')
    const clientPhone = params.get('clientPhone')

    if (!chatMessage) {
      return
    }

    const sanitizedMessage = sanitizeInput(chatMessage)
    if (!validateRequired(sanitizedMessage)) {
      params.delete('chatMessage')
      navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
      return
    }
    if (containsProfanity(sanitizedMessage)) {
      params.delete('chatMessage')
      navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
      return
    }

    setIsOpen(true)
    const isDuplicate = messagesRef.current.some((msg) => !msg.isBot && msg.text === sanitizedMessage)
    if (!isDuplicate) {
      setIsSending(true)

      const meta: PublicChatMeta = {
        eventType: leadType === 'price_clarification' ? 'price_clarification' : 'chat_message',
        productName: productName ? sanitizeInput(productName) : undefined,
        productUrl: productUrl ? sanitizeInput(productUrl) : undefined,
        clientName: clientName ? sanitizeInput(clientName) : undefined,
        clientPhone: clientPhone ? sanitizeInput(clientPhone) : undefined,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      }

      sendToBackend(sanitizedMessage, meta)
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
    params.delete('leadType')
    params.delete('productName')
    params.delete('productUrl')
    params.delete('clientName')
    params.delete('clientPhone')
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
  }, [location.pathname, location.search, navigate])

  const phoneHref = telHrefFromPhoneText(fabSettings.phoneText)
  const mailHref = mailtoHrefFromChatEmail(fabSettings.emailText)
  const tgUrlRaw = fabSettings.telegramUrl.trim()
  const telegramHref =
    tgUrlRaw && !/^https?:\/\//i.test(tgUrlRaw) ? `https://${tgUrlRaw}` : tgUrlRaw

  return (
    <>
      <AnimatePresence>
        {!isFiltersOpen && !isChatWidgetHidden && (
          <motion.div
            className="fixed bottom-6 right-6 z-[2147483647] flex flex-row-reverse items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.button
              type="button"
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false)
                } else {
                  setFabMenuOpen((v) => !v)
                }
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-14 h-14 shrink-0 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
              aria-expanded={fabMenuOpen}
              aria-label={isOpen ? 'Закрыть чат' : fabMenuOpen ? 'Закрыть меню' : 'Связь и чат'}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MessageCircle className="w-6 h-6" />
              )}
              {isVpn && !isOpen && (
                <span className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-900" />
                </span>
              )}
            </motion.button>

            <AnimatePresence initial={false}>
              {fabMenuOpen && !isOpen && (
                <>
                  <motion.a
                    key="fab-mail"
                    href={mailHref === '#' ? undefined : mailHref}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15, delay: 0.06 }}
                    onClick={(e) => {
                      if (mailHref === '#') e.preventDefault()
                      setFabMenuOpen(false)
                    }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white shadow-md hover:bg-orange-700 transition-colors"
                    aria-label="Почта"
                    title="Почта"
                  >
                    <FabMailLogo className="h-[30px] w-[30px] shrink-0" />
                  </motion.a>
                  <motion.button
                    key="fab-tg"
                    type="button"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15, delay: 0.04 }}
                    disabled={!telegramHref}
                    onClick={() => {
                      if (!telegramHref) return
                      window.open(telegramHref, '_blank', 'noopener,noreferrer')
                      setFabMenuOpen(false)
                    }}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full p-0 shadow-md ring-inset ring-2 ring-white/25 hover:brightness-95 transition-[filter] disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Telegram"
                    title="Telegram"
                  >
                    <img
                      src={telegramIcon}
                      alt=""
                      width={112}
                      height={112}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                    />
                  </motion.button>
                  <motion.a
                    key="fab-phone"
                    href={phoneHref === '#' ? undefined : phoneHref}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15, delay: 0.02 }}
                    onClick={(e) => {
                      if (phoneHref === '#') e.preventDefault()
                      setFabMenuOpen(false)
                    }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors"
                    aria-label="Телефон"
                    title="Телефон"
                  >
                    <Phone className="h-[30px] w-[30px] shrink-0" strokeWidth={2.25} />
                  </motion.a>
                  <motion.button
                    key="fab-chat"
                    type="button"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      setIsOpen(true)
                      setFabMenuOpen(false)
                    }}
                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center px-1.5 rounded-full bg-primary text-white text-[11px] font-semibold leading-tight text-center shadow-md hover:bg-primary/90 transition-colors"
                    aria-label="Чат на сайте"
                    title="Чат"
                  >
                    Чат
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isChatWidgetHidden && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-[2147483647] overflow-hidden"
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

            {/* Постоянная плашка VPN внутри чата */}
            {isVpn && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  Похоже, вы используете VPN — это может ограничивать работу сайта
                </p>
              </div>
            )}

            <div ref={messagesContainerRef} className="h-80 p-4 overflow-y-auto bg-gray-50">
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
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (validationError) setValidationError('')
                  }}
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
              {validationError && (
                <p className="mt-2 text-xs text-red-500 px-2">{validationError}</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}