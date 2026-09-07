-- ============================================================
-- ConexHome SV — Migración 003: Row Level Security
-- ============================================================

ALTER TABLE public.profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_clicks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions           ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ─────────────────────────────────────────────────
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE POLICY "properties_select"
  ON public.properties FOR SELECT USING (
    (status = 'publicada' AND is_hidden = false)
    OR auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "properties_insert"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.check_property_limit(auth.uid())
  );

CREATE POLICY "properties_update"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "properties_delete"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- ── PROPERTY_IMAGES ──────────────────────────────────────────
CREATE POLICY "property_images_select"
  ON public.property_images FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND (p.status = 'publicada' OR p.user_id = auth.uid())
    )
  );

CREATE POLICY "property_images_insert"
  ON public.property_images FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "property_images_delete"
  ON public.property_images FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

-- ── AMENITIES ────────────────────────────────────────────────
CREATE POLICY "amenities_select_all"
  ON public.amenities FOR SELECT USING (true);

CREATE POLICY "amenities_insert_admin"
  ON public.amenities FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- ── PROPERTY_AMENITIES ────────────────────────────────────────
CREATE POLICY "property_amenities_select_all"
  ON public.property_amenities FOR SELECT USING (true);

CREATE POLICY "property_amenities_insert"
  ON public.property_amenities FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "property_amenities_delete"
  ON public.property_amenities FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

-- ── FAVORITES ────────────────────────────────────────────────
CREATE POLICY "favorites_select_own"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- ── CONVERSATIONS ─────────────────────────────────────────────
CREATE POLICY "conversations_select_participant"
  ON public.conversations FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "conversations_insert_auth"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ── CONVERSATION_PARTICIPANTS ─────────────────────────────────
CREATE POLICY "conv_participants_select"
  ON public.conversation_participants FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp2
      WHERE cp2.conversation_id = conversation_id AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "conv_participants_insert_auth"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "conv_participants_update_own"
  ON public.conversation_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE POLICY "messages_select_participant"
  ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_participant"
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
  );

-- ── REPORTS ──────────────────────────────────────────────────
CREATE POLICY "reports_insert_auth"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_admin"
  ON public.reports FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "reports_update_admin"
  ON public.reports FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ── PROPERTY_VIEWS ────────────────────────────────────────────
CREATE POLICY "property_views_insert_all"
  ON public.property_views FOR INSERT WITH CHECK (true);

CREATE POLICY "property_views_select"
  ON public.property_views FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

-- ── CONTACT_CLICKS ────────────────────────────────────────────
CREATE POLICY "contact_clicks_insert_all"
  ON public.contact_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_clicks_select"
  ON public.contact_clicks FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

-- ── APP_SETTINGS ─────────────────────────────────────────────
CREATE POLICY "app_settings_select_all"
  ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "app_settings_insert_admin"
  ON public.app_settings FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "app_settings_update_admin"
  ON public.app_settings FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ── ADMIN_ACTIONS ─────────────────────────────────────────────
CREATE POLICY "admin_actions_select_admin"
  ON public.admin_actions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "admin_actions_insert_admin"
  ON public.admin_actions FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));
