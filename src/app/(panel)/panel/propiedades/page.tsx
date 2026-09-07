import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PlusCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { APP_CONFIG } from '@/config/app'
import { formatPrice } from '@/lib/utils/format'
import PropertyStatusActions from '@/components/panel/PropertyStatusActions'

export const metadata: Metadata = {
  title: 'Mis propiedades',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  publicada:  { label: 'Publicada',  color: 'bg-success-light text-success' },
  borrador:   { label: 'Borrador',   color: 'bg-slate-100 text-slate-600' },
  pausada:    { label: 'Pausada',    color: 'bg-amber-50 text-amber-600' },
  vendida:    { label: 'Vendida',    color: 'bg-blue-50 text-blue-600' },
  alquilada:  { label: 'Alquilada', color: 'bg-blue-50 text-blue-600' },
  eliminada:  { label: 'Eliminada', color: 'bg-red-50 text-red-500' },
}

export default async function MisPropertiesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  const { data: properties } = await supabase
    .from('properties')
    .select('id, slug, title, status, operation, price, cover_image_url, department, municipality, created_at, published_at')
    .eq('user_id', user.id)
    .neq('status', 'eliminada')
    .order('created_at', { ascending: false })

  const activeCount = properties?.filter((p) =>
    ['borrador', 'publicada', 'pausada'].includes(p.status)
  ).length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mis propiedades</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {activeCount}/{APP_CONFIG.MAX_FREE_PROPERTIES} publicaciones activas usadas
          </p>
        </div>
        {activeCount < APP_CONFIG.MAX_FREE_PROPERTIES && (
          <Link
            href="/publicar"
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar
          </Link>
        )}
      </div>

      {!properties || properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-3xl mb-3">🏠</p>
          <h3 className="font-semibold text-navy mb-2">Aún no tienes propiedades</h3>
          <p className="text-slate-500 text-sm mb-5">Publica tu primera propiedad gratis. Sin comisiones.</p>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar ahora
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const statusCfg = STATUS_CONFIG[property.status] ?? STATUS_CONFIG.borrador
            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {property.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.cover_image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{property.operation}</span>
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{property.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {property.municipality}, {property.department}
                  </p>
                  {property.price && (
                    <p className="text-sm font-bold text-accent mt-1">
                      {formatPrice(property.price, property.operation)}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {property.status === 'publicada' && (
                    <Link
                      href={`/propiedades/${property.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-navy transition-colors"
                      title="Ver publicación"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  <PropertyStatusActions
                    propertyId={property.id}
                    currentStatus={property.status}
                    operation={property.operation}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
