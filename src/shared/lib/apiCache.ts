type CacheEntry<T> = {
  expiresAt: number
  promise: Promise<T>
}

const store = new Map<string, CacheEntry<unknown>>()

/** Кэш GET-данных между переходами по страницам (header, footer, каталог). */
export function getCached<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const existing = store.get(key) as CacheEntry<T> | undefined
  if (existing && existing.expiresAt > now) {
    return existing.promise
  }

  const promise = loader().catch((error) => {
    store.delete(key)
    throw error
  })

  store.set(key, { expiresAt: now + ttlMs, promise })
  return promise
}

export function invalidateCached(key: string): void {
  store.delete(key)
}
