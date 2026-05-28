// API страницы «Контакты» — GET/PUT /api/pages/contacts

import { apiFetch } from './http'

export interface ContactFormBlock {
  title: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitButton: string
  submittingButton: string
  successMessage: string
}

export interface GeneralInfoPhoneItem {
  id: number
  label: string
  value: string
}

export interface GeneralInfoBlock {
  title: string
  phones: GeneralInfoPhoneItem[]
  emailLabel: string
  email: string
  workHoursLabel: string
  workHours: string
}

export interface ContactsPageData {
  address: string
  locations: LocationItem[]
  contactForm: ContactFormBlock
  generalInfo: GeneralInfoBlock
}

export interface LocationItem {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  coords: [number, number]
}

export const defaultContactForm: ContactFormBlock = {
  title: 'Свяжитесь с нами',
  nameLabel: 'Ваше имя',
  namePlaceholder: 'Иван Иванов',
  phoneLabel: 'Телефон',
  phonePlaceholder: '+7 (___) ___-__-__',
  emailLabel: 'Email',
  emailPlaceholder: 'email@example.com',
  messageLabel: 'Сообщение',
  messagePlaceholder: 'Расскажите, что вас интересует...',
  submitButton: 'Отправить заявку',
  submittingButton: 'Отправка…',
  successMessage: 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
}

export const defaultGeneralInfo: GeneralInfoBlock = {
  title: 'Общая информация',
  phones: [
    { id: 1, label: 'Телефон', value: '+7 (960) 166 30-30' },
    { id: 2, label: 'Телефон', value: '+7 (831) 200-00-02' },
    { id: 3, label: 'Телефон', value: '+7 (831) 200-00-03' },
  ],
  emailLabel: 'Email',
  email: 'otadoya.m@mail.ru',
  workHoursLabel: 'Режим работы',
  workHours: 'Ежедневно с 9:00 до 20:00',
}

const defaultContactsData: ContactsPageData = {
  address: 'г. Нижний Новгород',
  contactForm: defaultContactForm,
  generalInfo: defaultGeneralInfo,
  locations: [
    {
      id: 1,
      name: 'СЦ Бекетов',
      address: 'СЦ Бекетов, ул. Бекетова, д. 13а',
      phone: '+7 (831) 200-00-01',
      hours: 'Ежедневно с 10:00 до 20:00',
      coords: [56.2906, 44.0024] as [number, number],
    },
    {
      id: 2,
      name: 'Салон на ул. Родионова',
      address: 'ул. Литвинова, 74Б',
      phone: '+7 (831) 200-00-02',
      hours: 'Ежедневно с 09:00 до 17:00',
      coords: [56.2755, 43.9803] as [number, number],
    },
    {
      id: 3,
      name: 'Радиорынок (ГЕРЦ)',
      address: 'ул. Композитора Касьянова, 6Г, пав №3, места: 42, 43, 44, 45',
      phone: '+7 (831) 200-00-03',
      hours: 'Ежедневно с 10:00 до 19:00',
      coords: [56.2636, 43.9578] as [number, number],
    },
  ],
}

function parseLocations(raw: unknown): LocationItem[] {
  if (!Array.isArray(raw)) return defaultContactsData.locations
  const out: LocationItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = Number(o.id)
    const coords = o.coords
    if (!Number.isFinite(id) || !Array.isArray(coords) || coords.length < 2) continue
    const lat = Number(coords[0])
    const lng = Number(coords[1])
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    out.push({
      id,
      name: String(o.name ?? ''),
      address: String(o.address ?? ''),
      phone: String(o.phone ?? ''),
      hours: String(o.hours ?? ''),
      coords: [lat, lng],
    })
  }
  return out.length > 0 ? out : defaultContactsData.locations
}

