export interface PropertyTypeOption {
  value: string
  label: string
  slug: string
  icon: string
}

export const PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: 'casa', label: 'Casa', slug: 'casas', icon: '🏠' },
  { value: 'apartamento', label: 'Apartamento', slug: 'apartamentos', icon: '🏢' },
  { value: 'terreno', label: 'Terreno', slug: 'terrenos', icon: '🌿' },
  { value: 'finca', label: 'Finca', slug: 'fincas', icon: '🌾' },
  { value: 'local-comercial', label: 'Local comercial', slug: 'locales-comerciales', icon: '🏪' },
  { value: 'oficina', label: 'Oficina', slug: 'oficinas', icon: '🏬' },
  { value: 'bodega', label: 'Bodega', slug: 'bodegas', icon: '🏭' },
  { value: 'edificio', label: 'Edificio', slug: 'edificios', icon: '🏗️' },
  { value: 'rancho', label: 'Rancho', slug: 'ranchos', icon: '🏡' },
  { value: 'casa-de-playa', label: 'Casa de playa', slug: 'casas-de-playa', icon: '🏖️' },
  { value: 'proyecto-residencial', label: 'Proyecto residencial', slug: 'proyectos-residenciales', icon: '🏘️' },
  { value: 'otro', label: 'Otro', slug: 'otros', icon: '📋' },
]

export const PROPERTY_TYPES_BY_VALUE = Object.fromEntries(
  PROPERTY_TYPES.map((t) => [t.value, t])
)
