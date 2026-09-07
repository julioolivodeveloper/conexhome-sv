import Link from 'next/link'
import { PlusCircle, Search } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#1E4D8C]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-2xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Plataforma 100% gratuita · El Salvador
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-5">
          Publica tu propiedad gratis
          <br className="hidden sm:block" />{' '}
          <span className="text-accent">y llega a todo El Salvador.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          La plataforma inmobiliaria de El Salvador donde cualquier persona puede
          comprar, vender o alquilar — sin comisiones, sin intermediarios.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/publicar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-accent/30 text-base"
          >
            <PlusCircle className="w-5 h-5" />
            Publicar propiedad gratis
          </Link>
          <Link
            href="/comprar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors text-base"
          >
            <Search className="w-5 h-5" />
            Buscar propiedades
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">14</span>
            <span>departamentos</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">100%</span>
            <span>publicación gratuita</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">0</span>
            <span>comisiones</span>
          </div>
        </div>
      </div>
    </section>
  )
}