function parseContactForm(raw: unknown): ContactFormBlock {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    title: typeof r.title === 'string' ? r.title : defaultContactForm.title,
    nameLabel: typeof r.nameLabel === 'string' ? r.nameLabel : defaultContactForm.nameLabel,
    namePlaceholder:
      typeof r.namePlaceholder === 'string' ? r.namePlaceholder : defaultContactForm.namePlaceholder,
    phoneLabel: typeof r.phoneLabel === 'string' ? r.phoneLabel : defaultContactForm.phoneLabel,
    phonePlaceholder:
      typeof r.phonePlaceholder === 'string' ? r.phonePlaceholder : defaultContactForm.phonePlaceholder,
    emailLabel: typeof r.emailLabel === 'string' ? r.emailLabel : defaultContactForm.emailLabel,
    emailPlaceholder:
      typeof r.emailPlaceholder === 'string' ? r.emailPlaceholder : defaultContactForm.emailPlaceholder,
    messageLabel: typeof r.messageLabel === 'string' ? r.messageLabel : defaultContactForm.messageLabel,
    messagePlaceholder:
      typeof r.messagePlaceholder === 'string' ? r.messagePlaceholder : defaultContactForm.messagePlaceholder,
    submitButton: typeof r.submitButton === 'string' ? r.submitButton : defaultContactForm.submitButton,
    submittingButton:
      typeof r.submittingButton === 'string' ? r.submittingButton : defaultContactForm.submittingButton,
    successMessage:
      typeof r.successMessage === 'string' ? r.successMessage : defaultContactForm.successMessage,
  }
}

function parseGeneralInfoPhones(raw: unknown): GeneralInfoPhoneItem[] {
  if (!Array.isArray(raw)) return defaultGeneralInfo.phones
  const out: GeneralInfoPhoneItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = Number(o.id)
    if (!Number.isFinite(id)) continue
    out.push({
      id,
      label: typeof o.label === 'string' ? o.label : 'Телефон',
      value: typeof o.value === 'string' ? o.value : typeof o.text === 'string' ? o.text : '',
    })
  }
  return out.length > 0 ? out : defaultGeneralInfo.phones
}

function parseGeneralInfo(raw: unknown, legacy?: Record<string, unknown>): GeneralInfoBlock {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  let phones = parseGeneralInfoPhones(r.phones)
  if (phones === defaultGeneralInfo.phones && legacy) {
    const legacyPhone = typeof legacy.phone === 'string' ? legacy.phone.trim() : ''
    if (legacyPhone) {
      phones = [{ id: 1, label: 'Телефон', value: legacyPhone }]
    }
  }

  return {
    title: typeof r.title === 'string' ? r.title : defaultGeneralInfo.title,
    phones,
    emailLabel: typeof r.emailLabel === 'string' ? r.emailLabel : defaultGeneralInfo.emailLabel,
    email:
      typeof r.email === 'string'
        ? r.email
        : typeof legacy?.email === 'string'
          ? legacy.email
          : defaultGeneralInfo.email,
    workHoursLabel:
      typeof r.workHoursLabel === 'string' ? r.workHoursLabel : defaultGeneralInfo.workHoursLabel,
    workHours:
      typeof r.workHours === 'string'
        ? r.workHours
        : typeof legacy?.workHours === 'string'
          ? legacy.workHours
          : defaultGeneralInfo.workHours,
  }
}

export function normalizeContactsPageData(raw: unknown): ContactsPageData {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    address: typeof r.address === 'string' ? r.address : defaultContactsData.address,
    locations: parseLocations(r.locations),
    contactForm: parseContactForm(r.contactForm),
    generalInfo: parseGeneralInfo(r.generalInfo, r),
  }
}

/**
 * Получить данные страницы "Контакты"
 * GET /api/pages/contacts
 */
export async function getContactsPage(): Promise<ContactsPageData | null> {
  try {
    const response = await apiFetch('/api/pages/contacts')
    if (!response.ok) throw new Error('Failed to fetch contacts page')
    const raw = await response.json()
    return normalizeContactsPageData(raw)
  } catch (error) {
    console.error('Error fetching contacts page:', error)
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
    const raw = await response.json()
    return normalizeContactsPageData(raw)
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
