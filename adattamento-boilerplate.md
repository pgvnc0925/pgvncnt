Mappa di adattamento Boilerplate → Pagine Vincenti

⸻

1. Struttura esistente da mantenere

Questi moduli li tieni quasi intatti:
	•	boilerplate/auth/* → login/signup, gestione profilo, toggle tema.
	•	boilerplate/legal/* → già pronti i moduli GDPR/consenso. Solo tradurre testi in italiano.
	•	boilerplate/lib/payments/* + app/api/stripe/* → tienili per futuro paywall, ma nell’MVP puoi disattivarli.
	•	boilerplate/templates/app/layout.tsx e providers.tsx → restano come base per tutto il sito.
	•	boilerplate/templates/tailwind.config.js → va solo aggiornata palette colori (verde/terracotta).

✅ Queste parti sono già solide: non reinventare.

⸻

2. File da modificare/adattare

Qui serve taglia e cuci:

Homepage & Marketing
	•	boilerplate/templates/app/(marketing)/logos/page.tsx
	•	boilerplate/templates/app/(marketing)/pricing/page.tsx
→ Elimina demo pricing/loghi.
→ Crea nuova app/(marketing)/page.tsx = homepage Pagine Vincenti.
Contiene:
	•	Hero section (“Strumenti pratici, framework reali, gratis”)
	•	Griglia dei tool (component tool-card.tsx).
	•	CTA verso /tools.

User Profile
	•	auth/components/UserProfilePanel.tsx
→ Aggiungere sezione “Le mie sessioni salvate” (legge da tool_sessions).

⸻

3. File/componenti da aggiungere

Tools

Nuova cartella:
app/tools/page.tsx               // griglia tool
app/tools/[slug]/page.tsx        // singolo tool (workflow)
components/tools/tool-card.tsx
components/tools/workflow-step.tsx
components/tools/tool-output.tsx
components/tools/tool-chat.tsx   // AI widget

Books
app/libri/page.tsx
app/libri/[slug]/page.tsx
components/books/book-card.tsx
components/books/book-detail.tsx

Articles (AISEO)
app/articoli/[slug]/page.tsx
(MDX loader )

API
app/api/tools/[slug]/generate/route.ts   // genera output tool
app/api/leads/route.ts                   // salva email → Brevo
app/api/affiliate/track/route.ts         // click tracking

4. Database (Supabase)

Da aggiungere alle migrations:
-- Tools
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  workflow_steps JSONB NOT NULL
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  amazon_link TEXT,
  description TEXT,
  key_frameworks TEXT[]
);

-- Tool sessions
CREATE TABLE tool_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id),
  inputs JSONB,
  output JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate clicks
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id),
  context TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

5. Flow da implementare

Tool Flow
	1.	Utente entra su /tools/[slug].
	2.	Multi-step form (workflow-step.tsx).
	3.	Alla fine → output (tool-output.tsx).
	4.	“Scarica PDF” → richiede email (salvata in leads + Brevo).

Book Flow
	1.	Utente apre /libri/[slug].
	2.	Vede scheda libro + “Usato in questi tool”.
	3.	Click su “Vedi su Amazon” → chiamata API affiliate/track.

AI Help Flow
	1.	Utente su step → clicca icona help.
	2.	tool-chat.tsx invia query a Claude API.
	3.	Claude risponde con spiegazione del framework.

⸻

6. Priorità Sprint (da boilerplate → MVP)
	1.	Pulizia boilerplate (rimuovere pagine demo pricing/logos).
	2.	Homepage nuova con griglia tool mock.
	3.	DB migrations per tools/books/tool_sessions.
	4.	Implementare primo tool (Decision Validator) end-to-end.
	5.	Lead capture con Brevo al download PDF.
	6.	Sezione libri con 2 schede reali.
	7.	Integrazione AI in 1 step del tool.
	8.	SEO: articoli MDX (1–2).

⸻

7. Cosa ignorare per ora
	•	Stripe checkout (tienilo disattivato).
	•	Sezione prodotti digitali.
	•	Admin dashboard avanzata.
	•	Test automatizzati (basta manuale per MVP).
