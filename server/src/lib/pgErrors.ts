/** Map PostgreSQL error codes to HTTP status and safe client message */

export interface MappedPgError {
  status: number
  code?: string
  message: string
  logDetail?: string
}

export function mapPgError(err: unknown): MappedPgError | null {
  if (!err || typeof err !== 'object') return null
  const e = err as { code?: string; message?: string; detail?: string; constraint?: string }

  const pgCode = e.code
  if (!pgCode || typeof pgCode !== 'string') return null

  const detail = [e.message, e.detail, e.constraint].filter(Boolean).join(' | ')

  switch (pgCode) {
    case '23505':
      return {
        status: 409,
        code: 'duplicate',
        message: 'Запись с такими данными уже существует',
        logDetail: detail,
      }
    case '23503':
      return {
        status: 409,
        code: 'foreign_key',
        message: 'Связанная запись не найдена',
        logDetail: detail,
      }
    case '23502': {
      const src = `${e.detail ?? ''} ${e.message ?? ''}`
      const colMatch = /column\s+"([^"]+)"/i.exec(src)
      const col = colMatch?.[1]
      const priceHint =
        col === 'price' || /\bprice\b/i.test(src)
          ? ' На сервере нужно применить миграции (удаление колонки price): в каталоге server выполните npm run migrate.'
          : ''
      return {
        status: 400,
        code: 'not_null',
        message: `Не заполнено обязательное поле${col ? `: ${col}` : ''}.${priceHint}`.trim(),
        logDetail: detail,
      }
    }
    case '23514':
      return {
        status: 400,
        code: 'check_violation',
        message: 'Данные не проходят проверку',
        logDetail: detail,
      }
    case '22P02':
      return {
        status: 400,
        code: 'invalid_input',
        message: 'Некорректный формат данных',
        logDetail: detail,
      }
    case '42P01':
    case '42703':
      return {
        status: 500,
        code: 'internal',
        message: 'Internal Server Error',
        logDetail: detail,
      }
    default:
      if (pgCode.startsWith('23')) {
        return {
          status: 400,
          code: pgCode,
          message: 'Ошибка целостности данных',
          logDetail: detail,
        }
      }
      return {
        status: 500,
        code: pgCode,
        message: 'Internal Server Error',
        logDetail: detail,
      }
  }
}
