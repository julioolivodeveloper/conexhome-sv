export const APP_CONFIG = {
  MAX_FREE_PROPERTIES: 5,
  MAX_IMAGES_PER_PROPERTY: 10,
  MAX_IMAGE_SIZE_KB: 500,
  MAX_IMAGE_WIDTH_PX: 1600,
  IMAGE_QUALITY: 85,
  PROPERTY_SLUG_MAX_LENGTH: 120,
} as const

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ConexHome SV'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexhomesv.com'
export const PLATFORM_WHATSAPP = process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP ?? '50300000000'
