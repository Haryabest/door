/** Скрывает статичный hero из index.html после отрисовки React-версии. */
export function hideStaticHeroLcp() {
  const el = document.getElementById('static-hero-lcp')
  if (el) el.style.visibility = 'hidden'
}
