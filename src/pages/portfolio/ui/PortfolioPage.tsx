import { useState } from "react"
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"

const portfolioItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1768548273807-275b0e16fff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5pc2hlZCUyMGhvbWUlMjBpbnRlcmlvciUyMHByb2plY3R8ZW58MXx8fHwxNzc0Mzc1Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Квартира в современном стиле",
    description: "Установка межкомнатных дверей с скрытым коробом",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1722528078553-f6d3ae8c55e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBlbnRyYW5jZXxlbnwxfHx8fDE3NzQzNzU2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Премиум входная группа",
    description: "Входные двери с терморазрывом",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1770677350521-d5fdcbd74367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGhhbGx3YXklMjBkb29yfGVufDF8fHx8MTc3NDM3NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Коридор в классическом стиле",
    description: "Двери из массива дуба",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1762721373504-9504de3bc07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMGRvb3J3YXl8ZW58MXx8fHwxNzc0Mzc1Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Минималистичный интерьер",
    description: "Скрытые двери под покраску",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1765766599489-fd53df7f8724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGludGVyaW9yJTIwZG9vcnxlbnwxfHx8fDE3NzQzNzU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Современная квартира",
    description: "Белые межкомнатные двери",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1760385737098-0b555a75b2ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29vZGVuJTIwZG9vciUyMGVudHJhbmNlfGVufDF8fHx8MTc3NDM3NTY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Элегантная входная дверь",
    description: "Деревянная входная дверь",
  },
]

export function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* Portfolio Grid - Masonry layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
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
              </div>
            ))}
          </div>
        </div>

        {/* Modal для просмотра */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              <img
                src={portfolioItems.find(i => i.id === selectedImage)?.image}
                alt="Portfolio"
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-4 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  {portfolioItems.find(i => i.id === selectedImage)?.title}
                </h3>
                <p className="text-white/80">
                  {portfolioItems.find(i => i.id === selectedImage)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-white border-t border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Хотите такой же результат?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Свяжитесь с нами для консультации и расчета стоимости
            </p>
            <a
              href="/contacts"
              className="inline-block px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
