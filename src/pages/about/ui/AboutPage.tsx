import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Award, Users, Clock, ThumbsUp } from "lucide-react"

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* About Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                «От А до Я» — Ваш надежный партнер в мире дверей
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Наша компания специализируется на продаже межкомнатных и входных дверей,
                  а также сопутствующей фурнитуры в Нижнем Новгороде.
                </p>
                <p>
                  Мы работаем только с проверенными производителями и гарантируем высокое
                  качество всей представленной продукции. В нашем каталоге вы найдете двери
                  на любой вкус и бюджет — от классических до ультрасовременных моделей.
                </p>
                <p>
                  Наши специалисты помогут подобрать оптимальное решение, учитывая
                  особенности вашего интерьера и личные предпочтения.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1770677350521-d5fdcbd74367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGhhbGx3YXklMjBkb29yfGVufDF8fHx8MTc3NDM3NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="About company"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Clock, value: "10+", label: "Лет на рынке" },
              { icon: Users, value: "5000+", label: "Довольных клиентов" },
              { icon: Award, value: "500+", label: "Моделей в каталоге" },
              { icon: ThumbsUp, value: "100%", label: "Гарантия качества" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Advantages */}
          <div className="bg-white rounded-lg shadow-md p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Наши преимущества
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Широкий ассортимент",
                  description: "Более 500 моделей дверей различных стилей и ценовых категорий",
                },
                {
                  title: "Проверенные производители",
                  description: "Работаем только с надежными поставщиками из России и Европы",
                },
                {
                  title: "Профессиональная консультация",
                  description: "Опытные менеджеры помогут выбрать оптимальное решение",
                },
                {
                  title: "Гарантия качества",
                  description: "Официальная гарантия на всю продукцию от производителя",
                },
                {
                  title: "Индивидуальный подход",
                  description: "Учитываем все пожелания и особенности вашего интерьера",
                },
                {
                  title: "Удобное расположение",
                  description: "Несколько шоу-румов в Нижнем Новгороде для вашего удобства",
                },
              ].map((advantage, index) => (
                <div
                  key={index}
                  className="hover:bg-primary/5 p-4 rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2 text-primary">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
