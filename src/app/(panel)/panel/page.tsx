import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Home, PlusCircle, Heart, MessageSquare, Eye, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { APP_CONFIG } from '@/config/app'

export const metadata: Metadata = {
  title: 'Mi panel',
}

export default async function PanelPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { count: activeCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['borrador', 'publicada', 'pausada'])

  const { count: favCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const firstName = (profile?.full_name ?? user.email ?? 'Usuario').split(' ')[0]
  const usedSlots = activeCount ?? 0
  const maxSlots = APP_CONFIG.MAX_FREE_PROPERTIES

  const stats = [
    {
      label: 'Propiedades activas',
      value: `${usedSlots} / ${maxSlots}`,
      icon: Home,
      color: 'bg-accent-light text-accent',
      href: '/panel/propiedades',
    },
    {
      label: 'Favoritos',
      value: String(favCount ?? 0),
      icon: Heart,
      color: 'bg-red-50 text-red-500',
      href: '/favoritos',
    },
    {
      label: 'Mensajes',
      value: '0',
      icon: MessageSquare,
      color: 'bg-success-light text-success',
      href: '/mensajes',
    },
    {
      label: 'Vistas totales',
      value: '0',
      icon: Eye,
      color: 'bg-amber-50 text-amber-600',
      href: '/panel/propiedades',
    },
  ]

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">
          ¡Hola, {firstName}! 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Aquí tienes un resumen de tu actividad en ConexHome SV.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/publicar"
          className="flex items-center gap-4 bg-accent text-white rounded-2xl p-5 hover:bg-accent-dark transition-colors shadow-sm group"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Publicar propiedad</p>
            <p className="text-xs text-white/80 mt-0.5">
              {maxSlots - usedSlots} publicaciones disponibles
            </p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/panel/perfil"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="font-semibold text-navy">Completar mi perfil</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Agrega teléfono y WhatsApp
            </p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Empty state for properties */}
      {usedSlots === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-semibold text-navy mb-1">
            Aún no tienes propiedades publicadas
          </h3>
          <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
            Publica tu primera propiedad gratis. Aparecerá en los resultados de
            búsqueda de forma inmediata.
          </p>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar ahora
          </Link>
        </div>
      )}
    </div>
  )
}
