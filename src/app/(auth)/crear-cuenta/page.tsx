import type { Metadata } from 'next'
import Link from 'next/link'
import { Home } from 'lucide-react'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear cuenta',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
          <Home className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-navy">
          ConexHome <span className="text-accent">SV</span>
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-navy mb-1 text-center">
          Crear cuenta gratis
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Únete y publica propiedades gratis en El Salvador
        </p>

        <RegisterForm />

        <p className="text-center text-sm text-slate-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/iniciar-sesion"
            className="text-accent font-semibold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
