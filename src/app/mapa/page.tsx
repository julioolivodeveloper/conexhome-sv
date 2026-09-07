import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { MapProperty } from '@/components/map/PropertyMap'
import MapPageClient from '@/components/map/MapPageClient'

export const metadata: Metadata = {
  title: 'Mapa de propiedades en El Salvador',
  description: 'Explora propiedades en venta y alquiler en El Salvador en el mapa.',
}

export default async function MapPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('properties')
    .select('id, slug, title, price, operation, latitude, longitude, department, municipality, cover_image_url')
    .eq('status', 'publicada')
    .order('published_at', { ascending: false })
    .limit(200)

  const properties: MapProperty[] = (rows ?? []).map((r) => ({
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

  const ventaCount = properties.filter((p) => p.operation === 'venta').length
  const alquilerCount = properties.filter((p) => p.operation === 'alquiler').length

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Mapa de propiedades</h1>
            <p className="text-slate-300 text-sm mt-0.5">
              {properties.length} propiedades · {ventaCount} en venta · {alquilerCount} en alquiler
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/comprar"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Ver lista venta
            </Link>
            <Link
              href="/alquilar"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Ver lista alquiler
            </Link>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent inline-block" />
            En venta
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-success inline-block" />
            En alquiler
          </div>
          <span>· Haz clic en un marcador para ver los detalles</span>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {properties.length > 0 ? (
          <MapPageClient properties={properties} />
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🗺️</p>
            <h2 className="text-lg font-semibold text-slate-600 mb-2">El mapa está vacío</h2>
            <p className="text-slate-400 text-sm mb-6">Aún no hay propiedades publicadas. ¡Sé el primero!</p>
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
            >
              Publicar propiedad gratis
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
