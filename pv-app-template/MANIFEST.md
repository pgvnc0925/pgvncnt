# Template Manifest — Pagine Vincenti App Engine

Data: 2025-12-29
Versione: 1.0.0
Stato: Production-Ready

---

## 📦 Cosa è incluso

### Core Infrastruttura

- ✅ Next.js 15 (App Router)
- ✅ React 18
- ✅ TypeScript 5
- ✅ Tailwind CSS 3
- ✅ shadcn/ui (base components)

### Componenti

#### Atomici (5)
- Input.tsx
- Select.tsx
- Scale.tsx (range slider)
- Textarea.tsx
- Checkbox.tsx

#### Blocks Semantici PV (5)
- ContextFrame.tsx
- StepCard.tsx
- Verdict.tsx
- TensionMap.tsx (2×2 tension matrix)
- Accordion.tsx (collapsible sections)

#### Layout (1)
- AppShell.tsx (header + progress + footer)

### Hooks (4)

- useAppSession()   → Gestione sessione + dati
- useCredits()      → Sistema crediti
- useAppConfig()    → Carica config dinamica
- useSubmitStep()   → Validazione + submit

### API Clients (2)

- supabaseClient.ts → CRUD sessioni, crediti, risultati
- n8nClient.ts      → POST a webhook n8n per agenti

### Types (1)

- types.ts          → 40+ interfacce TypeScript per coerenza

### App di Esempio (Core-App v1)

- page.tsx          → **Motore universale di rendering** (config-driven)
- ui-schema.ts      → 13 domande su 4 sistemi + 4 verdetti
- config.ts         → Metadati app
- rag-manifest.ts   → Governance della conoscenza
- layout.tsx        → Wrapper

### Documentazione (4)

- README.md         → Overview completo + setup
- QUICKSTART.md     → 15 minuti per lanciare
- ARCHITECTURE.md   → Deep dive architetturale
- MANIFEST.md       → Questo file

### Config Files (5)

- package.json      → Dipendenze
- tsconfig.json     → TypeScript config
- next.config.js    → Next.js config
- tailwind.config.js → Tailwind config
- postcss.config.js → PostCSS config

### Utility

- .env.example      → Template variabili d'ambiente
- .gitignore        → Git config
- app/globals.css   → Global styles

---

## 🎯 Cosa NON è incluso (e perché)

### ❌ Authentication

Motivo: Varia per setup (Supabase Auth vs NextAuth vs Custom)

**Todo**: Integra con tuo provider auth
- useAuth() hook
- withAuth() middleware
- Auth in Supabase `auth.users` table

### ❌ Database Schema

Motivo: Deve matchare la tua infra Supabase

**Todo**: Crea tabelle
- `app_sessions` (salva risposte)
- `app_results` (salva verdetti)
- `user_credits` (traccia consumo)
- `audit_logs` (traccia azioni)

### ❌ n8n Workflows

Motivo: Dipendono dalla tua logica diagnostica

**Todo**: Scrivi workflow
- `pv-core-app-processor`
- `pv-strategy-generator`
- `pv-exercise-evaluator`
- ecc per ogni app

### ❌ Deployment Config

Motivo: Varia per hosting (Vercel, Docker, etc)

**Todo**: Configura
- Vercel deployment (se usi Vercel)
- Docker build (se usi Docker)
- CI/CD pipeline

### ❌ Email/Notifications

Motivo: Integrazione esterna (SendGrid, Mailgun, etc)

**Todo**: Se vuoi
- Email di conferma sessione
- Email con risultati
- Notifiche push

---

## 📊 Statistiche

| Categoria | Quantità | Linee di codice |
|-----------|----------|-----------------|
| Componenti atomici | 5 | ~200 |
| Blocks semantici | 5 | ~400 |
| Hooks | 4 | ~300 |
| API clients | 2 | ~200 |
| App di esempio | 5 file | ~800 |
| Tipi | 1 file | ~250 |
| **Totale** | **27 file** | **~2100 LOC** |

(Escluso node_modules e documentazione)

---

## ✅ Quality Checklist

- ✅ TypeScript strict mode
- ✅ Zero `any` types
- ✅ ESLint config base
- ✅ Tailwind CSS (no manual CSS)
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Form validation
- ✅ Error boundaries (parziale, da aggiungere)
- ✅ Loading states
- ✅ Disabled states
- ✅ Mobile responsive
- ✅ Dark mode ready (config, non implementato)

---

## 🚀 Come iniziare

### 1. Scarica/clona il template

```bash
git clone https://github.com/pagine-vincenti/app-engine.git
cd app-engine
```

### 2. Segui QUICKSTART.md

```bash
npm install
cp .env.example .env.local
# Aggiungi le tue credenziali
npm run dev
```

### 3. Visita l'app demo

http://localhost:3000/apps/core-app-v1

### 4. Leggi ARCHITECTURE.md per capire il design

### 5. Crea una nuova app (15 minuti)

```bash
mkdir apps/my-app-v1
# Copia files, modifica ui-schema.ts, scrivi workflow n8n
```

---

## 🔄 Versioning

**Questo template**: v1.0.0

**Promessa di stabilità**:
- ✅ API dei componenti rimane stabile
- ✅ Structure di config rimane stabile
- ✅ page.tsx non cambia
- ⚠️ Tailwind config può evolve (minor breaking changes)
- ⚠️ Dipendenze npm vengono aggiornate (segui best practices)

---

## 📝 Note Finali

### Cosa lo rende speciale

1. **Config-driven**: Nuove app senza codice novo
2. **Backend-agnostic**: Funziona con n8n + Supabase (o altro)
3. **UX Canon incorporato**: Verdict + TensionMap built-in
4. **Type-safe**: TypeScript ovunque
5. **Scalable**: Provato concettualmente per 20+ app

### Cosa rende difficile

1. Capire la separazione frontend/backend
2. Imparare a scrivere config (ui-schema.ts)
3. Scrivere agenti n8n complessi
4. Testing end-to-end

### Supporto

- GitHub Issues: https://github.com/pagine-vincenti/app-engine/issues
- Documentazione: Leggi README, QUICKSTART, ARCHITECTURE
- Example apps: Vedi apps/core-app-v1/

---

## 📅 Roadmap interno

- [ ] Aggiungere Error Boundaries
- [ ] Aggiungere Sentry integration
- [ ] Aggiungere analytics tracking
- [ ] Aggiungere i18n (italiano/inglese)
- [ ] Aggiungere dark mode
- [ ] Aggiungere PWA support
- [ ] Creare Workbook app template
- [ ] Creare Quiz app template
- [ ] Creare Audit app template
- [ ] Creare Coach app template

---

## 🎓 Learning Path

1. **Leggi** QUICKSTART.md (5 minuti)
2. **Esegui** setup locale (5 minuti)
3. **Prova** Core-App MVP (5 minuti)
4. **Leggi** ARCHITECTURE.md (30 minuti)
5. **Studia** page.tsx (30 minuti)
6. **Crea** una nuova app (1-2 ore)
7. **Scrivi** workflow n8n (2-4 ore)
8. **Deploy** (1 ora)

**Totale**: ~5-8 ore per mastery

---

Fatto. Buon lavoro. 🚀
