export interface ProductLocal {
  id: number
  name: string
  description?: string
  features: string[]
  material: string
  color: string
  image: string
  category: string
  slug: string
}

/** Поля формы без slug — URL-сегмент генерируется на сохранении */
export type ProductFormState = Partial<Omit<ProductLocal, 'slug'>> & { file?: File; featuresText?: string }

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
    description: '',
    features: [],
    featuresText: '',
    category: '',
  }
}
