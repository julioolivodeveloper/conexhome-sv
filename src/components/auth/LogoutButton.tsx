'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
}

export default function LogoutButton({
  className,
  showIcon = true,
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-60',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="w-4 h-4" />
      )}
      {isLoading ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </button>
  )
}
