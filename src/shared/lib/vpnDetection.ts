/**
 * Утилита для определения использования VPN
 * Использует WebRTC для более надежного обнаружения
 */

import { useState, useEffect } from 'react'

interface VpnDetectionResult {
  isVpn: boolean
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Проверяет, может ли WebRTC обнаружить VPN/прокси
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
          // Таймаут может означать, что STUN сервер недоступен (VPN блокирует)
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
        // Проверяем наличие внешних IP-адресов (не локальных)
        if (!resolved && (
          candidate.includes('srflx') ||  // STUN reflected address (внешний IP)
          candidate.includes('relay')      // TURN relayed address (через прокси)
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
 * Проверяет использование прокси через navigator.webdriver
 */
function checkWebdriver(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator as { webdriver?: boolean }).webdriver
}

/**
 * Основная функция определения VPN
 * Возвращает Promise с результатом проверки
 */
export async function detectVpn(): Promise<VpnDetectionResult> {
  const [webrtc, webdriver] = await Promise.all([
    checkWebRTC(),
    Promise.resolve(checkWebdriver())
  ])
  
  // VPN вероятен если WebRTC обнаружил внешний IP или запущен автоматизированный браузер
  const isVpn = webrtc || webdriver
  
  let confidence: 'high' | 'medium' | 'low' = 'low'
  if (isVpn) {
    confidence = webrtc ? 'high' : 'medium'
  }
  
  return { isVpn, confidence }
}

/**
 * Хук для React компонентов
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