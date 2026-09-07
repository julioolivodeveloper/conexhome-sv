'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/actions/favorites'

interface Props {
  propertyId: string
  initialFavorited?: boolean
  size?: 'sm' | 'md'
}

export default function FavoriteButton({ propertyId, initialFavorited = false, size = 'sm' }: Props) {
  const router = useRouter()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      const result = await toggleFavorite(propertyId)
      if (result.needsAuth) {
        router.push('/iniciar-sesion')
        return
      }
      if (result.favorited !== undefined) {
        setFavorited(result.favorited)
      }
    })
  }

  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  const btnSize = size === 'md' ? 'w-10 h-10' : 'w-8 h-8'

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${btnSize} bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed`}
      aria-label={favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <Heart
        className={`${iconSize} transition-colors ${
          favorited ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'
        }`}
      />
    </button>
  )
}
