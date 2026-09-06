# ConexHome SV — Progreso del Proyecto

**Plataforma inmobiliaria para El Salvador**
**Dominio:** https://conexhomesv.com
**Repositorio:** https://github.com/julioolivodeveloper/conexhome-sv
**Fecha de inicio:** 2026-09-06

---

## Estado actual

| Etapa | Nombre                    | Estado      | Fecha      |
|-------|---------------------------|-------------|------------|
| 0     | Inspección y Plan         | ✅ Completa | 2026-09-06 |
| 1     | Diseño y UI Base          | ✅ Completa | 2026-09-06 |
| 2     | Supabase y Autenticación  | ⏳ Pendiente |            |
| 3     | Publicación de Propiedades| ⏳ Pendiente |            |
| 4     | Búsqueda y Mapa           | ⏳ Pendiente |            |
| 5     | Favoritos y Mensajes      | ⏳ Pendiente |            |
| 6     | Administración y Reportes | ⏳ Pendiente |            |
| 7     | SEO y Optimización        | ⏳ Pendiente |            |
| 8     | Despliegue                | ⏳ Pendiente |            |

---

## Tecnologías seleccionadas

| Categoría        | Tecnología                            |
|------------------|---------------------------------------|
| Framework        | Next.js 15 (App Router)               |
| Lenguaje         | TypeScript 5                          |
| Estilos          | Tailwind CSS 4                        |
| Base de datos    | Supabase PostgreSQL                   |
| Autenticación    | Supabase Auth                         |
| Almacenamiento   | Supabase Storage                      |
| Tiempo real      | Supabase Realtime                     |
| Mapa             | MapLibre GL JS + OpenStreetMap        |
| Formularios      | React Hook Form + Zod                 |
| Iconos           | Lucide Icons                          |
| Alojamiento      | Cloudflare Pages (también compatible con Vercel) |
| Control de código| GitHub (julioolivodeveloper)          |
| Gestor paquetes  | npm (Node.js v24)                     |

---

## Arquitectura general

```
Browser
  │
  ├── Next.js (App Router + Server Components + Server Actions)
  │     ├── Páginas públicas (SSR/SSG para SEO)
  │     ├── Rutas protegidas (middleware de autenticación)
  │     └── API Routes (validación server-side, operaciones admin)
  │
  └── Supabase
        ├── PostgreSQL (datos + RLS)
        ├── Auth (JWT, email/password, magic link futuro)
        ├── Storage (imágenes WebP organizadas por usuario)
        └── Realtime (mensajería en tiempo real)
```

**Principio de separación de alojamiento:**
- Toda la lógica de negocio vive en Next.js y Supabase.
- El archivo `next.config.ts` NO tendrá configuración específica de Cloudflare.
- La adaptación a Cloudflare Pages se hará exclusivamente con `@cloudflare/next-on-pages` y un archivo `wrangler.toml` separado.
- Para migrar a Vercel en el futuro: simplemente hacer deploy desde GitHub sin cambiar la aplicación.

---

## Estructura de carpetas propuesta

