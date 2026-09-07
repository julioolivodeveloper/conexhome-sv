import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/home/PropertyCard'
import type { Property } from '@/types/property'

export const metadata: Metadata = {
  title: 'Mis favoritos — ConexHome SV',
}

export default async function FavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  const { data: rows } = await supabase
    .from('favorites')
    .select(`
      property_id,
      properties(
        id, slug, title, description, operation, property_type, status,
        price, price_negotiable, financing_available, bedrooms, bathrooms,
        parking_spots, land_area, construction_area, area_unit,
        department, municipality, zone, cover_image_url, is_featured,
        view_count, created_at, published_at, contact_name, contact_preference
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  type RawProperty = {
    id: string; slug: string; title: string; description: string | null;
    operation: string; property_type: string; status: string; price: number | null;
    price_negotiable: boolean; financing_available: boolean; bedrooms: number | null;
    bathrooms: number | null; parking_spots: number | null; land_area: number | null;
    construction_area: number | null; area_unit: string | null; department: string;
    municipality: string; zone: string | null; cover_image_url: string | null;
    is_featured: boolean; view_count: number; created_at: string;
    published_at: string | null; contact_name: string | null; contact_preference: string | null;
  }

  const toProperty = (r: RawProperty): Property => ({
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
  })

  const properties: Property[] = (rows ?? [])
    .filter((row) => row.properties !== null)
    .map((row) => toProperty(row.properties as RawProperty))

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-navy py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis favoritos</h1>
          </div>
          <p className="text-slate-300 text-sm mt-1">
            {properties.length} {properties.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} isFavorited={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-300" />
            </div>
            <h2 className="text-lg font-semibold text-slate-600 mb-2">
              Todavía no tienes favoritos
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              Cuando encuentres una propiedad que te interese, toca el corazón para guardarla aquí.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/comprar"
                className="px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
              >
                Ver propiedades en venta
              </Link>
              <Link
                href="/alquilar"
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                En alquiler
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
