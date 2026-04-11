import { useMemo, memo } from 'react'

interface BackgroundPatternProps {
  opacity?: number
  size?: number
  color?: string
  className?: string
}

const generatePattern = (color: string, size: number) => {
  const s = size

  // Отступы внутри каждой ячейки (15% с каждой стороны)
  const pad = 0.15
  const cellSize = 1 - pad * 2

  // Позиции центров ячеек сетки 3×3
  const cell = (col: number, row: number) => ({
    x: col + pad,
    y: row + pad,
    w: cellSize,
    h: cellSize,
  })

  const c = (col: number, row: number) => cell(col, row)

  // Размеры элементов относительно ячейки
  const doorW = 0.45 * cellSize
  const doorH = 0.7 * cellSize

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width='${s * 3}' height='${s * 3}' viewBox='0 0 ${s * 3} ${s * 3}' xmlns='http://www.w3.org/2000/svg'>
      <!-- Ячейка (0,0): Дверь -->
      <rect x='${c(0, 0).x * s + doorW * s * 0.15}' y='${c(0, 0).y * s}' width='${doorW * s}' height='${doorH * s}' rx='2' fill='none' stroke='${color}' stroke-width='1.2'/>
      <circle cx='${c(0, 0).x * s + doorW * s * 0.85}' cy='${c(0, 0).y * s + doorH * s * 0.5}' r='${s * 0.03}' fill='${color}'/>

      <!-- Ячейка (1,0): Дверная ручка -->
      <circle cx='${c(1, 0).x * s + c(0, 0).w * s * 0.5}' cy='${c(1, 0).y * s + c(0, 0).h * s * 0.5}' r='${s * 0.12}' fill='none' stroke='${color}' stroke-width='1.2'/>
      <circle cx='${c(1, 0).x * s + c(0, 0).w * s * 0.5}' cy='${c(1, 0).y * s + c(0, 0).h * s * 0.5}' r='${s * 0.035}' fill='${color}'/>

      <!-- Ячейка (2,0): Маленькая дверь -->
      <rect x='${c(2, 0).x * s + doorW * s * 0.2}' y='${c(2, 0).y * s + doorH * s * 0.05}' width='${doorW * s * 0.8}' height='${doorH * s * 0.7}' rx='2' fill='none' stroke='${color}' stroke-width='1'/>
      <circle cx='${c(2, 0).x * s + doorW * s * 0.85}' cy='${c(2, 0).y * s + doorH * s * 0.4}' r='${s * 0.025}' fill='${color}'/>

      <!-- Ячейка (0,1): Арка -->
      <path d='M ${c(0, 1).x * s + s * 0.05} ${c(0, 1).y * s + c(0, 1).h * s} L ${c(0, 1).x * s + s * 0.05} ${c(0, 1).y * s + s * 0.15} A ${s * 0.18} ${s * 0.18} 0 0 1 ${c(0, 1).x * s + s * 0.41} ${c(0, 1).y * s + s * 0.15} L ${c(0, 1).x * s + s * 0.41} ${c(0, 1).y * s + c(0, 1).h * s}' fill='none' stroke='${color}' stroke-width='1.2'/>

      <!-- Ячейка (1,1): Панель -->
      <rect x='${c(1, 1).x * s + s * 0.12}' y='${c(1, 1).y * s + s * 0.12}' width='${s * 0.46}' height='${s * 0.46}' fill='none' stroke='${color}' stroke-width='1'/>
      <rect x='${c(1, 1).x * s + s * 0.22}' y='${c(1, 1).y * s + s * 0.22}' width='${s * 0.26}' height='${s * 0.26}' fill='none' stroke='${color}' stroke-width='0.7'/>
      <line x1='${c(1, 1).x * s + s * 0.35}' y1='${c(1, 1).y * s + s * 0.22}' x2='${c(1, 1).x * s + s * 0.35}' y2='${c(1, 1).y * s + s * 0.48}' stroke='${color}' stroke-width='0.5'/>
      <line x1='${c(1, 1).x * s + s * 0.22}' y1='${c(1, 1).y * s + s * 0.35}' x2='${c(1, 1).x * s + s * 0.48}' y2='${c(1, 1).y * s + s * 0.35}' stroke='${color}' stroke-width='0.5'/>

      <!-- Ячейка (2,1): Вторая арка (маленькая) -->
      <path d='M ${c(2, 1).x * s + s * 0.1} ${c(2, 1).y * s + s * 0.35} L ${c(2, 1).x * s + s * 0.1} ${c(2, 1).y * s + s * 0.12} A ${s * 0.1} ${s * 0.1} 0 0 1 ${c(2, 1).x * s + s * 0.3} ${c(2, 1).y * s + s * 0.12} L ${c(2, 1).x * s + s * 0.3} ${c(2, 1).y * s + s * 0.35}' fill='none' stroke='${color}' stroke-width='1'/>

      <!-- Ячейка (0,2): Геометрический ромб -->
      <polygon points='${c(0, 2).x * s + s * 0.35},${c(0, 2).y * s + s * 0.08} ${c(0, 2).x * s + s * 0.55},${c(0, 2).y * s + s * 0.35} ${c(0, 2).x * s + s * 0.35},${c(0, 2).y * s + s * 0.62} ${c(0, 2).x * s + s * 0.15},${c(0, 2).y * s + s * 0.35}' fill='none' stroke='${color}' stroke-width='1'/>
      <polygon points='${c(0, 2).x * s + s * 0.35},${c(0, 2).y * s + s * 0.16} ${c(0, 2).x * s + s * 0.47},${c(0, 2).y * s + s * 0.35} ${c(0, 2).x * s + s * 0.35},${c(0, 2).y * s + s * 0.54} ${c(0, 2).x * s + s * 0.23},${c(0, 2).y * s + s * 0.35}' fill='none' stroke='${color}' stroke-width='0.7'/>
      <circle cx='${c(0, 2).x * s + s * 0.35}' cy='${c(0, 2).y * s + s * 0.35}' r='${s * 0.04}' fill='${color}'/>

      <!-- Ячейка (1,2): Круглая ручка -->
      <circle cx='${c(1, 2).x * s + c(0, 0).w * s * 0.5}' cy='${c(1, 2).y * s + c(0, 0).h * s * 0.5}' r='${s * 0.08}' fill='none' stroke='${color}' stroke-width='1'/>
      <circle cx='${c(1, 2).x * s + c(0, 0).w * s * 0.5}' cy='${c(1, 2).y * s + c(0, 0).h * s * 0.5}' r='${s * 0.025}' fill='${color}'/>

      <!-- Ячейка (2,2): Третья дверь (маленькая) -->
      <rect x='${c(2, 2).x * s + s * 0.15}' y='${c(2, 2).y * s + s * 0.08}' width='${s * 0.3}' height='${s * 0.55}' rx='2' fill='none' stroke='${color}' stroke-width='1'/>
      <circle cx='${c(2, 2).x * s + s * 0.38}' cy='${c(2, 2).y * s + s * 0.35}' r='${s * 0.025}' fill='${color}'/>
    </svg>
  `)}`
}

export const BackgroundPattern = memo(({
  opacity = 0.03,
  size = 120,
  color = '#0f3c65',
  className = '',
}: BackgroundPatternProps) => {
  const patternUrl = useMemo(() => {
    return `url("${generatePattern(color, size)}")`
  }, [opacity, size, color])

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: patternUrl,
        backgroundSize: `${size * 3}px ${size * 3}px`,
        opacity,
      }}
      aria-hidden="true"
    />
  )
})

BackgroundPattern.displayName = 'BackgroundPattern'
