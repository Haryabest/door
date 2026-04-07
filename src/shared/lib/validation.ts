export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return ''
  } catch {
    return ''
  }
}

export const formatPhoneInput = (input: string): string => {
  const digits = input.replace(/\D/g, '')
  const normalized = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits.startsWith('7')
      ? digits
      : `7${digits}`
  const trimmed = normalized.slice(0, 11)

  const country = trimmed[0] || '7'
  const part1 = trimmed.slice(1, 4)
  const part2 = trimmed.slice(4, 7)
  const part3 = trimmed.slice(7, 9)
  const part4 = trimmed.slice(9, 11)

  let formatted = `+${country}`

  if (part1) {
    formatted += ` (${part1}`
  }

  if (part1.length === 3) {
    formatted += ')'
  }

  if (part2) {
    formatted += ` ${part2}`
  }

  if (part3) {
    formatted += `-${part3}`
  }

  if (part4) {
    formatted += `-${part4}`
  }

  return formatted
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\+\(\)\-]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max
}
