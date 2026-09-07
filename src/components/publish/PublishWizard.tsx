'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createProperty, addPropertyImages } from '@/actions/properties'
import { WIZARD_INITIAL, type WizardFormData } from '@/types/wizard'
import { APP_CONFIG } from '@/config/app'
import Step1Operation from './Step1Operation'
import Step2Info from './Step2Info'
import Step3Features from './Step3Features'
import Step4Location from './Step4Location'
import Step5Photos from './Step5Photos'
import Step6Contact from './Step6Contact'
import Step7Review from './Step7Review'

interface Amenity {
  id: string
  name: string
  icon: string | null
}

interface PublishWizardProps {
  amenities: Amenity[]
  userId: string
  usedSlots: number
}

const STEP_LABELS = [
  'Operación',
  'Información',
  'Características',
  'Ubicación',
  'Fotos',
  'Contacto',
  'Revisión',
]

async function compressToWebP(file: File, maxWidth = APP_CONFIG.MAX_IMAGE_WIDTH_PX, quality = APP_CONFIG.IMAGE_QUALITY / 100): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const ratio = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas error')); return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('toBlob failed'))
        },
        'image/webp',
        quality
      )
    }
    img.onerror = reject
    img.src = url
  })
}

export default function PublishWizard({ amenities, userId, usedSlots }: PublishWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardFormData>(WIZARD_INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (updates: Partial<WizardFormData>) =>
    setData((prev) => ({ ...prev, ...updates }))

  const atLimit = usedSlots >= APP_CONFIG.MAX_FREE_PROPERTIES

  const handleSubmit = async (publishNow: boolean) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = {
        operation: data.operation || undefined,
        property_type: data.property_type,
        title: data.title,
        description: data.description || undefined,
        price: data.price ? parseFloat(data.price) : null,
        price_negotiable: data.price_negotiable,
        financing_available: data.financing_available,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        parking_spots: data.parking_spots ? parseInt(data.parking_spots) : null,
        land_area: data.land_area ? parseFloat(data.land_area) : null,
        construction_area: data.construction_area ? parseFloat(data.construction_area) : null,
        area_unit: data.area_unit,
        amenity_ids: data.amenity_ids,
        department: data.department,
        municipality: data.municipality,
        zone: data.zone || undefined,
        location_reference: data.location_reference || undefined,
        location_type: data.location_type,
        contact_name: data.contact_name || undefined,
        contact_phone: data.contact_phone || undefined,
        contact_whatsapp: data.contact_whatsapp || undefined,
        contact_preference: data.contact_preference,
        youtube_url: data.youtube_url || undefined,
        publish_now: publishNow,
      }

      const result = await createProperty(formData)

      if (result.error || !result.success) {
        setSubmitError(result.error ?? 'Error inesperado')
        return
      }

      // Upload images if any
      if (data.images.length > 0 && result.propertyId) {
        const supabase = createClient()
        const imageRecords: Array<{
          storage_path: string
          public_url: string
          display_order: number
          is_cover: boolean
        }> = []

        for (let i = 0; i < data.images.length; i++) {
          const file = data.images[i]
          try {
            const blob = await compressToWebP(file)
            const path = `${userId}/${result.propertyId}/${Date.now()}-${i}.webp`
            const { error: uploadError } = await supabase.storage
              .from('property-images')
              .upload(path, blob, { contentType: 'image/webp', upsert: false })

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('property-images')
                .getPublicUrl(path)

              imageRecords.push({
                storage_path: path,
                public_url: urlData.publicUrl,
                display_order: i,
                is_cover: i === 0,
              })
            }
          } catch {
            // Skip failed images
          }
        }

        if (imageRecords.length > 0) {
          await addPropertyImages(result.propertyId, imageRecords)
        }
      }

      router.push(publishNow ? `/propiedades/${result.slug}` : '/panel/propiedades')
    } catch {
      setSubmitError('Error inesperado. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (atLimit) {
    return (
      <div className="text-center py-12">
        <p className="text-3xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold text-navy mb-2">Límite alcanzado</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Tienes {usedSlots}/{APP_CONFIG.MAX_FREE_PROPERTIES} propiedades activas. Para publicar una nueva, pausa o elimina una existente.
        </p>
        <a
          href="/panel/propiedades"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent-dark"
        >
          Administrar mis propiedades
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-600">
            Paso {step} de {STEP_LABELS.length}: {STEP_LABELS[step - 1]}
          </p>
          <p className="text-xs text-slate-400">{Math.round((step / STEP_LABELS.length) * 100)}%</p>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${(step / STEP_LABELS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`w-2 h-2 rounded-full -mt-3 transition-colors ${
                i + 1 <= step ? 'bg-accent' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        {step === 1 && (
          <Step1Operation data={data} onChange={update} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2Info
            data={data}
            onChange={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Features
            data={data}
            amenities={amenities}
            onChange={update}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4Location
            data={data}
            onChange={update}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <Step5Photos
            data={data}
            onChange={update}
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        )}
        {step === 6 && (
          <Step6Contact
            data={data}
            onChange={update}
            onNext={() => setStep(7)}
            onBack={() => setStep(5)}
          />
        )}
        {step === 7 && (
          <Step7Review
            data={data}
            onBack={() => setStep(6)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        )}
      </div>
    </div>
  )
}
