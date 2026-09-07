import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils/format'
import PropertyAdminActions from '@/components/admin/PropertyAdminActions'

export const metadata: Metadata = { title: 'Propiedades — Admin' }

const STATUS_COLORS: Record<string, string> = {
  publicada: 'bg-success-light text-success',
  borrador: 'bg-slate-100 text-slate-500',
  pausada: 'bg-amber-50 text-amber-600',
  vendida: 'bg-blue-50 text-blue-500',
  alquilada: 'bg-purple-50 text-purple-500',
  eliminada: 'bg-red-50 text-red-400',
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const status = params.status ?? ''
  const page = Math.max(1, parseInt(params.pagina ?? '1'))
  const PAGE_SIZE = 30
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const admin = createAdminClient()

  let query = admin
    .from('properties')
    .select(`
      id, slug, title, operation, status, price, department, municipality,
      is_hidden, is_featured, created_at,
      profiles!properties_user_id_fkey(full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) query = query.eq('status', status)

  const { data: rows, count } = await query
  const total = count ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const STATUS_TABS = [
    { value: '', label: 'Todas' },
    { value: 'publicada', label: 'Publicadas' },
    { value: 'borrador', label: 'Borradores' },
    { value: 'pausada', label: 'Pausadas' },
    { value: 'eliminada', label: 'Eliminadas' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Propiedades</h1>
        <p className="text-slate-500 text-sm mt-1">{total} propiedades en total</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_TABS.map(({ value, label }) => (
          <Link
            key={value}
            href={value ? `/admin/propiedades?status=${value}` : '/admin/propiedades'}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              status === value
                ? 'bg-navy text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-navy'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Propiedad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Propietario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(rows ?? []).map((row) => {
                const owner = row.profiles as { full_name: string } | null
                return (
                  <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${row.is_hidden ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-navy truncate max-w-xs">{row.title}</p>
                          <p className="text-xs text-slate-400">{row.municipality}, {row.department}</p>
                        </div>
                        <Link href={`/propiedades/${row.slug}`} target="_blank" className="text-slate-300 hover:text-accent transition-colors shrink-0">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{owner?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700 text-xs font-medium">
                      {row.price ? formatPrice(row.price, row.operation) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[row.status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {row.status}
                      </span>
                      {row.is_hidden && (
                        <span className="ml-1 text-xs px-1.5 py-0.5 bg-red-50 text-red-400 rounded-full">oculta</span>
                      )}
                      {row.is_featured && (
                        <span className="ml-1 text-xs px-1.5 py-0.5 bg-amber-50 text-amber-500 rounded-full">★</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PropertyAdminActions
                        propertyId={row.id}
                        isHidden={row.is_hidden ?? false}
                        isFeatured={row.is_featured ?? false}
                      />
                    </td>
                  </tr>
                )
              })}
              {(rows ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay propiedades con este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/propiedades?${status ? `status=${status}&` : ''}pagina=${page - 1}`}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/propiedades?${status ? `status=${status}&` : ''}pagina=${page + 1}`}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Siguiente →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
