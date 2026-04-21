export interface ProductLocal {
  id: number
  name: string
  price: number
  oldPrice?: number | null
  description?: string
  features: string[]
  material: string
  color: string
  image: string
  category: string
  slug: string
}

export interface ProductCategoryOption {
  value: string
  label: string
}

export type ProductFormState = Partial<ProductLocal> & { file?: File; featuresText?: string }

export function parseFeaturesText(text: string | undefined): string[] {
  if (!text?.trim()) return []
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100)
}

export function emptyProductForm(): ProductFormState {
  return {
    name: '',
    material: '',
    color: '',
    image: '',
    price: 0,
    oldPrice: null,
    description: '',
    features: [],
    featuresText: '',
    category: 'interior',
    slug: '',
  }
}

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  { value: 'interior', label: 'Межкомнатные' },
  { value: 'entrance', label: 'Входные' },
  { value: 'hardware', label: 'Фурнитура' },
]
