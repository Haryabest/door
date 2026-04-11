import { useState, useEffect } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { motion } from "framer-motion"
import { SEO } from "@/shared/ui/SEO"
import { Image } from "@/shared/ui/Image"
import { BackgroundPattern } from "@/shared/ui/BackgroundPattern"
import { getHomePage, type HomePageData } from "@/shared/api/home"

const iconMap: Record<string, any> = {
  'DoorOpen': (await import('lucide-react')).DoorOpen,
  'Shield': (await import('lucide-react')).Shield,
  'Award': (await import('lucide-react')).Award,
}

export function HomePage() {
  const [pageData, setPageData] = useState<HomePageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setIsLoading(true)
    const data = await getHomePage()
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
          <div className="relative h-[100vh] w-full skeleton">
            <div className="relative h-full flex flex-col items-center justify-center px-4">
              <div className="text-center text-white max-w-4xl mx-auto">
                <div className="h-16 sm:h-20 md:h-24 lg:h-32 w-96 sm:w-[500px] lg:w-[600px] bg-white/20 rounded-lg mx-auto mb-4" />
                <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-64 sm:w-80 md:w-96 lg:w-[500px] bg-white/10 rounded-lg mx-auto mb-4" />
                <div className="h-8 w-40 bg-white/10 rounded-lg mx-auto mb-12" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="h-14 w-48 bg-white/20 rounded-lg" />
                  <div className="h-14 w-36 bg-white/10 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="h-10 w-64 skeleton rounded-lg mx-auto mb-4" />
                <div className="h-6 w-96 skeleton rounded-lg mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center p-8 rounded-lg bg-gray-50">
                    <div className="w-16 h-16 skeleton rounded-full mx-auto mb-4" />
                    <div className="h-6 w-32 skeleton rounded-lg mx-auto mb-3" />
                    <div className="h-4 w-48 skeleton rounded-lg mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="h-10 w-56 skeleton rounded-lg mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg aspect-[4/3] skeleton" />
                ))}
              </div>
            </div>
          </section>
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
        title="Купить двери в Нижнем Новгороде"
        description="От А до Я — магазин межкомнатных и входных дверей в Нижнем Новгороде. Большой выбор дверей и фурнитуры, консультация, замер, доставка и установка."
        canonicalUrl="/"
        image="/logo.png"
        keywords="купить двери Нижний Новгород, межкомнатные двери, входные двери, двери и фурнитура, установка дверей, магазин дверей"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'От А до Я',
          url: 'https://otadoya.ru/',
          image: 'https://otadoya.ru/logo.png',
          telephone: '+7 (960) 166-30-30',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Нижний Новгород',
            streetAddress: 'СЦ Бекетов, ул. Бекетова, д. 13а',
            addressCountry: 'RU',
          },
          areaServed: 'Нижний Новгород',
          sameAs: [],
        }}
      />
      <Header />
      <main>
        <BackgroundPattern opacity={0.035} size={100} />
        {/* Hero Section */}
        <div className="relative h-[100vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${pageData.hero.backgroundImage}')`
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {pageData.hero.title}
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-white/90"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {pageData.hero.subtitle}
              </motion.p>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-white/80"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {pageData.hero.city}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <a
                  href="/catalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-base sm:text-lg"
                >
                  Каталог продукции
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </a>
                <a
                  href="tel:+79601663030"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer text-base sm:text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Позвонить
                </a>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              opacity: { duration: 0.6, delay: 1.2 },
              y: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <svg 
              className="w-6 h-6 text-white/60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </div>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Профессиональный подход к каждому клиенту и высокое качество продукции
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageData.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon]
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(15 60 101 / 0.1)' }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-center p-8 rounded-lg bg-secondary hover:bg-accent transition-colors"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Категории продукции
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData.categories.map((category, index) => (
                <motion.a
                  key={category.id}
                  href={`/catalog#${category.category}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-md hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                    <div className="flex items-center text-white/90 group-hover:text-white transition-colors">
                      <span className="text-sm">Смотреть каталог</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
