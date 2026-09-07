'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { List, Map } from 'lucide-react'
import type { MapProperty } from '@/components/map/PropertyMap'

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-slate-100 animate-pulse" style={{ height: '500px' }} />
  ),
})

interface Props {
  properties: MapProperty[]
  children: React.ReactNode
}

export default function MapViewToggle({ properties, children }: Props) {
  const [view, setView] = useState<'lista' | 'mapa'>('lista')

  return (
    <div>
      {/* Toggle buttons */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setView('lista')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
              view === 'lista'
                ? 'bg-accent text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Lista
          </button>
          <button
            onClick={() => setView('mapa')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
              view === 'mapa'
                ? 'bg-accent text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Mapa
          </button>
        </div>
      </div>

      {view === 'lista' ? (
        children
      ) : (
        <PropertyMap properties={properties} height="600px" />
      )}
    </div>
  )
}
