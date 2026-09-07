'use client'

import type { WizardFormData } from '@/types/wizard'
import { DEPARTMENTS } from '@/lib/constants/departments'
import { MUNICIPALITIES } from '@/lib/constants/municipalities'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
  onNext: () => void
  onBack: () => void
}

const inputClass =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

export default function Step4Location({ data, onChange, onNext, onBack }: Props) {
  const municipalities = data.department ? (MUNICIPALITIES[data.department] ?? []) : []
  const canProceed = data.department !== '' && data.municipality !== ''

  const handleDepartmentChange = (dep: string) => {
    onChange({ department: dep, municipality: '' })
  }

  return (
    <div className="space-y-5">
      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Departamento <span className="text-red-500">*</span>
        </label>
        <select
          value={data.department}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona un departamento</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.slug} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Municipality */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Municipio <span className="text-red-500">*</span>
        </label>
        <select
          value={data.municipality}
          onChange={(e) => onChange({ municipality: e.target.value })}
          disabled={!data.department}
          className={inputClass}
        >
          <option value="">Selecciona un municipio</option>
          {municipalities.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Zone / Colonia */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Colonia / Zona / Urbanización
        </label>
        <input
          type="text"
          value={data.zone}
          onChange={(e) => onChange({ zone: e.target.value })}
          maxLength={100}
          className={inputClass}
          placeholder="Ej: Colonia San Benito"
        />
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Referencia de ubicación
        </label>
        <textarea
          value={data.location_reference}
          onChange={(e) => onChange({ location_reference: e.target.value })}
          maxLength={300}
          rows={3}
          className={inputClass}
          placeholder="Ej: 2 cuadras al norte del parque central, contiguo a farmacia…"
        />
        <p className="text-xs text-slate-400 mt-1">
          Ayuda a los compradores a encontrar la propiedad sin revelar la dirección exacta.
        </p>
      </div>

      {/* Location precision */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Precisión de ubicación</h3>
        <div className="flex gap-3">
          {([
            { value: 'approximate', label: 'Aproximada', desc: 'Zona general' },
            { value: 'exact', label: 'Exacta', desc: 'Dirección precisa' },
          ] as const).map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ location_type: value })}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                data.location_type === value
                  ? 'border-accent bg-accent-light'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className={`font-medium ${data.location_type === value ? 'text-accent' : 'text-slate-700'}`}>
                {label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
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
