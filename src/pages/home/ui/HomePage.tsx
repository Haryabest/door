import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Carousel3D, ScrollIndicator } from "@/widgets/Carousel"
import { Features } from "@/widgets/Features"
import { Categories } from "@/widgets/Categories"

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <div className="relative h-[100vh]">
          <Carousel3D />
          <ScrollIndicator />
        </div>
        <Features />
        <Categories />
      </main>
      <Footer />
    </>
  )
}
