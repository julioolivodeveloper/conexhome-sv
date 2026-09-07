import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import PlatformFeatures from '@/components/home/PlatformFeatures'
import DepartmentExplorer from '@/components/home/DepartmentExplorer'
import OwnerCTA from '@/components/home/OwnerCTA'

export const metadata: Metadata = {
  title: 'ConexHome SV — Publica tu propiedad gratis en El Salvador',
  description:
    'Compra, vende o alquila propiedades en El Salvador de forma gratuita. Sin comisiones, sin intermediarios. Publica en segundos y llega a todo el país.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <PlatformFeatures />
      <DepartmentExplorer />
      <OwnerCTA />
    </main>
  )
}
