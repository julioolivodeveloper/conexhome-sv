import Link from 'next/link'
import { PlusCircle, ArrowRight } from 'lucide-react'

export default function OwnerCTA() {
  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-success rounded-full" />
          Gratis para siempre
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          ¿Listo para publicar
          <span className="text-accent"> tu primera propiedad?</span>
        </h2>

        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Crea tu cuenta en segundos y publica gratis. Sin tarjeta de crédito,
          sin comisiones, sin intermediarios.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/publicar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-accent/30 text-base"
          >
            <PlusCircle className="w-5 h-5" />
            Publicar ahora — es gratis
          </Link>
          <Link
            href="/comprar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors text-base"
          >
            Ver propiedades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
