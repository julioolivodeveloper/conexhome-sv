export interface WizardFormData {
  // Step 1
  operation: 'venta' | 'alquiler' | ''
  property_type: string
  // Step 2
  title: string
  description: string
  price: string
  price_negotiable: boolean
  financing_available: boolean
  // Step 3
  bedrooms: string
  bathrooms: string
  parking_spots: string
  land_area: string
  construction_area: string
  area_unit: 'm2' | 'vara2' | 'manzana'
  amenity_ids: string[]
  // Step 4
  department: string
  municipality: string
  zone: string
  location_reference: string
  location_type: 'exact' | 'approximate'
  // Step 5
  images: File[]
  // Step 6
  contact_name: string
  contact_phone: string
  contact_whatsapp: string
  contact_preference: 'whatsapp' | 'phone' | 'message' | 'any'
  youtube_url: string
}

export const WIZARD_INITIAL: WizardFormData = {
  operation: '',
  property_type: '',
  title: '',
  description: '',
  price: '',
  price_negotiable: false,
  financing_available: false,
  bedrooms: '',
  bathrooms: '',
  parking_spots: '',
  land_area: '',
  construction_area: '',
  area_unit: 'm2',
  amenity_ids: [],
  department: '',
  municipality: '',
  zone: '',
  location_reference: '',
  location_type: 'approximate',
  images: [],
  contact_name: '',
  contact_phone: '',
  contact_whatsapp: '',
  contact_preference: 'any',
  youtube_url: '',
}
