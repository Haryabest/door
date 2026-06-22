import { Suspense, createContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { lazyPage } from '@/shared/lib/lazyPage'
import { ensureDocumentTitle, DEFAULT_DOCUMENT_TITLE } from '@/shared/lib/ensureDocumentTitle'
import { SiteLayout } from '@/widgets/SiteLayout'
import { HomePage } from '@/pages/home/ui/HomePage'

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

function DocumentTitleGuard() {
  useEffect(() => {
    ensureDocumentTitle(DEFAULT_DOCUMENT_TITLE)
    const observer = new MutationObserver(() => {
      if (!document.querySelector('title')) {
        ensureDocumentTitle(DEFAULT_DOCUMENT_TITLE)
      }
    })
    observer.observe(document.head, { childList: true })
    return () => observer.disconnect()
  }, [])
  return null
}

function DeferredChatWidget() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) return

    const reveal = () => setShow(true)
    window.addEventListener('scroll', reveal, { once: true, passive: true })
    window.addEventListener('pointerdown', reveal, { once: true })
    const fallback = window.setTimeout(reveal, 15000)

    return () => {
      window.removeEventListener('scroll', reveal)
      window.removeEventListener('pointerdown', reveal)
      window.clearTimeout(fallback)
    }
  }, [show])

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
      <DocumentTitleGuard />
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
