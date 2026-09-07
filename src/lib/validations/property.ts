import { z } from 'zod'

export const propertySchema = z.object({
  operation: z.enum(['venta', 'alquiler']),
  property_type: z.string().min(1, 'Selecciona el tipo de propiedad'),
  title: z.string().min(10, 'Mínimo 10 caracteres').max(120, 'Máximo 120 caracteres'),
  description: z.string().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
  price: z.coerce.number().positive('El precio debe ser mayor a 0').nullable().optional(),
  price_negotiable: z.boolean().default(false),
  financing_available: z.boolean().default(false),
  bedrooms: z.coerce.number().int().min(0).max(50).nullable().optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).nullable().optional(),
  parking_spots: z.coerce.number().int().min(0).max(50).nullable().optional(),
  land_area: z.coerce.number().positive().nullable().optional(),
  construction_area: z.coerce.number().positive().nullable().optional(),
  area_unit: z.enum(['m2', 'vara2', 'manzana']).default('m2'),
  amenity_ids: z.array(z.string()).default([]),
  department: z.string().min(1, 'Selecciona el departamento'),
  municipality: z.string().min(1, 'Selecciona el municipio'),
  zone: z.string().max(100).optional().or(z.literal('')),
  location_reference: z.string().max(300).optional().or(z.literal('')),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  location_type: z.enum(['exact', 'approximate']).default('approximate'),
  contact_name: z.string().max(100).optional().or(z.literal('')),
  contact_phone: z.string().max(20).optional().or(z.literal('')),
  contact_whatsapp: z.string().max(20).optional().or(z.literal('')),
  contact_preference: z.enum(['whatsapp', 'phone', 'message', 'any']).default('any'),
  youtube_url: z.string().max(200).optional().or(z.literal('')),
  publish_now: z.boolean().default(true),
})

export type PropertyFormData = z.infer<typeof propertySchema>
