/** Ответ об ошибке мутации из админки (401, rate limit и т.д.) */

export interface AdminApiFailure {
  status: number
  code?: string
  error?: string
}

export async function parseAdminApiFailure(res: Response): Promise<AdminApiFailure> {
  const status = res.status
  try {
    const j = (await res.json()) as { code?: string; error?: string }
    return {
      status,
      code: typeof j.code === 'string' ? j.code : undefined,
      error: typeof j.error === 'string' ? j.error : undefined,
    }
  } catch {
    return { status }
  }
}

const SESSION_OR_TOKEN_HINT =
  'Ошибка сохранения. Выйдите и войдите снова (сессия). Для API-скриптов нужен Bearer (ADMIN_API_TOKEN) или VITE_ADMIN_API_TOKEN при сборке.'

export type FormatAdminFailureOptions = {
  /** Фраза для финального предложения, напр. «Сохранение каталога», «Создание товара» */
  action: string
}

export function formatAdminSaveFailureMessage(
  f: AdminApiFailure,
  options: FormatAdminFailureOptions
): string {
  const { action } = options
  const detail = f.error ? `\n\nОтвет сервера: ${f.error}` : ''
  if (f.status === 0) {
    return `Не удалось связаться с API (сеть, CORS или блокировка). Проверьте VITE_API_URL и консоль браузера.${detail}`
  }
  if (f.status === 401 || f.code === 'unauthorized') {
    return (
      `${SESSION_OR_TOKEN_HINT}\n\n` +
      'Если вход уже выполняли: браузер часто не прикрепляет cookie к API на другом домене/порту. На сервере в CORS_ORIGIN укажите точный origin сайта (как в адресной строке, https и www без ошибок). Если фронт и API на разных доменах — в .env сервера: ADMIN_COOKIE_SAMESITE=none, ADMIN_COOKIE_SECURE=true, сайт только по HTTPS.'
    )
  }
  if (f.code === 'rate_limit' || f.status === 429) {
    return 'Слишком много запросов к API. Подождите и попробуйте снова.'
  }
  if (f.status >= 500) {
    return `Ошибка сервера (${f.status}). Попробуйте позже.${detail}`
  }
  return `${action} не удалось (HTTP ${f.status}${f.code ? `, ${f.code}` : ''}).${detail}`
}
