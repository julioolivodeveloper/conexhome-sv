'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileFormData } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  profile: {
    full_name: string
    phone: string | null
    whatsapp: string | null
    bio: string | null
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name,
      phone: profile.phone ?? '',
      whatsapp: profile.whatsapp ?? '',
      bio: profile.bio ?? '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null)
    setSaved(false)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        bio: data.bio || null,
      })
      .eq('id', user.id)

    if (error) {
      setServerError('No se pudo guardar. Inténtalo de nuevo.')
      return
    }

    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {serverError}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-success-light border border-success/20 text-success text-sm rounded-xl">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Perfil actualizado correctamente.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            {...register('full_name')}
            type="text"
            className={inputClass}
            placeholder="Tu nombre completo"
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Teléfono
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={inputClass}
            placeholder="Ej: 22001234"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            WhatsApp
          </label>
          <input
            {...register('whatsapp')}
            type="tel"
            className={inputClass}
            placeholder="Ej: 50378001234"
          />
          <p className="mt-1 text-xs text-slate-400">
            Incluye el código de país (503 para El Salvador)
          </p>
          {errors.whatsapp && (
            <p className="mt-1 text-xs text-red-600">{errors.whatsapp.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Descripción breve
          </label>
          <textarea
            {...register('bio')}
            rows={3}
            className={inputClass}
            placeholder="Cuéntanos un poco sobre ti o tu negocio inmobiliario…"
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
