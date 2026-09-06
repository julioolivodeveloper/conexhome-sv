import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { recentProperties } from '@/data/mock-properties'
import PropertyCard from '@/components/home/PropertyCard'

export const metadata: Metadata = {
  title: 'Comprar propiedad en El Salvador',
  description:
    'Encuentra casas, apartamentos, terrenos y más propiedades en venta en El Salvador.',
}

export default function BuyPage() {
  const ventas = recentProperties.filter((p) => p.operation === 'venta')

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Propiedades en venta
          </h1>
          <p className="text-slate-300 text-sm">
            {ventas.length} propiedades disponibles · Filtros y mapa disponibles en Etapa 4
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {ventas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ventas.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No hay propiedades disponibles.</p>
          </div>
        )}
      </div>
    </main>
  )
}
