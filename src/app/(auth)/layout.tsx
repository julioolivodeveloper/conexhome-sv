import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ConexHome SV',
    default: 'ConexHome SV',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      {children}
    </div>
  )
}
