'use client'

import { useState } from 'react'
import { Eye, EyeOff, CheckCircle, Key, Trash2, Loader2 } from 'lucide-react'
import { updatePropertyStatus } from '@/actions/properties'

type Status = 'publicada' | 'pausada' | 'vendida' | 'alquilada' | 'eliminada' | string

interface Props {
  propertyId: string
  currentStatus: Status
  operation: string
}

export default function PropertyStatusActions({ propertyId, currentStatus, operation }: Props) {
  const [loading, setLoading] = useState(false)

  const doAction = async (status: 'publicada' | 'pausada' | 'vendida' | 'alquilada' | 'eliminada') => {
    if (status === 'eliminada') {
      if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    }
    setLoading(true)
    await updatePropertyStatus(propertyId, status)
    setLoading(false)
  }

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
  }

  return (
    <div className="flex flex-col gap-1.5">
      {currentStatus === 'borrador' && (
        <button
          onClick={() => doAction('publicada')}
          className="p-2 rounded-lg hover:bg-success-light text-slate-400 hover:text-success transition-colors"
          title="Publicar"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {currentStatus === 'publicada' && (
        <button
          onClick={() => doAction('pausada')}
          className="p-2 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
          title="Pausar"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      )}
      {currentStatus === 'pausada' && (
        <button
          onClick={() => doAction('publicada')}
          className="p-2 rounded-lg hover:bg-success-light text-slate-400 hover:text-success transition-colors"
          title="Reactivar"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {['publicada', 'pausada'].includes(currentStatus) && (
        <button
          onClick={() => doAction(operation === 'alquiler' ? 'alquilada' : 'vendida')}
          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
          title={operation === 'alquiler' ? 'Marcar como alquilada' : 'Marcar como vendida'}
        >
          {operation === 'alquiler' ? <Key className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </button>
      )}
      {currentStatus !== 'eliminada' && (
        <button
          onClick={() => doAction('eliminada')}
          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
