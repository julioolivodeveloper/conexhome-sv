export function formatPrice(price: number, operation?: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  if (operation === 'alquiler') return `${formatted}/mes`
  return formatted
}

export function formatArea(area: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    m2: 'm²',
    vara2: 'v²',
    manzana: 'mz',
  }
  return `${area.toLocaleString('es-SV')} ${unitLabels[unit] ?? unit}`
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Hace 1 día'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

export function formatWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^0/, '503')
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'casa': 'Casa',
    'apartamento': 'Apartamento',
    'terreno': 'Terreno',
    'finca': 'Finca',
    'local-comercial': 'Local comercial',
    'oficina': 'Oficina',
    'bodega': 'Bodega',
    'edificio': 'Edificio',
    'rancho': 'Rancho',
    'casa-de-playa': 'Casa de playa',
    'proyecto-residencial': 'Proyecto residencial',
    'otro': 'Otro',
  }
  return labels[type] ?? type
}
