'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createOrGetConversation(
  propertyId: string,
  sellerId: string
): Promise<{ conversationId?: string; error?: string; needsAuth?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado', needsAuth: true }
  if (user.id === sellerId) return { error: 'No puedes enviarte mensajes a ti mismo' }

  // Find existing conversation between these two users about this property
  const { data: myParticipations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  const myConvIds = myParticipations?.map((p) => p.conversation_id) ?? []

  if (myConvIds.length > 0) {
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('property_id', propertyId)
      .in('id', myConvIds)
      .limit(1)
      .maybeSingle()

    if (existing) return { conversationId: existing.id }
  }

  // Create new conversation
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .insert({ property_id: propertyId })
    .select('id')
    .single()

  if (convErr || !conv) return { error: 'Error al crear la conversación' }

  await supabase.from('conversation_participants').insert([
    { conversation_id: conv.id, user_id: user.id, unread_count: 0 },
    { conversation_id: conv.id, user_id: sellerId, unread_count: 0 },
  ])

  return { conversationId: conv.id }
}

export async function sendMessage(
  conversationId: string,
  body: string
): Promise<{ success?: boolean; error?: string }> {
  const trimmed = body.trim()
  if (!trimmed) return { error: 'El mensaje no puede estar vacío' }
  if (trimmed.length > 2000) return { error: 'El mensaje es demasiado largo' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  // Verify user is a participant
  const { data: participation } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!participation) return { error: 'No tienes acceso a esta conversación' }

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: trimmed,
  })

  if (error) return { error: 'Error al enviar el mensaje' }

  revalidatePath(`/mensajes/${conversationId}`)
  return { success: true }
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('conversation_participants')
    .update({ unread_count: 0 })
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
}
