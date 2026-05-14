import type { CatalogPageData } from '@/shared/api/catalog'

/** Строка для таблицы / формы: названия подкатегорий по id или «—». */
export function formatProductSubcategoriesLine(
  catalog: CatalogPageData | null | undefined,
  categoryId: string | undefined,
  subcategoryIds: string[] | undefined
): string {
  if (!categoryId) return '—'
  const ids = subcategoryIds?.filter(Boolean) ?? []
  if (ids.length === 0) return '—'
  const cat = catalog?.categories.find((c) => c.id === categoryId)
  const map = new Map((cat?.subcategories ?? []).map((s) => [s.id, s.name]))
  return ids.map((id) => map.get(id) ?? id).join(', ')
}
