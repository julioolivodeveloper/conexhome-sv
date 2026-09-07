import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Users, Flag, Eye, AlertTriangle } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatRelativeTime } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Admin — ConexHome SV' }

export default async function AdminDashboardPage() {
  const admin = createAdminClient()

  const [
    { count: totalProperties },
    { count: publishedProperties },
    { count: totalUsers },
    { count: pendingReports },
    { data: recentProps },
  ] = await Promise.all([
    admin.from('properties').select('*', { count: 'exact', head: true }),
    admin.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'publicada'),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pendiente'),
    admin.from('properties')
      .select('id, slug, title, status, created_at, profiles!properties_user_id_fkey(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const stats = [
    { label: 'Propiedades totales', value: totalProperties ?? 0, icon: Home, color: 'bg-accent-light text-accent', href: '/admin/propiedades' },
    { label: 'Propiedades publicadas', value: publishedProperties ?? 0, icon: Eye, color: 'bg-success-light text-success', href: '/admin/propiedades' },
    { label: 'Usuarios registrados', value: totalUsers ?? 0, icon: Users, color: 'bg-slate-100 text-slate-600', href: '/admin/usuarios' },
    { label: 'Reportes pendientes', value: pendingReports ?? 0, icon: Flag, color: pendingReports ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500', href: '/admin/reportes' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de la plataforma ConexHome SV</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Alert for pending reports */}
      {(pendingReports ?? 0) > 0 && (
        <Link
          href="/admin/reportes"
          className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 hover:bg-red-100 transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {pendingReports} {(pendingReports ?? 0) === 1 ? 'reporte pendiente' : 'reportes pendientes'}
            </p>
            <p className="text-xs text-red-500">Haz clic para revisar</p>
          </div>
        </Link>
      )}

      {/* Recent properties */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-navy text-sm">Propiedades recientes</h2>
          <Link href="/admin/propiedades" className="text-xs text-accent hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {(recentProps ?? []).map((p) => {
            const owner = p.profiles as { full_name: string } | null
            return (
              <div key={p.id} className="flex items-center gap-3 px-6 py-3">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/propiedades/${p.slug}`}
                    className="text-sm font-medium text-navy hover:text-accent transition-colors truncate block"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-400">
                    {owner?.full_name ?? 'Sin nombre'} · {formatRelativeTime(p.created_at)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'publicada' ? 'bg-success-light text-success' :
                  p.status === 'borrador' ? 'bg-slate-100 text-slate-500' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {p.status}
                </span>
              </div>
            )
          })}
          {(recentProps ?? []).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">Sin propiedades aún</p>
          )}
        </div>
      </div>
    </div>
  )
}
