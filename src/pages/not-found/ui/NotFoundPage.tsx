import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, DoorOpen } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Контент */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Анимированная иконка */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-32 h-32 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <DoorOpen className="w-16 h-16 text-primary" />
          </motion.div>

          {/* Заголовок 404 */}
          <motion.h1 
            className="text-8xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            404
          </motion.h1>

          {/* Подзаголовок */}
          <motion.h2 
            className="text-2xl font-semibold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Страница не найдена
          </motion.h2>

          {/* Описание */}
          <motion.p 
            className="text-muted-foreground mb-8 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Похоже, вы пытаетесь войти в закрытую дверь.
            <br />
            Такой страницы не существует или она была перемещена.
          </motion.p>

          {/* Кнопки */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5" />
              На главную
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-background transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
          </motion.div>

          {/* Полезные ссылки */}
          <motion.div 
            className="mt-12 pt-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Возможно, вы искали:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/catalog" className="text-primary hover:underline text-sm">
                Каталог
              </Link>
              <Link to="/about" className="text-primary hover:underline text-sm">
                О компании
              </Link>
              <Link to="/contacts" className="text-primary hover:underline text-sm">
                Контакты
              </Link>
              <Link to="/portfolio" className="text-primary hover:underline text-sm">
                Портфолио
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 От А до Я. Все права защищены.
        </div>
      </footer>
    </div>
  )
}
