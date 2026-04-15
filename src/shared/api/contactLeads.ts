/** Заявки с формы «Контакты»: POST публично, список — только админ */

import { apiFetch, apiUrl } from './http'

export interface ContactLead {
  id: number
  name: string
  phone: string
  email: string | null
  message: string
  createdAt: string
}

export async function submitContactLead(input: {
  name: string
  phone: string
  email?: string
  message: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(apiUrl('/api/contact-leads'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      email: input.email?.trim() ? input.email.trim() : null,
      message: input.message,
    }),
    credentials: 'omit',
  })
  if (!res.ok) {
    let msg = 'Не удалось отправить заявку'
    try {
      const j = (await res.json()) as { error?: string }
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    return { ok: false, error: msg }
  }
  return { ok: true }
}

export async function getContactLeads(): Promise<ContactLead[]> {
  const res = await apiFetch('/api/contact-leads')
  if (!res.ok) return []
  const data = (await res.json()) as { items: ContactLead[] }
  return data.items ?? []
}
