'use client'

import { useTransition } from 'react'
import { CheckCircle, Clock, Loader2 } from 'lucide-react'
import { resolveReport } from '@/actions/admin'

interface Props {
  reportId: string
  status: string
}

export default function ReportAdminActions({ reportId, status }: Props) {
  const [isPending, startTransition] = useTransition()

  const handle = (newStatus: 'revisando' | 'resuelto') => {
    startTransition(async () => {
      const res = await resolveReport(reportId, newStatus)
      if (res.error) alert(res.error)
    })
  }

  if (status === 'resuelto') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <CheckCircle className="w-3.5 h-3.5" /> Resuelto
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {status === 'pendiente' && (
        <button
          onClick={() => handle('revisando')}
          disabled={isPending}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
          Revisar
        </button>
      )}
      <button
        onClick={() => handle('resuelto')}
        disabled={isPending}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
        Resolver
      </button>
    </div>
  )
}
