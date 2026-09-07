'use client'

import { Home, Key } from 'lucide-react'
import type { WizardFormData } from '@/types/wizard'
import { PROPERTY_TYPES } from '@/lib/constants/property-types'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
  onNext: () => void
}

export default function Step1Operation({ data, onChange, onNext }: Props) {
  const canProceed = data.operation !== '' && data.property_type !== ''

  return (
    <div className="space-y-8">
      {/* Operation */}
      <div>
        <h2 className="text-base font-semibold text-navy mb-4">¿Qué quieres hacer?</h2>
        <div className="grid grid-cols-2 gap-4">
          {([
            { value: 'venta', label: 'Vender', Icon: Home, desc: 'Vendo mi propiedad' },
            { value: 'alquiler', label: 'Alquilar', Icon: Key, desc: 'Alquilo mi propiedad' },
          ] as const).map(({ value, label, Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ operation: value })}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                data.operation === value
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-7 h-7" />
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div>
        <h2 className="text-base font-semibold text-navy mb-4">Tipo de propiedad</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PROPERTY_TYPES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ property_type: value })}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                data.property_type === value
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
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
