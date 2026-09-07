-- ============================================================
-- ConexHome SV — Migración 001: Esquema principal
-- ============================================================

-- Profiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL DEFAULT '',
  phone        TEXT,
  whatsapp     TEXT,
  avatar_url   TEXT,
  bio          TEXT,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug                 TEXT NOT NULL UNIQUE,
  title                TEXT NOT NULL,
  description          TEXT,
  operation            TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
  property_type        TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'borrador'
                         CHECK (status IN ('borrador','publicada','pausada','vendida','alquilada','eliminada')),
  price                NUMERIC(12,2),
  price_negotiable     BOOLEAN NOT NULL DEFAULT false,
  financing_available  BOOLEAN NOT NULL DEFAULT false,
  bedrooms             SMALLINT,
  bathrooms            SMALLINT,
  parking_spots        SMALLINT,
  land_area            NUMERIC(10,2),
  construction_area    NUMERIC(10,2),
  area_unit            TEXT NOT NULL DEFAULT 'm2' CHECK (area_unit IN ('m2','vara2','manzana')),
  department           TEXT NOT NULL,
  municipality         TEXT NOT NULL,
  zone                 TEXT,
  location_reference   TEXT,
  latitude             NUMERIC(10,8),
  longitude            NUMERIC(11,8),
  location_type        TEXT NOT NULL DEFAULT 'approximate' CHECK (location_type IN ('exact','approximate')),
  contact_name         TEXT,
  contact_phone        TEXT,
  contact_whatsapp     TEXT,
  contact_preference   TEXT NOT NULL DEFAULT 'any'
                         CHECK (contact_preference IN ('whatsapp','phone','message','any')),
  youtube_url          TEXT,
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  is_hidden            BOOLEAN NOT NULL DEFAULT false,
  view_count           INTEGER NOT NULL DEFAULT 0,
  cover_image_url      TEXT,
  published_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_user_id     ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status      ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_operation   ON public.properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_department  ON public.properties(department);
CREATE INDEX IF NOT EXISTS idx_properties_featured    ON public.properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_published   ON public.properties(published_at DESC) WHERE status = 'publicada';

-- Property images
CREATE TABLE IF NOT EXISTS public.property_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_cover      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images(property_id);

-- Amenities catalog
CREATE TABLE IF NOT EXISTS public.amenities (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT
);

-- Property amenities (junction)
CREATE TABLE IF NOT EXISTS public.property_amenities (
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_id  UUID REFERENCES public.amenities(id)  ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  subject     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_blocked      BOOLEAN NOT NULL DEFAULT false,
  unread_count    INTEGER NOT NULL DEFAULT 0,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id),
  body            TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  property_id      UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason           TEXT NOT NULL,
  description      TEXT,
  status           TEXT NOT NULL DEFAULT 'pendiente'
                     CHECK (status IN ('pendiente','revisando','resuelto')),
  resolved_by      UUID REFERENCES public.profiles(id),
  resolved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Property views
CREATE TABLE IF NOT EXISTS public.property_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property ON public.property_views(property_id);

-- Contact clicks
CREATE TABLE IF NOT EXISTS public.contact_clicks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  click_type  TEXT NOT NULL CHECK (click_type IN ('whatsapp','phone','message')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- App settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  UUID REFERENCES public.profiles(id)
);

-- Admin actions audit log
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES public.profiles(id),
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   UUID,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
