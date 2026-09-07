'use client'

import { useState, useTransition } from 'react'
import { Flag, ChevronDown, ChevronUp, Loader2, CheckCircle } from 'lucide-react'
import { createReport, REPORT_REASONS } from '@/actions/reports'

interface Props {
  propertyId: string
  isAuthenticated: boolean
}

export default function ReportButton({ propertyId, isAuthenticated }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!isAuthenticated) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return
    setError('')
    startTransition(async () => {
      const res = await createReport(propertyId, reason, description)
      if (res.error) {
        setError(res.error)
        return
      }
      setSent(true)
      setTimeout(() => {
        setOpen(false)
        setSent(false)
        setReason('')
        setDescription('')
      }, 2500)
    })
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        Reportar esta propiedad
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
          {sent ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Reporte enviado. Gracias por ayudarnos a mantener la plataforma.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Motivo del reporte *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-slate-700"
                >
                  <option value="">Selecciona un motivo…</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Descripción adicional (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Detalles adicionales…"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none bg-white text-slate-700 placeholder-slate-400"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending || !reason}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
                  Enviar reporte
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
