import { lazy, type ComponentType } from 'react'

/** Повторная загрузка чанка при сбое сети после деплоя. */
export function lazyPage<TModule extends Record<string, ComponentType<unknown>>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule & string
) {
  return lazy(async () => {
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const mod = await loader()
        return { default: mod[exportName] as ComponentType<unknown> }
      } catch (error) {
        lastError = error
        if (attempt < 2) {
          await new Promise((resolve) => window.setTimeout(resolve, 600 * (attempt + 1)))
        }
      }
    }
    throw lastError
  })
}
