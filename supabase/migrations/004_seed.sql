-- ============================================================
-- ConexHome SV — Migración 004: Datos iniciales
-- ============================================================

-- Configuración de la plataforma
INSERT INTO public.app_settings (key, value, description)
VALUES
  ('max_free_properties', '5',          'Máximo de propiedades activas gratuitas por usuario'),
  ('site_name',           'ConexHome SV', 'Nombre de la plataforma'),
  ('platform_active',     'true',        'Si la plataforma está activa')
ON CONFLICT (key) DO NOTHING;

-- Catálogo de amenidades
INSERT INTO public.amenities (name, icon)
VALUES
  ('Piscina',                '🏊'),
  ('Jardín',                 '🌿'),
  ('Garaje techado',         '🚗'),
  ('Seguridad 24/7',         '🔒'),
  ('Gimnasio',               '💪'),
  ('Área de juegos',         '🎮'),
  ('Cuarto de servicio',     '🏠'),
  ('Sistema de alarma',      '🚨'),
  ('Aire acondicionado',     '❄️'),
  ('Amueblado',              '🛋️'),
  ('Electricidad de respaldo','⚡'),
  ('Agua potable',           '💧'),
  ('Internet',               '📡'),
  ('Vista al mar',           '🌊'),
  ('Terraza',                '☀️'),
  ('Balcón',                 '🏗️'),
  ('Pozo propio',            '💧'),
  ('Sistema de riego',       '🌱'),
  ('Acceso controlado',      '🔐'),
  ('Áreas verdes',           '🌳'),
  ('Bodega',                 '📦'),
  ('Lavandería',             '🫧'),
  ('Cisterna',               '🪣'),
  ('Panel solar',            '☀️'),
  ('Cisterna de gas',        '🔥')
ON CONFLICT (name) DO NOTHING;
