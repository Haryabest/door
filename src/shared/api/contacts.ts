// API страницы «Контакты» — GET/PUT /api/pages/contacts

import { apiFetch } from './http'

export interface ContactsPageData {
  phone: string
  email: string
  workHours: string
  address: string
  locations: LocationItem[]
}

export interface LocationItem {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  coords: [number, number]
}

// Данные по умолчанию (если API не доступен)
const defaultContactsData: ContactsPageData = {
  phone: '+7 (960) 166 30-30',
  email: 'otadoya.m@mail.ru',
  workHours: 'Ежедневно с 9:00 до 20:00',
  address: 'г. Нижний Новгород',
  locations: [
    {
      id: 1,
      name: 'СЦ Бекетов',
      address: 'СЦ Бекетов, ул. Бекетова, д. 13а',
      phone: '+7 (831) 200-00-01',
      hours: 'Ежедневно с 10:00 до 20:00',
      coords: [56.2906, 44.0024] as [number, number]
    },
    {
      id: 2,
      name: 'Салон на ул. Родионова',
      address: 'ул. Литвинова, 74Б',
      phone: '+7 (831) 200-00-02',
      hours: 'Ежедневно с 09:00 до 17:00',
      coords: [56.2755, 43.9803] as [number, number]
    },
    {
      id: 3,
      name: 'Радиорынок (ГЕРЦ)',
      address: 'ул. Композитора Касьянова, 6Г, пав №3, места: 42, 43, 44, 45',
      phone: '+7 (831) 200-00-03',
      hours: 'Ежедневно с 10:00 до 19:00',
      coords: [56.2636, 43.9578] as [number, number]
    }
  ]
}

/**
 * Получить данные страницы "Контакты"
 * GET /api/pages/contacts
 */
export async function getContactsPage(): Promise<ContactsPageData | null> {
  try {
    const response = await apiFetch('/api/pages/contacts')
    if (!response.ok) throw new Error('Failed to fetch contacts page')
    return await response.json()
  } catch (error) {
    console.error('Error fetching contacts page:', error)
    // Возвращаем данные по умолчанию при ошибке
    return defaultContactsData
  }
}

/**
 * Обновить данные страницы "Контакты"
 * PUT /api/pages/contacts
 */
export async function updateContactsPage(data: ContactsPageData): Promise<ContactsPageData | null> {
  try {
    const response = await apiFetch('/api/pages/contacts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update contacts page')
    return await response.json()
  } catch (error) {
    console.error('Error updating contacts page:', error)
    return null
  }
}

/**
 * Добавить локацию
 * POST /api/pages/contacts/locations
 */
export async function addLocation(location: Omit<LocationItem, 'id'>): Promise<LocationItem | null> {
  try {
    const response = await apiFetch('/api/pages/contacts/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    })
    if (!response.ok) throw new Error('Failed to add location')
    return await response.json()
  } catch (error) {
    console.error('Error adding location:', error)
    return null
  }
}

/**
 * Удалить локацию
 * DELETE /api/pages/contacts/locations/:id
 */
export async function deleteLocation(id: number): Promise<boolean> {
  try {
    const response = await apiFetch(`/api/pages/contacts/locations/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete location')
    return true
  } catch (error) {
    console.error('Error deleting location:', error)
    return false
  }
}

/**
 * Обновить локацию
 * PUT /api/pages/contacts/locations/:id
 */
export async function updateLocation(id: number, location: Partial<LocationItem>): Promise<LocationItem | null> {
  try {
    const response = await apiFetch(`/api/pages/contacts/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    })
    if (!response.ok) throw new Error('Failed to update location')
    return await response.json()
  } catch (error) {
    console.error('Error updating location:', error)
    return null
  }
}
