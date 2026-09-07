import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'edge'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexhomesv.com'
const DESC =
  'Compra, vende o alquila propiedades en El Salvador de forma gratuita. Casas, apartamentos, terrenos y más en los 14 departamentos.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'ConexHome SV — Propiedades en El Salvador',
    template: '%s | ConexHome SV',
  },
  description: DESC,
  keywords: ['propiedades El Salvador', 'casas en venta El Salvador', 'apartamentos alquiler El Salvador', 'inmuebles El Salvador', 'bienes raíces SV'],
  authors: [{ name: 'ConexHome SV', url: BASE }],
  openGraph: {
    siteName: 'ConexHome SV',
    locale: 'es_SV',
    type: 'website',
    title: 'ConexHome SV — Propiedades en El Salvador',
    description: DESC,
    url: BASE,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConexHome SV — Propiedades en El Salvador',
    description: DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE,
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
