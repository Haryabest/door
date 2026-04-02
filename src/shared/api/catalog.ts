// API для работы со страницей "Каталог" (заглушки для БД)

import { apiFetch } from './http'

export interface CatalogPageData {
  categories: CatalogCategory[]
  materials: string[]
  colors: CatalogColor[]
}

export interface CatalogCategory {
  id: string
  name: string
  icon: string
  subcategories: CatalogSubcategory[]
}

export interface CatalogSubcategory {
  id: string
  name: string
}

export interface CatalogColor {
  id: string
  name: string
  color: string
  border: string
}

// Данные по умолчанию (если API не доступен)
const defaultCatalogData: CatalogPageData = {
  categories: [
    {
      id: 'interior',
      name: 'Межкомнатные двери',
      icon: 'DoorOpen',
      subcategories: [
        { id: 'pvh', name: 'ПВХ' },
        { id: 'emal', name: 'Эмаль' },
        { id: 'ecoshpon', name: 'Экошпон' },
        { id: 'massiv', name: 'Массив и натуральный шпон' },
      ]
    },
    {
      id: 'entrance',
      name: 'Входные двери',
      icon: 'Home',
      subcategories: [
        { id: 'flat', name: 'В квартиру' },
        { id: 'house', name: 'В дом' },
      ]
    },
    {
      id: 'systems',
      name: 'Системы открывания',
      icon: 'Settings',
      subcategories: []
    },
    {
      id: 'panels',
      name: 'Стеновые панели',
      icon: 'PanelLeft',
      subcategories: []
    },
    {
      id: 'plinths',
      name: 'Плинтуса',
      icon: 'Square',
      subcategories: []
    },
  ],
  materials: ['ПВХ', 'Эмаль', 'Экошпон', 'Массив', 'Натуральный шпон'],
  colors: [
    { id: 'white', name: 'Белый', color: '#FFFFFF', border: '#E5E5E5' },
    { id: 'gray', name: 'Серый', color: '#9CA3AF', border: '#6B7280' },
    { id: 'beige', name: 'Бежевый', color: '#F5E6D3', border: '#D4C4B0' },
    { id: 'brown', name: 'Коричневый', color: '#8B4513', border: '#6B3410' },
    { id: 'wenge', name: 'Венге', color: '#4A3728', border: '#2D1F15' },
    { id: 'black', name: 'Чёрный', color: '#1F2937', border: '#111827' },
  ]
}

/**
 * Получить данные страницы "Каталог"
 * GET /api/pages/catalog
 */
export async function getCatalogPage(): Promise<CatalogPageData | null> {
  try {
    const response = await apiFetch('/api/pages/catalog')
    if (!response.ok) throw new Error('Failed to fetch catalog page')
    return await response.json()
  } catch (error) {
    console.error('Error fetching catalog page:', error)
    return defaultCatalogData
  }
}

/**
 * Обновить данные страницы "Каталог"
 * PUT /api/pages/catalog
 */
export async function updateCatalogPage(data: CatalogPageData): Promise<CatalogPageData | null> {
  try {
    const response = await apiFetch('/api/pages/catalog', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update catalog page')
    return await response.json()
  } catch (error) {
    console.error('Error updating catalog page:', error)
    return null
  }
}
