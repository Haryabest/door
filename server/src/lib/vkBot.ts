import { VK, Keyboard } from 'vk-io'
import { logger } from './logger.js'
import { addVkSubscriber, getVkAdminBaseUrl, getVkDailyStats, isVkSubscriber, removeVkSubscriber } from './vkNotify.js'

function getVkConfig(): { token: string; groupId: number } | null {
  const token = process.env.VK_GROUP_TOKEN?.trim()
  const groupIdRaw = process.env.VK_GROUP_ID?.trim()
  const groupId = groupIdRaw ? Number(groupIdRaw) : NaN

  if (!token || !Number.isFinite(groupId) || groupId <= 0) return null
  return { token, groupId }
}

export async function startVkBotLongPoll(): Promise<void> {
  const cfg = getVkConfig()
  if (!cfg) {
    logger.warn('VK bot is not configured: set VK_GROUP_TOKEN and VK_GROUP_ID')
    return
  }

  const vk = new VK({
    token: cfg.token,
    pollingGroupId: cfg.groupId,
  })

  const adminUrl = getVkAdminBaseUrl()

  const subscribedKeyboard = Keyboard.builder()
    .textButton({ label: '📊 Статистика за день', payload: { cmd: 'daily_stats' }, color: Keyboard.PRIMARY_COLOR })
    .row()
    .textButton({ label: '⚙️ Настройки уведомлений', payload: { cmd: 'settings' }, color: Keyboard.SECONDARY_COLOR })
    .row()
    .textButton({ label: '📂 Перейти в админку сайта', payload: { cmd: 'open_admin' }, color: Keyboard.POSITIVE_COLOR })
    .oneTime(false)

  const unsubscribedKeyboard = Keyboard.builder()
    .textButton({ label: '⚙️ Настройки уведомлений', payload: { cmd: 'settings' }, color: Keyboard.SECONDARY_COLOR })
    .row()
    .textButton({ label: '📂 Перейти в админку сайта', payload: { cmd: 'open_admin' }, color: Keyboard.POSITIVE_COLOR })
    .oneTime(false)

  const settingsKeyboardSubscribed = Keyboard.builder()
    .textButton({ label: 'Отключить уведомления', payload: { cmd: 'unsubscribe' }, color: Keyboard.NEGATIVE_COLOR })
    .row()
    .textButton({ label: 'Назад в меню', payload: { cmd: 'menu' }, color: Keyboard.SECONDARY_COLOR })
    .oneTime(false)

  const settingsKeyboardUnsubscribed = Keyboard.builder()
    .textButton({ label: 'Включить уведомления', payload: { cmd: 'subscribe' }, color: Keyboard.POSITIVE_COLOR })
    .row()
    .textButton({ label: 'Назад в меню', payload: { cmd: 'menu' }, color: Keyboard.SECONDARY_COLOR })
    .oneTime(false)

  vk.updates.on('message_new', async (context) => {
    // Ignore outgoing messages from the group itself
    if (context.isOutbox) return

    const text = (context.text ?? '').trim()
    const lower = text.toLowerCase()
    const peerId = context.peerId
    const payloadCmd = (context.messagePayload as { cmd?: string } | null)?.cmd?.toLowerCase()
    const command = payloadCmd ?? lower
    const isSubscribed = isVkSubscriber(peerId)

    if (command === 'start' || text === '/start' || command === 'подписаться' || command === 'menu' || command === 'help' || command === 'помощь') {
      addVkSubscriber(peerId)
      await context.send({
        message: 'Меню менеджера:\n• 📊 Статистика за день\n• ⚙️ Настройки уведомлений\n• 📂 Перейти в админку сайта',
        keyboard: subscribedKeyboard,
      })
      return
    }

    if (command === 'stop' || command === '/stop' || command === 'отписаться' || command === 'отключить уведомления' || command === 'unsubscribe') {
      removeVkSubscriber(peerId)
      await context.send({
        message: '🔕 Вы выключили отправку уведомлений ✅',
        keyboard: unsubscribedKeyboard,
      })
      return
    }

    if (command === 'включить уведомления' || command === 'subscribe') {
      addVkSubscriber(peerId)
      await context.send({
        message: '🔔 Уведомления снова включены ✅',
        keyboard: subscribedKeyboard,
      })
      return
    }

    if (command === 'settings' || command === '⚙️ настройки уведомлений') {
      await context.send({
        message: isSubscribed
          ? 'Уведомления сейчас включены. Выберите действие:'
          : 'Уведомления сейчас выключены. Выберите действие:',
        keyboard: isSubscribed ? settingsKeyboardSubscribed : settingsKeyboardUnsubscribed,
      })
      return
    }

    if (command === 'daily_stats' || command === '📊 статистика за день') {
      const stats = getVkDailyStats()
      await context.send({
        message: [
          `📊 Статистика за ${stats.dateKey}:`,
          `• Всего заявок: ${stats.totalLeads}`,
          `• Срочные сообщения чата: ${stats.urgentChats}`,
          `• Уточнения цены: ${stats.priceClarifications}`,
        ].join('\n'),
        keyboard: subscribedKeyboard,
      })
      return
    }

    if (command === 'open_admin' || command === '📂 перейти в админку сайта') {
      await context.send({
        message: adminUrl ? `📂 Админка сайта: ${adminUrl}/admin` : 'Админка не настроена. Укажите VK_MANAGER_PANEL_URL или PUBLIC_BASE_URL в server/.env.',
        keyboard: subscribedKeyboard,
      })
      return
    }

    await context.send({
      message: 'Используйте кнопки меню ниже.',
      keyboard: subscribedKeyboard,
    })
  })

  try {
    await vk.updates.startPolling()
    logger.info({ groupId: cfg.groupId }, 'VK bot long poll started')
  } catch (error) {
    logger.error({ err: error, groupId: cfg.groupId }, 'Failed to start VK bot long poll')
    // Don't crash the whole API if VK polling fails (e.g., long poll disabled in group settings).
    return
  }
}

