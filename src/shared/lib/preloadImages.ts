/** Фоновая прогрузка в кэш браузера; ошибка по одному URL не блокирует остальные. */
export function preloadImages(urls: readonly string[]): Promise<void> {
  const unique = [...new Set(urls.filter((u) => typeof u === 'string' && u.trim() !== ''))]
  if (unique.length === 0) return Promise.resolve()

  return Promise.all(
    unique.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        })
    )
  ).then(() => undefined)
}
