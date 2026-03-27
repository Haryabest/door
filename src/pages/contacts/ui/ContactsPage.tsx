import { useState } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare, Calendar, Check } from "lucide-react"

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
    coords: [56.2636, 43.9578],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.")
    setFormData({ name: "", phone: "", email: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Свяжитесь с нами
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
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
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                    placeholder="Расскажите, что вас интересует..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Отправить заявку
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* General Contact */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Общая информация
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Телефон</div>
                      <a href="tel:+79601663030" className="text-primary hover:underline">
                        +7 (960) 166 30-30
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <a href="mailto:otadoya.m@mail.ru" className="text-primary hover:underline">
                        otadoya.m@mail.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
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
                  </div>
                </div>
              </div>

              {/* Locations List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary mb-3">Наши салоны</h3>
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedLocation === location.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        selectedLocation === location.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary mb-1">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">{location.hours}</p>
                      </div>
                      {selectedLocation === location.id && (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white border-t border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Наши магазины на карте
            </h2>
            
            {/* Карта с кнопками навигации */}
            <div className="relative">
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
            </div>

            {/* Название текущего магазина */}
            <div className="text-center mt-6">
              <p className="text-lg font-semibold text-primary">{currentLocation?.name}</p>
              <p className="text-sm text-muted-foreground">{currentLocation?.address}</p>
            </div>

            {/* Адреса под картой */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedLocation === location.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white hover:border-primary/50'
                  }`}
                >
                  <h4 className="font-semibold text-primary mb-2">{location.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{location.address}</p>
                  <p className="text-xs text-muted-foreground">{location.hours}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
