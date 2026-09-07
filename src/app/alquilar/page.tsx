import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/home/PropertyCard'
import type { Property } from '@/types/property'

export const metadata: Metadata = {
  title: 'Alquilar propiedad en El Salvador',
  description: 'Encuentra casas, apartamentos y locales en alquiler en El Salvador.',
}

export default async function RentPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('properties')
    .select('id, slug, title, description, operation, property_type, status, price, price_negotiable, financing_available, bedrooms, bathrooms, parking_spots, land_area, construction_area, area_unit, department, municipality, zone, cover_image_url, is_featured, view_count, created_at, published_at, contact_name, contact_preference')
    .eq('status', 'publicada')
    .eq('operation', 'alquiler')
    .order('published_at', { ascending: false })
    .limit(48)

  const properties: Property[] = (rows ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? '',
    operation: r.operation as Property['operation'],
    property_type: r.property_type as Property['property_type'],
    status: r.status as Property['status'],
    price: r.price ?? 0,
    price_negotiable: r.price_negotiable,
    financing_available: r.financing_available,
    bedrooms: r.bedrooms ?? undefined,
    bathrooms: r.bathrooms ?? undefined,
    parking_spots: r.parking_spots ?? undefined,
    land_area: r.land_area ?? undefined,
    construction_area: r.construction_area ?? undefined,
    area_unit: (r.area_unit as Property['area_unit']) ?? 'm2',
    department: r.department,
    municipality: r.municipality,
    zone: r.zone ?? undefined,
    cover_image_url: r.cover_image_url ?? undefined,
    is_featured: r.is_featured,
    view_count: r.view_count,
    images: [],
    contact_name: r.contact_name ?? '',
    contact_preference: (r.contact_preference as Property['contact_preference']) ?? 'any',
    created_at: r.created_at,
    published_at: r.published_at ?? undefined,
  }))

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-navy py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Propiedades en alquiler
          </h1>
          <p className="text-slate-300 text-sm">
            {properties.length} propiedades disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-600 mb-2">
              Aún no hay propiedades en alquiler
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Sé el primero en publicar una propiedad en ConexHome SV.
            </p>
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
            >
              Publicar gratis
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
