import { apiFetch } from './http'

export async function adminLogin(password: string): Promise<boolean> {
  const r = await apiFetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return r.ok
}

export async function adminLogout(): Promise<void> {
  await apiFetch('/api/auth/admin/logout', { method: 'POST' })
}

export async function adminMe(): Promise<boolean> {
  const r = await apiFetch('/api/auth/admin/me')
  if (!r.ok) return false
  const j = (await r.json()) as { authenticated?: boolean }
  return j.authenticated === true
}
