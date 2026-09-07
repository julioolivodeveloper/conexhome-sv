import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import MessageThread from '@/components/messages/MessageThread'
import { markConversationRead } from '@/actions/messages'

export const metadata: Metadata = {
  title: 'Conversación — ConexHome SV',
}

interface PageProps {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  // Verify user is a participant (RLS enforces this, no data = not a participant)
  const { data: participation } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!participation) notFound()

  // Fetch conversation + property info
  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      id, updated_at,
      properties(slug, title, cover_image_url, municipality, department, user_id)
    `)
    .eq('id', conversationId)
    .single()

  if (!conv) notFound()

  // Fetch messages with sender names
  const { data: messageRows } = await supabase
    .from('messages')
    .select(`
      id, body, sender_id, created_at,
      profiles(full_name)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  const messages = (messageRows ?? []).map((m) => ({
    id: m.id,
    body: m.body,
    sender_id: m.sender_id,
    created_at: m.created_at,
    sender_name: (m.profiles as { full_name: string } | null)?.full_name ?? null,
  }))

  // Mark as read
  await markConversationRead(conversationId)

  const property = conv.properties as {
    slug: string; title: string; cover_image_url: string | null;
    municipality: string; department: string; user_id: string
  } | null

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/mensajes"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-navy transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Mensajes
          </Link>

          {property && (
            <>
              <div className="w-px h-5 bg-slate-200" />
              <Link
                href={`/propiedades/${property.slug}`}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  {property.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.cover_image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">{property.title}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {property.municipality}, {property.department}
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
        <div className="flex-1 bg-white border-x border-slate-100 overflow-hidden flex flex-col">
          <MessageThread
            conversationId={conversationId}
            currentUserId={user.id}
            initialMessages={messages}
          />
        </div>
      </div>
    </main>
  )
}
