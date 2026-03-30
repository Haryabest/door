import { useState, useEffect } from 'react'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Award, Users, Clock, ThumbsUp, Star, Shield, Truck, Headphones, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { SEO } from "@/shared/ui/SEO"
import { useNavigate } from 'react-router-dom'
import { getAboutPage, type AboutPageData } from '@/shared/api/about'

const iconMap: Record<string, any> = {
  'Star': Star,
  'Shield': Shield,
  'Headphones': Headphones,
  'Award': Award,
  'Users': Users,
  'Truck': Truck,
  'Clock': Clock,
  'ThumbsUp': ThumbsUp,
}

export function AboutPage() {
  const navigate = useNavigate()
  const [pageData, setPageData] = useState<AboutPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setIsLoading(true)
    const data = await getAboutPage()
    if (data) {
      setPageData(data)
    } else {
      // Данные по умолчанию
      setPageData({
        aboutTitle: '«От А до Я» — Ваш надежный партнер в мире дверей',
        aboutDescription: 'Наша компания специализируется на продаже межкомнатных и входных дверей, а также сопутствующей фурнитуры в Нижнем Новгороде.\n\nМы работаем только с проверенными производителями и гарантируем высокое качество всей представленной продукции. В нашем каталоге вы найдете двери на любой вкус и бюджет — от классических до ультрасовременных моделей.\n\nНаши специалисты помогут подобрать оптимальное решение, учитывая особенности вашего интерьера и личные предпочтения.',
        stats: [
          { id: 1, icon: 'Clock', value: '10+', label: 'Лет на рынке' },
          { id: 2, icon: 'Users', value: '5000+', label: 'Довольных клиентов' },
          { id: 3, icon: 'Award', value: '500+', label: 'Моделей в каталоге' },
          { id: 4, icon: 'ThumbsUp', value: '100%', label: 'Гарантия качества' },
        ],
        advantages: [
          { id: 1, icon: 'Star', title: 'Широкий ассортимент', description: 'Более 500 моделей дверей различных стилей и ценовых категорий' },
          { id: 2, icon: 'Shield', title: 'Проверенные производители', description: 'Работаем только с надежными поставщиками из России и Европы' },
          { id: 3, icon: 'Headphones', title: 'Профессиональная консультация', description: 'Опытные менеджеры помогут выбрать оптимальное решение' },
          { id: 4, icon: 'Award', title: 'Гарантия качества', description: 'Официальная гарантия на всю продукцию от производителя' },
          { id: 5, icon: 'Users', title: 'Индивидуальный подход', description: 'Учитываем все пожелания и особенности вашего интерьера' },
          { id: 6, icon: 'Truck', title: 'Удобное расположение', description: 'Несколько шоу-румов в Нижнем Новгороде для вашего удобства' },
        ]
      })
    }
    setIsLoading(false)
  }

  if (isLoading) {
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
        title="О компании"
        description="О компании От А до Я - 10 лет на рынке, более 5000 довольных клиентов. Профессиональная установка дверей в Нижнем Новгороде."
      />
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-primary mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {pageData.aboutTitle}
              </motion.h2>
              <div className="space-y-4 text-muted-foreground">
                {pageData.aboutDescription.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1770677350521-d5fdcbd74367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGhhbGx3YXklMjBkb29yfGVufDF8fHx8MTc3NDM3NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="About company"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {pageData.stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Clock
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <IconComponent className="w-10 h-10 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Advantages */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Наши преимущества
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageData.advantages.map((advantage, index) => {
                const IconComponent = iconMap[advantage.icon] || Star
                return (
                  <motion.div
                    key={advantage.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-3 sm:p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 text-primary leading-tight">{advantage.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{advantage.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Скрытая кнопка админки */}
        <div className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate('/admin-login')}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            title="Админ-панель"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
