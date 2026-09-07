'use client'

import { Loader2, AlertCircle } from 'lucide-react'
import type { WizardFormData } from '@/types/wizard'
import { formatPrice } from '@/lib/utils/format'
import { PROPERTY_TYPES_BY_VALUE } from '@/lib/constants/property-types'

interface Props {
  data: WizardFormData
  onBack: () => void
  onSubmit: (publishNow: boolean) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-navy font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export default function Step7Review({ data, onBack, onSubmit, isSubmitting, error }: Props) {
  const typeLabel = PROPERTY_TYPES_BY_VALUE[data.property_type]?.label ?? data.property_type
  const priceNum = data.price ? parseFloat(data.price) : null

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Revisa tu anuncio antes de publicarlo. Podrás editarlo en cualquier momento desde tu panel.
      </p>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Anuncio</p>
          <Row label="Operación" value={data.operation === 'venta' ? 'Venta' : 'Alquiler'} />
          <Row label="Tipo" value={typeLabel} />
          <Row label="Título" value={data.title} />
          <Row label="Precio" value={priceNum ? formatPrice(priceNum, data.operation) : 'No especificado'} />
          {data.price_negotiable && <Row label="Precio" value="Negociable" />}
          {data.financing_available && <Row label="Financiamiento" value="Sí acepta" />}
        </div>

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Características</p>
          <Row label="Habitaciones" value={data.bedrooms || null} />
          <Row label="Baños" value={data.bathrooms || null} />
          <Row label="Parqueos" value={data.parking_spots || null} />
          <Row
            label="Área terreno"
            value={data.land_area ? `${data.land_area} ${data.area_unit}` : null}
          />
          <Row
            label="Área construcción"
            value={data.construction_area ? `${data.construction_area} ${data.area_unit}` : null}
          />
          {data.amenity_ids.length > 0 && (
            <Row label="Amenidades" value={`${data.amenity_ids.length} seleccionadas`} />
          )}
        </div>

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Ubicación</p>
          <Row label="Departamento" value={data.department} />
          <Row label="Municipio" value={data.municipality} />
          <Row label="Zona" value={data.zone || null} />
          <Row label="Referencia" value={data.location_reference || null} />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Contacto</p>
          <Row label="Nombre" value={data.contact_name || null} />
          <Row label="Teléfono" value={data.contact_phone || null} />
          <Row label="WhatsApp" value={data.contact_whatsapp || null} />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Fotos</p>
          <p className="text-sm text-slate-600">
            {data.images.length === 0
              ? 'Sin fotos — se podrán agregar después'
              : `${data.images.length} foto${data.images.length !== 1 ? 's' : ''} seleccionada${data.images.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSubmit(true)}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors disabled:opacity-60 text-sm"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Publicando…' : 'Publicar ahora'}
        </button>
        <button
          type="button"
          onClick={() => onSubmit(false)}
          disabled={isSubmitting}
          className="w-full py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
        >
          Guardar como borrador
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Volver a editar
        </button>
      </div>
    </div>
  )
}
