import { Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

/** Общая оболочка: Header/Footer не перемонтируются при смене страницы. */
export function SiteLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ErrorBoundary resetKey={location.pathname} fallback="inline">
        <Outlet />
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
