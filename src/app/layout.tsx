import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ConexHome SV — Compra, vende o alquila propiedades en El Salvador',
    template: '%s | ConexHome SV',
  },
  description:
    'Encuentra tu próximo hogar o publica tu propiedad gratuitamente. La plataforma inmobiliaria más completa de El Salvador.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexhomesv.com'
  ),
  openGraph: {
    siteName: 'ConexHome SV',
    locale: 'es_SV',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
