import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  image?: string
  canonicalUrl?: string
  keywords?: string
  noIndex?: boolean
  type?: 'website' | 'product' | 'article'
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>
}

export function SEO({
  title,
  description,
  image,
  canonicalUrl,
  keywords,
  noIndex = false,
  type = 'website',
  structuredData,
}: SEOProps) {
  const siteUrl = 'https://otadoya.ru'
  const defaultImage = `${siteUrl}/logo.png`
  const normalizedCanonical = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${siteUrl}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`
    : siteUrl
  const normalizedImage = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
    : defaultImage
  const robotsContent = noIndex
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  const resolvedKeywords = keywords || 'двери, межкомнатные двери, входные двери, фурнитура, двери Нижний Новгород, купить двери, установка дверей'
  const baseStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'От А до Я',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      telephone: '+7 (960) 166-30-30',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Нижний Новгород',
        streetAddress: 'СЦ Бекетов, ул. Бекетова, д. 13а',
        addressCountry: 'RU',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'От А до Я',
      url: siteUrl,
      inLanguage: 'ru-RU',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/catalog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]
  const jsonLd = structuredData
    ? [...baseStructuredData, ...(Array.isArray(structuredData) ? structuredData : [structuredData])]
    : baseStructuredData

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title} | От А до Я - Двери и Фурнитура</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="author" content="От А до Я" />
      <meta name="theme-color" content="#0f3c65" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={normalizedCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:url" content={normalizedCanonical} />
      <meta property="og:title" content={`${title} | От А до Я`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={normalizedImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="От А до Я - Двери и Фурнитура" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={normalizedCanonical} />
      <meta name="twitter:title" content={`${title} | От А до Я`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={normalizedImage} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Язык и кодировка */}
      <meta httpEquiv="Content-Language" content="ru" />
      <meta charSet="utf-8" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
