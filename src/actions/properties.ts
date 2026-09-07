'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/validations/property'
import { generateSlug } from '@/lib/utils/slug'
import { APP_CONFIG } from '@/config/app'

export async function createProperty(formData: unknown) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  // Check property limit (redundant with RLS, belt-and-suspenders)
  const { data: limitOk } = await supabase.rpc('check_property_limit', {
    p_user_id: user.id,
  })
  if (!limitOk) {
    return {
      error: `Alcanzaste el límite de ${APP_CONFIG.MAX_FREE_PROPERTIES} propiedades activas gratuitas.`,
    }
  }

  const parsed = propertySchema.safeParse(formData)
  if (!parsed.success) {
    return { error: 'Datos inválidos', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { amenity_ids, publish_now, ...rest } = parsed.data

  const propertyId = crypto.randomUUID()
  const slug = generateSlug(rest.title, propertyId)

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      id: propertyId,
      slug,
      user_id: user.id,
      operation: rest.operation,
      property_type: rest.property_type,
      title: rest.title,
      description: rest.description || null,
      price: rest.price ?? null,
      price_negotiable: rest.price_negotiable,
      financing_available: rest.financing_available,
      bedrooms: rest.bedrooms ?? null,
      bathrooms: rest.bathrooms ?? null,
      parking_spots: rest.parking_spots ?? null,
      land_area: rest.land_area ?? null,
      construction_area: rest.construction_area ?? null,
      area_unit: rest.area_unit,
      department: rest.department,
      municipality: rest.municipality,
      zone: rest.zone || null,
      location_reference: rest.location_reference || null,
      latitude: rest.latitude ?? null,
      longitude: rest.longitude ?? null,
      location_type: rest.location_type,
      contact_name: rest.contact_name || null,
      contact_phone: rest.contact_phone || null,
      contact_whatsapp: rest.contact_whatsapp || null,
      contact_preference: rest.contact_preference,
      youtube_url: rest.youtube_url || null,
      status: publish_now ? 'publicada' : 'borrador',
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23514' || error.message?.includes('check_property_limit')) {
      return {
        error: `Alcanzaste el límite de ${APP_CONFIG.MAX_FREE_PROPERTIES} propiedades activas gratuitas.`,
      }
    }
    return { error: 'Error al crear la propiedad. Intenta de nuevo.' }
  }

  if (amenity_ids.length > 0) {
    await supabase.from('property_amenities').insert(
      amenity_ids.map((id) => ({ property_id: property.id, amenity_id: id }))
    )
  }

  revalidatePath('/panel/propiedades')
  return { success: true, propertyId: property.id, slug: property.slug }
}

export async function addPropertyImages(
  propertyId: string,
  images: Array<{
    storage_path: string
    public_url: string
    display_order: number
    is_cover: boolean
  }>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  // Verify property belongs to user
  const { data: prop } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('user_id', user.id)
    .single()

  if (!prop) return { error: 'Propiedad no encontrada' }

  if (images.length > 0) {
    const { error } = await supabase
      .from('property_images')
      .insert(images.map((img) => ({ ...img, property_id: propertyId })))

    if (error) return { error: 'Error al guardar imágenes' }

    const cover = images.find((i) => i.is_cover) ?? images[0]
    await supabase
      .from('properties')
      .update({ cover_image_url: cover.public_url })
      .eq('id', propertyId)
      .eq('user_id', user.id)
  }

  revalidatePath('/panel/propiedades')
  return { success: true }
}

export async function updatePropertyStatus(
  propertyId: string,
  status: 'publicada' | 'pausada' | 'vendida' | 'alquilada' | 'eliminada'
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', propertyId)
    .eq('user_id', user.id)

  if (error) return { error: 'No se pudo actualizar el estado' }

  revalidatePath('/panel/propiedades')
  return { success: true }
}
