import { useState, useEffect } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { motion } from "framer-motion"
import { SEO } from "@/shared/ui/SEO"
import { portfolioApi } from "@/shared/api/portfolio"
import type { PortfolioItem } from "@/shared/api/portfolio"

export function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    portfolioApi.getPortfolioItems().then(data => {
      setPortfolioItems(data)
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Портфолио"
        description="Наши работы - установленные двери в квартирах и домах. Реализованные проекты, фото готовых объектов."
      />
      <Header />
      <main className="flex-1">

        {/* Portfolio Grid - Masonry layout */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white cursor-pointer break-inside-avoid"
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
        </motion.div>

        {/* Modal для просмотра */}
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="relative bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-primary transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>

              {/* Контент модального окна */}
              <div className="flex flex-col md:flex-row">
                {/* Картинка */}
                <div className="md:w-2/3">
                  <img
                    src={portfolioItems.find(i => i.id === selectedImage)?.image}
                    alt="Portfolio"
                    className="w-full h-auto object-cover md:rounded-l-2xl"
                  />
                </div>

                {/* Описание */}
                <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {portfolioItems.find(i => i.id === selectedImage)?.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {portfolioItems.find(i => i.id === selectedImage)?.description}
                  </p>
                  <a
                    href="/contacts"
                    className="inline-block px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity text-center cursor-pointer"
                  >
                    Узнать цену
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div 
          className="bg-white border-t border-border py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
            >
              Связаться с нами
            </motion.a>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
