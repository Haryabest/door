import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { ADMIN_API_TOKEN_STORAGE_KEY } from '@/shared/api/http'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [apiToken, setApiToken] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(ADMIN_API_TOKEN_STORAGE_KEY) ?? '' : ''
  )
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== 'admin123') {
      setError('Неверный пароль')
      return
    }
    localStorage.setItem('isAdmin', 'true')
    const t = apiToken.trim()
    if (t) {
      localStorage.setItem(ADMIN_API_TOKEN_STORAGE_KEY, t)
    } else {
      localStorage.removeItem(ADMIN_API_TOKEN_STORAGE_KEY)
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Введите пароль для входа</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Токен API (как ADMIN_API_TOKEN на сервере)
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                placeholder="Без токена сохранение на сервер не сработает, если задан ADMIN_API_TOKEN"
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Один раз вставьте тот же секрет, что в <code className="text-xs">server/.env</code>. Хранится только в браузере.
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Войти
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Вернуться на сайт
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
