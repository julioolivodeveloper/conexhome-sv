import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Bed, Bath, Car, Maximize, Phone, MessageSquare, ChevronLeft,
  Eye, Calendar, Home, CheckCircle, DollarSign,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatArea, formatRelativeTime } from '@/lib/utils/format'
import SendMessageButton from '@/components/messages/SendMessageButton'
import FavoriteButton from '@/components/favorites/FavoriteButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('title, description, department, municipality')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Propiedad no encontrada' }

  return {
    title: `${data.title} — ConexHome SV`,
    description: data.description ?? `Propiedad en ${data.municipality}, ${data.department}`,
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: property } = await supabase
    .from('properties')
    .select(`
      *,
      profiles!properties_user_id_fkey(full_name, phone, whatsapp, avatar_url),
      property_images(public_url, display_order, is_cover),
      property_amenities(amenities(name, icon))
    `)
    .eq('slug', slug)
    .eq('status', 'publicada')
    .single()

  if (!property) notFound()

  // Check if current user favorited this property
  let isFavorited = false
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', property.id)
      .maybeSingle()
    isFavorited = !!fav
  }

  const images = (property.property_images as Array<{ public_url: string; display_order: number; is_cover: boolean }>)
    ?.sort((a, b) => a.display_order - b.display_order) ?? []

  const amenities = (property.property_amenities as Array<{ amenities: { name: string; icon: string | null } | null }>)
    ?.map((pa) => pa.amenities)
    .filter(Boolean) ?? []

  const owner = property.profiles as { full_name: string; phone: string | null; whatsapp: string | null; avatar_url: string | null } | null
  const contactPhone = property.contact_phone || owner?.phone
  const contactWhatsApp = property.contact_whatsapp || owner?.whatsapp
  const contactName = property.contact_name || owner?.full_name || 'Vendedor'

  const whatsappMsg = encodeURIComponent(
    `Hola, vi tu propiedad en ConexHome SV: "${property.title}" y me interesa. ¿Podemos hablar?`
  )
  const whatsappUrl = contactWhatsApp
    ? `https://wa.me/${contactWhatsApp.replace(/\D/g, '')}?text=${whatsappMsg}`
    : null

  const mainImage = images.find((i) => i.is_cover)?.public_url ?? images[0]?.public_url

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href="javascript:history.back()"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: images + details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              {mainImage ? (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImage}
                    alt={property.title}
                    className="w-full aspect-video object-cover"
                  />
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {images.map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={img.public_url}
                          alt={`Foto ${i + 1}`}
                          className="w-16 h-16 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <Home className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Sin fotos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Main info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start gap-3 flex-wrap mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                  property.operation === 'venta' ? 'bg-accent text-white' : 'bg-success text-white'
                }`}>
                  {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                </span>
                <span className="text-xs text-slate-500 py-1">{property.property_type}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-navy mb-2">{property.title}</h1>

              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>
                  {property.zone ? `${property.zone}, ` : ''}{property.municipality}, {property.department}
                </span>
              </div>

              {property.price && (
                <div className="mb-4">
                  <p className="text-2xl font-bold text-accent">
                    {formatPrice(property.price, property.operation)}
                  </p>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    {property.price_negotiable && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-success" /> Precio negociable
                      </span>
                    )}
                    {property.financing_available && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-success" /> Acepta financiamiento
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Features row */}
              <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100">
                {property.bedrooms != null && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Bed className="w-4 h-4 text-slate-400" />
                    {property.bedrooms} hab.
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Bath className="w-4 h-4 text-slate-400" />
                    {property.bathrooms} baños
                  </div>
                )}
                {property.parking_spots != null && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Car className="w-4 h-4 text-slate-400" />
                    {property.parking_spots} parqueo{property.parking_spots !== 1 ? 's' : ''}
                  </div>
                )}
                {property.land_area && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Maximize className="w-4 h-4 text-slate-400" />
                    {formatArea(property.land_area, property.area_unit)} terreno
                  </div>
                )}
                {property.construction_area && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Maximize className="w-4 h-4 text-slate-400" />
                    {formatArea(property.construction_area, property.area_unit)} construido
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mt-5">
                  <h2 className="font-semibold text-navy mb-2 text-sm">Descripción</h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Location reference */}
              {property.location_reference && (
                <div className="mt-5">
                  <h2 className="font-semibold text-navy mb-2 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Referencia de ubicación
                  </h2>
                  <p className="text-sm text-slate-600">{property.location_reference}</p>
                </div>
              )}

              {/* YouTube */}
              {property.youtube_url && (
                <div className="mt-5">
                  <h2 className="font-semibold text-navy mb-2 text-sm">Video</h2>
                  <a
                    href={property.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    Ver video en YouTube →
                  </a>
                </div>
              )}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-semibold text-navy mb-4 text-sm">Amenidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{a!.icon ?? '✓'}</span>
                      {a!.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Published info */}
            <div className="flex items-center gap-4 text-xs text-slate-400 px-1">
              {property.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Publicado {formatRelativeTime(property.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {property.view_count} vistas
              </span>
            </div>
          </div>

          {/* Right column: contact card (sticky) */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:sticky lg:top-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  {owner?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={owner.avatar_url}
                      alt={contactName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-accent font-bold text-sm">
                      {contactName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{contactName}</p>
                  <p className="text-xs text-slate-400">Propietario / Agente</p>
                </div>
              </div>

              <div className="space-y-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1da851] transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contactar por WhatsApp
                  </a>
                )}

                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-2.5 w-full py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar: {contactPhone}
                  </a>
                )}

                <SendMessageButton
                  propertyId={property.id}
                  sellerId={property.user_id}
                  currentUserId={user?.id ?? null}
                />

                {!whatsappUrl && !contactPhone && (
                  <p className="text-xs text-slate-400 text-center">
                    El vendedor no ha publicado datos de contacto
                  </p>
                )}
              </div>

              {/* Favorite */}
              <div className="mt-4 flex items-center gap-2">
                <FavoriteButton propertyId={property.id} initialFavorited={isFavorited} size="md" />
                <span className="text-xs text-slate-500">
                  {isFavorited ? 'Guardada en favoritos' : 'Guardar en favoritos'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                Al contactar, menciona que viste esta propiedad en ConexHome SV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
