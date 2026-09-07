'use client'

import { useState, useEffect, useRef } from 'react'
import { formatRelativeTime } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import MessageInput from './MessageInput'

interface Message {
  id: string
  body: string
  sender_id: string
  created_at: string
  sender_name: string | null
}

interface Props {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
}

export default function MessageThread({ conversationId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as { id: string; body: string; sender_id: string; created_at: string }
          // Avoid duplicates (Server Action revalidatePath may already add it via SSR)
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev
            return [
              ...prev,
              {
                id: row.id,
                body: row.body,
                sender_id: row.sender_id,
                created_at: row.created_at,
                sender_name: null,
              },
            ]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">
              Aún no hay mensajes. ¡Empieza la conversación!
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!isMine && msg.sender_name && (
                  <span className="text-xs text-slate-500 px-1">{msg.sender_name}</span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isMine
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.body}
                </div>
                <span className="text-xs text-slate-400 px-1">
                  {formatRelativeTime(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput conversationId={conversationId} />
    </div>
  )
}
