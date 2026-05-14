import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { HeroSection as HeroSectionType } from '@/shared/api/home'
import { defaultHeaderData, getHeader } from '@/shared/api/header'
import { preloadImages } from '@/shared/lib/preloadImages'
import { telHrefFromPhoneText } from '@/shared/lib/telHref'
import { HERO_SLIDE_ASSET_URLS } from '../heroSlideshowUrls'

interface HeroSectionProps {
  hero: HeroSectionType
}

const SLIDE_FADE_S = 1
/** После затухания 1 с — 8 с в полной непрозрачности, затем кроссфейд 1 с (без паузы между картинками) */
const SLIDE_HOLD_FULL_MS = 8000
/** Интервал с начала активного момента слайда: 1 с появление + 8 с показ */
const SLIDE_CYCLE_MS = SLIDE_HOLD_FULL_MS + SLIDE_FADE_S * 1000

export function HeroSection({ hero }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [phoneHref, setPhoneHref] = useState(() => telHrefFromPhoneText(defaultHeaderData.phoneText))

  /** Только локальные файлы из `src/assets/hero-slides/`, без URL из админки и без внешних ссылок. */
  const slideshowImages = HERO_SLIDE_ASSET_URLS

  useEffect(() => {
    setCurrentSlide(0)
  }, [slideshowImages])

  useEffect(() => {
    void preloadImages(slideshowImages)
  }, [slideshowImages])

  useEffect(() => {
    if (slideshowImages.length === 0) return
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
    }, SLIDE_CYCLE_MS)

    return () => window.clearInterval(timer)
  }, [slideshowImages.length])

  useEffect(() => {
    let isMounted = true

    getHeader().then((data) => {
      if (!isMounted || !data) return
      setPhoneHref(telHrefFromPhoneText(data.phoneText))
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="relative z-0 h-[100vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slideshowImages.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            aria-hidden={index !== currentSlide}
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{
              duration: SLIDE_FADE_S,
              ease: 'easeInOut',
            }}
            style={{
              backgroundImage: `url('${src}')`,
              zIndex: index === currentSlide ? 2 : 1,
            }}
          />
        ))}
      </div>

      {/* Затемнение — между фоном и текстом */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* Контент: заголовки и кнопки не анимируются со слайдами */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-white/90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {hero.city}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a
              href="/catalog"
              className="tap-click inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-base sm:text-lg"
            >
              Каталог продукции
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
            <a
              href={phoneHref}
              className="tap-click inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer text-base sm:text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Позвонить
            </a>
          </motion.div>
        </div>
      </div>

      {/* Стрелка вниз */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' }
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
  )
}
