'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Users, Flag, Shield } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/propiedades', label: 'Propiedades', icon: Home },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/reportes', label: 'Reportes', icon: Flag },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-56 shrink-0 bg-navy text-white p-4 lg:min-h-[calc(100vh-64px)]">
      <div className="flex items-center gap-2 mb-6 px-2 pt-1">
        <Shield className="w-5 h-5 text-accent" />
        <span className="font-bold text-sm">Panel Admin</span>
      </div>

      <nav className="space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-white/10">
        <Link
          href="/panel"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          ← Volver al panel
        </Link>
      </div>
    </aside>
  )
}
