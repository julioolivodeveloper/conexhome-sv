import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { DEPARTMENTS } from '@/lib/constants/departments'

const DEPARTMENT_COLORS = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-violet-500 to-violet-700',
  'from-purple-500 to-purple-700',
  'from-sky-500 to-sky-700',
  'from-cyan-500 to-cyan-700',
  'from-teal-500 to-teal-700',
  'from-emerald-500 to-emerald-700',
  'from-green-500 to-green-700',
  'from-lime-500 to-lime-700',
  'from-yellow-500 to-yellow-700',
  'from-orange-500 to-orange-700',
  'from-red-500 to-red-700',
  'from-rose-500 to-rose-700',
]

export default function DepartmentExplorer() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-semibold uppercase tracking-wide">
              Todo El Salvador
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
            Explorar por departamento
          </h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Encuentra propiedades en cualquiera de los 14 departamentos del país
          </p>
        </div>

        {/* Department grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DEPARTMENTS.map((dept, i) => (
            <Link
              key={dept.slug}
              href={`/departamento/${dept.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center p-3 text-center hover:scale-105 transition-transform duration-200"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${DEPARTMENT_COLORS[i % DEPARTMENT_COLORS.length]}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10">
                <p className="text-white font-semibold text-xs sm:text-sm leading-tight drop-shadow">
                  {dept.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all text-sm"
          >
            <MapPin className="w-4 h-4" />
            Explorar en el mapa interactivo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
