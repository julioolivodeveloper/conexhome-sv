'use client'

import { useRef, useState } from 'react'
import { Upload, X, GripVertical, Star } from 'lucide-react'
import { APP_CONFIG } from '@/config/app'

interface ImageUploaderProps {
  images: File[]
  onChange: (images: File[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const accepted: File[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > APP_CONFIG.MAX_IMAGE_SIZE_KB * 1024 * 5) continue // 5x tolerance, compress later
      if (images.length + accepted.length >= APP_CONFIG.MAX_IMAGES_PER_PROPERTY) break
      accepted.push(file)
    }
    if (accepted.length > 0) onChange([...images, ...accepted])
  }

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const setCover = (index: number) => {
    const reordered = [...images]
    const [moved] = reordered.splice(index, 1)
    reordered.unshift(moved)
    onChange(reordered)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-accent bg-accent-light'
            : 'border-slate-200 hover:border-accent hover:bg-slate-50'
        }`}
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-medium text-slate-700 text-sm">
          Arrastra fotos aquí o{' '}
          <span className="text-accent underline">selecciona archivos</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          JPG, PNG, WebP · Máx. {APP_CONFIG.MAX_IMAGES_PER_PROPERTY} fotos
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              {/* Cover badge */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Portada
                </span>
              )}
              {/* Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCover(i) }}
                    title="Usar como portada"
                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(i) }}
                  title="Eliminar"
                  className="p-1.5 bg-white/90 rounded-lg hover:bg-white"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
                <span className="p-1.5 bg-white/90 rounded-lg cursor-grab">
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
            </div>
          ))}

          {/* Add more button */}
          {images.length < APP_CONFIG.MAX_IMAGES_PER_PROPERTY && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-accent hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-400">Agregar</span>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">
        {images.length}/{APP_CONFIG.MAX_IMAGES_PER_PROPERTY} fotos · La primera imagen será la portada.
      </p>
    </div>
  )
}
