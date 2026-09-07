'use client'
import Link from 'next/link'
import { PlusCircle, Search, MapPin, MessageCircle } from 'lucide-react'

interface EmptyPropertiesProps {
  operation: 'venta' | 'alquiler'
  hasFilters: boolean
}

const steps = [
  {
    icon: PlusCircle,
    title: 'Publica tu propiedad',
    desc: 'Gratis, en segundos, sin intermediarios.',
    href: '/publicar',
    cta: 'Publicar ahora',
    accent: true,
  },
  {
    icon: Search,
    title: 'Explora por departamento',
    desc: 'Los 14 departamentos de El Salvador.',
    href: '/mapa',
    cta: 'Ver mapa',
    accent: false,
  },
  {
    icon: MessageCircle,
    title: 'Contacto directo',
    desc: 'Sin comisiones entre comprador y vendedor.',
    href: '/crear-cuenta',
    cta: 'Crear cuenta gratis',
    accent: false,
  },
]

export default function EmptyProperties({ operation, hasFilters }: EmptyPropertiesProps) {
  if (hasFilters) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-navy mb-2">Sin resultados para esos filtros</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          Prueba ampliando el rango de precio, cambiando el departamento o el tipo de propiedad.
        </p>
        <Link
          href={operation === 'venta' ? '/comprar' : '/alquilar'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
        >
          Ver todas en {operation === 'venta' ? 'venta' : 'alquiler'}
        </Link>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16">
      {/* Main message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          <MapPin className="w-4 h-4" />
          El Salvador
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
          {operation === 'venta'
            ? 'Sé el primero en publicar una propiedad en venta'
            : 'Sé el primero en publicar una propiedad en alquiler'}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          ConexHome SV está creciendo. Publica tu propiedad gratis hoy y llega a
          miles de personas en todo El Salvador.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
        {steps.map(({ icon: Icon, title, desc, href, cta, accent }) => (
          <div
            key={title}
            className={`rounded-2xl p-6 border text-center flex flex-col items-center ${
              accent
                ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                : 'bg-white border-slate-100 shadow-sm'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                accent ? 'bg-white/20' : 'bg-accent/10'
              }`}
            >
              <Icon className={`w-6 h-6 ${accent ? 'text-white' : 'text-accent'}`} />
            </div>
            <h3 className={`font-bold text-sm mb-1 ${accent ? 'text-white' : 'text-navy'}`}>
              {title}
            </h3>
            <p className={`text-xs leading-relaxed mb-4 flex-1 ${accent ? 'text-white/80' : 'text-slate-500'}`}>
              {desc}
            </p>
            <Link
              href={href}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                accent
                  ? 'bg-white text-accent hover:bg-slate-50'
                  : 'bg-accent/10 text-accent hover:bg-accent/20'
              }`}
            >
              {cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* Departments teaser */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-3">
          Propiedades disponibles en los 14 departamentos de El Salvador
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:underline"
        >
          <MapPin className="w-4 h-4" />
          Ver departamentos
        </Link>
      </div>
    </div>
  )
}
