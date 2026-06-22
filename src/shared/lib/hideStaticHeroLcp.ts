/** Убирает статичный hero из index.html — иначе fixed-фон остаётся на каталоге и других страницах. */
export function removeStaticHeroLcp() {
  document.getElementById('static-hero-lcp')?.remove()
}

/** @deprecated используйте removeStaticHeroLcp */
export const hideStaticHeroLcp = removeStaticHeroLcp
