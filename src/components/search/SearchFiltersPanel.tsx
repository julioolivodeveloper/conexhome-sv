'use client'

import { useCallback, useState, useTransition, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants/property-types'
import { DEPARTMENTS } from '@/lib/constants/departments'
import { MUNICIPALITIES } from '@/lib/constants/municipalities'
import { activeFilterCount } from '@/lib/utils/search'

interface Props {
  lockedOperation?: 'venta' | 'alquiler'
  totalResults: number
}

function FiltersInner({ lockedOperation, totalResults }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(false)

  const get = (key: string) => searchParams.get(key) ?? ''

  const filters = {
    q:            get('q'),
    operacion:    get('operacion'),
    tipo:         get('tipo'),
    departamento: get('departamento'),
    municipio:    get('municipio'),
    precio_min:   get('precio_min'),
    precio_max:   get('precio_max'),
    hab_min:      get('hab_min'),
  }

  const activeCount = activeFilterCount(filters)

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      params.delete('pagina')
      return params.toString()
    },
    [searchParams]
  )

  const update = (key: string, value: string | null) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value })}`, { scroll: false })
    })
  }

  const clearAll = () => {
    startTransition(() => {
      const params = lockedOperation ? `operacion=${lockedOperation}` : ''
      router.push(`${pathname}${params ? '?' + params : ''}`, { scroll: false })
    })
  }

  const inputClass =
    'w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-white'

  const municipalities = filters.departamento ? (MUNICIPALITIES[filters.departamento] ?? []) : []

  return (
    <div className={`bg-white border-b border-slate-100 ${isPending ? 'opacity-75' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Main row */}
        <div className="flex gap-2">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update('q', e.target.value || null)}
              placeholder="Buscar por título..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>

          {/* Filters toggle button */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
              expanded || activeCount > 0
                ? 'border-accent bg-accent-light text-accent'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeCount > 0 && (
              <span className="bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Clear button */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
              title="Limpiar filtros"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Operation (if not locked) */}
            {!lockedOperation && (
              <select
                value={filters.operacion}
                onChange={(e) => update('operacion', e.target.value || null)}
                className={inputClass}
              >
                <option value="">Operación</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            )}

            {/* Property type */}
            <select
              value={filters.tipo}
              onChange={(e) => update('tipo', e.target.value || null)}
              className={inputClass}
            >
              <option value="">Tipo</option>
              {PROPERTY_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Department */}
            <select
              value={filters.departamento}
              onChange={(e) => {
                const qs = createQueryString({ departamento: e.target.value || null, municipio: null })
                startTransition(() => router.push(`${pathname}?${qs}`, { scroll: false }))
              }}
              className={inputClass}
            >
              <option value="">Departamento</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Municipality */}
            <select
              value={filters.municipio}
              onChange={(e) => update('municipio', e.target.value || null)}
              disabled={!filters.departamento}
              className={inputClass}
            >
              <option value="">Municipio</option>
              {municipalities.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Price min */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
              <input
                type="number"
                value={filters.precio_min}
                onChange={(e) => update('precio_min', e.target.value || null)}
                placeholder="Precio mín."
                min={0}
                className={`${inputClass} pl-6`}
              />
            </div>

            {/* Price max */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
              <input
                type="number"
                value={filters.precio_max}
                onChange={(e) => update('precio_max', e.target.value || null)}
                placeholder="Precio máx."
                min={0}
                className={`${inputClass} pl-6`}
              />
            </div>

            {/* Bedrooms min */}
            <select
              value={filters.hab_min}
              onChange={(e) => update('hab_min', e.target.value || null)}
              className={inputClass}
            >
              <option value="">Habitaciones</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        )}

        {/* Results count + active chips */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400">
            {isPending ? 'Buscando…' : `${totalResults} propiedad${totalResults !== 1 ? 'es' : ''} encontrada${totalResults !== 1 ? 's' : ''}`}
          </p>
          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex gap-1.5 flex-wrap justify-end">
              {filters.tipo && (
                <span className="inline-flex items-center gap-1 text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full">
                  {PROPERTY_TYPES.find(t => t.value === filters.tipo)?.label ?? filters.tipo}
                  <button onClick={() => update('tipo', null)}><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {filters.departamento && (
                <span className="inline-flex items-center gap-1 text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full">
                  {filters.departamento}
                  <button onClick={() => update('departamento', null)}><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {(filters.precio_min || filters.precio_max) && (
                <span className="inline-flex items-center gap-1 text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full">
                  ${filters.precio_min || '0'} – ${filters.precio_max || '∞'}
                  <button onClick={() => { update('precio_min', null); update('precio_max', null) }}><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {filters.hab_min && (
                <span className="inline-flex items-center gap-1 text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full">
                  {filters.hab_min}+ hab.
                  <button onClick={() => update('hab_min', null)}><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchFiltersPanel(props: Props) {
  return (
    <Suspense fallback={
      <div className="bg-white border-b border-slate-100 py-3 px-4">
        <div className="h-9 bg-slate-100 rounded-xl animate-pulse max-w-xl" />
      </div>
    }>
      <FiltersInner {...props} />
    </Suspense>
  )
}
