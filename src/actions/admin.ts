'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return null
  return { userId: user.id, supabase, adminClient: createAdminClient() }
}

async function logAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  notes?: string
) {
  const admin = createAdminClient()
  await admin.from('admin_actions').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    notes: notes ?? null,
  })
}

export async function setPropertyHidden(
  propertyId: string,
  hidden: boolean
): Promise<{ error?: string }> {
  const ctx = await verifyAdmin()
  if (!ctx) return { error: 'No autorizado' }

  await ctx.adminClient
    .from('properties')
    .update({ is_hidden: hidden })
    .eq('id', propertyId)

  await logAction(ctx.userId, hidden ? 'hide_property' : 'show_property', 'property', propertyId)
  revalidatePath('/admin/propiedades')
  return {}
}

export async function setPropertyFeatured(
  propertyId: string,
  featured: boolean
): Promise<{ error?: string }> {
  const ctx = await verifyAdmin()
  if (!ctx) return { error: 'No autorizado' }

  await ctx.adminClient
    .from('properties')
    .update({ is_featured: featured })
    .eq('id', propertyId)

  await logAction(ctx.userId, featured ? 'feature_property' : 'unfeature_property', 'property', propertyId)
  revalidatePath('/admin/propiedades')
  return {}
}

export async function setPropertyStatus(
  propertyId: string,
  status: string
): Promise<{ error?: string }> {
  const ctx = await verifyAdmin()
  if (!ctx) return { error: 'No autorizado' }

  await ctx.adminClient
    .from('properties')
    .update({ status })
    .eq('id', propertyId)

  await logAction(ctx.userId, 'change_status', 'property', propertyId, `status → ${status}`)
  revalidatePath('/admin/propiedades')
  return {}
}

export async function setUserSuspended(
  userId: string,
  suspended: boolean
): Promise<{ error?: string }> {
  const ctx = await verifyAdmin()
  if (!ctx) return { error: 'No autorizado' }

  await ctx.adminClient
    .from('profiles')
    .update({ is_suspended: suspended })
    .eq('id', userId)

  await logAction(ctx.userId, suspended ? 'suspend_user' : 'unsuspend_user', 'user', userId)
  revalidatePath('/admin/usuarios')
  return {}
}

export async function resolveReport(
  reportId: string,
  status: 'revisando' | 'resuelto'
): Promise<{ error?: string }> {
  const ctx = await verifyAdmin()
  if (!ctx) return { error: 'No autorizado' }

  if (status === 'resuelto') {
    await ctx.adminClient.from('reports').update({
      status,
      resolved_by: ctx.userId,
      resolved_at: new Date().toISOString(),
    }).eq('id', reportId)
  } else {
    await ctx.adminClient.from('reports').update({ status }).eq('id', reportId)
  }

  await logAction(ctx.userId, 'resolve_report', 'report', reportId, `status → ${status}`)
  revalidatePath('/admin/reportes')
  return {}
}
