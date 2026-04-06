import { useState } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export function Image({ fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EНет изображения%3C/text%3E%3C/svg%3E', onError, ...props }: ImageProps) {
  const [src, setSrc] = useState(props.src)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setSrc(fallback)
    if (onError) onError(e)
  }

  return <img {...props} src={src} onError={handleError} />
}
