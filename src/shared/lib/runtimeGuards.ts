/** Типичные ошибки расширений Chrome/Yandex — не относятся к сайту. */
function isExtensionNoise(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? `${reason.message} ${reason.stack ?? ''}`
      : typeof reason === 'string'
        ? reason
        : String(reason ?? '')

  return (
    /message channel closed/i.test(message) ||
    /Receiving end does not exist/i.test(message) ||
    /runtime\.lastError/i.test(message) ||
    /Extension context invalidated/i.test(message)
  )
}

/** Не даём шуму расширений всплывать как uncaught promise rejection. */
export function installRuntimeGuards(): void {
  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionNoise(event.reason)) {
      event.preventDefault()
    }
  })
}
