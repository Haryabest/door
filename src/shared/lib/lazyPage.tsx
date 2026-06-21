import { lazy, type ComponentType } from 'react'
import { ExtensionHint } from '@/shared/ui/ExtensionHint'

function LazyChunkFailed() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h2 className="mb-2 text-xl font-bold text-primary">Не удалось загрузить раздел</h2>
        <p className="mb-4 text-muted-foreground">
          Возможно, обновилась версия сайта или прервалось соединение. Нажмите «Обновить».
        </p>
        <ExtensionHint className="mb-6 text-left" />
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-background hover:opacity-90 cursor-pointer"
        >
          Обновить
        </button>
      </div>
    </main>
  )
}

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

    console.error(`[lazyPage] Failed to load ${exportName}:`, lastError)
    return {
      default: function LazyChunkFailedPage() {
        return <LazyChunkFailed />
      },
    }
  })
}
