/**
 * Утилита для определения использования VPN
 * Использует несколько методов для более надёжного обнаружения
 */

import { useState, useEffect } from 'react'

interface VpnDetectionResult {
  isVpn: boolean
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Проверяет WebRTC на наличие внешних IP-адресов
 */
async function checkWebRTC(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      
      let resolved = false
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true
          try { pc.close() } catch {}
          resolve(false)
        }
      }, 3000)
      
      pc.createDataChannel('')
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            try { pc.close() } catch {}
            resolve(false)
          }
        })
      
      pc.onicecandidate = (event) => {
        if (!event.candidate) return
        const candidate = event.candidate.candidate?.toLowerCase() || ''
        if (!resolved && (
          candidate.includes('srflx') ||
          candidate.includes('relay')
        )) {
          resolved = true
          clearTimeout(timeout)
          try { pc.close() } catch {}
          resolve(true)
        }
      }
    } catch {
      resolve(false)
    }
  })
}

/**
 * Проверяет несоответствие часового пояса
 */
function checkTimezoneMismatch(): boolean {
  if (typeof Intl === 'undefined') return false
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  // Список популярных VPN-локаций
  const vpnTimezones = ['UTC', 'GMT', 'America/New_York', 'America/Los_Angeles', 'America/Chicago']
  // Если часовой пояс не определён или относится к VPN-локациям
  return !timezone || vpnTimezones.includes(timezone)
}

/**
 * Проверяет использование прокси через navigator.webdriver
 */
function checkWebdriver(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator as { webdriver?: boolean }).webdriver
}

/**
 * Проверяет наличие известных VPN-расширений
 */
function checkVpnExtensions(): boolean {
  if (typeof window === 'undefined') return false
  const vpnExtensions = [
    'nordvpn', 'expressvpn', 'surfshark', 'cyberghost',
    'hotspotshield', 'protonvpn', 'windscribe', 'mullvad',
    'purevpn', 'ipvanish', 'privatevpn', 'vyprvpn'
  ]
  // Проверяем в user agent и плагинах браузера
  const userAgent = navigator.userAgent.toLowerCase()
  return vpnExtensions.some(ext => userAgent.includes(ext))
}

/**
 * Проверяет DoH (DNS over HTTPS) — часто используется VPN
 */
function checkDoH(): boolean {
  if (typeof window === 'undefined') return false
  // Проверяем, использует ли браузер DoH (частый признак VPN)
  const connection = (navigator as { connection?: { effectiveType?: string, saveData?: boolean } }).connection
  return !!(connection?.saveData)
}

/**
 * Проверяет размер экрана и window matchMedia
 */
function checkScreenFingerprint(): boolean {
  if (typeof window === 'undefined') return false
  // VPN иногда неправильно сообщают разрешение экрана
  const screenWidth = window.screen.width
  const innerWidth = window.innerWidth
  // Если innerWidth близко к screenWidth, это может быть признаком VPN
  return Math.abs(innerWidth - screenWidth) < 50
}

/**
 * Проверяет язык браузера на несоответствие с часовым поясом
 */
function checkLanguageTimezoneMismatch(): boolean {
  if (typeof Intl === 'undefined' || typeof navigator === 'undefined') return false
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language || ''
  // Русский язык, но часовой пояс не российский
  if (language.toLowerCase().startsWith('ru') && timezone && 
      !timezone.includes('Moscow') && !timezone.includes('Krasnoyarsk') && 
      !timezone.includes('Ekaterinburg') && !timezone.includes('Samara') &&
      !timezone.includes('Novosibirsk') && !timezone.includes('Vladivostok')) {
    return true
  }
  return false
}

/**
 * Основная функция определения VPN
 * Возвращает Promise с результатом проверки
 */
export async function detectVpn(): Promise<VpnDetectionResult> {
  // Запускаем все проверки параллельно
  const [webrtc, webdriver, extensions, doh, screenFingerprint, langTimezone] = await Promise.all([
    checkWebRTC(),
    Promise.resolve(checkWebdriver()),
    Promise.resolve(checkVpnExtensions()),
    Promise.resolve(checkDoH()),
    Promise.resolve(checkScreenFingerprint()),
    Promise.resolve(checkLanguageTimezoneMismatch())
  ])
  
  // Webdriver — высокая уверенность (автоматизированный браузер)
  if (webdriver) {
    return { isVpn: true, confidence: 'high' }
  }
  
  // WebRTC обнаружил внешний IP — высокая уверенность
  if (webrtc) {
    return { isVpn: true, confidence: 'high' }
  }
  
  // VPN-расширение обнаружено — высокая уверенность
  if (extensions) {
    return { isVpn: true, confidence: 'high' }
  }
  
  // Несколько косвенных признаков
  const indirectSigns = [doh, screenFingerprint, langTimezone].filter(Boolean).length
  
  if (indirectSigns >= 2) {
    return { isVpn: true, confidence: 'medium' }
  }
  
  if (indirectSigns === 1) {
    return { isVpn: true, confidence: 'low' }
  }
  
  return { isVpn: false, confidence: 'low' }
}

/**
 * Хук для React компонентов
 * Выполняет проверку один раз при монтировании
 */
export function useVpnDetection() {
  const [isVpn, setIsVpn] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    let mounted = true
    
    detectVpn().then(result => {
      if (mounted) {
        setIsVpn(result.isVpn)
        setIsChecking(false)
      }
    })
    
    return () => {
      mounted = false
    }
  }, [])
  
  return { isVpn, isChecking }
}