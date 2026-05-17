import type { Request } from 'express'

/**
 * Одноразовый POST при ответах 5xx (только NODE_ENV=production).
 * Slack Incoming Webhook, n8n, Discord и т.п. — задаётся ERROR_ALERT_WEBHOOK_URL на сервере.
 */
export function notifyErrorAlertWebhook(req: Request, status: number, summary: string): void {
  const url = process.env.ERROR_ALERT_WEBHOOK_URL?.trim()
  if (!url || process.env.NODE_ENV !== 'production') return

  const payload = {
    source: 'doors-api',
    status,
    method: req.method,
    path: req.originalUrl ?? req.url ?? '',
    requestId: req.id,
    summary: summary.slice(0, 900),
    at: new Date().toISOString(),
  }

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 4500)

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: ac.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timer))
}
