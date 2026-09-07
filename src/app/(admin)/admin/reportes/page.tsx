import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatRelativeTime } from '@/lib/utils/format'
import ReportAdminActions from '@/components/admin/ReportAdminActions'

export const metadata: Metadata = { title: 'Reportes — Admin' }

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-red-50 text-red-500',
  revisando: 'bg-amber-50 text-amber-600',
  resuelto: 'bg-success-light text-success',
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = params.estado ?? 'pendiente'
  const page = Math.max(1, parseInt(params.pagina ?? '1'))
  const PAGE_SIZE = 25
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const admin = createAdminClient()

  let query = admin
    .from('reports')
    .select(`
      id, reason, description, status, created_at,
      properties(slug, title),
      profiles!reports_reporter_id_fkey(full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filter !== 'todos') query = query.eq('status', filter)

  const { data: rows, count } = await query
  const total = count ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const STATUS_TABS = [
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'revisando', label: 'En revisión' },
    { value: 'resuelto', label: 'Resueltos' },
    { value: 'todos', label: 'Todos' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">{total} reportes con este filtro</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_TABS.map(({ value, label }) => (
          <Link
            key={value}
            href={`/admin/reportes?estado=${value}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === value
                ? 'bg-navy text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-navy'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Propiedad reportada</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Motivo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reportado por</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(rows ?? []).map((report) => {
                const property = report.properties as { slug: string; title: string } | null
                const reporter = report.profiles as { full_name: string } | null
                return (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {property ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-navy truncate max-w-xs">{property.title}</span>
                          <Link href={`/propiedades/${property.slug}`} target="_blank" className="text-slate-300 hover:text-accent transition-colors shrink-0">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Propiedad eliminada</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-700 max-w-xs">{report.reason}</p>
                      {report.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{report.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {reporter?.full_name ?? 'Anónimo'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatRelativeTime(report.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[report.status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ReportAdminActions reportId={report.id} status={report.status} />
                    </td>
                  </tr>
                )
              })}
              {(rows ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay reportes con este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/reportes?estado=${filter}&pagina=${page - 1}`} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/reportes?estado=${filter}&pagina=${page + 1}`} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
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
