'use client'

import { useEffect, useRef } from 'react'
import { formatPrice } from '@/lib/utils/format'
import { DEPARTMENT_CENTERS, EL_SALVADOR_CENTER, EL_SALVADOR_ZOOM } from '@/lib/constants/map-centers'

export interface MapProperty {
  id: string
  slug: string
  title: string
  price: number | null
  operation: string
  latitude: number | null
  longitude: number | null
  department: string
  municipality: string
  cover_image_url: string | null
}

interface Props {
  properties: MapProperty[]
  height?: string
}

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
}

export default function PropertyMap({ properties, height = '500px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const markersRef = useRef<unknown[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    let map: {
      addControl: (c: unknown, pos: string) => void
      setCenter: (c: [number, number]) => void
      flyTo: (opts: unknown) => void
      remove: () => void
      on: (event: string, cb: () => void) => void
    } | null = null

    import('maplibre-gl').then((maplibregl) => {
      if (!containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MapGL = (maplibregl as any).default ?? maplibregl

      map = new MapGL.Map({
        container: containerRef.current,
        style: OSM_STYLE,
        center: EL_SALVADOR_CENTER,
        zoom: EL_SALVADOR_ZOOM,
      })

      mapRef.current = map

      map!.addControl(new MapGL.NavigationControl(), 'top-right')

      map!.on('load', () => {
        // Clear existing markers
        markersRef.current.forEach((m) => (m as { remove: () => void }).remove())
        markersRef.current = []

        const bounds: [[number, number], [number, number]] = [
          [Infinity, Infinity],
          [-Infinity, -Infinity],
        ]

        properties.forEach((property) => {
          // Get coords: exact or department center fallback
          const center = DEPARTMENT_CENTERS[property.department]
          const lng = property.longitude ?? center?.[0] ?? EL_SALVADOR_CENTER[0]
          const lat = property.latitude ?? center?.[1] ?? EL_SALVADOR_CENTER[1]

          // Update bounds
          bounds[0][0] = Math.min(bounds[0][0], lng)
          bounds[0][1] = Math.min(bounds[0][1], lat)
          bounds[1][0] = Math.max(bounds[1][0], lng)
          bounds[1][1] = Math.max(bounds[1][1], lat)

          // Marker element
          const el = document.createElement('div')
          el.className = 'property-marker'
          el.style.cssText = `
            background: ${property.operation === 'venta' ? '#2563eb' : '#16a34a'};
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            border: 2px solid white;
            transition: transform 0.15s;
          `
          el.textContent = property.price ? formatPrice(property.price, property.operation) : property.municipality
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.1)' })
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
          el.addEventListener('click', () => {
            window.open(`/propiedades/${property.slug}`, '_blank')
          })

          // Popup
          const popupHTML = `
            <div style="min-width:180px;max-width:220px;">
              ${property.cover_image_url ? `<img src="${property.cover_image_url}" alt="${property.title}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;">` : ''}
              <p style="font-size:13px;font-weight:600;color:#1a3557;margin:0 0 4px;line-height:1.3;">${property.title}</p>
              <p style="font-size:11px;color:#64748b;margin:0 0 6px;">📍 ${property.municipality}, ${property.department}</p>
              ${property.price ? `<p style="font-size:14px;font-weight:700;color:#2563eb;margin:0 0 8px;">${formatPrice(property.price, property.operation)}</p>` : ''}
              <a href="/propiedades/${property.slug}" style="display:block;background:#2563eb;color:white;text-align:center;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;" target="_blank">Ver propiedad</a>
            </div>
          `

          const popup = new MapGL.Popup({ offset: 15, closeButton: false })
            .setHTML(popupHTML)

          const marker = new MapGL.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map!)

          markersRef.current.push(marker)
        })

        // Fit map to bounds if there are properties
        if (properties.length > 0 && bounds[0][0] !== Infinity) {
          if (properties.length === 1) {
            map!.flyTo({ center: [bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2, bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2], zoom: 13 })
          } else {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(map as any).fitBounds(bounds, { padding: 60, maxZoom: 14 })
            } catch {
              // ignore bounds error for single-point clusters
            }
          }
        }
      })
    })

    return () => {
      if (map) map.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={containerRef} style={{ height }} />
      <p className="absolute bottom-2 left-2 text-[10px] text-slate-500 bg-white/80 px-2 py-0.5 rounded-full">
        {properties.length} propiedad{properties.length !== 1 ? 'es' : ''}
      </p>
    </div>
  )
}