```
/conexhome-sv
├── src/
│   ├── app/
│   │   ├── (auth)/                        # Rutas de autenticación
│   │   │   ├── iniciar-sesion/page.tsx
│   │   │   ├── crear-cuenta/page.tsx
│   │   │   ├── recuperar-contrasena/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (main)/                        # Rutas públicas principales
│   │   │   ├── comprar/page.tsx
│   │   │   ├── alquilar/page.tsx
│   │   │   ├── propiedades/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── mapa/page.tsx
│   │   │   ├── departamento/[slug]/page.tsx
│   │   │   ├── tipo/[slug]/page.tsx
│   │   │   ├── favoritos/page.tsx
│   │   │   ├── mensajes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [conversationId]/page.tsx
│   │   │   ├── publicar/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (panel)/                       # Panel del usuario autenticado
│   │   │   └── panel/
│   │   │       ├── page.tsx               # Resumen
│   │   │       ├── propiedades/page.tsx
│   │   │       ├── favoritos/page.tsx
│   │   │       ├── mensajes/page.tsx
│   │   │       └── perfil/page.tsx
│   │   ├── (admin)/                       # Panel administrativo privado
│   │   │   └── admin/
│   │   │       ├── page.tsx               # Dashboard admin
│   │   │       ├── usuarios/page.tsx
│   │   │       ├── propiedades/page.tsx
│   │   │       └── reportes/page.tsx
│   │   ├── api/
│   │   │   ├── properties/route.ts        # CRUD propiedades
│   │   │   ├── images/route.ts            # Upload/delete imágenes
│   │   │   ├── messages/route.ts          # Mensajería
│   │   │   └── admin/route.ts             # Acciones admin
│   │   ├── sitemap.ts                     # Sitemap dinámico
│   │   ├── robots.ts                      # robots.txt
│   │   ├── layout.tsx                     # Root layout
│   │   ├── page.tsx                       # Página principal
│   │   ├── not-found.tsx                  # Página 404
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                            # Componentes base (Button, Input, etc.)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Navigation.tsx
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx           # Tarjeta de propiedad
│   │   │   ├── PropertyGallery.tsx        # Galería con lightbox
│   │   │   ├── PropertyDetail.tsx         # Página detalle
│   │   │   ├── PropertyGrid.tsx           # Cuadrícula de resultados
│   │   │   ├── PropertyStatusBadge.tsx
│   │   │   └── SimilarProperties.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx              # Buscador principal hero
│   │   │   ├── SearchFilters.tsx          # Panel de filtros
│   │   │   └── SearchResults.tsx
│   │   ├── map/
│   │   │   ├── PropertyMap.tsx            # Mapa de resultados
│   │   │   ├── PropertyMarker.tsx         # Marcador con precio
│   │   │   ├── LocationPicker.tsx         # Selección de ubicación al publicar
│   │   │   └── MapToggle.tsx              # Alternar lista/mapa en móvil
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RecoverForm.tsx
│   │   ├── publish/
│   │   │   ├── PublishWizard.tsx          # Contenedor multi-paso
│   │   │   ├── Step1Operation.tsx
│   │   │   ├── Step2Info.tsx
│   │   │   ├── Step3Features.tsx
│   │   │   ├── Step4Location.tsx
│   │   │   ├── Step5Photos.tsx
│   │   │   ├── Step6Contact.tsx
│   │   │   ├── Step7Review.tsx
│   │   │   └── ImageUploader.tsx          # Compresión + WebP + progreso
│   │   ├── messaging/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── QuickMessages.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   ├── PropertiesTable.tsx
│   │   │   └── ReportsTable.tsx
│   │   └── home/
│   │       ├── HeroSection.tsx
│   │       ├── FeaturedProperties.tsx
│   │       ├── RecentProperties.tsx
│   │       ├── DepartmentExplorer.tsx
│   │       ├── BuySection.tsx
│   │       ├── RentSection.tsx
│   │       └── OwnerCTA.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Supabase client (browser)
│   │   │   ├── server.ts                  # Supabase client (server)
│   │   │   └── middleware.ts              # Auth middleware helper
│   │   ├── constants/
│   │   │   ├── departments.ts             # 14 departamentos de El Salvador
│   │   │   ├── municipalities.ts          # Municipios por departamento
│   │   │   ├── property-types.ts          # Tipos de propiedad
│   │   │   └── amenities.ts               # Catálogo de amenidades
│   │   ├── utils/
│   │   │   ├── format.ts                  # Formateo de precios, fechas, áreas
│   │   │   ├── slug.ts                    # Generación de slugs
│   │   │   ├── whatsapp.ts                # Formateo de mensajes WhatsApp
│   │   │   └── images.ts                  # Compresión y conversión WebP
│   │   └── validations/
│   │       ├── property.ts                # Zod: esquemas de propiedades
│   │       ├── auth.ts                    # Zod: esquemas de autenticación
│   │       └── message.ts                 # Zod: esquemas de mensajes
│   ├── hooks/
│   │   ├── useAuth.ts                     # Estado de autenticación
│   │   ├── useProperties.ts               # Query de propiedades
│   │   ├── useFavorites.ts                # Gestión de favoritos
│   │   ├── useMessages.ts                 # Mensajería realtime
│   │   └── usePropertyLimit.ts            # Verificar límite de publicaciones
│   ├── types/
│   │   ├── database.ts                    # Tipos generados de Supabase
│   │   ├── property.ts                    # Tipos de propiedad extendidos
│   │   └── user.ts                        # Tipos de usuario
│   └── config/
│       └── app.ts                         # MAX_FREE_PROPERTIES = 5, etc.
├── supabase/
│   └── migrations/
│       ├── 001_profiles.sql
│       ├── 002_properties.sql
│       ├── 003_property_images.sql
│       ├── 004_amenities.sql
│       ├── 005_favorites.sql
│       ├── 006_conversations.sql
│       ├── 007_messages.sql
│       ├── 008_reports.sql
│       ├── 009_analytics.sql
│       ├── 010_app_settings.sql
│       └── 011_rls_policies.sql
├── public/
│   ├── images/
│   │   ├── og-default.jpg                 # Imagen Open Graph por defecto
│   │   └── hero-bg.jpg                    # Imagen hero
│   └── icons/
├── .env.example
├── .gitignore
├── wrangler.toml                          # Solo configuración Cloudflare
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── PROJECT_PROGRESS.md
```

