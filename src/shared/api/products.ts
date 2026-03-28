// API для работы с товарами (заглушки для БД)

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

export const productsApi = {
  getProducts: () => Promise.resolve([]),
  searchProducts: (_query: string) => Promise.resolve([]),
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  console.log('POST /api/products', product)
  return null
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  console.log('PUT /api/products', id, product)
  return null
}

export async function deleteProduct(id: number): Promise<boolean> {
  console.log('DELETE /api/products', id)
  return true
}

export async function uploadImage(file: File): Promise<string | null> {
  console.log('POST /api/upload', file)
  return null
}
