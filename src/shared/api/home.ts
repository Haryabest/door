// API для работы с Главной страницей (заглушки для БД)

export interface HomePageData {
  hero: HeroSection
  features: FeatureItem[]
  categories: CategoryItem[]
}

export interface HeroSection {
  title: string
  subtitle: string
  city: string
  backgroundImage: string
}

export interface FeatureItem {
  id: number
  icon: string
  title: string
  description: string
}

export interface CategoryItem {
  id: number
  title: string
  image: string
  category: string
}

const API_URL = '/api'

// Данные по умолчанию (если API не доступен)
const defaultHomePageData: HomePageData = {
  hero: {
    title: 'От А до Я',
    subtitle: 'Премиум двери и фурнитура',
    city: 'Нижний Новгород',
    backgroundImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80'
  },
  features: [
    { id: 1, icon: 'DoorOpen', title: 'Широкий ассортимент', description: 'Межкомнатные и входные двери, системы, панели, плинтуса и фурнитура' },
    { id: 2, icon: 'Shield', title: 'Гарантия качества', description: 'Работаем только с проверенными производителями и предоставляем гарантию' },
    { id: 3, icon: 'Award', title: 'Профессионализм', description: 'Опытные консультанты помогут подобрать идеальное решение для вас' },
  ],
  categories: [
    { id: 1, title: 'Межкомнатные двери', image: 'https://images.unsplash.com/photo-1765766599489-fd53df7f8724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGludGVyaW9yJTIwZG9vcnxlbnwxfHx8fDE3NzQzNzU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080', category: 'interior' },
    { id: 2, title: 'Входные двери', image: 'https://images.unsplash.com/photo-1770786174932-293eaf17f919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZyb250JTIwZG9vciUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NDM3NTY3N3ww&ixlib=rb-4.1.0&q=80&w=1080', category: 'entrance' },
    { id: 3, title: 'Фурнитура', image: 'https://images.unsplash.com/photo-1761353854322-96e6ab127da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZG9vciUyMGhhcmR3YXJlfGVufDF8fHx8MTc3NDM3NTY3OHww&ixlib=rb-4.1.0&q=80&w=1080', category: 'hardware' },
  ]
}

/**
 * Получить данные главной страницы
 * GET /api/pages/home
 */
export async function getHomePage(): Promise<HomePageData | null> {
  try {
    const response = await fetch(`${API_URL}/pages/home`)
    if (!response.ok) throw new Error('Failed to fetch home page')
    return await response.json()
  } catch (error) {
    console.error('Error fetching home page:', error)
    return defaultHomePageData
  }
}

/**
 * Обновить данные главной страницы
 * PUT /api/pages/home
 */
export async function updateHomePage(data: HomePageData): Promise<HomePageData | null> {
  try {
    const response = await fetch(`${API_URL}/pages/home`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update home page')
    return await response.json()
  } catch (error) {
    console.error('Error updating home page:', error)
    return null
  }
}
