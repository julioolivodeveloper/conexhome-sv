import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl font-bold text-slate-100 mb-4">404</div>
      <h1 className="text-2xl font-bold text-navy mb-2">Página no encontrada</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          Ir al inicio
        </Link>
        <Link
          href="/comprar"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-navy font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Buscar propiedades
        </Link>
      </div>
    </main>
  )
}
