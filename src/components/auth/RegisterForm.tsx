'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('Este correo electrónico ya está registrado.')
      } else {
        setServerError('Ocurrió un error. Inténtalo de nuevo.')
      }
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
        <h3 className="text-lg font-bold text-navy mb-2">¡Revisa tu correo!</h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
          Te enviamos un correo de confirmación. Haz clic en el enlace para
          activar tu cuenta y comenzar a publicar.
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

      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nombre completo
        </label>
        <input
          {...register('full_name')}
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Confirmar contraseña
        </label>
        <input
          {...register('confirm_password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repite la contraseña"
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        />
        {errors.confirm_password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta gratis'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Al registrarte aceptas nuestros{' '}
        <a href="/terminos" className="underline hover:text-slate-700">
          Términos de uso
        </a>{' '}
        y{' '}
        <a href="/privacidad" className="underline hover:text-slate-700">
          Política de privacidad
        </a>
        .
      </p>
    </form>
  )
}
