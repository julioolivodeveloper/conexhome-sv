import { cn } from '@/lib/utils/cn'

type BadgeVariant =
  | 'venta'
  | 'alquiler'
  | 'publicada'
  | 'borrador'
  | 'pausada'
  | 'vendida'
  | 'alquilada'
  | 'blue'
  | 'green'
  | 'gray'
  | 'yellow'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  venta: 'bg-accent text-white',
  alquiler: 'bg-success text-white',
  publicada: 'bg-success-light text-success border border-success/20',
  borrador: 'bg-slate-100 text-slate-600 border border-slate-200',
  pausada: 'bg-warning-light text-warning border border-warning/20',
  vendida: 'bg-accent-light text-accent border border-accent/20',
  alquilada: 'bg-purple-50 text-purple-700 border border-purple-200',
  blue: 'bg-accent-light text-accent border border-accent/20',
  green: 'bg-success-light text-success border border-success/20',
  gray: 'bg-slate-100 text-slate-600 border border-slate-200',
  yellow: 'bg-warning-light text-warning border border-warning/20',
}

export default function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
