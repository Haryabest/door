import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function Categories() {
  return (
    <section className="py-20 bg-[#F9F5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Категории продукции
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Межкомнатные двери",
              image: "https://images.unsplash.com/photo-1765766599489-fd53df7f8724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGludGVyaW9yJTIwZG9vcnxlbnwxfHx8fDE3NzQzNzU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
              category: "interior",
            },
            {
              title: "Входные двери",
              image: "https://images.unsplash.com/photo-1770786174932-293eaf17f919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZyb250JTIwZG9vciUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NDM3NTY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
              category: "entrance",
            },
            {
              title: "Фурнитура",
              image: "https://images.unsplash.com/photo-1761353854322-96e6ab127da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZG9vciUyMGhhcmR3YXJlfGVufDF8fHx8MTc3NDM3NTY3OHww&ixlib=rb-4.1.0&q=80&w=1080",
              category: "hardware",
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={`/catalog#${item.category}`}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <div className="flex items-center text-white/90 group-hover:text-white transition-colors">
                  <span className="text-sm">Смотреть каталог</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
