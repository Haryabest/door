import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { removeStaticHeroLcp } from '@/shared/lib/hideStaticHeroLcp'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

/** Общая оболочка: Header/Footer не перемонтируются при смене страницы. */
export function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') {
      removeStaticHeroLcp()
    }
  }, [location.pathname])

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
