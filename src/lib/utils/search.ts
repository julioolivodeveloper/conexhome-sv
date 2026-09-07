export interface SearchFilters {
  q?: string
  operacion?: string
  tipo?: string
  departamento?: string
  municipio?: string
  precio_min?: string
  precio_max?: string
  hab_min?: string
  pagina?: string
}

export const PAGE_SIZE = 12

export function parseSearchFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
  const get = (key: string) => {
    const v = params[key]
    return typeof v === 'string' ? v.trim() : undefined
  }
  return {
    q:             get('q'),
    operacion:     get('operacion'),
    tipo:          get('tipo'),
    departamento:  get('departamento'),
    municipio:     get('municipio'),
    precio_min:    get('precio_min'),
    precio_max:    get('precio_max'),
    hab_min:       get('hab_min'),
    pagina:        get('pagina'),
  }
}

export function buildSearchQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: SearchFilters
) {
  if (filters.q) {
    query = query.ilike('title', `%${filters.q}%`)
  }
  if (filters.operacion) {
    query = query.eq('operation', filters.operacion)
  }
  if (filters.tipo) {
    query = query.eq('property_type', filters.tipo)
  }
  if (filters.departamento) {
    query = query.eq('department', filters.departamento)
  }
  if (filters.municipio) {
    query = query.eq('municipality', filters.municipio)
  }
  if (filters.precio_min) {
    const min = parseFloat(filters.precio_min)
    if (!isNaN(min)) query = query.gte('price', min)
  }
  if (filters.precio_max) {
    const max = parseFloat(filters.precio_max)
    if (!isNaN(max)) query = query.lte('price', max)
  }
  if (filters.hab_min) {
    const min = parseInt(filters.hab_min)
    if (!isNaN(min)) query = query.gte('bedrooms', min)
  }
  return query
}

export function activeFilterCount(filters: SearchFilters, excludeOperation = true): number {
  let count = 0
  if (filters.q) count++
  if (!excludeOperation && filters.operacion) count++
  if (filters.tipo) count++
  if (filters.departamento) count++
  if (filters.municipio) count++
  if (filters.precio_min || filters.precio_max) count++
  if (filters.hab_min) count++
  return count
}
