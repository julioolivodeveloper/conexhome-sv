'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Home, Menu, PlusCircle } from 'lucide-react'
import MobileMenu from './MobileMenu'

const navLinks = [
  { href: '/comprar', label: 'Comprar' },
  { href: '/alquilar', label: 'Alquilar' },
  { href: '/mapa', label: 'Explorar mapa' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="ConexHome SV — Inicio"
            >
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-navy leading-none">
                ConexHome{' '}
                <span className="text-accent">SV</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/iniciar-sesion"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/publicar"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Publicar gratis
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
