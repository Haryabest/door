// API для работы с товарами

import { apiFetch } from './http'

export interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number | null
  description?: string
  features?: string[]
  material: string
  color: string
  image: string
  category: string
  slug: string
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiFetch('/api/products')
    if (!response.ok) return []
    return parseJson<Product[]>(response)
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const q = query.trim()
    if (!q) return []
    const response = await apiFetch(`/api/products/search?q=${encodeURIComponent(q)}`)
    if (!response.ok) return []
    return parseJson<Product[]>(response)
  },
}

export async function getProductById(id: number): Promise<Product | null> {
  const response = await apiFetch(`/api/products/${id}`)
  if (!response.ok) return null
  return parseJson<Product>(response)
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const response = await apiFetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) return null
  return parseJson<Product>(response)
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  const response = await apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) return null
  return parseJson<Product>(response)
}

export async function deleteProduct(id: number): Promise<boolean> {
  const response = await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
  return response.ok
}

export async function uploadImage(file: File): Promise<string | null> {
  const form = new FormData()
  form.append('file', file)
  const response = await apiFetch('/api/upload', {
    method: 'POST',
    body: form,
  })
  if (!response.ok) return null
  const data = (await response.json()) as { url?: string }
  return data.url ?? null
}
