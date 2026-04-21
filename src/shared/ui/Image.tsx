import { useState, useRef, useEffect } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  maxRetries?: number
  retryDelay?: number
}

export function Image({
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EНет изображения%3C/text%3E%3C/svg%3E',
  maxRetries = 3,
  retryDelay = 1000,
  onError,
  ...props
}: ImageProps) {
  const [src, setSrc] = useState(props.src ?? '')
  const [isRetrying, setIsRetrying] = useState(false)
  const retryCountRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const newSrc = props.src ?? ''
    if (newSrc !== src && !isRetrying) {
      retryCountRef.current = 0
      setSrc(newSrc)
    }
  }, [props.src, src, isRetrying])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const currentSrc = src || props.src || ''
    if (retryCountRef.current < maxRetries && currentSrc) {
      retryCountRef.current++
      setIsRetrying(true)
      
      timeoutRef.current = setTimeout(() => {
        const timestamp = Date.now()
        const newSrcWithTs = `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}_t=${timestamp}`
        setSrc(newSrcWithTs)
        setIsRetrying(false)
      }, retryDelay * retryCountRef.current)
      
      return
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setSrc(fallback)
    if (onError) onError(e)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return <img {...props} src={src} onError={handleError} />
}