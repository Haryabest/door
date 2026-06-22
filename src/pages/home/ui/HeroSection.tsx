import { useEffect, useState } from 'react'
import type { HeroSection as HeroSectionType } from '@/shared/api/home'
import { defaultHeaderData, getHeader } from '@/shared/api/header'
import { telHrefFromPhoneText } from '@/shared/lib/telHref'
import { HERO_SLIDE_ASSET_URLS } from '../heroSlideshowUrls'
import {
  hasStaticHeroLcp,
  removeStaticHeroLcp,
  stripStaticHeroCopy,
} from '@/shared/lib/hideStaticHeroLcp'

interface HeroSectionProps {
  hero: HeroSectionType
}

const SLIDE_FADE_S = 1
const SLIDE_HOLD_FULL_MS = 8000
const SLIDE_CYCLE_MS = SLIDE_HOLD_FULL_MS + SLIDE_FADE_S * 1000

function preloadSlideLater(urls: readonly string[], startIndex: number) {
  if (startIndex >= urls.length) return
  const run = () => {
    for (let i = startIndex; i < urls.length; i += 1) {
      const img = new Image()
      img.src = urls[i]
    }
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 4000 })
  } else {
    window.setTimeout(run, 1500)
  }
}

function shouldUseReactSlideImage(index: number, staticHeroRetired: boolean) {
  return staticHeroRetired || index !== 0
}

export function HeroSection({ hero }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [staticHeroRetired, setStaticHeroRetired] = useState(
    () => typeof document === 'undefined' || !hasStaticHeroLcp()
  )
  const [phoneHref, setPhoneHref] = useState(() => telHrefFromPhoneText(defaultHeaderData.phoneText))

  const slideshowImages = HERO_SLIDE_ASSET_URLS

  useEffect(() => {
    if (!hasStaticHeroLcp()) {
      setStaticHeroRetired(true)
      return
    }

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        stripStaticHeroCopy()
        setStaticHeroRetired(true)
        requestAnimationFrame(() => removeStaticHeroLcp())
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  useEffect(() => {
    setCurrentSlide(0)
    setStaticHeroRetired(!hasStaticHeroLcp())
  }, [slideshowImages])

  useEffect(() => {
    if (slideshowImages.length <= 1) return
    preloadSlideLater(slideshowImages, 1)
  }, [slideshowImages])

  useEffect(() => {
    if (slideshowImages.length <= 1) return
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
    }, SLIDE_CYCLE_MS)

    return () => window.clearInterval(timer)
  }, [slideshowImages.length])

  useEffect(() => {
    let isMounted = true

    getHeader().then((data) => {
      if (!isMounted || !data) return
      setPhoneHref(telHrefFromPhoneText(data.phoneText))
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="relative isolate z-10 min-h-[calc(100svh-var(--site-header-h))] w-full overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        {slideshowImages.map((src, index) => {
          if (index !== currentSlide) return null
          if (!shouldUseReactSlideImage(index, staticHeroRetired)) return null

          return (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              role="presentation"
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
              className={`pointer-events-none absolute inset-0 h-full w-full object-cover${
                index > 0 ? ' hero-slide-img hero-slide-img--enter' : ''
              }`}
              style={{ zIndex: 2 }}
            />
          )
        })}
      </div>

      <div className="absolute inset-0 z-1 bg-black/50" />

      <div className="relative z-10 flex h-full min-h-[inherit] flex-col items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            {hero.title}
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-white/90">
            {hero.subtitle}
          </p>

          <p className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-white/80">
            {hero.city}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalog"
              className="tap-click inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-base sm:text-lg"
            >
              Каталог продукции
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
            <a
              href={phoneHref}
              className="tap-click inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer text-base sm:text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Позвонить
            </a>
          </div>
        </div>
      </div>

      <div className="hero-bounce pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}
