const CYRILLIC_EQUIVALENTS: Record<string, string> = {
  a: 'а',
  b: 'в',
  c: 'с',
  e: 'е',
  h: 'н',
  k: 'к',
  m: 'м',
  o: 'о',
  p: 'р',
  t: 'т',
  x: 'х',
  y: 'у',
}

const SWEAR_STEMS = [
  'хуй',
  'хуе',
  'хуя',
  'еб',
  'еба',
  'ебл',
  'пизд',
  'бля',
  'бляд',
  'сука',
  'сучк',
  'мудак',
  'мудил',
  'гандон',
  'долбоеб',
  'шлюх',
  'нахуй',
]

function normalize(text: string): { spaced: string; compact: string } {
  const lowered = text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[abcehkmoptxy]/g, (char) => CYRILLIC_EQUIVALENTS[char] ?? char)

  const spaced = lowered
    .replace(/[^а-я0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    spaced,
    compact: spaced.replace(/\s+/g, ''),
  }
}

export function containsProfanity(text: string): boolean {
  if (!text.trim()) return false

  const { spaced, compact } = normalize(text)
  if (!spaced) return false

  return SWEAR_STEMS.some((stem) => {
    const tokenPattern = new RegExp(`(^|\\s)${stem}[а-я0-9]*($|\\s)`, 'u')
    return tokenPattern.test(spaced) || compact.includes(stem)
  })
}
