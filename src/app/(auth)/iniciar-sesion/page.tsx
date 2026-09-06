import type { Metadata } from 'next'
import Link from 'next/link'
import { Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

export default function LoginPage() {
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
        <h1 className="text-2xl font-bold text-navy mb-1 text-center">Iniciar sesión</h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Ingresa a tu cuenta para continuar
        </p>

        {/* Placeholder form — Etapa 2 implementará la lógica */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              placeholder="tu@correo.com"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              placeholder="••••••••"
              disabled
            />
          </div>

          <button
            disabled
            className="w-full py-3 bg-accent text-white font-semibold rounded-xl opacity-60 cursor-not-allowed text-sm"
          >
            Iniciar sesión — disponible en Etapa 2
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          ¿No tienes cuenta?{' '}
          <Link href="/crear-cuenta" className="text-accent font-semibold hover:underline">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
