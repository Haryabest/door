export interface PortfolioItem {
  id: number
  image: string
  title: string
  description: string
}

const API_BASE = '/api'

export const portfolioApi = {
  getPortfolioItems: async (): Promise<PortfolioItem[]> => {
    const response = await fetch(`${API_BASE}/portfolio`)
    if (!response.ok) {
      console.warn('API request to /portfolio failed - running in demo mode')
      return []
    }
    return response.json()
  }
}