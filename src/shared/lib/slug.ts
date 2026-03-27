/**
 * Транслитерация кириллицы в латиницу
 */
export function transliterate(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-',
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '') // Удаляем всё кроме букв, цифр и дефисов
    .replace(/-+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-|-$/g, '') // Удаляем дефисы с краёв
}

/**
 * Генерация SEO-friendly slug для товара
 * Формат: {название}-{материал}-{цвет}-{id}
 * Пример: dver-klassik-pvh-belyy-1
 */
export function generateProductSlug(
  name: string,
  material: string,
  color: string,
  id: number
): string {
  const nameSlug = transliterate(name)
  const materialSlug = transliterate(material)
  const colorSlug = transliterate(color)
  
  return `${nameSlug}-${materialSlug}-${colorSlug}-${id}`
}

/**
 * Извлечение ID из slug
 * ID всегда последний после дефиса
 */
export function extractIdFromSlug(slug: string): number {
  const parts = slug.split('-')
  const id = parts.pop()
  return Number(id) || 0
}
