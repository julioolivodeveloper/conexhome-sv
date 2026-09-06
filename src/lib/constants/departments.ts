export interface Department {
  name: string
  slug: string
  capital: string
  propertyCount?: number
}

export const DEPARTMENTS: Department[] = [
  { name: 'Ahuachapán', slug: 'ahuachapan', capital: 'Ahuachapán' },
  { name: 'Sonsonate', slug: 'sonsonate', capital: 'Sonsonate' },
  { name: 'Santa Ana', slug: 'santa-ana', capital: 'Santa Ana' },
  { name: 'Chalatenango', slug: 'chalatenango', capital: 'Chalatenango' },
  { name: 'La Libertad', slug: 'la-libertad', capital: 'Nueva San Salvador' },
  { name: 'San Salvador', slug: 'san-salvador', capital: 'San Salvador' },
  { name: 'Cuscatlán', slug: 'cuscatlan', capital: 'Cojutepeque' },
  { name: 'La Paz', slug: 'la-paz', capital: 'Zacatecoluca' },
  { name: 'Cabañas', slug: 'cabanas', capital: 'Sensuntepeque' },
  { name: 'San Vicente', slug: 'san-vicente', capital: 'San Vicente' },
  { name: 'Usulután', slug: 'usulutan', capital: 'Usulután' },
  { name: 'San Miguel', slug: 'san-miguel', capital: 'San Miguel' },
  { name: 'Morazán', slug: 'morazan', capital: 'San Francisco Gotera' },
  { name: 'La Unión', slug: 'la-union', capital: 'La Unión' },
]

export const DEPARTMENTS_BY_SLUG = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.slug, d])
)