---

## Diseño de base de datos

### Tabla: `profiles`
```sql
id            uuid PRIMARY KEY REFERENCES auth.users(id)
full_name     text NOT NULL
phone         text
whatsapp      text
avatar_url    text
bio           text
is_admin      boolean DEFAULT false
is_suspended  boolean DEFAULT false
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

### Tabla: `properties`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id)
slug            text UNIQUE NOT NULL
title           text NOT NULL
description     text
operation       text NOT NULL         -- 'venta' | 'alquiler'
property_type   text NOT NULL         -- 'casa' | 'apartamento' | ...
status          text NOT NULL DEFAULT 'borrador'
                                      -- 'borrador' | 'publicada' | 'pausada'
                                      -- | 'vendida' | 'alquilada' | 'eliminada'
price           numeric(12,2)
price_negotiable boolean DEFAULT false
financing_available boolean DEFAULT false
bedrooms        smallint
bathrooms       smallint
parking_spots   smallint
land_area       numeric(10,2)
construction_area numeric(10,2)
area_unit       text DEFAULT 'm2'     -- 'm2' | 'vara2' | 'manzana'
department      text NOT NULL
municipality    text NOT NULL
zone            text
location_reference text
latitude        numeric(10,8)
longitude       numeric(11,8)
location_type   text DEFAULT 'approximate'  -- 'exact' | 'approximate'
contact_name    text
contact_phone   text
contact_whatsapp text
contact_preference text DEFAULT 'any'  -- 'whatsapp' | 'phone' | 'message' | 'any'
youtube_url     text
is_featured     boolean DEFAULT false
is_hidden       boolean DEFAULT false  -- oculto por admin
view_count      integer DEFAULT 0
cover_image_url text
published_at    timestamptz
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### Tabla: `property_images`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
property_id   uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE
storage_path  text NOT NULL
public_url    text NOT NULL
display_order smallint NOT NULL DEFAULT 0
is_cover      boolean DEFAULT false
created_at    timestamptz DEFAULT now()
```

### Tabla: `amenities`
```sql
id    uuid PRIMARY KEY DEFAULT gen_random_uuid()
name  text UNIQUE NOT NULL
icon  text
```

