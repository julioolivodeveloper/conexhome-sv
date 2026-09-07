import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { DEPARTMENTS } from '@/lib/constants/departments'
import { PROPERTY_TYPES } from '@/lib/constants/property-types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexhomesv.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: properties } = await supabase
    .from('properties')
    .select('slug, published_at')
    .eq('status', 'publicada')
    .order('published_at', { ascending: false })
    .limit(5000)

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/comprar`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/alquilar`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/mapa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const departmentPages: MetadataRoute.Sitemap = DEPARTMENTS.map((d) => ({
    url: `${BASE}/departamento/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const typePages: MetadataRoute.Sitemap = PROPERTY_TYPES.filter((t) => t.slug !== 'otros').map((t) => ({
    url: `${BASE}/tipo/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const propertyPages: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `${BASE}/propiedades/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...departmentPages, ...typePages, ...propertyPages]
}
