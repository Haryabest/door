import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { SEO } from "@/shared/ui/SEO"
import { ChevronLeft, Share2, Truck, Shield, Award, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { productsApi } from "@/shared/api/products"
import type { Product } from "@/shared/api/products"
import { extractIdFromSlug } from "@/shared/lib/slug"

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [quantity, setQuantity] = useState(1)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const productId = extractIdFromSlug(slug || '')

  useEffect(() => {
    setIsLoading(true)
    productsApi.getProducts().then(products => {
      setProduct(products.find(p => p.id === productId) || null)
      setIsLoading(false)
    })
  }, [productId])

  if (isLoading || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Загрузка...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleShare = (platform?: 'vk' | 'telegram') => {
    const url = window.location.href
    const title = product.name
    const text = `Смотри: ${product.name} за ${product.price.toLocaleString()} ₽`

    if (platform === 'vk') {
      window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url)
    }
    setShowShareMenu(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={product.name}
        description={`${product.name} - ${product.description} Цена: ${product.price.toLocaleString()} ₽`}
      />
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-secondary rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">Материал</p>
                  <p className="font-semibold text-primary text-sm sm:text-base">{product.material}</p>
                </div>
                <div className="p-3 sm:p-4 bg-secondary rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">Цвет</p>
                  <p className="font-semibold text-primary text-sm sm:text-base">{product.color}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2 sm:mb-3 text-sm sm:text-base">Характеристики:</h3>
                <ul className="space-y-1 sm:space-y-2">
                  {(product.features || []).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-foreground">Количество:</span>
                <div className="flex items-center border-2 border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2 hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <span className="px-3 sm:px-4 py-2 font-medium text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 sm:px-4 py-2 hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-3 sm:gap-4">
                  <button className="flex-1 py-3 sm:py-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-sm sm:text-base">
                    Узнать цену
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 sm:p-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-background transition-colors cursor-pointer"
                      aria-label="Поделиться"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {showShareMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowShareMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[200px]"
                          >
                            <button
                              onClick={() => handleShare('vk')}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                              </svg>
                              <span className="text-sm font-medium">ВКонтакте</span>
                            </button>
                            <button
                              onClick={() => handleShare('telegram')}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left border-t border-border"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#24A1DE">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                              </svg>
                              <span className="text-sm font-medium">Telegram</span>
                            </button>
                            <button
                              onClick={() => handleShare()}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left border-t border-border"
                            >
                              <Copy className="w-5 h-5 text-gray-500" />
                              <span className="text-sm font-medium">Копировать ссылку</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-border">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Бесплатная доставка от 50 000 ₽</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Гарантия 2 года</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Сертифицированное качество</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}