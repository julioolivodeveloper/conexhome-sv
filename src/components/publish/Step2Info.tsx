'use client'

import type { WizardFormData } from '@/types/wizard'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
  onNext: () => void
  onBack: () => void
}

const inputClass =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

export default function Step2Info({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.title.trim().length >= 10

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Título del anuncio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={120}
          className={inputClass}
          placeholder="Ej: Casa con 3 habitaciones en Santa Tecla con jardín"
        />
        <p className={`text-xs mt-1 ${data.title.length < 10 ? 'text-slate-400' : 'text-success'}`}>
          {data.title.length}/120 caracteres · Mínimo 10
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Descripción
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={2000}
          rows={5}
          className={inputClass}
          placeholder="Describe la propiedad: características, estado, entorno, puntos de interés cercanos…"
        />
        <p className="text-xs text-slate-400 mt-1">{data.description.length}/2000 caracteres</p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Precio (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange({ price: e.target.value })}
            min={0}
            className={`${inputClass} pl-8`}
            placeholder={data.operation === 'alquiler' ? '250 (mensual)' : '75000'}
          />
        </div>
        {data.operation === 'alquiler' && (
          <p className="text-xs text-slate-400 mt-1">Precio mensual en dólares</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.price_negotiable}
            onChange={(e) => onChange({ price_negotiable: e.target.checked })}
            className="w-4 h-4 rounded accent-accent"
          />
          <span className="text-sm text-slate-700">Precio negociable</span>
        </label>
        {data.operation === 'venta' && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.financing_available}
              onChange={(e) => onChange({ financing_available: e.target.checked })}
              className="w-4 h-4 rounded accent-accent"
            />
            <span className="text-sm text-slate-700">Se acepta financiamiento bancario</span>
          </label>
        )}
      </div>

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
          disabled={!canProceed}
          className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
