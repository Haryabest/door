// API страницы «О нас» — GET/PUT /api/pages/about и вложенные ресурсы

import { apiFetch } from './http'

export interface AboutPageData {
  aboutTitle: string
  aboutDescription: string
  stats: StatItem[]
  advantages: AdvantageItem[]
}

export interface StatItem {
  id: number
  icon: string
  value: string
  label: string
}

export interface AdvantageItem {
  id: number
  icon: string
  title: string
  description: string
}

// Данные по умолчанию (если API не доступен)
const defaultAboutData: AboutPageData = {
  aboutTitle: '«От А до Я» — Ваш надежный партнер в мире дверей',
  aboutDescription: 'Наша компания специализируется на продаже межкомнатных и входных дверей, а также сопутствующей фурнитуры в Нижнем Новгороде.\n\nМы работаем только с проверенными производителями и гарантируем высокое качество всей представленной продукции. В нашем каталоге вы найдете двери на любой вкус и бюджет — от классических до ультрасовременных моделей.\n\nНаши специалисты помогут подобрать оптимальное решение, учитывая особенности вашего интерьера и личные предпочтения.',
  stats: [
    { id: 1, icon: 'Clock', value: '10+', label: 'Лет на рынке' },
    { id: 2, icon: 'Users', value: '5000+', label: 'Довольных клиентов' },
    { id: 3, icon: 'Award', value: '500+', label: 'Моделей в каталоге' },
    { id: 4, icon: 'ThumbsUp', value: '100%', label: 'Гарантия качества' },
  ],
  advantages: [
    { id: 1, icon: 'Star', title: 'Широкий ассортимент', description: 'Более 500 моделей дверей различных стилей и ценовых категорий' },
    { id: 2, icon: 'Shield', title: 'Проверенные производители', description: 'Работаем только с надежными поставщиками из России и Европы' },
    { id: 3, icon: 'Headphones', title: 'Профессиональная консультация', description: 'Опытные менеджеры помогут выбрать оптимальное решение' },
    { id: 4, icon: 'Award', title: 'Гарантия качества', description: 'Официальная гарантия на всю продукцию от производителя' },
    { id: 5, icon: 'Users', title: 'Индивидуальный подход', description: 'Учитываем все пожелания и особенности вашего интерьера' },
    { id: 6, icon: 'Truck', title: 'Удобное расположение', description: 'Несколько шоу-румов в Нижнем Новгороде для вашего удобства' },
  ]
}

/**
 * Получить данные страницы "О нас"
 * GET /api/pages/about
 */
export async function getAboutPage(): Promise<AboutPageData | null> {
  try {
    const response = await apiFetch('/api/pages/about')
    if (!response.ok) throw new Error('Failed to fetch about page')
    return await response.json()
  } catch (error) {
    console.error('Error fetching about page:', error)
    // Возвращаем данные по умолчанию при ошибке
    return defaultAboutData
  }
}

/**
 * Обновить данные страницы "О нас"
 * PUT /api/pages/about
 */
export async function updateAboutPage(data: AboutPageData): Promise<AboutPageData | null> {
  try {
    const response = await apiFetch('/api/pages/about', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update about page')
    return await response.json()
  } catch (error) {
    console.error('Error updating about page:', error)
    return null
  }
}

/**
 * Добавить статистику
 * POST /api/pages/about/stats
 */
export async function addStat(stat: Omit<StatItem, 'id'>): Promise<StatItem | null> {
  try {
    const response = await apiFetch('/api/pages/about/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stat),
    })
    if (!response.ok) throw new Error('Failed to add stat')
    return await response.json()
  } catch (error) {
    console.error('Error adding stat:', error)
    return null
  }
}

/**
 * Удалить статистику
 * DELETE /api/pages/about/stats/:id
 */
export async function deleteStat(id: number): Promise<boolean> {
  try {
    const response = await apiFetch(`/api/pages/about/stats/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete stat')
    return true
  } catch (error) {
    console.error('Error deleting stat:', error)
    return false
  }
}

/**
 * Обновить статистику
 * PUT /api/pages/about/stats/:id
 */
export async function updateStat(id: number, stat: Partial<StatItem>): Promise<StatItem | null> {
  try {
    const response = await apiFetch(`/api/pages/about/stats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stat),
    })
    if (!response.ok) throw new Error('Failed to update stat')
    return await response.json()
  } catch (error) {
    console.error('Error updating stat:', error)
    return null
  }
}

/**
 * Добавить преимущество
 * POST /api/pages/about/advantages
 */
export async function addAdvantage(advantage: Omit<AdvantageItem, 'id'>): Promise<AdvantageItem | null> {
  try {
    const response = await apiFetch('/api/pages/about/advantages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(advantage),
    })
    if (!response.ok) throw new Error('Failed to add advantage')
    return await response.json()
  } catch (error) {
    console.error('Error adding advantage:', error)
    return null
  }
}

/**
 * Удалить преимущество
 * DELETE /api/pages/about/advantages/:id
 */
export async function deleteAdvantage(id: number): Promise<boolean> {
  try {
    const response = await apiFetch(`/api/pages/about/advantages/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete advantage')
    return true
  } catch (error) {
    console.error('Error deleting advantage:', error)
    return false
  }
}

/**
 * Обновить преимущество
 * PUT /api/pages/about/advantages/:id
 */
export async function updateAdvantage(id: number, advantage: Partial<AdvantageItem>): Promise<AdvantageItem | null> {
  try {
    const response = await apiFetch(`/api/pages/about/advantages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(advantage),
    })
    if (!response.ok) throw new Error('Failed to update advantage')
    return await response.json()
  } catch (error) {
    console.error('Error updating advantage:', error)
    return null
  }
}
