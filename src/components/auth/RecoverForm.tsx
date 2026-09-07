'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { recoverSchema, type RecoverFormData } from '@/lib/validations/auth'

export default function RecoverForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  })

  const onSubmit = async (data: RecoverFormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/recuperar-contrasena/actualizar`,
    })

    if (error) {
      setServerError('Ocurrió un error. Inténtalo de nuevo.')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-success" />
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">¡Correo enviado!</h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
          Si el correo está registrado, recibirás instrucciones para restablecer
          tu contraseña en unos minutos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Correo electrónico
        </label>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Enviando…' : 'Enviar instrucciones'}
      </button>
    </form>
  )
}
