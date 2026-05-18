import { randomInt } from 'node:crypto'
import type { Pool } from 'pg'

/** Имя животное_число — читаемый псевдоним вместо случайной латиницы («Посетитель x7k…»). */
export const VISITOR_DISPLAY_ANIMALS = [
  'Сова',
  'Лев',
  'Тигр',
  'Медведь',
  'Волк',
  'Лиса',
  'Рысь',
  'Орёл',
  'Сокол',
  'Ястреб',
  'Панда',
  'Жираф',
  'Слон',
  'Выдра',
  'Кит',
  'Дельфин',
  'Пингвин',
  'Коала',
  'Енот',
  'Белка',
  'Ёж',
  'Кролик',
  'Обезьяна',
  'Фламинго',
  'Черепаха',
  'Жаба',
  'Утка',
  'Гусь',
  'Журавль',
  'Олень',
  'Лось',
  'Кабан',
  'Барс',
  'Шакал',
  'Гиена',
  'Носорог',
  'Бегемот',
  'Кенгуру',
  'Вомбат',
  'Оцелот',
] as const

const COLLISION_TRIES = 100

/**
 * Новый чат получает имя вида «Лев_746», не совпадающее по строке с существующим user_name в БД.
 */
export async function generateUniqueVisitorDisplayName(pool: Pool): Promise<string> {
  const animals = VISITOR_DISPLAY_ANIMALS

  for (let i = 0; i < COLLISION_TRIES; i++) {
    const word = animals[randomInt(0, animals.length)]
    const n = randomInt(100, 10_000) // [100, 9999]
    const candidate = `${word}_${n}`
    const { rows } = await pool.query('SELECT 1 FROM chats WHERE user_name = $1 LIMIT 1', [candidate])
    if (rows.length === 0) return candidate
  }

  const word = animals[randomInt(0, animals.length)]
  const fallback = `${word}_${randomInt(100_000, 1_000_000)}` // до 999_999 на последней попытке
  return fallback
}
