'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, ChevronDown } from 'lucide-react'
import { DEPARTMENTS } from '@/lib/constants/departments'

type Tab = 'comprar' | 'alquilar'

export default function SearchBar() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('comprar')
  const [department, setDepartment] = useState('')
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tab === 'alquilar') params.set('operacion', 'alquiler')
    if (department) params.set('departamento', department)
    if (query) params.set('q', query)
    const base = tab === 'comprar' ? '/comprar' : '/alquilar'
    router.push(`${base}?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-white/10 backdrop-blur-sm rounded-t-2xl border border-white/20 border-b-0 inline-flex w-auto">
        {(['comprar', 'alquilar'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-semibold rounded-t-2xl transition-all capitalize ${
              tab === t
                ? 'bg-white text-navy shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t === 'comprar' ? 'Comprar' : 'Alquilar'}
          </button>
        ))}
      </div>

      {/* Search box */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-2"
      >
        {/* Location */}
        <div className="relative flex-1 flex items-center">
          <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Departamento, ciudad, colonia…"
            className="w-full pl-9 pr-3 py-3 text-slate-800 placeholder-slate-400 text-sm bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-colors"
          />
        </div>

        {/* Department filter */}
        <div className="relative sm:w-44">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full pl-9 pr-8 py-3 text-sm text-slate-700 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white appearance-none transition-colors"
          >
            <option value="">Departamento</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-colors shadow-sm text-sm whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </form>
    </div>
  )
}
