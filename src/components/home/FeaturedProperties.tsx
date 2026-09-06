import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import type { Property } from '@/types/property'
import PropertyCard from './PropertyCard'

interface FeaturedPropertiesProps {
  properties: Property[]
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  if (!properties.length) return null

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-accent text-sm font-semibold uppercase tracking-wide">
                Destacadas
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
              Propiedades destacadas
            </h2>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Las mejores oportunidades del mercado salvadoreño
            </p>
          </div>
          <Link
            href="/comprar"
            className="shrink-0 flex items-center gap-1 text-accent text-sm font-semibold hover:gap-2 transition-all"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
