interface Props {
  title: string
  description: string | null
  price: number | null
  operation: string
  department: string
  municipality: string
  slug: string
  imageUrl: string | null
}

export default function PropertyJsonLd({
  title,
  description,
  price,
  operation,
  department,
  municipality,
  slug,
  imageUrl,
}: Props) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexhomesv.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description ?? undefined,
    url: `${base}/propiedades/${slug}`,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: municipality,
      addressRegion: department,
      addressCountry: 'SV',
    },
    ...(price
      ? {
          price: String(price),
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: String(price),
            priceCurrency: 'USD',
            ...(operation === 'alquiler' ? { unitCode: 'MON', referenceQuantity: { '@type': 'QuantitativeValue', value: 1 } } : {}),
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
