import Link from 'next/link'
import { UserPlus, Home, MessageCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Crea tu cuenta gratis',
    desc: 'Regístrate en segundos con tu correo electrónico. Sin tarjeta de crédito ni pagos de ningún tipo.',
    href: '/crear-cuenta',
    cta: 'Crear cuenta',
  },
  {
    number: '02',
    icon: Home,
    title: 'Publica tu propiedad',
    desc: 'Agrega fotos, descripción, precio y ubicación. Tu propiedad aparece en línea al instante en los 14 departamentos.',
    href: '/publicar',
    cta: 'Publicar ahora',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Conéctate directo',
    desc: 'Los interesados te contactan por mensajería interna. Tú decides con quién hablar, sin intermediarios.',
    href: null,
    cta: null,
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold uppercase tracking-wide">
            Simple y rápido
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-2">
            ¿Cómo funciona ConexHome SV?
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            En tres pasos tu propiedad llega a miles de personas en todo El Salvador.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%-1rem)] w-8 h-px bg-accent/30 z-10" />
                )}

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 leading-none mt-1">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-navy font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{step.desc}</p>

                  {step.href && step.cta && (
                    <Link
                      href={step.href}
                      className="mt-5 inline-flex items-center text-accent font-semibold text-sm hover:underline"
                    >
                      {step.cta} →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
