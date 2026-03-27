export interface Product {
  id: number
  name: string
  price: number
  oldPrice: number | null
  image: string
  category: string
  material: string
  color: string
  description?: string
  features?: string[]
  slug: string
}

const API_BASE = '/api'

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products`)
    if (!response.ok) {
      console.warn('API request to /products failed - running in demo mode')
      return []
    }
    return response.json()
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      console.warn('API request to /products/search failed - running in demo mode')
      return []
    }
    return response.json()
  },

  getProductById: async (id: number): Promise<Product | null> => {
    const response = await fetch(`${API_BASE}/products/${id}`)
    if (!response.ok) {
      console.warn(`API request to /products/${id} failed - running in demo mode`)
      return null
    }
    return response.json()
  }
}