import { Suspense, createContext, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { lazyPage } from '@/shared/lib/lazyPage'
import { useDeferMount } from '@/shared/lib/deferMount'
import { SiteLayout } from '@/widgets/SiteLayout'

const HomePage = lazyPage(() => import('@/pages/home'), 'HomePage')
const CatalogPage = lazyPage(() => import('@/pages/catalog'), 'CatalogPage')
const PortfolioPage = lazyPage(() => import('@/pages/portfolio'), 'PortfolioPage')
const AboutPage = lazyPage(() => import('@/pages/about'), 'AboutPage')
const ContactsPage = lazyPage(() => import('@/pages/contacts'), 'ContactsPage')
const ProductPage = lazyPage(() => import('@/pages/product'), 'ProductPage')
const AdminLoginPage = lazyPage(() => import('@/pages/admin-login'), 'AdminLoginPage')
const AdminPage = lazyPage(() => import('@/pages/admin'), 'AdminPage')
const NotFoundPage = lazyPage(() => import('@/pages/not-found'), 'NotFoundPage')
const ChatWidget = lazyPage(() => import('@/widgets/ChatWidget'), 'ChatWidget')

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Загрузка…</p>
    </div>
  )
}

function DeferredChatWidget() {
  const show = useDeferMount(2000)
  if (!show) return null
  return (
    <Suspense fallback={null}>
      <ChatWidget />
    </Suspense>
  )
}

const FiltersContext = createContext<{
  isFiltersOpen: boolean
  setIsFiltersOpen: (open: boolean) => void
  isChatWidgetHidden: boolean
  setIsChatWidgetHidden: (hidden: boolean) => void
}>({
  isFiltersOpen: false,
  setIsFiltersOpen: () => {},
  isChatWidgetHidden: false,
  setIsChatWidgetHidden: () => {},
})

export function App() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isChatWidgetHidden, setIsChatWidgetHidden] = useState(false)

  return (
    <FiltersContext.Provider value={{ isFiltersOpen, setIsFiltersOpen, isChatWidgetHidden, setIsChatWidgetHidden }}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/catalog/:slug" element={<ProductPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
              </Route>
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <ErrorBoundary fallback="silent">
            <DeferredChatWidget />
          </ErrorBoundary>
        </BrowserRouter>
      </ErrorBoundary>
    </FiltersContext.Provider>
  )
}

export { FiltersContext }
