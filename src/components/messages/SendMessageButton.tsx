'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Loader2 } from 'lucide-react'
import { createOrGetConversation } from '@/actions/messages'

interface Props {
  propertyId: string
  sellerId: string
  currentUserId: string | null
}

export default function SendMessageButton({ propertyId, sellerId, currentUserId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  if (currentUserId === sellerId) return null

  if (!currentUserId) {
    return (
      <a
        href="/iniciar-sesion"
        className="flex items-center justify-center gap-2.5 w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors text-sm"
      >
        <MessageSquare className="w-4 h-4" />
        Inicia sesión para enviar mensaje
      </a>
    )
  }

  const handleClick = () => {
    setError('')
    startTransition(async () => {
      const result = await createOrGetConversation(propertyId, sellerId)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.conversationId) {
        router.push(`/mensajes/${result.conversationId}`)
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center justify-center gap-2.5 w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}
        {isPending ? 'Abriendo chat…' : 'Enviar mensaje'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>}
    </div>
  )
}
