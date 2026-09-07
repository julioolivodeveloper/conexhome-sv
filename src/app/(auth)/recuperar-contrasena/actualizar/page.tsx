import type { Metadata } from 'next'
import Link from 'next/link'
import { Home } from 'lucide-react'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

export const metadata: Metadata = {
  title: 'Nueva contraseña',
}

export default function UpdatePasswordPage() {
  return (
    <div className="w-full max-w-md">
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
          Nueva contraseña
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Elige una nueva contraseña segura
        </p>

        <UpdatePasswordForm />

        <p className="text-center text-sm text-slate-500 mt-5">
          <Link href="/iniciar-sesion" className="text-accent hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
