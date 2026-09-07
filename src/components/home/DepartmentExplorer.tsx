import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight } from 'lucide-react'
import { DEPARTMENTS } from '@/lib/constants/departments'

const DEPT_IMAGES: Record<string, string> = {
  ahuachapan:
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=75',
  sonsonate:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=75',
  'santa-ana':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=75',
  chalatenango:
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=75',
  'la-libertad':
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=75',
  'san-salvador':
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=75',
  cuscatlan:
    'https://images.unsplash.com/photo-1559494007-a929a61e5eb9?auto=format&fit=crop&w=600&q=75',
  'la-paz':
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=75',
  cabanas:
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=75',
  'san-vicente':
    'https://images.unsplash.com/photo-1518451879369-f3e7b1b1b87b?auto=format&fit=crop&w=600&q=75',
  usulutan:
    'https://images.unsplash.com/photo-1500534314209-a157d0e14d0d?auto=format&fit=crop&w=600&q=75',
  'san-miguel':
    'https://images.unsplash.com/photo-1476514525405-8f83aadb3174?auto=format&fit=crop&w=600&q=75',
  morazan:
    'https://images.unsplash.com/photo-1516026672322-375600ea61b2?auto=format&fit=crop&w=600&q=75',
  'la-union':
    'https://images.unsplash.com/photo-1510414842594-a61c69b4fcc4?auto=format&fit=crop&w=600&q=75',
}

const FALLBACK = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=75'

export default function DepartmentExplorer() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
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
          {DEPARTMENTS.map((dept) => {
            const imgUrl = DEPT_IMAGES[dept.slug] ?? FALLBACK
            return (
              <Link
                key={dept.slug}
                href={`/departamento/${dept.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square flex flex-col items-end justify-start hover:scale-105 transition-transform duration-200 shadow-sm"
              >
                {/* Background image */}
                <Image
                  src={imgUrl}
                  alt={dept.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                  className="object-cover"
                  unoptimized
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />

                {/* Name at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-xs sm:text-sm leading-tight drop-shadow-md">
                    {dept.name}
                  </p>
                </div>
              </Link>
            )
          })}
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
