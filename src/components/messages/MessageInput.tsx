'use client'

import { useState, useTransition, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { sendMessage } from '@/actions/messages'

interface Props {
  conversationId: string
}

export default function MessageInput({ conversationId }: Props) {
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setError('')
    startTransition(async () => {
      const result = await sendMessage(conversationId, body)
      if (result.error) {
        setError(result.error)
        return
      }
      setBody('')
      textareaRef.current?.focus()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
      {error && (
        <p className="text-xs text-red-500 mb-2">{error}</p>
      )}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje… (Enter para enviar)"
          rows={2}
          maxLength={2000}
          className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-sm text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="flex-shrink-0 w-11 h-11 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Enviar mensaje"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-1.5">Shift+Enter para salto de línea</p>
    </form>
  )
}
