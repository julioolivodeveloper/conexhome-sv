import SearchBar from './SearchBar'

export default function HeroSection() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#1E4D8C]" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Plataforma gratuita · El Salvador
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-5">
          Encuentra el lugar donde
          <br className="hidden sm:block" />{' '}
          <span className="text-accent">comienza tu próxima historia.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Compra, vende o alquila propiedades en todo El Salvador
          <br className="hidden sm:block" /> desde un solo lugar.
        </p>

        {/* Search bar */}
        <SearchBar />

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">+500</span>
            <span>propiedades publicadas</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">14</span>
            <span>departamentos</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">100%</span>
            <span>publicación gratuita</span>
          </div>
        </div>
      </div>
    </section>
  )
}
