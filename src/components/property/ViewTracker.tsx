'use client'

import { useEffect, useRef } from 'react'
import { trackPropertyView } from '@/actions/analytics'

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackPropertyView(propertyId)
  }, [propertyId])

  return null
}
