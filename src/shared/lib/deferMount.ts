import { useEffect, useState } from 'react'

/** Откладывает монтирование тяжёлых виджетов после первого кадра. */
export function useDeferMount(delayMs = 1500): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const activate = () => {
      if (!cancelled) setReady(true)
    }

    if (typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(activate, { timeout: delayMs })
      return () => {
        cancelled = true
        cancelIdleCallback(idleId)
      }
    }

    const timerId = window.setTimeout(activate, delayMs)
    return () => {
      cancelled = true
      window.clearTimeout(timerId)
    }
  }, [delayMs])

  return ready
}
