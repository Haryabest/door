// API для работы со страницей "Портфолио" (заглушки для БД)

export interface PortfolioPageData {
  items: PortfolioItem[]
}

export interface PortfolioItem {
  id: number
  image: string
  title: string
  description: string
}

const API_URL = '/api'

// Данные по умолчанию (если API не доступен)
const defaultPortfolioData: PortfolioPageData = {
  items: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1768548273807-275b0e16fff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5pc2hlZCUyMGhvbWUlMjBpbnRlcmlvciUyMHByb2plY3R8ZW58MXx8fHwxNzc0Mzc1Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Квартира в современном стиле',
      description: 'Установка межкомнатных дверей с скрытым коробом'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1722528078553-f6d3ae8c55e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBlbnRyYW5jZXxlbnwxfHx8fDE3NzQzNzU2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Премиум входная группа',
      description: 'Входные двери с терморазрывом'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1770677350521-d5fdcbd74367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGhhbGx3YXklMjBkb29yfGVufDF8fHx8MTc3NDM3NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Коридор в классическом стиле',
      description: 'Двери из массива дуба'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1762721373504-9504de3bc07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMGRvb3J3YXl8ZW58MXx8fHwxNzc0Mzc1Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Минималистичный интерьер',
      description: 'Скрытые двери под покраску'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1765766599489-fd53df7f8724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGludGVyaW9yJTIwZG9vcnxlbnwxfHx8fDE3NzQzNzU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Современная квартира',
      description: 'Белые межкомнатные двери'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1760385737098-0b555a75b2ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29vZGVuJTIwZG9vciUyMGVudHJhbmNlfGVufDF8fHx8MTc3NDM3NTY3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Элегантная входная дверь',
      description: 'Деревянная входная дверь'
    }
  ]
}

/**
 * Получить данные страницы "Портфолио"
 * GET /api/pages/portfolio
 */
export async function getPortfolioPage(): Promise<PortfolioPageData | null> {
  try {
    const response = await fetch(`${API_URL}/pages/portfolio`)
    if (!response.ok) throw new Error('Failed to fetch portfolio page')
    return await response.json()
  } catch (error) {
    console.error('Error fetching portfolio page:', error)
    // Возвращаем данные по умолчанию при ошибке
    return defaultPortfolioData
  }
}

/**
 * Обновить данные страницы "Портфолио"
 * PUT /api/pages/portfolio
 */
export async function updatePortfolioPage(data: PortfolioPageData): Promise<PortfolioPageData | null> {
  try {
    const response = await fetch(`${API_URL}/pages/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update portfolio page')
    return await response.json()
  } catch (error) {
    console.error('Error updating portfolio page:', error)
    return null
  }
}

/**
 * Добавить элемент портфолио
 * POST /api/pages/portfolio/items
 */
export async function addPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
  try {
    const response = await fetch(`${API_URL}/pages/portfolio/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error('Failed to add portfolio item')
    return await response.json()
  } catch (error) {
    console.error('Error adding portfolio item:', error)
    return null
  }
}

/**
 * Удалить элемент портфолио
 * DELETE /api/pages/portfolio/items/:id
 */
export async function deletePortfolioItem(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/pages/portfolio/items/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete portfolio item')
    return true
  } catch (error) {
    console.error('Error deleting portfolio item:', error)
    return false
  }
}

/**
 * Обновить элемент портфолио
 * PUT /api/pages/portfolio/items/:id
 */
export async function updatePortfolioItem(id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
  try {
    const response = await fetch(`${API_URL}/pages/portfolio/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error('Failed to update portfolio item')
    return await response.json()
  } catch (error) {
    console.error('Error updating portfolio item:', error)
    return null
  }
}
