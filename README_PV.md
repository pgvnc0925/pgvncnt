# 🚀 Pagine Vincenti – Manifesto di Progetto

## 🎯 Visione
**Pagine Vincenti** è una piattaforma di **business tools interattivi** che trasformano i framework dei grandi libri di management e marketing in strumenti pratici.  
Obiettivo:  
- Generare **lead** per [timoteopasquali.it](https://timoteopasquali.it).  
- Dimostrare competenza su business + AI.  
- Creare un **laboratorio pubblico** di mini-SaaS dimostrativi.  

Non è un prodotto “standalone da scalare”, ma un **showcase + lead magnet**.

---

## 📦 Stack Tecnico
- **Frontend:** Next.js 14 (App Router, TypeScript, Tailwind, shadcn/ui).  
- **Backend:** Supabase (Postgres + Auth + Storage + RLS).  
- **AI:** Anthropic Claude API (chat contestuale nei tool).  
- **Email/Leads:** Supabase Edge Functions + Brevo.  
- **Hosting:** Vercel.  

---

## 📂 Struttura chiave (da boilerplate → adattata)
```
app/
  (marketing)/page.tsx     → Homepage (hero + griglia tool)
  tools/page.tsx           → Lista tool
  tools/[slug]/page.tsx    → Workflow interattivo
  libri/page.tsx           → Lista libri
  libri/[slug]/page.tsx    → Scheda libro
  articoli/[slug]/page.tsx → Articoli SEO
  dashboard/page.tsx       → Sessioni salvate
  api/tools/[slug]/...     → Generazione output
  api/leads/route.ts       → Lead capture
  api/affiliate/route.ts   → Tracciamento click
```

DB migrations:  
- `tools`, `books`, `tool_sessions`, `leads`, `affiliate_clicks`.  
(vedi `001_add_pagine_vincenti.sql` e `002_add_rls_policies.sql`).  

---

## 🧩 Componenti Core
- `components/tools/` → `tool-card`, `workflow-step`, `tool-output`, `tool-chat`.  
- `components/books/` → `book-card`, `book-detail`.  
- `components/layout/` → header, footer, cookie-banner.  

---

## 📈 Flussi Utente
1. Utente apre un tool → compila workflow → ottiene output.  
2. Per scaricare PDF → lascia email → salvato in Supabase + inviato a Brevo.  
3. Output contiene:  
   - Analisi strutturata.  
   - CTA “Approfondisci libro” (link Amazon affiliato).  
   - CTA “Scopri consulenze su timoteopasquali.it”.  

---

## 🛡️ Sicurezza & Compliance
- **RLS attive**: tool_sessions visibili solo al proprietario, leads non pubbliche.  
- **Legal pages** già incluse: Privacy, TOS, Cookie.  
- **Disclosure affiliazioni**: nel footer + vicino ai link Amazon.  

---

## 🔧 Dev Setup
1. Clona repo boilerplate.  
2. Aggiungi migrations `001_add_pagine_vincenti.sql` e `002_add_rls_policies.sql`.  
3. Installa dipendenze:
   ```bash
   npm install
   npm run dev
   ```
4. Tailwind/PostCSS: se non configurati, usare `boilerplate/templates/*` (vedi README originale).  
5. Deploy su Vercel: impostare env (Supabase, Brevo, Claude API key).  

---

## 🤖 MCP & AI Agents
Per lavorare in AI pair-programming:
- **Costituzione AI**: vedi `ai_agent_constitution.md`.  
- **MCP setup**: vedi `mcp_complete_setup_guide.md` + `updated_mcp_config.json`.  
- **Script**: `scripts/mcp_setup.sh` (opzionale).  

---

## 📝 Commit Guidelines
Usa commit brevi e chiari (inglese), vedi `commit-cheatsheet.md`.  
Esempi:
- `Init new project from boilerplate template`  
- `Add tool_sessions table and RLS policies`  
- `Implement Decision Validator tool (UI + API)`  

---

## 📌 Roadmap MVP (8 sprint ≈ 2 mesi)
1. Setup + homepage base.  
2. Primo tool (Decision Validator).  
3. Lead capture + PDF export.  
4. Sezione libri + affiliazioni.  
5. AI help integrato.  
6. Secondo tool (Marketing Architect).  
7. Articoli SEO.  
8. Refinement + lancio soft.  

---

👉 Questo README è il **documento principale** da consegnare a Claude Code o altri agenti AI: contiene obiettivi, stack, flussi, DB, regole e roadmap. Tutti gli altri file (`ai_agent_constitution.md`, `commit-cheatsheet.md`, `mcp_complete_setup_guide.md`) sono “appendici di riferimento”.  
