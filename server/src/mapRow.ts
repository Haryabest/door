import type { QueryResultRow } from 'pg'

export function mapProduct(row: QueryResultRow) {
  return {
    id: row.id as number,
    name: row.name as string,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    description: (row.description as string | null) ?? undefined,
    features: (row.features as string[] | null) ?? [],
    material: row.material as string,
    color: row.color as string,
    image: row.image as string,
    category: row.category as string,
    slug: row.slug as string,
  }
}

export function mapPortfolioItem(row: QueryResultRow) {
  return {
    id: row.id as number,
    image: row.image as string,
    title: row.title as string,
    description: row.description as string,
  }
}

export function mapMessage(row: QueryResultRow) {
  return {
    id: row.id as number,
    text: row.text as string,
    isUser: row.is_user as boolean,
    timestamp: row.created_at as Date,
    chatId: row.chat_id as number,
  }
}
