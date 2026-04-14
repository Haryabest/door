import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeroSection as HeroSectionType } from '@/shared/api/home'

interface HeroSectionProps {
  hero: HeroSectionType
}

export function HeroSection({ hero }: HeroSectionProps) {
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo')

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Переключатель фото/видео */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full p-1">
        <button
          onClick={() => setMediaMode('photo')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            mediaMode === 'photo'
              ? 'bg-white text-primary'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Фото
        </button>
        <button
          onClick={() => setMediaMode('video')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            mediaMode === 'video'
              ? 'bg-white text-primary'
              : 'text-white/80 hover:text-white'
          }`}
        >
          Видео
        </button>
      </div>

      {/* Фон: фото или видео */}
      <AnimatePresence mode="wait">
        {mediaMode === 'photo' ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
          />
        ) : (
          <motion.video
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </AnimatePresence>

      {/* Затемнение */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Контент */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
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

      {/* Стрелка вниз */}
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
  )
}
