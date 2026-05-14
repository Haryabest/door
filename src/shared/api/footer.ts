import { apiFetch } from './http'

export interface FooterLinkItem {
  label: string
  path: string
}

export interface FooterPhoneItem {
  text: string
}

export interface FooterData {
  logoTitle: string
  logoSubtitle: string
  description: string
  navItems: FooterLinkItem[]
  phones: FooterPhoneItem[]
  emailText: string
  emailHref: string
  address: string
  copyright: string
  legalLinks: FooterLinkItem[]
}

export const defaultFooterData: FooterData = {
  logoTitle: 'От А до Я',
  logoSubtitle: 'Двери и Фурнитура',
  description:
    'Широкий ассортимент межкомнатных и входных дверей, фурнитуры и комплектующих. Профессиональные консультации и гарантия качества.',
  navItems: [
    { label: 'Каталог', path: '/catalog' },
    { label: 'Портфолио', path: '/portfolio' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contacts' },
  ],
  phones: [
    { text: '+7 (960) 166 30-30' },
    { text: '+7 (831) 200-00-02' },
    { text: '+7 (831) 200-00-03' },
  ],
  emailText: 'otadoya@mail.ru',
  emailHref: 'mailto:otadoya@mail.ru',
  address: 'СЦ Бекетов, ул. Бекетова, д. 13а',
  copyright: '© 2026 От А до Я. Все права защищены.',
  legalLinks: [
    { label: 'Политика конфиденциальности', path: '/privacy' },
    { label: 'Условия использования', path: '/terms' },
  ],
}

function parseFooterLinkItems(raw: unknown): FooterLinkItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is Record<string, unknown> => x !== null && typeof x === 'object')
    .map((x) => ({
      label: typeof x.label === 'string' ? x.label : '',
      path: typeof x.path === 'string' ? x.path : '/',
    }))
}

/** Телефоны: только текст; поле href из старых записей игнорируется. */
function parseFooterPhones(raw: unknown): FooterPhoneItem[] {
  if (!Array.isArray(raw)) return defaultFooterData.phones
  return raw
    .filter((x): x is Record<string, unknown> => x !== null && typeof x === 'object')
    .map((x) => ({
      text: typeof x.text === 'string' ? x.text : '',
    }))
}

export function normalizeFooterData(raw: unknown): FooterData {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    logoTitle: typeof r.logoTitle === 'string' ? r.logoTitle : defaultFooterData.logoTitle,
    logoSubtitle: typeof r.logoSubtitle === 'string' ? r.logoSubtitle : defaultFooterData.logoSubtitle,
    description: typeof r.description === 'string' ? r.description : defaultFooterData.description,
    navItems: Array.isArray(r.navItems) ? parseFooterLinkItems(r.navItems) : defaultFooterData.navItems,
    phones: Array.isArray(r.phones) ? parseFooterPhones(r.phones) : defaultFooterData.phones,
    emailText: typeof r.emailText === 'string' ? r.emailText : defaultFooterData.emailText,
    emailHref: typeof r.emailHref === 'string' ? r.emailHref : defaultFooterData.emailHref,
    address: typeof r.address === 'string' ? r.address : defaultFooterData.address,
    copyright: typeof r.copyright === 'string' ? r.copyright : defaultFooterData.copyright,
    legalLinks: Array.isArray(r.legalLinks) ? parseFooterLinkItems(r.legalLinks) : defaultFooterData.legalLinks,
  }
}

export async function getFooter(): Promise<FooterData | null> {
  try {
    const response = await apiFetch('/api/widgets/footer')
    if (!response.ok) throw new Error('Failed to fetch footer')
    const raw = await response.json()
    if (!raw || typeof raw !== 'object') return null
    return normalizeFooterData(raw)
  } catch (error) {
    console.error('Error fetching footer:', error)
    return null
  }
}

export async function updateFooter(data: FooterData): Promise<FooterData | null> {
  try {
    const response = await apiFetch('/api/widgets/footer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update footer')
    const raw = await response.json()
    return normalizeFooterData(raw)
  } catch (error) {
    console.error('Error updating footer:', error)
    return null
  }
}
