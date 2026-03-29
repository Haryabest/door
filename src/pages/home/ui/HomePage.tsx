import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { HeroSection } from "@/widgets/Carousel"
import { Features } from "@/widgets/Features"
import { Categories } from "@/widgets/Categories"
import { SEO } from "@/shared/ui/SEO"

export function HomePage() {
  return (
    <>
      <SEO
        title="Главная"
        description="От А до Я - двери и фурнитура в Нижнем Новгороде. Широкий ассортимент межкомнатных и входных дверей, профессиональная консультация, гарантия качества."
      />
      <Header />
      <main>
        <HeroSection />
        <Features />
        <Categories />
      </main>
      <Footer />
    </>
  )
}
