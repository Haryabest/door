import { VK, Keyboard } from 'vk-io'
import { logger } from './logger.js'
import { addVkSubscriber, removeVkSubscriber } from './vkNotify.js'

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

  const subscribedKeyboard = Keyboard.builder()
    .textButton({ label: 'Отключить уведомления', payload: { cmd: 'unsubscribe' }, color: Keyboard.NEGATIVE_COLOR })
    .row()
    .textButton({ label: 'Помощь', payload: { cmd: 'help' }, color: Keyboard.SECONDARY_COLOR })
    .oneTime(false)

  const unsubscribedKeyboard = Keyboard.builder()
    .textButton({ label: 'Включить уведомления', payload: { cmd: 'subscribe' }, color: Keyboard.POSITIVE_COLOR })
    .row()
    .textButton({ label: 'Помощь', payload: { cmd: 'help' }, color: Keyboard.SECONDARY_COLOR })
    .oneTime(false)

  vk.updates.on('message_new', async (context) => {
    // Ignore outgoing messages from the group itself
    if (context.isOutbox) return

    const text = (context.text ?? '').trim()
    const lower = text.toLowerCase()
    const peerId = context.peerId

    if (lower === 'start' || text === '/start' || lower === 'подписаться') {
      addVkSubscriber(peerId)
      await context.send({
        message: 'Подписка включена. Теперь ты будешь получать уведомления сообщества.',
        keyboard: subscribedKeyboard,
      })
      return
    }

    if (lower === 'stop' || lower === '/stop' || lower === 'отписаться' || lower === 'отключить уведомления') {
      removeVkSubscriber(peerId)
      await context.send({
        message: '🔕 Вы выключили отправку уведомлений ✅',
        keyboard: unsubscribedKeyboard,
      })
      return
    }

    if (lower === 'включить уведомления') {
      addVkSubscriber(peerId)
      await context.send({
        message: '🔔 Уведомления снова включены ✅',
        keyboard: subscribedKeyboard,
      })
      return
    }

    if (lower === 'help' || lower === 'помощь') {
      await context.send({
        message: 'Команды: start (подписаться), stop (отписаться).',
        keyboard: subscribedKeyboard,
      })
    }
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

