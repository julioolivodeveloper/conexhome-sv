'use client'

import type { WizardFormData } from '@/types/wizard'

interface Amenity {
  id: string
  name: string
  icon: string | null
}

interface Props {
  data: WizardFormData
  amenities: Amenity[]
  onChange: (updates: Partial<WizardFormData>) => void
  onNext: () => void
  onBack: () => void
}

const inputClass =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

const numericProps = [
  { key: 'bedrooms' as const, label: 'Habitaciones', placeholder: '3' },
  { key: 'bathrooms' as const, label: 'Baños', placeholder: '2' },
  { key: 'parking_spots' as const, label: 'Parqueos', placeholder: '1' },
]

const areaUnits = [
  { value: 'm2' as const, label: 'm²' },
  { value: 'vara2' as const, label: 'varas²' },
  { value: 'manzana' as const, label: 'manzanas' },
]

export default function Step3Features({ data, amenities, onChange, onNext, onBack }: Props) {
  const toggleAmenity = (id: string) => {
    const ids = data.amenity_ids.includes(id)
      ? data.amenity_ids.filter((a) => a !== id)
      : [...data.amenity_ids, id]
    onChange({ amenity_ids: ids })
  }

  const showBeds =
    ['casa', 'apartamento', 'rancho', 'casa-de-playa', 'proyecto-residencial'].includes(
      data.property_type
    )

  return (
    <div className="space-y-6">
      {/* Numeric features */}
      {showBeds && (
        <div>
          <h3 className="text-sm font-semibold text-navy mb-3">Características</h3>
          <div className="grid grid-cols-3 gap-3">
            {numericProps.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={data[key]}
                  onChange={(e) => onChange({ [key]: e.target.value })}
                  className={inputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Áreas</h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Área del terreno
            </label>
            <input
              type="number"
              min={0}
              value={data.land_area}
              onChange={(e) => onChange({ land_area: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>
          {['casa', 'apartamento', 'rancho', 'casa-de-playa', 'local-comercial', 'oficina', 'bodega'].includes(
            data.property_type
          ) && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Área de construcción
              </label>
              <input
                type="number"
                min={0}
                value={data.construction_area}
                onChange={(e) => onChange({ construction_area: e.target.value })}
                className={inputClass}
                placeholder="0"
              />
            </div>
          )}
        </div>
        {/* Area unit selector */}
        <div className="flex gap-2">
          {areaUnits.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ area_unit: value })}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                data.area_unit === value
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-navy mb-3">
            Amenidades ({data.amenity_ids.length} seleccionadas)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {amenities.map((amenity) => {
              const selected = data.amenity_ids.includes(amenity.id)
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${
                    selected
                      ? 'border-accent bg-accent-light text-accent'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{amenity.icon ?? '•'}</span>
                  <span className="text-xs">{amenity.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
