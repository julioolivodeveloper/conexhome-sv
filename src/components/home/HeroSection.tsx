import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search } from 'lucide-react'

const HERO_IMG =
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[560px] sm:min-h-[620px] flex items-center">
      {/* Background image */}
      <Image
        src={HERO_IMG}
        alt="Playa de El Salvador"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Content */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-7">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Plataforma 100% gratuita · El Salvador
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl">
          Publica tu propiedad gratis{' '}
          <span className="text-accent">y llega a todo El Salvador.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed">
          La plataforma inmobiliaria de El Salvador donde cualquier persona puede
          comprar, vender o alquilar — sin comisiones, sin intermediarios.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/publicar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-accent/30 text-base"
          >
            <PlusCircle className="w-5 h-5" />
            Publicar propiedad gratis
          </Link>
          <Link
            href="/comprar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-colors text-base"
          >
            <Search className="w-5 h-5" />
            Buscar propiedades
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-300">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">14</span>
            <span>departamentos</span>
          </div>
          <div className="w-px h-10 bg-white/20 hidden sm:block self-center" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">100%</span>
            <span>publicación gratuita</span>
          </div>
          <div className="w-px h-10 bg-white/20 hidden sm:block self-center" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">$0</span>
            <span>comisiones</span>
          </div>
        </div>
      </div>
    </section>
  )
}
