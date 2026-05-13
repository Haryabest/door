import { apiFetch } from './http'

export interface FooterLinkItem {
  label: string
  path: string
}

export interface FooterPhoneItem {
  text: string
  href: string
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
    { text: '+7 (960) 166 30-30', href: 'tel:+79601663030' },
    { text: '+7 (831) 200-00-02', href: 'tel:+78312000002' },
    { text: '+7 (831) 200-00-03', href: 'tel:+78312000003' },
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

export async function getFooter(): Promise<FooterData | null> {
  try {
    const response = await apiFetch('/api/widgets/footer')
    if (!response.ok) throw new Error('Failed to fetch footer')
    const data = (await response.json()) as FooterData | null
    if (!data) return null
    return data
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
    return (await response.json()) as FooterData
  } catch (error) {
    console.error('Error updating footer:', error)
    return null
  }
}
