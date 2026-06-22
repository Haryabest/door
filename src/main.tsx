import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { App } from './App.tsx'
import { installRuntimeGuards } from '@/shared/lib/runtimeGuards'

installRuntimeGuards()

const rootEl = document.getElementById('root')
if (rootEl) {
  const placeholder = document.getElementById('boot-placeholder')
  if (placeholder) placeholder.remove()
}

createRoot(rootEl!).render(
  <HelmetProvider defaultTitle="От А до Я — Двери и фурнитура в Нижнем Новгороде">
    <App />
  </HelmetProvider>,
)
