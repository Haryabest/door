import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/shared/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Каталог', path: '/catalog' },
  { label: 'Портфолио', path: '/portfolio' },
  { label: 'О нас', path: '/about' },
  { label: 'Контакты', path: '/contacts' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              className="nav-link text-base font-medium text-foreground"
              style={{
                background: "none",
                border: "none",
                padding: "8px 0",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Поиск и телефон */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Поиск">
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
          </Button>
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
                  className="px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-primary hover:text-background transition-colors"
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
