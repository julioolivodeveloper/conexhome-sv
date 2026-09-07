'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleFavorite(
  propertyId: string
): Promise<{ favorited?: boolean; error?: string; needsAuth?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado', needsAuth: true }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    revalidatePath('/favoritos')
    revalidatePath('/panel')
    return { favorited: false }
  }

  await supabase.from('favorites').insert({ user_id: user.id, property_id: propertyId })
  revalidatePath('/favoritos')
  revalidatePath('/panel')
  return { favorited: true }
}
