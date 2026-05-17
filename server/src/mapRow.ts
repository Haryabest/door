import type { QueryResultRow } from 'pg'
import { resolveMediaUrl } from './lib/resolveMediaUrl.js'

export function mapProduct(row: QueryResultRow) {
  const subRaw = row.subcategory_ids as string[] | null | undefined
  return {
    id: row.id as number,
    name: row.name as string,
    description: (row.description as string | null) ?? undefined,
    features: (row.features as string[] | null) ?? [],
    material: row.material as string,
    color: row.color as string,
    image: resolveMediaUrl(row.image as string),
    category: row.category as string,
    slug: row.slug as string,
    subcategoryIds: Array.isArray(subRaw) ? subRaw : [],
  }
}

export function mapPortfolioItem(row: QueryResultRow) {
  return {
    id: row.id as number,
    image: resolveMediaUrl(row.image as string),
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