### Tabla: `property_amenities`
```sql
property_id uuid REFERENCES properties(id) ON DELETE CASCADE
amenity_id  uuid REFERENCES amenities(id) ON DELETE CASCADE
PRIMARY KEY (property_id, amenity_id)
```

### Tabla: `favorites`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE
created_at  timestamptz DEFAULT now()
UNIQUE(user_id, property_id)
```

### Tabla: `conversations`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
property_id uuid REFERENCES properties(id) ON DELETE SET NULL
subject     text
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### Tabla: `conversation_participants`
```sql
conversation_id  uuid REFERENCES conversations(id) ON DELETE CASCADE
user_id          uuid REFERENCES profiles(id) ON DELETE CASCADE
is_blocked       boolean DEFAULT false
unread_count     integer DEFAULT 0
joined_at        timestamptz DEFAULT now()
PRIMARY KEY (conversation_id, user_id)
```

### Tabla: `messages`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE
sender_id       uuid NOT NULL REFERENCES profiles(id)
body            text NOT NULL
is_read         boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

### Tabla: `reports`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
reporter_id   uuid REFERENCES profiles(id) ON DELETE SET NULL
property_id   uuid REFERENCES properties(id) ON DELETE SET NULL
reported_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL
reason        text NOT NULL
description   text
status        text DEFAULT 'pendiente'  -- 'pendiente' | 'revisando' | 'resuelto'
resolved_by   uuid REFERENCES profiles(id)
resolved_at   timestamptz
created_at    timestamptz DEFAULT now()
```

### Tabla: `property_views`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE
user_id     uuid REFERENCES profiles(id) ON DELETE SET NULL
ip_hash     text                        -- hash anónimo para visitantes
created_at  timestamptz DEFAULT now()
```

### Tabla: `contact_clicks`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE
user_id     uuid REFERENCES profiles(id) ON DELETE SET NULL
click_type  text NOT NULL               -- 'whatsapp' | 'phone' | 'message'
created_at  timestamptz DEFAULT now()
```

### Tabla: `app_settings`
```sql
key         text PRIMARY KEY
value       text NOT NULL
description text
updated_at  timestamptz DEFAULT now()
updated_by  uuid REFERENCES profiles(id)
```
*Valor inicial clave:* `max_free_properties = '5'`

