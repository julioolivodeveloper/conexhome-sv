import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { User, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/panel/ProfileForm'

export const metadata: Metadata = {
  title: 'Mi perfil',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, whatsapp, bio, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Mi perfil</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Esta información aparecerá en tus publicaciones de propiedades.
        </p>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center shrink-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-accent" />
            )}
          </div>
          <div>
            <p className="font-semibold text-navy">
              {profile?.full_name || 'Sin nombre'}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <button
              disabled
              className="mt-2 text-xs text-accent hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cambiar foto — disponible en Etapa 3
            </button>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <h2 className="font-semibold text-navy mb-5 flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-slate-400" />
          Información de contacto
        </h2>
        <ProfileForm
          profile={{
            full_name: profile?.full_name ?? '',
            phone: profile?.phone ?? null,
            whatsapp: profile?.whatsapp ?? null,
            bio: profile?.bio ?? null,
          }}
        />
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-navy mb-5 flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-slate-400" />
          Cuenta
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Correo electrónico
            </label>
            <input
              type="email"
              value={user.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Contraseña</p>
            <a
              href="/recuperar-contrasena"
              className="text-sm text-accent hover:underline"
            >
              Cambiar contraseña →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
