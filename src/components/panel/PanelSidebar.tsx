'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Heart,
  MessageSquare,
  User,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import LogoutButton from '@/components/auth/LogoutButton'

interface PanelSidebarProps {
  userName: string
  userEmail: string
  avatarUrl?: string | null
}

const navItems = [
  { href: '/panel', label: 'Panel', icon: LayoutDashboard, exact: true },
  { href: '/panel/propiedades', label: 'Mis propiedades', icon: Home, exact: false },
  { href: '/publicar', label: 'Publicar propiedad', icon: PlusCircle, exact: false },
  { href: '/favoritos', label: 'Favoritos', icon: Heart, exact: false },
  { href: '/mensajes', label: 'Mensajes', icon: MessageSquare, exact: false },
  { href: '/panel/perfil', label: 'Mi perfil', icon: User, exact: false },
]

export default function PanelSidebar({ userName, userEmail, avatarUrl }: PanelSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-0">
      {/* User info */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-accent font-bold text-sm">{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-navy text-sm truncate">{userName || 'Usuario'}</p>
            <p className="text-slate-400 text-xs truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-accent-light text-accent'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <LogoutButton
          className="text-slate-500 hover:text-red-600 w-full justify-start px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
          showIcon
        />
      </div>
    </aside>
  )
}
