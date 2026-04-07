import { useState, useEffect, useContext } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { motion } from "framer-motion"
import { SEO } from "@/shared/ui/SEO"
import { getPortfolioPage, type PortfolioPageData } from "@/shared/api/portfolio"
import { FiltersContext } from "@/App"

export function PortfolioPage() {
  const { setIsChatWidgetHidden } = useContext(FiltersContext)
  const [pageData, setPageData] = useState<PortfolioPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    loadPageData()
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (selectedImage) {
      document.body.style.overflow = 'hidden'
      setIsChatWidgetHidden(true)
    } else {
      document.body.style.overflow = previousOverflow
      setIsChatWidgetHidden(false)
    }

    return () => {
      document.body.style.overflow = previousOverflow
      setIsChatWidgetHidden(false)
    }
  }, [selectedImage, setIsChatWidgetHidden])

  const loadPageData = async () => {
    setIsLoading(true)
    const data = await getPortfolioPage()
    if (data) {
      setPageData(data)
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative overflow-hidden rounded-xl shadow-md bg-white break-inside-avoid">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="h-5 w-3/4 skeleton rounded mb-2" />
                    <div className="h-4 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Ошибка загрузки</h1>
            <button onClick={loadPageData} className="text-primary hover:underline">Попробовать снова</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Портфолио"
        description="Наши работы - установленные двери в квартирах и домах. Реализованные проекты, фото готовых объектов."
        canonicalUrl="/portfolio"
        image="/logo.png"
        keywords="портфолио дверей, установка дверей фото, выполненные работы двери, примеры дверей Нижний Новгород"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Портфолио От А до Я',
          url: 'https://otadoya.ru/portfolio',
          description: 'Примеры установленных дверей и выполненных проектов компании От А до Я',
        }}
      />
      <Header />
      <main className="flex-1">
        {/* Portfolio Grid - Masonry layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {pageData.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white break-inside-avoid cursor-pointer"
                onClick={() => setSelectedImage(item.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/90">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal для просмотра */}
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="relative bg-white rounded-2xl overflow-hidden max-w-5xl w-full h-[85vh] max-h-[760px] cursor-default"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-primary transition-all shadow-lg cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              <div className="h-full grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                <div className="bg-black/5 flex items-center justify-center p-4 md:p-6 min-h-[280px]">
                  <img
                    src={pageData.items.find(i => i.id === selectedImage)?.image}
                    alt="Portfolio"
                    className="w-full h-full object-contain"
                  />
                </div>
                <motion.div 
                  className="p-6 md:p-8 overflow-y-auto border-t md:border-t-0 md:border-l border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {pageData.items.find(i => i.id === selectedImage)?.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {pageData.items.find(i => i.id === selectedImage)?.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="bg-white border-t border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              className="text-3xl font-bold text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Хотите такой же результат?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Свяжитесь с нами для консультации и расчета стоимости
            </motion.p>
            <motion.a
              href="/contacts"
              className="inline-block px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Связаться с нами
            </motion.a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
