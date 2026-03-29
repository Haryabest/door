import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80')"
        }}
      >
        {/* Затемнение */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Контент */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          {/* Логотип */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            От А до Я
          </motion.h1>
          
          {/* Подзаголовок */}
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-white/90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Премиум двери и фурнитура
          </motion.p>
          
          {/* Город */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Нижний Новгород
          </motion.p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-base sm:text-lg"
              >
                <ArrowRight className="w-5 h-5" />
                Каталог продукции
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <a
                href="tel:+79601663030"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer text-base sm:text-lg"
              >
                <Phone className="w-5 h-5" />
                Позвонить
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Индикатор прокрутки */}
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
