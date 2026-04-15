// API шапки — GET/PUT /api/widgets/header

import { apiFetch } from './http'

export interface HeaderNavItem {
  label: string
  path: string
}

export interface HeaderData {
  logoTitle: string
  logoSubtitle: string
  phoneText: string
  phoneHref: string
  navItems: HeaderNavItem[]
}

export const defaultHeaderData: HeaderData = {
  logoTitle: 'От А до Я',
  logoSubtitle: 'Двери и Фурнитура',
  phoneText: '+7 (960) 166 30-30',
  phoneHref: 'tel:+79991234567',
  navItems: [
    { label: 'Каталог', path: '/catalog' },
    { label: 'Портфолио', path: '/portfolio' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contacts' },
  ],
}

/**
 * Получить данные шапки
 * GET /api/widgets/header
 *
 * ВАЖНО: если данных нет/ошибка — возвращаем null, чтобы на сайте остались стандартные значения.
 */
export async function getHeader(): Promise<HeaderData | null> {
  try {
    const response = await apiFetch('/api/widgets/header')
    if (!response.ok) throw new Error('Failed to fetch header')
    const data = (await response.json()) as HeaderData | null
    if (!data) return null
    return data
  } catch (error) {
    console.error('Error fetching header:', error)
    return null
  }
}

/**
 * Обновить данные шапки
 * PUT /api/widgets/header
 */
export async function updateHeader(data: HeaderData): Promise<HeaderData | null> {
  try {
    const response = await apiFetch('/api/widgets/header', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update header')
    return (await response.json()) as HeaderData
  } catch (error) {
    console.error('Error updating header:', error)
    return null
  }
}

