import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MessageSquare, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils/format'

export const metadata: Metadata = {
  title: 'Mis mensajes — ConexHome SV',
}

interface Conversation {
  id: string
  updated_at: string
  unread_count: number
  property_slug: string | null
  property_title: string | null
  property_cover: string | null
  property_location: string | null
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  // Get my conversation participations
  const { data: participations } = await supabase
    .from('conversation_participants')
    .select('conversation_id, unread_count')
    .eq('user_id', user.id)

  const myConvIds = participations?.map((p) => p.conversation_id) ?? []
  const unreadMap = new Map(participations?.map((p) => [p.conversation_id, p.unread_count]) ?? [])

  let conversations: Conversation[] = []

  if (myConvIds.length > 0) {
    const { data: convRows } = await supabase
      .from('conversations')
      .select(`
        id, updated_at,
        properties(slug, title, cover_image_url, municipality, department)
      `)
      .in('id', myConvIds)
      .order('updated_at', { ascending: false })

    conversations = (convRows ?? []).map((c) => {
      const p = c.properties as {
        slug: string; title: string; cover_image_url: string | null;
        municipality: string; department: string
      } | null
      return {
        id: c.id,
        updated_at: c.updated_at,
        unread_count: unreadMap.get(c.id) ?? 0,
        property_slug: p?.slug ?? null,
        property_title: p?.title ?? null,
        property_cover: p?.cover_image_url ?? null,
        property_location: p ? `${p.municipality}, ${p.department}` : null,
      }
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-navy py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-300" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis mensajes</h1>
          </div>
          <p className="text-slate-300 text-sm mt-1">
            {conversations.length} {conversations.length === 1 ? 'conversación' : 'conversaciones'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/mensajes/${conv.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-md hover:border-accent/20 transition-all group"
              >
                {/* Property thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {conv.property_cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={conv.property_cover}
                      alt={conv.property_title ?? 'Propiedad'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate group-hover:text-accent transition-colors">
                    {conv.property_title ?? 'Propiedad eliminada'}
                  </p>
                  {conv.property_location && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{conv.property_location}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(conv.updated_at)}</p>
                </div>

                {/* Unread badge */}
                {conv.unread_count > 0 && (
                  <div className="flex-shrink-0 min-w-5 h-5 px-1.5 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{conv.unread_count}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-200" />
            </div>
            <h2 className="text-lg font-semibold text-slate-600 mb-2">
              Todavía no tienes mensajes
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              Cuando contactes a un propietario o recibas consultas sobre tus propiedades, aparecerán aquí.
            </p>
            <Link
              href="/comprar"
              className="px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
            >
              Explorar propiedades
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
