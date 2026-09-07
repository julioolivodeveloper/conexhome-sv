import Link from 'next/link'
import {
  Search,
  PlusCircle,
  MessageCircle,
  MapPin,
  Heart,
  Shield,
  Camera,
  Smartphone,
} from 'lucide-react'

const features = [
  {
    icon: PlusCircle,
    title: 'Publica gratis',
    desc: 'Hasta 5 propiedades sin costo. Sin tarjeta de crédito ni suscripciones.',
    highlight: true,
  },
  {
    icon: Search,
    title: 'Busca con filtros',
    desc: 'Filtra por departamento, tipo de propiedad, precio, habitaciones y más.',
  },
  {
    icon: MapPin,
    title: 'Mapa interactivo',
    desc: 'Visualiza todas las propiedades sobre un mapa de El Salvador en tiempo real.',
  },
  {
    icon: MessageCircle,
    title: 'Mensajería directa',
    desc: 'Habla directamente con el propietario sin compartir tu número de teléfono.',
  },
  {
    icon: Heart,
    title: 'Lista de favoritos',
    desc: 'Guarda las propiedades que te interesan para revisarlas cuando quieras.',
  },
  {
    icon: Camera,
    title: 'Galería de fotos',
    desc: 'Sube hasta 20 fotos por propiedad para mostrar todos los detalles.',
  },
  {
    icon: Shield,
    title: 'Sin intermediarios',
    desc: 'Comprador y vendedor se conectan directo. Cero comisiones de por medio.',
  },
  {
    icon: Smartphone,
    title: 'Desde cualquier lugar',
    desc: 'Diseñado para móvil. Publica o busca propiedades desde tu celular.',
  },
]

export default function PlatformFeatures() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold uppercase tracking-wide">
            Todo en un solo lugar
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-2">
            ¿Qué puedes hacer en ConexHome SV?
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Una plataforma completa para comprar, vender y alquilar propiedades en El Salvador.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, highlight }) => (
            <div
              key={title}
              className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${
                highlight
                  ? 'bg-accent border-accent/20 text-white'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  highlight ? 'bg-white/20' : 'bg-accent/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${highlight ? 'text-white' : 'text-accent'}`} />
              </div>
              <h3
                className={`font-bold text-sm mb-1.5 ${highlight ? 'text-white' : 'text-navy'}`}
              >
                {title}
              </h3>
              <p className={`text-xs leading-relaxed ${highlight ? 'text-white/80' : 'text-slate-500'}`}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/publicar"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-md shadow-accent/20 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar mi propiedad gratis
          </Link>
        </div>
      </div>
    </section>
  )
}
