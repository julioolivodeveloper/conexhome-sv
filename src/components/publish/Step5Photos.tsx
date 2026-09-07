'use client'

import type { WizardFormData } from '@/types/wizard'
import ImageUploader from './ImageUploader'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step5Photos({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Las fotos son lo más importante de tu anuncio. Propiedades con imágenes reciben hasta{' '}
          <strong>5x más consultas</strong>. Puedes continuar sin fotos y agregarlas después.
        </p>
        <ImageUploader
          images={data.images}
          onChange={(images) => onChange({ images })}
        />
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
          {data.images.length === 0 ? 'Continuar sin fotos →' : `Continuar (${data.images.length} foto${data.images.length !== 1 ? 's' : ''}) →`}
        </button>
      </div>
    </div>
  )
}
