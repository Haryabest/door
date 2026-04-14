import { useMemo, memo } from 'react'

interface BackgroundPatternProps {
  opacity?: number
  size?: number
  color?: string
  className?: string
}

const generatePattern = (color: string, size: number) => {
  const s = size
  const rot = (deg: number) => `transform='rotate(${deg})'`

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width='${s * 4}' height='${s * 4}' viewBox='0 0 ${s * 4} ${s * 4}' xmlns='http://www.w3.org/2000/svg'>

      <!-- Дверь 1 -->
      <g ${rot(15)} transform-origin='${s * 0.5} ${s * 0.5}'>
        <rect x='${s * 0.2}' y='${s * 0.15}' width='${s * 0.35}' height='${s * 0.7}' rx='2' fill='none' stroke='${color}' stroke-width='1.8'/>
        <circle cx='${s * 0.48}' cy='${s * 0.5}' r='${s * 0.04}' fill='${color}'/>
      </g>

      <!-- Дверь 2 -->
      <g ${rot(-20)} transform-origin='${s * 2.5} ${s * 0.5}'>
        <rect x='${s * 2.2}' y='${s * 0.1}' width='${s * 0.3}' height='${s * 0.65}' rx='2' fill='none' stroke='${color}' stroke-width='1.6'/>
        <circle cx='${s * 2.43}' cy='${s * 0.45}' r='${s * 0.035}' fill='${color}'/>
      </g>

      <!-- Дверь 3 -->
      <g ${rot(10)} transform-origin='${s * 0.5} ${s * 2.5}'>
        <rect x='${s * 0.25}' y='${s * 2.1}' width='${s * 0.28}' height='${s * 0.6}' rx='2' fill='none' stroke='${color}' stroke-width='1.5'/>
        <circle cx='${s * 0.46}' cy='${s * 2.4}' r='${s * 0.03}' fill='${color}'/>
      </g>

      <!-- Дверь 4 -->
      <g ${rot(-12)} transform-origin='${s * 3.5} ${s * 2.5}'>
        <rect x='${s * 3.2}' y='${s * 2.15}' width='${s * 0.32}' height='${s * 0.6}' rx='2' fill='none' stroke='${color}' stroke-width='1.5'/>
        <circle cx='${s * 3.45}' cy='${s * 2.45}' r='${s * 0.03}' fill='${color}'/>
      </g>

      <!-- Дверная ручка 1 -->
      <g ${rot(25)} transform-origin='${s * 1.5} ${s * 0.5}'>
        <circle cx='${s * 1.5}' cy='${s * 0.5}' r='${s * 0.15}' fill='none' stroke='${color}' stroke-width='1.8'/>
        <circle cx='${s * 1.5}' cy='${s * 0.5}' r='${s * 0.045}' fill='${color}'/>
      </g>

      <!-- Дверная ручка 2 -->
      <g ${rot(-30)} transform-origin='${s * 3.5} ${s * 0.8}'>
        <circle cx='${s * 3.5}' cy='${s * 0.8}' r='${s * 0.13}' fill='none' stroke='${color}' stroke-width='1.6'/>
        <circle cx='${s * 3.5}' cy='${s * 0.8}' r='${s * 0.04}' fill='${color}'/>
      </g>

      <!-- Дверная ручка 3 -->
      <g ${rot(18)} transform-origin='${s * 0.5} ${s * 3.5}'>
        <circle cx='${s * 0.5}' cy='${s * 3.5}' r='${s * 0.12}' fill='none' stroke='${color}' stroke-width='1.5'/>
        <circle cx='${s * 0.5}' cy='${s * 3.5}' r='${s * 0.035}' fill='${color}'/>
      </g>

      <!-- Дверная ручка 4 -->
      <g ${rot(-15)} transform-origin='${s * 2.5} ${s * 3.5}'>
        <circle cx='${s * 2.5}' cy='${s * 3.5}' r='${s * 0.14}' fill='none' stroke='${color}' stroke-width='1.6'/>
        <circle cx='${s * 2.5}' cy='${s * 3.5}' r='${s * 0.04}' fill='${color}'/>
      </g>

      <!-- Арка 1 -->
      <g ${rot(12)} transform-origin='${s * 0.5} ${s * 1.5}'>
        <path d='M ${s * 0.2} ${s * 1.8} L ${s * 0.2} ${s * 1.2} A ${s * 0.18} ${s * 0.18} 0 0 1 ${s * 0.56} ${s * 1.2} L ${s * 0.56} ${s * 1.8}' fill='none' stroke='${color}' stroke-width='1.8'/>
      </g>

      <!-- Арка 2 -->
      <g ${rot(-18)} transform-origin='${s * 3.5} ${s * 1.5}'>
        <path d='M ${s * 3.2} ${s * 1.7} L ${s * 3.2} ${s * 1.25} A ${s * 0.14} ${s * 0.14} 0 0 1 ${s * 3.48} ${s * 1.25} L ${s * 3.48} ${s * 1.7}' fill='none' stroke='${color}' stroke-width='1.5'/>
      </g>

      <!-- Арка 3 -->
      <g ${rot(8)} transform-origin='${s * 1.5} ${s * 2.5}'>
        <path d='M ${s * 1.2} ${s * 2.7} L ${s * 1.2} ${s * 2.25} A ${s * 0.15} ${s * 0.15} 0 0 1 ${s * 1.5} ${s * 2.25} L ${s * 1.5} ${s * 2.7}' fill='none' stroke='${color}' stroke-width='1.5'/>
      </g>

      <!-- Панель 1 -->
      <g ${rot(-10)} transform-origin='${s * 2.5} ${s * 1.5}'>
        <rect x='${s * 2.25}' y='${s * 1.25}' width='${s * 0.5}' height='${s * 0.5}' fill='none' stroke='${color}' stroke-width='1.6'/>
        <rect x='${s * 2.35}' y='${s * 1.35}' width='${s * 0.3}' height='${s * 0.3}' fill='none' stroke='${color}' stroke-width='1'/>
        <line x1='${s * 2.5}' y1='${s * 1.25}' x2='${s * 2.5}' y2='${s * 1.75}' stroke='${color}' stroke-width='0.8'/>
        <line x1='${s * 2.25}' y1='${s * 1.5}' x2='${s * 2.75}' y2='${s * 1.5}' stroke='${color}' stroke-width='0.8'/>
      </g>

      <!-- Панель 2 -->
      <g ${rot(22)} transform-origin='${s * 1.5} ${s * 1.5}'>
        <rect x='${s * 1.25}' y='${s * 1.3}' width='${s * 0.4}' height='${s * 0.4}' fill='none' stroke='${color}' stroke-width='1.4'/>
        <rect x='${s * 1.33}' y='${s * 1.38}' width='${s * 0.24}' height='${s * 0.24}' fill='none' stroke='${color}' stroke-width='0.8'/>
      </g>

      <!-- Геометрический ромб 1 -->
      <g ${rot(35)} transform-origin='${s * 3.5} ${s * 3.5}'>
        <polygon points='${s * 3.5},${s * 3.25} ${s * 3.75},${s * 3.5} ${s * 3.5},${s * 3.75} ${s * 3.25},${s * 3.5}' fill='none' stroke='${color}' stroke-width='1.8'/>
        <polygon points='${s * 3.5},${s * 3.33} ${s * 3.67},${s * 3.5} ${s * 3.5},${s * 3.67} ${s * 3.33},${s * 3.5}' fill='none' stroke='${color}' stroke-width='1.2'/>
        <circle cx='${s * 3.5}' cy='${s * 3.5}' r='${s * 0.05}' fill='${color}'/>
      </g>

      <!-- Геометрический ромб 2 -->
      <g ${rot(-25)} transform-origin='${s * 0.5} ${s * 0.8}'>
        <polygon points='${s * 0.5},${s * 0.6} ${s * 0.7},${s * 0.8} ${s * 0.5},${s * 1.0} ${s * 0.3},${s * 0.8}' fill='none' stroke='${color}' stroke-width='1.5'/>
        <circle cx='${s * 0.5}' cy='${s * 0.8}' r='${s * 0.04}' fill='${color}'/>
      </g>

      <!-- Ключ -->
      <g ${rot(40)} transform-origin='${s * 2.5} ${s * 2.5}'>
        <circle cx='${s * 2.35}' cy='${s * 2.5}' r='${s * 0.08}' fill='none' stroke='${color}' stroke-width='1.5'/>
        <line x1='${s * 2.43}' y1='${s * 2.5}' x2='${s * 2.65}' y2='${s * 2.5}' stroke='${color}' stroke-width='1.5'/>
        <line x1='${s * 2.58}' y1='${s * 2.5}' x2='${s * 2.58}' y2='${s * 2.58}' stroke='${color}' stroke-width='1.2'/>
        <line x1='${s * 2.65}' y1='${s * 2.5}' x2='${s * 2.65}' y2='${s * 2.56}' stroke='${color}' stroke-width='1.2'/>
      </g>

      <!-- Замок -->
      <g ${rot(-8)} transform-origin='${s * 1.5} ${s * 3.5}'>
        <rect x='${s * 1.35}' y='${s * 3.45}' width='${s * 0.3}' height='${s * 0.22}' rx='2' fill='none' stroke='${color}' stroke-width='1.5'/>
        <path d='M ${s * 1.42} ${s * 3.45} L ${s * 1.42} ${s * 3.35} A ${s * 0.08} ${s * 0.08} 0 0 1 ${s * 1.58} ${s * 3.35} L ${s * 1.58} ${s * 3.45}' fill='none' stroke='${color}' stroke-width='1.3'/>
        <circle cx='${s * 1.5}' cy='${s * 3.55}' r='${s * 0.025}' fill='${color}'/>
      </g>

      <!-- Петля -->
      <g ${rot(30)} transform-origin='${s * 3.5} ${s * 1.8}'>
        <ellipse cx='${s * 3.5}' cy='${s * 1.8}' rx='${s * 0.06}' ry='${s * 0.15}' fill='none' stroke='${color}' stroke-width='1.5'/>
        <ellipse cx='${s * 3.5}' cy='${s * 2.1}' rx='${s * 0.06}' ry='${s * 0.15}' fill='none' stroke='${color}' stroke-width='1.5'/>
        <line x1='${s * 3.5}' y1='${s * 1.95}' x2='${s * 3.5}' y2='${s * 1.95}' stroke='${color}' stroke-width='1.5'/>
      </g>

      <!-- Маленькая дверь 5 -->
      <g ${rot(-22)} transform-origin='${s * 1.5} ${s * 0.8}'>
        <rect x='${s * 1.3}' y='${s * 0.6}' width='${s * 0.22}' height='${s * 0.45}' rx='1.5' fill='none' stroke='${color}' stroke-width='1.3'/>
        <circle cx='${s * 1.47}' cy='${s * 0.82}' r='${s * 0.025}' fill='${color}'/>
      </g>

    </svg>
  `)}`
}

export const BackgroundPattern = memo(({
  opacity = 0.1,
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
        backgroundSize: `${size * 4}px ${size * 4}px`,
        opacity,
      }}
      aria-hidden="true"
    />
  )
})

BackgroundPattern.displayName = 'BackgroundPattern'
