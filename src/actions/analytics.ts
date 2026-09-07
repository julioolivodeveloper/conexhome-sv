'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function trackPropertyView(propertyId: string): Promise<void> {
  const admin = createAdminClient()
  await admin.rpc('increment_property_view', { p_property_id: propertyId })
}
