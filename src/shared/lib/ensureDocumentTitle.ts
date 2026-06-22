export const DEFAULT_DOCUMENT_TITLE = 'От А до Я — Двери и фурнитура в Нижнем Новгороде'

export function formatPageTitle(pageTitle: string) {
  return `${pageTitle} | От А до Я - Двери и Фурнитура`
}

/** Гарантирует <title> в DOM — Helmet иногда убирает тег при гидрации. */
export function ensureDocumentTitle(title = DEFAULT_DOCUMENT_TITLE) {
  let el = document.querySelector('title')
  if (!el) {
    el = document.createElement('title')
    el.id = 'document-title'
    document.head.prepend(el)
  }
  if (!el.textContent?.trim()) {
    el.textContent = title
  }
}

export function setDocumentTitle(title: string) {
  ensureDocumentTitle(title)
  document.title = title
}
