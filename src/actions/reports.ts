'use server'

import { createClient } from '@/lib/supabase/server'

const REPORT_REASONS = [
  'Información falsa o engañosa',
  'Precio incorrecto',
  'Propiedad ya vendida/alquilada',
  'Fotos no corresponden a la propiedad',
  'Contenido inapropiado u ofensivo',
  'Posible fraude o estafa',
  'Duplicado de otra publicación',
  'Otro motivo',
]

export { REPORT_REASONS }

export async function createReport(
  propertyId: string,
  reason: string,
  description: string
): Promise<{ success?: boolean; error?: string }> {
  if (!REPORT_REASONS.includes(reason)) return { error: 'Motivo inválido' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para reportar' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    property_id: propertyId,
    reason,
    description: description.trim() || null,
    status: 'pendiente',
  })

  if (error) return { error: 'Error al enviar el reporte' }
  return { success: true }
}
