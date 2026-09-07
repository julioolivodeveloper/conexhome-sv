'use client'

import { useTransition } from 'react'
import { Eye, EyeOff, Star, StarOff, Loader2 } from 'lucide-react'
import { setPropertyHidden, setPropertyFeatured } from '@/actions/admin'

interface Props {
  propertyId: string
  isHidden: boolean
  isFeatured: boolean
}

export default function PropertyAdminActions({ propertyId, isHidden, isFeatured }: Props) {
  const [isPending, startTransition] = useTransition()

  const toggle = (action: () => Promise<{ error?: string }>) => {
    startTransition(async () => {
      const res = await action()
      if (res.error) alert(res.error)
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => toggle(() => setPropertyFeatured(propertyId, !isFeatured))}
        disabled={isPending}
        title={isFeatured ? 'Quitar destacado' : 'Destacar'}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          isFeatured ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
        }`}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isFeatured ? <Star className="w-3.5 h-3.5" /> : <StarOff className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={() => toggle(() => setPropertyHidden(propertyId, !isHidden))}
        disabled={isPending}
        title={isHidden ? 'Mostrar propiedad' : 'Ocultar propiedad'}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          isHidden ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
      >
        {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}
