import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ExtensionHint } from '@/shared/ui/ExtensionHint'

type FallbackVariant = 'full' | 'inline' | 'silent'

interface Props {
  children: ReactNode
  /** Сброс при смене маршрута или другого ключа */
  resetKey?: string
  fallback?: FallbackVariant
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private reset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const variant = this.props.fallback ?? 'full'

    if (variant === 'silent') {
      return null
    }

    if (variant === 'inline') {
      return (
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-md text-center">
            <h2 className="mb-2 text-xl font-bold text-primary">Раздел временно недоступен</h2>
            <p className="mb-4 text-muted-foreground">
              Произошла ошибка при отображении страницы. Меню и подвал сайта работают — попробуйте
              открыть раздел снова или перейти в другой.
            </p>
            <ExtensionHint className="mb-6" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.reset}
                className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-background hover:opacity-90 cursor-pointer"
              >
                Повторить
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-primary/30 px-5 py-2.5 font-semibold text-primary hover:bg-secondary cursor-pointer"
              >
                Обновить
              </button>
            </div>
          </div>
        </main>
      )
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="mb-3 text-2xl font-bold text-primary">Не удалось загрузить приложение</h1>
        <p className="mb-4 max-w-md text-muted-foreground">
          Обновите страницу. Если ошибка повторяется — проверьте расширения браузера.
        </p>
        <ExtensionHint className="mb-6 max-w-md" />
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-background hover:opacity-90 cursor-pointer"
        >
          Обновить
        </button>
      </div>
    )
  }
}
