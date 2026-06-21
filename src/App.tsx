import { lazy, Suspense, createContext, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })))
const CatalogPage = lazy(() => import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })))
const PortfolioPage = lazy(() => import('@/pages/portfolio').then((m) => ({ default: m.PortfolioPage })))
const AboutPage = lazy(() => import('@/pages/about').then((m) => ({ default: m.AboutPage })))
const ContactsPage = lazy(() => import('@/pages/contacts').then((m) => ({ default: m.ContactsPage })))
const ProductPage = lazy(() => import('@/pages/product').then((m) => ({ default: m.ProductPage })))
const AdminLoginPage = lazy(() => import('@/pages/admin-login').then((m) => ({ default: m.AdminLoginPage })))
const AdminPage = lazy(() => import('@/pages/admin').then((m) => ({ default: m.AdminPage })))
const NotFoundPage = lazy(() => import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })))
const ChatWidget = lazy(() => import('@/widgets/ChatWidget').then((m) => ({ default: m.ChatWidget })))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Загрузка…</p>
    </div>
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
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:slug" element={<ProductPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ChatWidget />
        </Suspense>
      </BrowserRouter>
    </FiltersContext.Provider>
  )
}

export { FiltersContext }
