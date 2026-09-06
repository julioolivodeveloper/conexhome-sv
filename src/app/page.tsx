import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import RecentProperties from '@/components/home/RecentProperties'
import DepartmentExplorer from '@/components/home/DepartmentExplorer'
import OwnerCTA from '@/components/home/OwnerCTA'
import { featuredProperties, recentProperties } from '@/data/mock-properties'

export const metadata: Metadata = {
  title: 'ConexHome SV — Compra, vende o alquila propiedades en El Salvador',
  description:
    'Encuentra tu próximo hogar o publica tu propiedad gratuitamente. La plataforma inmobiliaria más completa de El Salvador.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProperties properties={featuredProperties} />
      <DepartmentExplorer />
      <RecentProperties properties={recentProperties.slice(0, 8)} />
      <OwnerCTA />
    </main>
  )
}
