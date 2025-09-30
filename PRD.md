Pagine Vincenti - PRD (Showcase & Lead Magnet Version)

Version: 1.1
Last Updated: 2025-09-30
Document Type: Technical & Strategic Specification

⸻

1. PROJECT VISION & PURPOSE

Vision

Pagine Vincenti è una vetrina interattiva che mostra come i concetti dei grandi libri di business possano trasformarsi in strumenti pratici.
Obiettivo: costruire credibilità, generare lead, portare traffico e alimentare l’autorevolezza di Timoteo Pasquali come consulente AI e business automation.

Purpose
	•	Lead magnet: attirare imprenditori/professionisti tramite tool gratuiti e contenuti di valore.
	•	Showcase: dimostrare la capacità di trasformare framework teorici in software.
	•	Funnel: spingere traffico verso timoteopasquali.it e le offerte di consulenza/automazione.

Core Philosophy

“Don’t just read the framework. Use it.”

⸻

2. PRODUCT ARCHITECTURE

Struttura a due livelli
	1.	Tools interattivi (5–7 all’inizio): piccole app guidate (multi-step form) che applicano framework noti. Output: report/testo finale + CTA verso contenuti correlati.
	2.	Contenuti di supporto: schede libro, articoli di approfondimento, link affiliati.

Differenze dal PRD precedente
	•	Niente marketplace di prodotti digitali all’inizio.
	•	Niente paywall rigido: focus sul “dare molto gratis” → in cambio di email (lead).
	•	Monetizzazione diretta (Stripe, PDF venduti) può arrivare dopo.

⸻

3. TECH STACK

Frontend:
	•	Next.js 14 (App Router)
	•	TypeScript
	•	Tailwind + shadcn/ui
	•	Framer Motion (animazioni leggere)

Backend & DB:
	•	Supabase (PostgreSQL, Auth, Storage)
	•	API Routes in Next.js per la logica

AI Integration:
	•	Anthropic Claude API (aiuto contestuale nei tool, mini-RAG con spiegazioni dei framework)
	•	Rate limit: 5 messaggi al giorno free → loggati illimitato

Email/Leads:
	•	Supabase Edge Functions + Brevo (già usato su timoteopasquali.it)

Hosting:
	•	Vercel (paginevincenti.it, free/pro plan a seconda del traffico)

Analytics:
	•	Vercel Analytics + semplice event logging in Supabase

⸻

4. INFORMATION ARCHITECTURE

Sitemap
/ (homepage)
/tools (lista tool)
/tools/[slug] (tool interattivo)
/libri (elenco libri citati)
/libri/[slug] (scheda libro + affiliate)
/articoli (approfondimenti SEO)
/chi-sono
/privacy-policy
/termini-servizio
/cookie-policy

Database Schema (semplificato)

tools
	•	id, slug, name, description, category
	•	workflow_steps (JSONB)
	•	related_books (array)

books
	•	id, slug, title, author, cover_url, amazon_link
	•	description, key_frameworks (array)

tool_sessions
	•	id, user_id, tool_id
	•	inputs (JSONB)
	•	output (JSONB)
	•	created_at

profiles
	•	id, user_id, email
	•	created_at

leads
	•	id, email, source (tool, libro, articolo)
	•	created_at

⸻

5. DESIGN SYSTEM

Tone of Voice
	•	Diretto, pratico, senza fuffa.
	•	Italiano business colloquiale.

UI
	•	Griglia di tool in homepage.
	•	Ogni tool = card con nome, descrizione breve, [Inizia Gratis].
	•	Workflow step-by-step (max 5 step).
	•	Output finale = analisi + CTA:
	•	Scarica PDF → richiede email.
	•	Link al libro su Amazon.
	•	Link a [timoteopasquali.it].

### Brand Identity

**Positioning:**
"Tools seri per imprenditori seri. Niente fuffa, solo framework testati."

**Tone of Voice:**
- Diretto e senza fronzoli
- Professionale ma accessibile
- Pratico > Teorico
- Italiano colloquiale business (no inglesismi inutili)

**Examples:**
- YES: "Prendi decisioni migliori in 10 minuti"
- NO: "Scopri i segreti dei top CEO per il decision making"

- YES: "Questo tool usa 5 framework da libri che costano €100+ totali. Tu lo usi gratis."
- NO: "Accedi alla saggezza dei migliori autori business"

### Visual Language

**Color Palette:**

Primary (Action):
- Forest Green: #2C5F2D (buttons, CTAs, success states)

Secondary (Accent):
- Terracotta: #E07A5F (highlights, badges, secondary CTAs)

Neutrals:
- Off-White: #FAFAF9 (background)
- Charcoal: #2D3142 (text primary)
- Gray: #6B7280 (text secondary)

Semantic:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6

**Typography:**

Headings:
- Font: Inter (system fallback)
- Weights: 600 (semibold), 700 (bold)
- Sizes: 
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)

Body:
- Font: Inter
- Weight: 400 (regular), 500 (medium)
- Size: 1rem (16px)
- Line height: 1.6

Code/Monospace:
- Font: 'SF Mono', 'Consolas', monospace
- Use for: technical outputs, data display

**Spacing System:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Consistent rhythm across all components

**Component Style:**

Buttons:
- Primary: Solid green, white text, 8px radius
- Secondary: Outline, green border
- Tertiary: Ghost, text only
- Height: 40px default, 32px small, 48px large

Cards:
- White background
- 1px border gray-200
- 8px border radius
- 2px shadow on hover
- 16px padding

