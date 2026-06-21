import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="mb-3 text-2xl font-bold text-primary">Не удалось отобразить страницу</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          Попробуйте обновить страницу. Если ошибка повторяется — откройте сайт в режиме инкогнито
          без расширений браузера.
        </p>
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
