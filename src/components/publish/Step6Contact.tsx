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

const contactOptions = [
  { value: 'any', label: 'Cualquiera', desc: 'WhatsApp, teléfono o mensaje' },
  { value: 'whatsapp', label: 'Solo WhatsApp', desc: 'Preferentemente por WhatsApp' },
  { value: 'phone', label: 'Solo teléfono', desc: 'Llamadas telefónicas' },
  { value: 'message', label: 'Solo mensaje', desc: 'A través de la plataforma' },
] as const

export default function Step6Contact({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-5">
          Estos datos de contacto se mostrarán en tu anuncio. Puedes usar los de tu perfil o ingresar otros específicos para esta propiedad.
        </p>

        {/* Contact name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nombre de contacto
          </label>
          <input
            type="text"
            value={data.contact_name}
            onChange={(e) => onChange({ contact_name: e.target.value })}
            maxLength={100}
            className={inputClass}
            placeholder="Tu nombre o el de tu agencia"
          />
        </div>

        {/* Phone grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              value={data.contact_phone}
              onChange={(e) => onChange({ contact_phone: e.target.value })}
              maxLength={20}
              className={inputClass}
              placeholder="22001234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              WhatsApp
            </label>
            <input
              type="tel"
              value={data.contact_whatsapp}
              onChange={(e) => onChange({ contact_whatsapp: e.target.value })}
              maxLength={20}
              className={inputClass}
              placeholder="50378001234"
            />
            <p className="text-xs text-slate-400 mt-1">Incluye código de país (503)</p>
          </div>
        </div>

        {/* YouTube */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Video de YouTube (opcional)
          </label>
          <input
            type="url"
            value={data.youtube_url}
            onChange={(e) => onChange({ youtube_url: e.target.value })}
            className={inputClass}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Preference */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Preferencia de contacto
          </label>
          <div className="grid grid-cols-2 gap-2">
            {contactOptions.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ contact_preference: value })}
                className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  data.contact_preference === value
                    ? 'border-accent bg-accent-light'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className={`text-sm font-medium ${data.contact_preference === value ? 'text-accent' : 'text-slate-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
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
          className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm"
        >
          Revisar anuncio →
        </button>
      </div>
    </div>
  )
}
