// API главной страницы — GET/PUT /api/pages/home

import { apiFetch } from './http'

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

// Данные по умолчанию (если API не доступен)
export const defaultHomePageData: HomePageData = {
  hero: {
    title: 'От А до Я',
    subtitle: 'Премиум двери и фурнитура',
    city: 'Нижний Новгород',
    backgroundImage: '/home-photo.jpg'
  },
  features: [
    { id: 1, icon: 'DoorOpen', title: 'Широкий ассортимент', description: 'Межкомнатные и входные двери, системы, панели, плинтуса и фурнитура' },
    { id: 2, icon: 'Shield', title: 'Гарантия качества', description: 'Работаем только с проверенными производителями и предоставляем гарантию' },
    { id: 3, icon: 'Award', title: 'Профессионализм', description: 'Опытные консультанты помогут подобрать идеальное решение для вас' },
  ],
  categories: [
    { id: 1, title: 'Межкомнатные двери', image: '/categories/interior.avif', category: 'interior' },
    { id: 2, title: 'Входные двери', image: '/categories/entrance.avif', category: 'entrance' },
    { id: 3, title: 'Фурнитура', image: '/categories/hardware.avif', category: 'hardware' },
  ]
}

const LOCAL_CATEGORY_IMAGES: Record<string, string> = {
  interior: '/categories/interior.avif',
  entrance: '/categories/entrance.avif',
  hardware: '/categories/hardware.avif',
}

const TRUSTED_IMAGE_HOSTS = new Set([
  'dverinn52.ru',
  'www.dverinn52.ru',
  'localhost',
  'images.unsplash.com',
])

function shouldReplaceCategoryImage(url: string): boolean {
  if (!url?.trim()) return true
  if (url.startsWith('/categories/')) return false
  if (url.startsWith('/')) {
    return url === '/home-photo.jpg' || url === '/home-photo.webp'
  }
  try {
    const host = new URL(url).hostname
    return !TRUSTED_IMAGE_HOSTS.has(host)
  } catch {
    return true
  }
}

export function normalizeHomePageData(data: HomePageData): HomePageData {
  return {
    ...data,
    categories: data.categories.map((item) => ({
      ...item,
      image: shouldReplaceCategoryImage(item.image)
        ? (LOCAL_CATEGORY_IMAGES[item.category] ?? item.image)
        : item.image,
    })),
  }
}

/**
 * Получить данные главной страницы
 * GET /api/pages/home
 */
export async function getHomePage(): Promise<HomePageData | null> {
  try {
    const response = await apiFetch('/api/pages/home')
    if (!response.ok) throw new Error('Failed to fetch home page')
    const data = (await response.json()) as HomePageData
    return normalizeHomePageData(data)
  } catch (error) {
    console.error('Error fetching home page:', error)
    return normalizeHomePageData(defaultHomePageData)
  }
}

/**
 * Обновить данные главной страницы
 * PUT /api/pages/home
 */
export async function updateHomePage(data: HomePageData): Promise<HomePageData | null> {
  try {
    const response = await apiFetch('/api/pages/home', {
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