Forms:
- Input height: 40px
- Border: 1px gray-300
- Focus: 2px green ring
- Error: red border + message below

**Layout Grid:**
- 12 columns on desktop
- 8px gutters
- Max width: 1280px
- Responsive breakpoints:
  - Mobile: 640px
  - Tablet: 768px
  - Desktop: 1024px
  - Wide: 1280px

### UI Patterns

**Tool Cards (Homepage Grid):**
```
┌──────────────────────────┐
│ [Icon]                   │
│ Tool Name                │
│ One-line description     │
│ ─────────────────────    │
│ Powered by: 5 libri      │
│ [Usa Gratis →]           │
└──────────────────────────┘
```

**Tool Workflow (Multi-step form):**
```
┌────────────────────────────────────┐
│ Progress: ●●●○○ Step 3 of 5        │
├────────────────────────────────────┤
│                                    │
│ Step Title                         │
│ ────────────                       │
│ Explanation text with framework    │
│ reference                          │
│                                    │
│ [Input Field]                      │
│                                    │
│ ℹ️ Help text from book            │
│                                    │
│ [← Indietro] [Avanti →]           │
└────────────────────────────────────┘

[Chat widget fixed bottom-right]
```

**Affiliate Integration (Non-intrusive):**
```
After completing tool step 3 of 5:

┌────────────────────────────────────┐
│ 📚 Vuoi approfondire?              │
│                                    │
│ Questo step usa il framework       │
│ "Believability Weighting" dal      │
│ libro Principles di Ray Dalio      │
│                                    │
│ [Vedi su Amazon →] [Audible →]    │
│ (Commissione: €3-5 per noi)       │
│                                    │
│ [X] No grazie, continua            │
└────────────────────────────────────┘
```

⸻

6. USER FLOWS

Primo accesso
	•	Utente arriva da Google/social → homepage con claim:
“Strumenti pratici per migliorare decisioni e strategie. Gratis.”
	•	Clicca un tool → compila workflow → ottiene output.
	•	Per scaricare il PDF deve lasciare email → salvato in Supabase + inviato a Brevo.

Lead nurturing
	•	Email automatica:
	•	Giorno 1: link ad altri tool.
	•	Giorno 3: mini-case study (con link a timoteopasquali.it).
	•	Giorno 7: CTA consulenza/automazione.

Utente registrato
	•	Può salvare sessioni tool.
	•	Può usare chat AI illimitata nei tool.

⸻

7. CONTENT MANAGEMENT

Tools
	•	Definiti in JSON (step con domande, input type, help text, framework di riferimento).
	•	Esempio “Decision Validator”: 5 step, ognuno cita framework diverso.

Books
	•	Solo metadati + link affiliato.
	•	Non serve contenuto integrale.

Articoli
	•	SEO long form → attirano traffico organico.
	•	Strutturati come riassunti/analisi libri.

⸻

8. LEGAL & COMPLIANCE
	•	Privacy, ToS, Cookie → versioni base con Iubenda.
	•	Disclosure affiliate: presente in footer e vicino ai link Amazon.
	•	GDPR: export e cancellazione account da dashboard.

⸻

9. SUCCESS METRICS
	•	Tecniche:
	•	Site speed < 2s
	•	Uptime 99%
	•	Error rate < 1%
	•	Business:
	•	1.000+ email lead entro 6 mesi
	•	10% CTR su link affiliati
	•	5% traffico che passa a timoteopasquali.it

⸻

10. PROJECT STRUCTURE (repo)
pagine-vincenti/
├── app/
│   ├── (marketing)/page.tsx (homepage)
│   ├── tools/page.tsx
│   ├── tools/[slug]/page.tsx
│   ├── libri/page.tsx
│   ├── libri/[slug]/page.tsx
│   ├── articoli/[slug]/page.tsx
│   ├── dashboard/page.tsx
│   ├── api/tools/[slug]/generate/route.ts
│   ├── api/leads/route.ts
│   └── (legal)/...
│
├── components/
│   ├── tools/
│   │   ├── tool-card.tsx
│   │   ├── workflow-step.tsx
│   │   ├── tool-output.tsx
│   │   └── tool-chat.tsx
│   ├── books/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── ai/chat-context.ts
│   ├── utils.ts
│   └── email.ts
│
├── types/
├── public/
├── supabase/migrations/
└── package.json

APPENDIX A: Sample Tool (JSON)
{
  "slug": "decision-validator",
  "name": "Decision Validator",
  "description": "Valida decisioni importanti usando 5 framework celebri.",
  "category": "decision-making",
  "workflow_steps": [
    {
      "id": "step-1",
      "title": "Descrivi la decisione",
      "prompt": "Quale decisione devi prendere?",
      "input_type": "textarea",
      "help_text": "Esempio: assumere Mario come responsabile vendite.",
      "framework": "Principles (Dalio)"
    },
    {
      "id": "step-2",
      "title": "Individua i bias",
      "prompt": "Quali bias potrebbero influenzarti?",
      "input_type": "multi-select",
      "options": ["Confirmation bias", "Sunk cost", "Overconfidence"],
      "framework": "Thinking Fast & Slow (Kahneman)"
    }
  ],
  "output_template": {
    "sections": [
      { "title": "Decisione", "content": "{{decision}}" },
      { "title": "Bias individuati", "content": "{{biases}}" },
      { "title": "Raccomandazione finale", "content": "{{recommendation}}" }
    ]
  },
  "related_books": ["principles-dalio", "thinking-fast-slow"]
}


