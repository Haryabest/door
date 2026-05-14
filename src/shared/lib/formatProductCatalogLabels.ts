import type { CatalogPageData } from '@/shared/api/catalog'

/** Строка для карточки / страницы товара: первая буква заглавная, без капса целиком. */
export function formatProductCategoryCaption(name: string): string {
  const t = name.trim()
  if (!t) return t
  return (
    t.charAt(0).toLocaleUpperCase('ru-RU') + t.slice(1).toLocaleLowerCase('ru-RU')
  )
}

/** Строка для таблицы / формы / карточки: названия подкатегорий по id или «—». */
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
