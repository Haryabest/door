import { useState, useEffect } from 'react'
import { DoorOpen, Shield, Award } from 'lucide-react'
import { SEO } from '@/shared/ui/SEO'
import { Image } from '@/shared/ui/Image'
import { BackgroundPattern } from '@/shared/ui/BackgroundPattern'
import { getHomePage, defaultHomePageData, normalizeHomePageData, type HomePageData } from '@/shared/api/home'
import { SITE_URL } from '@/shared/config/siteUrl'
import { HeroSection } from './HeroSection'

const iconMap = {
  DoorOpen,
  Shield,
  Award,
} as const

export function HomePage() {
  const [pageData, setPageData] = useState<HomePageData>(() => normalizeHomePageData(defaultHomePageData))

  useEffect(() => {
    getHomePage().then((data) => {
      if (data) setPageData(data)
    })
  }, [])

  const seo = (
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
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/logo.png`,
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
  )

  return (
    <>
      {seo}
      <main>
        <HeroSection hero={pageData.hero} />

        <div className="relative isolate bg-background">
          <BackgroundPattern variant="absolute" opacity={0.1} size={100} />

          <section className="relative z-10 py-20">
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
              {pageData.features.map((feature) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] ?? DoorOpen
                return (
                  <div
                    key={feature.id}
                    className="home-feature-card text-center p-8 rounded-lg bg-secondary hover:bg-accent transition-colors"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Категории продукции
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData.categories.map((category) => (
                <a
                  key={category.id}
                  href={`/catalog#${category.category}`}
                  className="home-category-card group relative overflow-hidden rounded-lg aspect-[4/3] shadow-md hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={480}
                    height={360}
                    loading="lazy"
                    decoding="async"
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
                </a>
              ))}
            </div>
          </div>
        </section>
        </div>
      </main>
    </>
  )
}
