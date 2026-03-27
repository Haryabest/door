import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from "@/pages/home"
import { CatalogPage } from "@/pages/catalog"
import { PortfolioPage } from "@/pages/portfolio"
import { AboutPage } from "@/pages/about"
import { ContactsPage } from "@/pages/contacts"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
