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
  navItems: HeaderNavItem[]
}

export const defaultHeaderData: HeaderData = {
  logoTitle: 'От А до Я',
  logoSubtitle: 'Двери и Фурнитура',
  phoneText: '+7 (960) 166 30-30',
  navItems: [
    { label: 'Каталог', path: '/catalog' },
    { label: 'Портфолио', path: '/portfolio' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contacts' },
  ],
}

function parseNavItems(raw: unknown): HeaderNavItem[] {
  if (!Array.isArray(raw)) return defaultHeaderData.navItems
  return raw
    .filter((x): x is Record<string, unknown> => x !== null && typeof x === 'object')
    .map((x) => ({
      label: typeof x.label === 'string' ? x.label : '',
      path: typeof x.path === 'string' ? x.path : '/',
    }))
}

/** Нормализация JSON (в т.ч. старых записей с phoneHref — поле игнорируется). */
export function normalizeHeaderData(raw: unknown): HeaderData {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    logoTitle: typeof r.logoTitle === 'string' ? r.logoTitle : defaultHeaderData.logoTitle,
    logoSubtitle: typeof r.logoSubtitle === 'string' ? r.logoSubtitle : defaultHeaderData.logoSubtitle,
    phoneText: typeof r.phoneText === 'string' ? r.phoneText : defaultHeaderData.phoneText,
    navItems: parseNavItems(r.navItems),
  }
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
    const raw = await response.json()
    if (!raw || typeof raw !== 'object') return null
    return normalizeHeaderData(raw)
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
    const raw = await response.json()
    return normalizeHeaderData(raw)
  } catch (error) {
    console.error('Error updating header:', error)
    return null
  }
}
