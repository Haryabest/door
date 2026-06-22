/** Убирает статичный hero из index.html — иначе fixed-фон остаётся на каталоге и других страницах. */
export function hasStaticHeroLcp() {
  return Boolean(document.getElementById('static-hero-lcp'))
}

export function removeStaticHeroLcp() {
  document.getElementById('static-hero-lcp')?.remove()
}

/** Убирает дублирующий текст из статичного hero — React рисует свой. */
export function stripStaticHeroCopy() {
  document.querySelector('#static-hero-lcp [data-static-hero-copy]')?.remove()
}

/** Убирает статичный hero и передаёт отрисовку React-слою. */
export function retireStaticHeroLcp() {
  removeStaticHeroLcp()
}
