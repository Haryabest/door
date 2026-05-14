/**
 * Единственный источник кадров слайдшоу на главной: файлы в `src/assets/hero-slides/`
 * (jpg, jpeg, png, webp, avif). Порядок — по номеру в имени вида `door12.jpg` или ведущим цифрам;
 * иначе — лексикографически с numeric.
 */
const slideModules = import.meta.glob<string>('../../assets/hero-slides/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function basenameNoExt(p: string): string {
  const base = p.replace(/^.*[/\\]/, '')
  return base.replace(/\.[^.]+$/i, '')
}

/** Если в имени есть `door7` или ведущие цифры — сортировка по числу (1…10…2 не ломается). */
function slideOrderRank(modulePath: string): number | null {
  const name = basenameNoExt(modulePath)
  const door = /door\s*(\d+)/i.exec(name)
  if (door) return parseInt(door[1], 10)
  const lead = /^(\d+)/.exec(name)
  return lead ? parseInt(lead[1], 10) : null
}

export const HERO_SLIDE_ASSET_URLS: readonly string[] = Object.entries(slideModules)
  .sort(([pathA], [pathB]) => {
    const ra = slideOrderRank(pathA)
    const rb = slideOrderRank(pathB)
    if (ra != null && rb != null && ra !== rb) return ra - rb
    if (ra != null && rb == null) return -1
    if (rb != null && ra == null) return 1
    return pathA.localeCompare(pathB, undefined, { numeric: true })
  })
  .map(([, url]) => url)