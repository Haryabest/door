import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { SEO } from "@/shared/ui/SEO"
import { Image } from "@/shared/ui/Image"
import { ChevronLeft, Share2, Truck, Shield, Award, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById } from "@/shared/api/products"
import type { Product } from "@/shared/api/products"
import { extractIdFromSlug } from "@/shared/lib/slug"

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const productId = extractIdFromSlug(slug || '')

  useEffect(() => {
    setIsLoading(true)
    setNotFound(false)
    getProductById(productId).then((p) => {
      setProduct(p)
      setNotFound(!p)
      setIsLoading(false)
    })
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <div className="h-4 w-16 skeleton rounded" />
              <div className="h-4 w-4 skeleton rounded" />
              <div className="h-4 w-20 skeleton rounded" />
              <div className="h-4 w-4 skeleton rounded" />
              <div className="h-4 w-32 skeleton rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square skeleton rounded-2xl" />
              <div className="space-y-6">
                <div>
                  <div className="h-8 w-3/4 skeleton rounded-lg mb-2" />
                  <div className="h-5 w-full skeleton rounded" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-secondary rounded-lg">
                    <div className="h-4 w-16 skeleton rounded mb-2" />
                    <div className="h-5 w-24 skeleton rounded" />
                  </div>
                  <div className="p-3 sm:p-4 bg-secondary rounded-lg">
                    <div className="h-4 w-12 skeleton rounded mb-2" />
                    <div className="h-5 w-20 skeleton rounded" />
                  </div>
                </div>
                <div>
                  <div className="h-5 w-32 skeleton rounded mb-2 sm:mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-5/6 skeleton rounded" />
                    <div className="h-4 w-4/5 skeleton rounded" />
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="h-12 flex-1 skeleton rounded-lg" />
                  <div className="h-12 w-12 skeleton rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Товар не найден</h1>
            <Link to="/catalog" className="text-primary underline">В каталог</Link>
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
                <Image
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

              <div className="relative">
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => navigate(`?chatMessage=${encodeURIComponent(`Меня заинтересовала дверь «${product.name}»`)}`)}
                    className="flex-1 py-3 sm:py-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-sm sm:text-base"
                  >
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
                                <path d="M3.07 8.72c.1 4.92 2.57 7.88 6.9 7.88h.26v-2.82c1.59.16 2.8 1.33 3.28 2.82h2.25c-.61-2.22-2.22-3.45-3.23-3.92 1.01-.58 2.42-1.98 2.76-3.96h-2.05c-.44 1.61-1.75 3.01-3.01 3.15V8.72H7.17v5.52c-1.28-.32-2.9-1.83-2.97-5.52H3.07z"/>
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