'use client'

import Link from 'next/link'
import { X, Home, Search, Map, PlusCircle, Heart, MessageSquare, LogIn } from 'lucide-react'
import { useEffect } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: '/comprar', label: 'Comprar', icon: Search },
  { href: '/alquilar', label: 'Alquilar', icon: Home },
  { href: '/mapa', label: 'Explorar mapa', icon: Map },
  { href: '/publicar', label: 'Publicar propiedad', icon: PlusCircle },
  { href: '/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-navy text-lg">
              ConexHome <span className="text-accent">SV</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 text-slate-700 hover:bg-slate-50 hover:text-navy rounded-xl transition-colors font-medium"
            >
              <Icon className="w-5 h-5 text-slate-400" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-slate-100 space-y-3">
          <Link
            href="/iniciar-sesion"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Link>
          <Link
            href="/crear-cuenta"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
