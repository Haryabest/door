import { useState } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Phone, Mail, Clock, Send, User, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { SEO } from "@/shared/ui/SEO"
import { sanitizeInput, validateRequired, validateEmail, validatePhone, validateLength, formatPhoneInput } from "@/shared/lib/validation"

const locations = [
  {
    id: 1,
    name: "СЦ Бекетов",
    address: "СЦ Бекетов, ул. Бекетова, д. 13а",
    coords: [56.2906, 44.0024],
    hours: "Ежедневно с 10:00 до 20:00",
  },
  {
    id: 2,
    name: "Салон на ул. Родионова",
    address: "ул. Литвинова, 74Б",
    coords: [56.2755, 43.9803],
    hours: "Ежедневно с 09:00 до 17:00",
  },
  {
    id: 3,
    name: "Радиорынок (ГЕРЦ)",
    address: "ул. Композитора Касьянова, 6Г, пав №3, места: 42, 43, 44, 45",
    coords: [56.288743, 44.059329],
    hours: "Ежедневно с 10:00 до 19:00",
  },
]

export function ContactsPage() {
  const [selectedLocation, setSelectedLocation] = useState<number>(1)

  const handlePrevLocation = () => {
    setSelectedLocation(prev => {
      const currentIndex = locations.findIndex(l => l.id === prev)
      const newIndex = currentIndex > 0 ? currentIndex - 1 : locations.length - 1
      return locations[newIndex].id
    })
  }

  const handleNextLocation = () => {
    setSelectedLocation(prev => {
      const currentIndex = locations.findIndex(l => l.id === prev)
      const newIndex = currentIndex < locations.length - 1 ? currentIndex + 1 : 0
      return locations[newIndex].id
    })
  }

  const currentLocation = locations.find(l => l.id === selectedLocation)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Введите имя'
    } else if (!validateLength(formData.name, 2, 100)) {
      newErrors.name = 'Имя должно быть от 2 до 100 символов'
    }
    
    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Введите телефон'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона'
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }
    
    if (!validateRequired(formData.message)) {
      newErrors.message = 'Введите сообщение'
    } else if (!validateLength(formData.message, 2, 1000)) {
      newErrors.message = 'Сообщение должно быть от 2 до 1000 символов'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      phone: sanitizeInput(formData.phone),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    }
    
    setFormData(sanitizedData)
    
    if (!validateForm()) return
    
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.")
    setFormData({ name: "", phone: "", email: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const nextValue = name === 'phone' ? formatPhoneInput(value) : value

    setFormData({ ...formData, [name]: nextValue })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Контакты"
        description="Контакты компании От А до Я. Адреса салонов, телефоны, email. Режим работы: ежедневно с 9:00 до 20:00."
        canonicalUrl="/contacts"
        image="/logo.png"
        keywords="контакты двери Нижний Новгород, адрес магазина дверей, телефоны двери, салон дверей контакты"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Контакты От А до Я',
          url: 'https://otadoya.ru/contacts',
          description: 'Контакты, адреса салонов и телефоны компании От А до Я',
        }}
      />
      <Header />
      <main className="flex-1">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-primary mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Свяжитесь с нами
              </motion.h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { id: 'name', icon: User, label: 'Ваше имя', placeholder: 'Иван Иванов', type: 'text' },
                  { id: 'phone', icon: Phone, label: 'Телефон', placeholder: '+7 (___) ___-__-__', type: 'tel' },
                  { id: 'email', icon: Mail, label: 'Email', placeholder: 'email@example.com', type: 'email' },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <label htmlFor={field.id} className="block text-sm mb-2 flex items-center gap-2">
                      <field.icon className="w-4 h-4" />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.id !== 'email'}
                      maxLength={field.id === 'phone' ? 18 : undefined}
                      inputMode={field.id === 'phone' ? 'tel' : undefined}
                      autoComplete={field.id === 'phone' ? 'tel' : undefined}
                      className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 text-foreground ${errors[field.id] ? 'border-red-500 focus:ring-red-500' : 'border-primary/30 focus:ring-primary'}`}
                      placeholder={field.placeholder}
                    />
                    {errors[field.id] && (
                      <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 text-foreground resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-primary/30 focus:ring-primary'}`}
                    placeholder="Расскажите, что вас интересует..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </motion.div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary text-background font-semibold rounded-lg opacity-0 translate-y-5 hover:opacity-90 transition-all duration-200 cursor-pointer"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.5s forwards'
                  }}
                >
                  <Send className="w-5 h-5" />
                  Отправить заявку
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* General Contact */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-primary mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Общая информация
                </motion.h2>
                <div className="space-y-4">
                  {[
                    { icon: Phone, title: 'Телефон', content: '+7 (960) 166 30-30', href: 'tel:+79601663030' },
                    { icon: Phone, title: 'Телефон', content: '+7 (831) 200-00-02', href: 'tel:+78312000002' },
                    { icon: Phone, title: 'Телефон', content: '+7 (831) 200-00-03', href: 'tel:+78312000003' },
                    { icon: Mail, title: 'Email', content: 'otadoya.m@mail.ru', href: 'mailto:otadoya.m@mail.ru' },
                  ].map((item, index) => (
                    <motion.div 
                      key={`${item.title}-${item.content}`}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">{item.title}</div>
                        <a href={item.href} className="text-primary hover:underline">
                          {item.content}
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div 
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Режим работы
                      </div>
                      <div className="text-muted-foreground">
                        Ежедневно с 9:00 до 20:00
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Locations List */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >

              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div 
          className="bg-white border-t border-border py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Наши магазины на карте
            </motion.h2>
            
            {/* Карта с кнопками навигации */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Кнопка влево */}
              <button
                onClick={handlePrevLocation}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all border-2 border-primary/20"
                aria-label="Предыдущий магазин"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {/* Карта */}
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?ll=44.0024%2C56.2906&z=13&pt=${currentLocation?.coords[1]},${currentLocation?.coords[0]},pm2rdm`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title="Яндекс Карта магазинов"
                />
              </div>

              {/* Кнопка вправо */}
              <button
                onClick={handleNextLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all border-2 border-primary/20"
                aria-label="Следующий магазин"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </motion.div>

            {/* Название текущего магазина */}
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg font-semibold text-primary">{currentLocation?.name}</p>
              <p className="text-sm text-muted-foreground">{currentLocation?.address}</p>
            </motion.div>

            {/* Адреса под картой */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x justify-start md:justify-center">
                {locations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex-shrink-0 w-72 p-4 rounded-xl border-2 text-left transition-all snap-start ${
                      selectedLocation === location.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:border-primary/50'
                    }`}
                  >
                    <h4 className="font-semibold text-primary mb-2">{location.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{location.address}</p>
                    <p className="text-xs text-muted-foreground">{location.hours}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
