import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import lcpHeroUrl from './src/assets/hero-slides/door1.avif?url'

function htmlLcpHints(): Plugin {
  return {
    name: 'html-lcp-hints',
    transformIndexHtml(html) {
      const preload = `<link rel="preload" href="${lcpHeroUrl}" as="image" type="image/avif" fetchpriority="high" />`
      if (html.includes('door1') && html.includes('rel="preload"')) return html
      return html.replace('</head>', `    ${preload}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), htmlLcpHints()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
