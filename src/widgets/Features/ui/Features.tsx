import { motion } from 'framer-motion'
import { DoorOpen, Shield, Award } from 'lucide-react'

export function Features() {
  return (
    <section className="py-20 bg-background">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(15 60 101 / 0.1)' }}
            transition={{ duration: 0.3 }}
            className="text-center p-8 rounded-lg bg-[#FDF8E8] hover:bg-[#F9F3D9] transition-colors"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DoorOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Широкий ассортимент</h3>
            <p className="text-muted-foreground">
              Межкомнатные и входные двери, системы, панели, плинтуса и фурнитура
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(15 60 101 / 0.1)' }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center p-8 rounded-lg bg-[#FDF8E8] hover:bg-[#F9F3D9] transition-colors"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Гарантия качества</h3>
            <p className="text-muted-foreground">
              Работаем только с проверенными производителями и предоставляем гарантию
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(15 60 101 / 0.1)' }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center p-8 rounded-lg bg-[#FDF8E8] hover:bg-[#F9F3D9] transition-colors"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Профессионализм</h3>
            <p className="text-muted-foreground">
              Опытные консультанты помогут подобрать идеальное решение для вас
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
