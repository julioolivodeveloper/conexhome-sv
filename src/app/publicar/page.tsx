import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_CONFIG } from '@/config/app'
import PublishWizard from '@/components/publish/PublishWizard'

export const metadata: Metadata = {
  title: 'Publicar propiedad — ConexHome SV',
  description: 'Publica tu propiedad gratis en ConexHome SV',
}

export default async function PublishPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion?redirect=/publicar')

  const [{ count: activeCount }, { data: amenities }] = await Promise.all([
    supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['borrador', 'publicada', 'pausada']),
    supabase
      .from('amenities')
      .select('id, name, icon')
      .order('name'),
  ])

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-navy">Publicar propiedad</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Gratis · Sin comisiones · Aparece en minutos ·{' '}
          <span className="font-medium text-navy">
            {Math.max(0, APP_CONFIG.MAX_FREE_PROPERTIES - (activeCount ?? 0))} publicaciones disponibles
          </span>
        </p>
      </div>

      <PublishWizard
        amenities={amenities ?? []}
        userId={user.id}
        usedSlots={activeCount ?? 0}
      />
    </main>
  )
}
