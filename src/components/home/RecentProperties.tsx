import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { Property } from '@/types/property'
import PropertyCard from './PropertyCard'

interface RecentPropertiesProps {
  properties: Property[]
}

export default function RecentProperties({ properties }: RecentPropertiesProps) {
  if (!properties.length) return null

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                Recientes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
              Publicadas recientemente
            </h2>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Las últimas propiedades publicadas en ConexHome SV
            </p>
          </div>
          <Link
            href="/propiedades"
            className="shrink-0 flex items-center gap-1 text-accent text-sm font-semibold hover:gap-2 transition-all"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