### Tabla: `admin_actions`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
admin_id    uuid NOT NULL REFERENCES profiles(id)
action      text NOT NULL               -- 'hide_property' | 'suspend_user' | etc.
target_type text                        -- 'property' | 'user' | 'report'
target_id   uuid
notes       text
created_at  timestamptz DEFAULT now()
```

---

## Variables de entorno

| Variable                          | Público | Descripción                                            |
|-----------------------------------|---------|--------------------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`            | ✅ Sí   | URL canónica del sitio (https://conexhomesv.com)       |
| `NEXT_PUBLIC_SITE_NAME`           | ✅ Sí   | Nombre del sitio (ConexHome SV)                        |
| `NEXT_PUBLIC_SUPABASE_URL`        | ✅ Sí   | URL del proyecto Supabase                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | ✅ Sí   | Clave anónima de Supabase (segura para el browser)     |
| `SUPABASE_SERVICE_ROLE_KEY`       | ❌ No   | Solo servidor/admin — NUNCA exponer en el browser      |
| `NEXT_PUBLIC_MAP_STYLE_URL`       | ✅ Sí   | URL del estilo de mapa (OpenStreetMap via MapLibre)    |
| `NEXT_PUBLIC_MAP_TILES_URL`       | ✅ Sí   | URL base de los tiles del mapa                         |
| `NEXT_PUBLIC_PLATFORM_WHATSAPP`   | ✅ Sí   | WhatsApp de ConexHome SV para soporte                  |

---

## Configuración central del proyecto

Archivo `src/config/app.ts`:
```typescript
export const APP_CONFIG = {
  MAX_FREE_PROPERTIES: 5,          // Cambiable también en app_settings (DB)
  MAX_IMAGES_PER_PROPERTY: 10,
  MAX_IMAGE_SIZE_KB: 500,
  MAX_IMAGE_WIDTH_PX: 1600,
  IMAGE_QUALITY: 85,
  PROPERTY_SLUG_MAX_LENGTH: 120,
} as const
```

---

## Seguridad — RLS por tabla

| Tabla                      | SELECT                          | INSERT           | UPDATE           | DELETE              |
|----------------------------|---------------------------------|------------------|------------------|---------------------|
| `profiles`                 | Todos (público)                 | Auth via trigger | Solo propietario | No                  |
| `properties`               | Publicadas=todos; borrador=dueño| Auth             | Solo dueño       | Lógico (status=eliminada) |
| `property_images`          | Según propiedad                 | Solo dueño       | Solo dueño       | Solo dueño          |
| `favorites`                | Solo propietario                | Auth             | No               | Solo propietario    |
| `conversations`            | Solo participante               | Auth             | No               | No                  |
| `conversation_participants`| Solo participante               | Auth             | Solo participante| No                  |
| `messages`                 | Solo participante               | Solo participante| No               | No                  |
| `reports`                  | Solo admin                      | Auth             | Solo admin       | No                  |
| `property_views`           | Solo admin/dueño                | Todos            | No               | No                  |
| `contact_clicks`           | Solo admin/dueño                | Todos            | No               | No                  |
| `app_settings`             | Todos (lectura)                 | Solo admin       | Solo admin       | Solo admin          |
| `admin_actions`            | Solo admin                      | Solo admin       | No               | No                  |

---

## Rutas planificadas

| Ruta                         | Tipo        | Auth     | Descripción                    |
|------------------------------|-------------|----------|--------------------------------|
| `/`                          | Pública     | No       | Página principal               |
| `/comprar`                   | Pública     | No       | Búsqueda — venta               |
| `/alquilar`                  | Pública     | No       | Búsqueda — alquiler            |
| `/propiedades`               | Pública     | No       | Todas las propiedades          |
| `/propiedades/[slug]`        | Pública     | No       | Detalle de propiedad           |
| `/mapa`                      | Pública     | No       | Vista de mapa                  |
| `/departamento/[slug]`       | Pública     | No       | Por departamento (SEO)         |
| `/tipo/[slug]`               | Pública     | No       | Por tipo de propiedad (SEO)    |
| `/publicar`                  | Protegida   | Sí       | Formulario publicar            |
| `/favoritos`                 | Protegida   | Sí       | Mis favoritos                  |
| `/mensajes`                  | Protegida   | Sí       | Lista de conversaciones        |
| `/mensajes/[id]`             | Protegida   | Sí       | Conversación individual        |
| `/panel`                     | Protegida   | Sí       | Panel del usuario              |
| `/panel/propiedades`         | Protegida   | Sí       | Mis propiedades                |
| `/panel/perfil`              | Protegida   | Sí       | Mi perfil                      |
| `/iniciar-sesion`            | Pública     | No       | Login                          |
| `/crear-cuenta`              | Pública     | No       | Registro                       |
| `/recuperar-contrasena`      | Pública     | No       | Recuperar contraseña           |
| `/admin`                     | Privada     | Admin    | Panel administrativo           |

---

## Configuraciones necesarias antes de Etapa 2

### Supabase (manual — una sola vez)
1. Crear proyecto en app.supabase.com
2. Copiar `SUPABASE_URL` y `SUPABASE_ANON_KEY` y `SERVICE_ROLE_KEY`
3. Activar Supabase Auth con email/password
4. Activar confirmación de correo
5. Configurar URL de redirección: `https://conexhomesv.com/auth/callback`
6. Crear bucket `property-images` en Storage (público)
7. Ejecutar las migraciones SQL

### GitHub (manual — una sola vez)
1. Crear repositorio `conexhome-sv` en cuenta `julioolivodeveloper`
2. Configurar secretos para CI (si se desea)
3. No agregar `.env.local` nunca

### Cloudflare Pages (manual — Etapa 8)
1. Conectar repositorio GitHub a Cloudflare Pages
2. Configurar variables de entorno en el dashboard
3. Conectar dominio `conexhomesv.com` (solo con autorización explícita)

---

## Decisiones de arquitectura

- **Server Components por defecto** — solo marcar con `'use client'` cuando se necesite estado o eventos del browser.
- **Server Actions para mutaciones** — crear, editar, eliminar propiedades desde el servidor con validación Zod antes de tocar la DB.
- **Middleware de autenticación** — `src/middleware.ts` protege las rutas `/panel/*`, `/publicar`, `/favoritos`, `/mensajes`, `/admin/*`.
- **Sin `SUPABASE_SERVICE_ROLE_KEY` en el browser** — solo se usa en Server Actions y API Routes marcados como server-only.
- **Slugs únicos** — generados desde el título + ID corto. Inmutables una vez publicados para no romper SEO.
- **Imágenes procesadas en el browser** — compresión y conversión WebP antes del upload para reducir ancho de banda y Storage.
- **Realtime selectivo** — solo se suscribe al canal de mensajes cuando la pantalla de mensajes está activa.
- **Eliminación lógica** — las propiedades nunca se borran de la DB; se marcan `status = 'eliminada'`.
- **Límite validado en PostgreSQL** — función/trigger que cuenta propiedades activas antes de INSERT para prevenir bypass desde el cliente.

---

## Etapa 0 — Detalle

### Inspeccionado
- [x] Repositorio local: nuevo (recién inicializado en `/Users/jeoh123/conexhome-sv`)
- [x] GitHub: repositorio `conexhome-sv` no existe aún → se crea en Etapa 1
- [x] Supabase: proyecto por crear → credenciales pendientes del usuario
- [x] Cloudflare: por configurar en Etapa 8
- [x] Node.js v24.15 + npm 11.12 disponibles
- [x] Gestor de paquetes: **npm**

### Identificado
- [x] Arquitectura propuesta
- [x] Estructura de carpetas
- [x] Esquema de todas las tablas
- [x] Políticas RLS por tabla
- [x] Variables de entorno
- [x] Rutas de la aplicación
- [x] Decisiones técnicas documentadas

---

## Historial de etapas

### Etapa 1 — 2026-09-06
- Next.js 16.3.4 + TypeScript + Tailwind CSS 4 configurados manualmente
- Identidad visual: paleta navy/accent/success, tipografía Inter, globals.css con @theme
- Header sticky con menú móvil (MobileMenu)
- Footer completo con 4 columnas de navegación
- HeroSection con gradiente navy, estadísticas y SearchBar
- SearchBar con tabs Comprar/Alquiler, campo de texto y selector de departamento
- PropertyCard con imagen, badges de operación, favoritos, precio, tipo, ubicación y características
- Secciones home: FeaturedProperties, RecentProperties, DepartmentExplorer (14 dept.), OwnerCTA
- 8 propiedades mock con datos reales de El Salvador (casas, apartamentos, terreno, finca, local, playa)
- Páginas stub: /comprar, /alquilar, /iniciar-sesion, /crear-cuenta, 404
- TypeScript: ✅ 0 errores · ESLint: ✅ 0 errores, 0 warnings · Build: ✅ exitoso
- Repositorio GitHub creado: https://github.com/julioolivodeveloper/conexhome-sv
- Commit: af3c30e · 37 archivos · 9,507 líneas

### Etapa 0 — 2026-09-06
- Directorio del proyecto creado en `/Users/jeoh123/conexhome-sv`
- Git inicializado
- `PROJECT_PROGRESS.md` creado con arquitectura completa
- No se desarrolló código de la plataforma
