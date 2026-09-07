-- ============================================================
-- ConexHome SV — Migración 002: Funciones y triggers
-- ============================================================

-- Auto-actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-crear perfil en registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar límite de propiedades activas
CREATE OR REPLACE FUNCTION public.check_property_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_limit INT := 5;
  v_count INT;
BEGIN
  SELECT COALESCE(value::INT, 5) INTO v_limit
  FROM public.app_settings
  WHERE key = 'max_free_properties';

  SELECT COUNT(*) INTO v_count
  FROM public.properties
  WHERE user_id = p_user_id
    AND status IN ('borrador', 'publicada', 'pausada');

  RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Marcar published_at al publicar
CREATE OR REPLACE FUNCTION public.handle_property_published()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'publicada' AND (OLD.status IS NULL OR OLD.status != 'publicada') THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_property_published
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_property_published();

-- Función helper: es administrador
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
