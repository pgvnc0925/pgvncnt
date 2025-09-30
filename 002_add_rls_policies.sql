-- 002_add_rls_policies.sql

-- Enable RLS on new tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Public: tools e books visibili a tutti (solo SELECT)
CREATE POLICY "Tools are viewable by everyone" ON tools
  FOR SELECT USING (true);

CREATE POLICY "Books are viewable by everyone" ON books
  FOR SELECT USING (true);

-- tool_sessions: ogni utente gestisce solo le proprie sessioni
CREATE POLICY "Users manage own tool sessions" ON tool_sessions
  FOR ALL USING (auth.uid() = user_id);

-- leads: solo admin può vedere, utenti no
-- NB: per MVP, gli inserimenti restano pubblici (chiunque può lasciare email)
CREATE POLICY "Anyone can insert lead" ON leads
  FOR INSERT WITH CHECK (true);

-- affiliate_clicks: inserimento libero (tracking click anonimo)
CREATE POLICY "Anyone can insert affiliate click" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

-- Utenti non possono leggere leads o affiliate_clicks
-- (nessuna policy SELECT = blocco di default)

