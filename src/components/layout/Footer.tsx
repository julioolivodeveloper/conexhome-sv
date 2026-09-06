import Link from 'next/link'
import { Home, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  explorar: [
    { href: '/comprar', label: 'Comprar propiedad' },
    { href: '/alquilar', label: 'Alquilar propiedad' },
    { href: '/mapa', label: 'Explorar en mapa' },
    { href: '/departamento/san-salvador', label: 'Propiedades en San Salvador' },
    { href: '/departamento/la-libertad', label: 'Propiedades en La Libertad' },
    { href: '/departamento/santa-ana', label: 'Propiedades en Santa Ana' },
  ],
  propietarios: [
    { href: '/publicar', label: 'Publicar propiedad gratis' },
    { href: '/crear-cuenta', label: 'Crear cuenta' },
    { href: '/panel', label: 'Mi panel' },
    { href: '/panel/propiedades', label: 'Mis propiedades' },
  ],
  empresa: [
    { href: '/nosotros', label: 'Sobre ConexHome SV' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/privacidad', label: 'Política de privacidad' },
    { href: '/terminos', label: 'Términos de uso' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl leading-none">
                ConexHome <span className="text-accent">SV</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-xs">
              La plataforma inmobiliaria de El Salvador. Compra, vende o alquila
              propiedades desde un solo lugar, de forma simple y gratuita.
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>El Salvador, Centroamérica</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="mailto:hola@conexhomesv.com"
                  className="hover:text-white transition-colors"
                >
                  hola@conexhomesv.com
                </a>
              </div>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explorar</h3>
            <ul className="space-y-2.5">
              {footerLinks.explorar.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Propietarios */}
          <div>
            <h3 className="font-semibold text-white mb-4">Propietarios</h3>
            <ul className="space-y-2.5">
              {footerLinks.propietarios.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>
            &copy; {currentYear} ConexHome SV. Todos los derechos reservados.
          </p>
          <p className="text-xs">
            La información de las publicaciones es responsabilidad de los
            anunciantes.
          </p>
        </div>
      </div>
    </footer>
  )
}
