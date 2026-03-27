import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { productsApi } from "@/shared/api/products"

const navItems = [
  { label: 'Каталог', path: '/catalog' },
  { label: 'Портфолио', path: '/portfolio' },
  { label: 'О нас', path: '/about' },
  { label: 'Контакты', path: '/contacts' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; price: number; image: string; slug: string }[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchQuery.trim()) {
      productsApi.searchProducts(searchQuery).then(results => {
        setSearchResults(results.slice(0, 5))
      })
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Логотип */}
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">От А до Я</span>
          <span className="text-sm text-muted-foreground">Двери и Фурнитура</span>
        </Link>

        {/* Навигация - десктоп */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`nav-link text-base font-medium px-2 py-1 rounded transition-colors ${
                location.pathname === item.path
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Поиск и телефон */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Поиск"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <a
            href="tel:+79991234567"
            className="hidden lg:flex items-center gap-2 text-base font-medium text-foreground hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +7 (960) 166 30-30
          </a>

          {/* Бургер меню для мобильных */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Меню"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Поиск */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-background border-b overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск дверей..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-primary rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(`/catalog/${item.slug}`)
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary cursor-pointer"
                    >
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-primary">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
              className="absolute top-20 left-0 right-0 z-30 bg-background border-b shadow-lg lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-background'
                        : 'text-foreground hover:bg-primary hover:text-background'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}