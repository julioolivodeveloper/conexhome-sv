import Link from 'next/link'
import { PlusCircle, CheckCircle, Zap, Shield } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Publicación inmediata',
    desc: 'Tu propiedad aparece en línea al instante, sin esperar aprobación.',
  },
  {
    icon: CheckCircle,
    title: 'Completamente gratis',
    desc: 'Publica hasta 5 propiedades sin costo. Sin tarjeta de crédito.',
  },
  {
    icon: Shield,
    title: 'Sin complicaciones',
    desc: 'Sin papelerías, sin documentos, sin procesos largos.',
  },
]

export default function OwnerCTA() {
  return (
    <section className="bg-accent-light py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <PlusCircle className="w-4 h-4" />
              Para propietarios
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy leading-tight mb-4">
              ¿Tienes una propiedad
              <br />
              <span className="text-accent">para vender o alquilar?</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Publica tu propiedad gratis y llegá a miles de compradores e
              inquilinos potenciales en todo El Salvador. Sin intermediarios, sin
              comisiones.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/publicar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-accent/20 text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Publicar propiedad gratis
              </Link>
              <Link
                href="/crear-cuenta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-navy font-semibold rounded-xl border border-slate-200 transition-colors text-sm"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          {/* Right — benefits */}
          <div className="space-y-5">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-0.5 text-sm sm:text-base">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
