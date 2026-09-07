'use client'

import { useTransition } from 'react'
import { UserCheck, UserX, Loader2 } from 'lucide-react'
import { setUserSuspended } from '@/actions/admin'

interface Props {
  userId: string
  isSuspended: boolean
}

export default function UserAdminActions({ userId, isSuspended }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const res = await setUserSuspended(userId, !isSuspended)
      if (res.error) alert(res.error)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isSuspended ? 'Reactivar usuario' : 'Suspender usuario'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
        isSuspended
          ? 'bg-green-50 text-green-600 hover:bg-green-100'
          : 'bg-red-50 text-red-500 hover:bg-red-100'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isSuspended ? (
        <UserCheck className="w-3.5 h-3.5" />
      ) : (
        <UserX className="w-3.5 h-3.5" />
      )}
      {isSuspended ? 'Reactivar' : 'Suspender'}
    </button>
  )
}
