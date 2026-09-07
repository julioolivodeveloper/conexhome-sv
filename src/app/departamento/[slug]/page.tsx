import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEPARTMENTS, DEPARTMENTS_BY_SLUG } from '@/lib/constants/departments'
import PropertyCard from '@/components/home/PropertyCard'
import Pagination from '@/components/search/Pagination'
import type { Property } from '@/types/property'
import { PAGE_SIZE } from '@/lib/utils/search'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export async function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dept = DEPARTMENTS_BY_SLUG[slug]
  if (!dept) return { title: 'Departamento no encontrado' }

  return {
    title: `Propiedades en ${dept.name}, El Salvador`,
    description: `Casas, apartamentos, terrenos y más propiedades en venta y alquiler en ${dept.name}, El Salvador. Encuentra la propiedad ideal en ConexHome SV.`,
    openGraph: {
      title: `Propiedades en ${dept.name} | ConexHome SV`,
      description: `Encuentra propiedades en venta y alquiler en ${dept.name}, El Salvador.`,
    },
  }
}

const COLUMNS = 'id, slug, title, description, operation, property_type, status, price, price_negotiable, financing_available, bedrooms, bathrooms, parking_spots, land_area, construction_area, area_unit, department, municipality, zone, cover_image_url, is_featured, view_count, created_at, published_at, contact_name, contact_preference'

export default async function DepartamentoPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const dept = DEPARTMENTS_BY_SLUG[slug]
  if (!dept) notFound()

  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.pagina ?? '1'))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'publicada')
    .eq('department', dept.name)

  const { data: rows } = await supabase
    .from('properties')
    .select(COLUMNS)
    .eq('status', 'publicada')
    .eq('department', dept.name)
    .order('published_at', { ascending: false })
    .range(from, to)

  let favoriteIds = new Set<string>()
  if (user) {
    const { data: favs } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id)
    favoriteIds = new Set(favs?.map((f) => f.property_id) ?? [])
  }

  const properties: Property[] = (rows ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? '',
    operation: r.operation as Property['operation'],
    property_type: r.property_type as Property['property_type'],
    status: r.status as Property['status'],
    price: r.price ?? 0,
    price_negotiable: r.price_negotiable,
    financing_available: r.financing_available,
    bedrooms: r.bedrooms ?? undefined,
    bathrooms: r.bathrooms ?? undefined,
    parking_spots: r.parking_spots ?? undefined,
    land_area: r.land_area ?? undefined,
    construction_area: r.construction_area ?? undefined,
    area_unit: (r.area_unit as Property['area_unit']) ?? 'm2',
    department: r.department,
    municipality: r.municipality,
    zone: r.zone ?? undefined,
    cover_image_url: r.cover_image_url ?? undefined,
    is_featured: r.is_featured,
    view_count: r.view_count,
    images: [],
    contact_name: r.contact_name ?? '',
    contact_preference: (r.contact_preference as Property['contact_preference']) ?? 'any',
    created_at: r.created_at,
    published_at: r.published_at ?? undefined,
  }))

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-navy py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-400 text-sm mb-1">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            {' › '}
            <span className="text-slate-300">Departamentos</span>
            {' › '}
            <span className="text-white">{dept.name}</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Propiedades en {dept.name}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            {count ?? 0} propiedades disponibles en {dept.name}, El Salvador
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick links: Comprar / Alquilar */}
        <div className="flex gap-3 mb-6">
          <Link
            href={`/comprar?departamento=${encodeURIComponent(dept.name)}`}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
          >
            Ver en venta
          </Link>
          <Link
            href={`/alquilar?departamento=${encodeURIComponent(dept.name)}`}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Ver en alquiler
          </Link>
        </div>

        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} isFavorited={favoriteIds.has(p.id)} />
              ))}
            </div>
            <Pagination total={count ?? 0} currentPage={page} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏘️</p>
            <h2 className="text-lg font-semibold text-slate-600 mb-2">
              Aún no hay propiedades en {dept.name}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Sé el primero en publicar en este departamento.
            </p>
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
            >
              Publicar gratis
            </Link>
          </div>
        )}

        {/* Other departments */}
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Explorar otros departamentos</h2>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.filter((d) => d.slug !== slug).map((d) => (
              <Link
                key={d.slug}
                href={`/departamento/${d.slug}`}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full hover:border-accent hover:text-accent transition-colors"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
