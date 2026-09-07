import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatRelativeTime } from '@/lib/utils/format'
import UserAdminActions from '@/components/admin/UserAdminActions'

export const metadata: Metadata = { title: 'Usuarios — Admin' }

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.pagina ?? '1'))
  const PAGE_SIZE = 30
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const admin = createAdminClient()

  const { data: rows, count } = await admin
    .from('profiles')
    .select('id, full_name, is_admin, is_suspended, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const total = count ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Get property counts per user in one query
  const userIds = (rows ?? []).map((r) => r.id)
  const { data: propCounts } = await admin
    .from('properties')
    .select('user_id')
    .in('user_id', userIds)
    .not('status', 'eq', 'eliminada')

  const propCountMap = new Map<string, number>()
  for (const pc of propCounts ?? []) {
    propCountMap.set(pc.user_id, (propCountMap.get(pc.user_id) ?? 0) + 1)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Usuarios</h1>
        <p className="text-slate-500 text-sm mt-1">{total} usuarios registrados</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Propiedades</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Registro</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(rows ?? []).map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.is_suspended ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                        <span className="text-accent text-xs font-bold">
                          {(user.full_name ?? 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-navy">{user.full_name ?? 'Sin nombre'}</p>
                        {user.is_admin && (
                          <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {propCountMap.get(user.id) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {formatRelativeTime(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.is_suspended ? 'bg-red-50 text-red-500' : 'bg-success-light text-success'
                    }`}>
                      {user.is_suspended ? 'Suspendido' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!user.is_admin && (
                      <UserAdminActions userId={user.id} isSuspended={user.is_suspended ?? false} />
                    )}
                  </td>
                </tr>
              ))}
              {(rows ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay usuarios registrados aún
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
                <Link href={`/admin/usuarios?pagina=${page - 1}`} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/usuarios?pagina=${page + 1}`} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
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
