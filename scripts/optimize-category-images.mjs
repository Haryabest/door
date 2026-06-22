/**
 * Сжимает картинки категорий под реальный размер карточки (~428×285 @2x).
 */
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'categories')
const WIDTH = 856

const SOURCES = [
  { out: 'interior.avif', src: 'src/assets/hero-slides/door2.avif' },
  { out: 'entrance.avif', src: 'src/assets/hero-slides/door3.avif' },
  { out: 'hardware.avif', src: 'src/assets/hero-slides/door5.avif' },
]

mkdirSync(OUT, { recursive: true })

for (const { out, src } of SOURCES) {
  const input = path.join(ROOT, src)
  if (!existsSync(input)) {
    console.warn('[optimize-category-images] skip missing', src)
    continue
  }
  const dest = path.join(OUT, out)
  await sharp(input)
    .resize(WIDTH, null, { withoutEnlargement: true })
    .avif({ quality: 52, effort: 4 })
    .toFile(dest)
  const { size } = await import('fs').then((fs) => fs.promises.stat(dest))
  console.log('[optimize-category-images]', out, `${Math.round(size / 1024)} KiB`)
}
