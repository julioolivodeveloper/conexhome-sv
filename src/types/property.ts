export type PropertyOperation = 'venta' | 'alquiler'

export type PropertyStatus =
  | 'borrador'
  | 'publicada'
  | 'pausada'
  | 'vendida'
  | 'alquilada'
  | 'eliminada'

export type PropertyType =
  | 'casa'
  | 'apartamento'
  | 'terreno'
  | 'finca'
  | 'local-comercial'
  | 'oficina'
  | 'bodega'
  | 'edificio'
  | 'rancho'
  | 'casa-de-playa'
  | 'proyecto-residencial'
  | 'otro'

export type AreaUnit = 'm2' | 'vara2' | 'manzana'

export type ContactPreference = 'whatsapp' | 'phone' | 'message' | 'any'

export interface PropertyImage {
  id: string
  property_id: string
  public_url: string
  display_order: number
  is_cover: boolean
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  operation: PropertyOperation
  property_type: PropertyType
  status: PropertyStatus
  price: number
  price_negotiable: boolean
  financing_available: boolean
  bedrooms?: number
  bathrooms?: number
  parking_spots?: number
  land_area?: number
  construction_area?: number
  area_unit: AreaUnit
  department: string
  municipality: string
  zone?: string
  location_reference?: string
  latitude?: number
  longitude?: number
  contact_name: string
  contact_phone?: string
  contact_whatsapp?: string
  contact_preference: ContactPreference
  cover_image_url?: string
  images: PropertyImage[]
  amenities?: string[]
  is_featured: boolean
  view_count: number
  created_at: string
  published_at?: string
}
