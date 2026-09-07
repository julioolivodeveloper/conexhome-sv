import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import RecoverForm from '@/components/auth/RecoverForm'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
}

export default function RecoverPage() {
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
          Recuperar contraseña
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Ingresa tu correo y te enviaremos instrucciones
        </p>

        <RecoverForm />

        <div className="mt-5 text-center">
          <Link
            href="/iniciar-sesion"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
