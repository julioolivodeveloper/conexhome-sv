'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Car, Maximize2, Heart } from 'lucide-react'
import type { Property } from '@/types/property'
import { formatPrice, formatArea, propertyTypeLabel } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    slug,
    title,
    price,
    operation,
    property_type,
    department,
    municipality,
    zone,
    bedrooms,
    bathrooms,
    parking_spots,
    construction_area,
    land_area,
    area_unit,
    cover_image_url,
    price_negotiable,
    financing_available,
  } = property

  const displayArea = construction_area ?? land_area
  const location = [zone, municipality, department].filter(Boolean).join(', ')

  return (
    <Link
      href={`/propiedades/${slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-4xl opacity-50">🏠</span>
          </div>
        )}

        {/* Operation badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={operation === 'venta' ? 'venta' : 'alquiler'}>
            {operation === 'venta' ? 'En venta' : 'En alquiler'}
          </Badge>
        </div>

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label="Guardar en favoritos"
        >
          <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Tags */}
        {(price_negotiable || financing_available) && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {price_negotiable && (
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Negociable
              </span>
            )}
            {financing_available && (
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Financiamiento
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-1">
          <span className="text-xl font-bold text-navy">
            {formatPrice(price, operation)}
          </span>
        </div>

        {/* Type */}
        <p className="text-xs text-slate-400 font-medium mb-1.5">
          {propertyTypeLabel(property_type)}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span className="text-xs text-slate-500 line-clamp-1">{location}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3">
          {/* Features */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            {bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{bathrooms}</span>
              </div>
            )}
            {parking_spots !== undefined && (
              <div className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>{parking_spots}</span>
              </div>
            )}
            {displayArea !== undefined && (
              <div className="flex items-center gap-1 ml-auto">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatArea(displayArea, area_unit)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
