'use client'

import dynamic from 'next/dynamic'
import type { MapProperty } from './PropertyMap'

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl bg-slate-200 animate-pulse"
      style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}
    />
  ),
})

interface Props {
  properties: MapProperty[]
}

export default function MapPageClient({ properties }: Props) {
  return <PropertyMap properties={properties} height="calc(100vh - 250px)" />
}
