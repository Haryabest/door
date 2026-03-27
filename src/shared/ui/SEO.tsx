import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  image?: string
  canonicalUrl?: string
}

export function SEO({ title, description, image, canonicalUrl }: SEOProps) {
  const siteUrl = 'https://otadoya.ru'
  const defaultImage = '/og-image.jpg'

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title} | От А до Я - Двери и Фурнитура</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="двери, межкомнатные двери, входные двери, фурнитура, Нижний Новгород, купить двери" />
      <meta name="author" content="От А до Я" />
      <link rel="canonical" href={canonicalUrl || siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
      <meta property="og:title" content={`${title} | От А до Я`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || `${siteUrl}${defaultImage}`} />
      <meta property="og:site_name" content="От А до Я - Двери и Фурнитура" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl || siteUrl} />
      <meta name="twitter:title" content={`${title} | От А до Я`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || `${siteUrl}${defaultImage}`} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Язык и кодировка */}
      <meta httpEquiv="Content-Language" content="ru" />
      <meta charSet="utf-8" />
    </Helmet>
  )
}
