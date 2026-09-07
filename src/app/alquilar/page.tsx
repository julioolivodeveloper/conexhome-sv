import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/home/PropertyCard'
import SearchFiltersPanel from '@/components/search/SearchFiltersPanel'
import Pagination from '@/components/search/Pagination'
import MapViewToggle from '@/components/search/MapViewToggle'
import type { Property } from '@/types/property'
import type { MapProperty } from '@/components/map/PropertyMap'
import { parseSearchFilters, buildSearchQuery, PAGE_SIZE } from '@/lib/utils/search'

export const metadata: Metadata = {
  title: 'Propiedades en alquiler en El Salvador',
  description: 'Encuentra casas, apartamentos y locales en alquiler en El Salvador.',
}

const COLUMNS = 'id, slug, title, description, operation, property_type, status, price, price_negotiable, financing_available, bedrooms, bathrooms, parking_spots, land_area, construction_area, area_unit, department, municipality, zone, cover_image_url, is_featured, view_count, created_at, published_at, contact_name, contact_preference, latitude, longitude'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function RentPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = parseSearchFilters(params)
  const page = Math.max(1, parseInt(filters.pagina ?? '1'))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let countQuery = supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'publicada')
    .eq('operation', 'alquiler')

  countQuery = buildSearchQuery(countQuery, filters)
  const { count: total } = await countQuery

  let dataQuery = supabase
    .from('properties')
    .select(COLUMNS)
    .eq('status', 'publicada')
    .eq('operation', 'alquiler')
    .order('published_at', { ascending: false })
    .range(from, to)

  dataQuery = buildSearchQuery(dataQuery, filters)
  const { data: rows } = await dataQuery

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

  const mapProperties: MapProperty[] = (rows ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    price: r.price,
    operation: r.operation,
    latitude: r.latitude,
    longitude: r.longitude,
    department: r.department,
    municipality: r.municipality,
    cover_image_url: r.cover_image_url,
  }))

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-navy py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Propiedades en alquiler
          </h1>
          <div className="flex items-center gap-4 text-slate-300 text-sm">
            <span>El Salvador</span>
            <span>·</span>
            <Link href="/comprar" className="hover:text-white transition-colors underline underline-offset-2">
              Ver en venta
            </Link>
            <span>·</span>
            <Link href="/mapa" className="hover:text-white transition-colors underline underline-offset-2">
              Ver mapa
            </Link>
          </div>
        </div>
      </div>

      <SearchFiltersPanel lockedOperation="alquiler" totalResults={total ?? 0} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {properties.length > 0 ? (
          <MapViewToggle properties={mapProperties}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <Pagination total={total ?? 0} currentPage={page} />
          </MapViewToggle>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-lg font-semibold text-slate-600 mb-2">Sin resultados</h2>
            <p className="text-slate-400 text-sm mb-6">
              No encontramos propiedades con esos filtros. Prueba con criterios más amplios.
            </p>
            <Link
              href="/alquilar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
            >
              Ver todas en alquiler
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
