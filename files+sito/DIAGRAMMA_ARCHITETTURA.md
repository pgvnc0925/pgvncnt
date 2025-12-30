# 🗺 Diagramma Architettura Completa

## User Journey (Visual Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                     UTENTE VISITA                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ paginevincenti   │
                    │       .it/app     │
                    └──────────────────┘
                    [Static Page - SSG]
                    [Fast Cache]
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐         ┌──────────┐       ┌──────────┐
    │AppCard 1 │         │AppCard 2 │ ...   │AppCard N │
    │Core-App  │         │Workbook  │       │Quiz      │
    └──────────┘         └──────────┘       └──────────┘
          │                   │                   │
          │ Clicca "Scopri"   │                   │
          │ di più            │                   │
          ▼                   ▼                   ▼
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │/app/core-app     │  │/app/workbook │  │ /app/quiz    │
    │(Landing Page)    │  │ (Landing)    │  │ (Landing)    │
    │[SSG + Dynamic]   │  │              │  │              │
    │                  │  │              │  │              │
    │ ┌──────────────┐ │  │              │  │              │
    │ │ Chi sei      │ │  │              │  │              │
    │ │ Per chi è    │ │  │              │  │              │
    │ │ Su libri     │ │  │              │  │              │
    │ │ Features     │ │  │              │  │              │
    │ │              │ │  │              │  │              │
    │ │ [Prova Free] │ │  │              │  │              │
    │ │ [Abbonamenti]│ │  │              │  │              │
    │ └──────────────┘ │  │              │  │              │
    └──────────────────┘  └──────────────┘  └──────────────┘
          │                                         │
          │ Clicca "Prova Gratis"                  │
          │ o "Vai all'app"                        │
          │                                         │
          ▼                                         ▼
    ┌──────────────────────────────────────────────────────┐
    │        /apps/core-app-v1 (APP VERA)                 │
    │        [Dynamic - Client Side Rendered]             │
    │        [Requires Auth + Credits]                    │
    │                                                      │
    │        ┌─────────────────────────────────────────┐  │
    │        │ ExitToLandingButton (top right)         │  │
    │        │ ← Torna a /app/core-app                 │  │
    │        └─────────────────────────────────────────┘  │
    │                                                      │
    │        ┌─────────────────────────────────────────┐  │
    │        │ AppShell                                │  │
    │        │  ├─ Header (progress)                  │  │
    │        │  ├─ Main Content                       │  │
    │        │  │  ├─ ContextFrame                    │  │
    │        │  │  ├─ StepCard 1,2,3...              │  │
    │        │  │  ├─ Verdict                        │  │
    │        │  │  └─ TensionMap                     │  │
    │        │  └─ Footer                            │  │
    │        └─────────────────────────────────────────┘  │
    │                                                      │
    │        DATI:                                        │
    │        ├─ Session (Supabase)                       │
    │        ├─ Crediti (Supabase)                       │
    │        ├─ Config (ui-schema.ts)                    │
    │        └─ Verdetto (n8n webhook)                   │
    │                                                      │
    └──────────────────────────────────────────────────────┘
          │
          │ Clicca "← Torna"
          │
          ▼
    ┌──────────────────┐
    │ /app/core-app    │ [Torna alla landing]
    │ (Landing again)  │
    └──────────────────┘
```

---

## 📁 Folder Structure (Map)

```
paginevincenti/
│
├─ app/
│  │
│  ├─ page.tsx                      ← / (Homepage)
│  │
│  ├─ app/
│  │  ├─ page.tsx                   ← /app (Lista app - SSG)
│  │  │  Legge: apps/index.ts
│  │  │  Renderizza: AppCard (singola)
│  │  │  Output: Card list
│  │  │
│  │  └─ [slug]/
│  │     ├─ page.tsx                ← /app/[slug] (Landing - SSG+Dynamic)
│  │     │  Legge: apps/[app]/landing.ts
│  │     │  Renderizza: AppLanding
│  │     │  Output: Landing page
│  │     │
│  │     └─ layout.tsx
│  │
│  ├─ apps/
│  │  └─ [app-id]/
│  │     ├─ page.tsx                ← /apps/[app-id] (App vera - CSR)
│  │     │  Legge: apps/[app]/page.tsx
│  │     │  Legge: apps/[app]/config.ts
│  │     │  Legge: apps/[app]/ui-schema.ts
│  │     │  Auth richiesta
│  │     │  Crediti richiesti
│  │     │
│  │     └─ layout.tsx
│  │
│  └─ layout.tsx
│
├─ components/
│  ├─ app/
│  │  ├─ AppCard.tsx               ← Usato in /app
│  │  │  Props: app { id, slug, name, icon, ... }
│  │  │  Renderizza card singola
│  │  │
│  │  ├─ AppLanding.tsx            ← Usato in /app/[slug]
│  │  │  Props: app { landing { ... } }
│  │  │  Renderizza: headline + sections + pricing + CTA
│  │  │
│  │  └─ ExitToLandingButton.tsx    ← Usato in /apps/[app-id]
│  │     Props: appSlug
│  │     Renderizza: Bottone "← Indietro"
│  │     Link verso: /app/[slug]
│  │
│  ├─ atomic/
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ Scale.tsx
│  │  ├─ Textarea.tsx
│  │  └─ Checkbox.tsx
│  │
│  ├─ blocks/
│  │  ├─ ContextFrame.tsx
│  │  ├─ StepCard.tsx
│  │  ├─ Verdict.tsx
│  │  ├─ TensionMap.tsx
│  │  └─ Accordion.tsx
│  │
│  └─ layout/
│     ├─ AppShell.tsx
│     └─ Navbar.tsx
│
├─ apps/
│  ├─ index.ts                      ← Registry centrale
│  │  ├─ getAllApps()
│  │  ├─ getAppBySlug(slug)
│  │  ├─ getAppById(id)
│  │  └─ getAllAppSlugs()
│  │
│  ├─ core-app-v1/
│  │  ├─ page.tsx                   ← Motore universale
│  │  ├─ ui-schema.ts               ← Configurazione (domande + verdetti)
│  │  ├─ config.ts                  ← Metadati app
│  │  ├─ rag-manifest.ts            ← RAG governance
│  │  └─ landing.ts                 ← Dati per landing (/app/[slug])
│  │
│  ├─ workbook-v1/
│  │  ├─ page.tsx
│  │  ├─ ui-schema.ts
│  │  ├─ config.ts
│  │  ├─ rag-manifest.ts
│  │  └─ landing.ts
│  │
│  └─ quiz-v1/
│     ├─ page.tsx
│     ├─ ui-schema.ts
│     ├─ config.ts
│     ├─ rag-manifest.ts
│     └─ landing.ts
│
├─ lib/
│  ├─ types.ts
│  ├─ apps.ts                       ← Helper per app registry
│  └─ api/
│     ├─ supabaseClient.ts
│     └─ n8nClient.ts
│
├─ hooks/
│  ├─ useAppSession.ts
│  ├─ useCredits.ts
│  ├─ useAppConfig.ts
│  └─ useSubmitStep.ts
│
└─ [config files]
   ├─ package.json
   ├─ tsconfig.json
   ├─ next.config.js
   └─ tailwind.config.js
```

---

## 🔄 Data Dependencies

```
paginevincenti.it/app
    ├─ Reads: apps/index.ts
    │   └─ Array of AppMetadata { id, slug, name, icon, landing, ... }
    │
    └─ Renders: components/app/AppCard.tsx (per ogni app)
        └─ Link href="/app/{slug}"


paginevincenti.it/app/[slug]
    ├─ Reads: apps/index.ts
    │   └─ Finds: AppMetadata for {slug}
    │       └─ Uses: app.landing (LandingData)
    │           ├─ headline
    │           ├─ subheadline
    │           ├─ sections { whoIsFor, basedOnBooks, whatYouGet }
    │           ├─ pricing { freeTrialCount, creditCost, plans[] }
    │           └─ cta { primary, secondary }
    │
    └─ Renders: components/app/AppLanding.tsx
        └─ Shows: Landing page + Pricing + CTAs
            ├─ Link "Prova Gratis" → /apps/{app-id}
            └─ Button "Abbonati" → Stripe/Checkout


paginevincenti.it/apps/[app-id]
    ├─ Auth Check: useAppSession()
    ├─ Credits Check: useCredits()
    │
    ├─ Reads: apps/[app-id]/page.tsx (Component)
    ├─ Reads: apps/[app-id]/ui-schema.ts (Config)
    ├─ Reads: apps/[app-id]/config.ts (Metadata)
    │
    ├─ External APIs:
    │   ├─ Supabase (session storage, credits)
    │   └─ n8n webhook (verdict generation)
    │
    └─ Renders: 
        ├─ AppShell
        ├─ ContextFrame
        ├─ StepCard (dynamic from ui-schema.ts)
        ├─ Verdict + TensionMap
        └─ ExitToLandingButton appSlug="core-app"
            └─ Link to /app/{slug}
```

---

## 🌐 URL Pattern Summary

```
TYPE      ROUTE                  RENDERING  CACHE      AUTH    DESCRIPTION
────────────────────────────────────────────────────────────────────────────
Static    /app                   SSG        ✅ Eternal ✗      Lista app
Dynamic   /app/{slug}            SSG        ✅ 1h      ✗      Landing
App       /apps/{app-id}         CSR        ✗ None     ✅      App vera
```

---

## 🔗 Navigation Map

```
Homepage /
    │
    └─→ /app (SSG)
         │
         ├─→ /app/core-app (SSG)
         │    │
         │    └─→ /apps/core-app-v1 (CSR + Auth)
         │         └─→ ← /app/core-app
         │
         ├─→ /app/workbook (SSG)
         │    │
         │    └─→ /apps/workbook-v1 (CSR + Auth)
         │         └─→ ← /app/workbook
         │
         └─→ /app/quiz (SSG)
              │
              └─→ /apps/quiz-v1 (CSR + Auth)
                   └─→ ← /app/quiz
```

---

## 🚀 Vercel Deployment

**Build time (SSG generation)**:
```
✅ /app [1 page]
✅ /app/core-app [1 page]
✅ /app/workbook [1 page]
✅ /app/quiz [1 page]
```

**Runtime (CSR)**:
```
❌ /apps/core-app-v1 [Generated on request, auth required]
❌ /apps/workbook-v1 [Generated on request, auth required]
❌ /apps/quiz-v1 [Generated on request, auth required]
```

**Performance**:
- /app: **Instant** (cached, static)
- /app/[slug]: **Instant** (cached, static)
- /apps/[id]: **Fast** (CSR, no server rendering overhead)

---

## ✨ Key Points

1. **Separation of Concerns**:
   - `/app` = Static marketing
   - `/app/[slug]` = Dynamic landing
   - `/apps/[id]` = Interactive app

2. **Performance**:
   - SSG for discovery (fast)
   - CSR for app (interactive)

3. **SEO**:
   - /app = Indexable, keywords
   - /app/[slug] = Indexable, product page
   - /apps/[id] = Non-indexable (app, not content)

4. **Auth Strategy**:
   - /app & /app/[slug] = Public (no auth needed)
   - /apps/[id] = Protected (auth + credits required)

5. **Data Management**:
   - `apps/index.ts` = Single source of truth for app metadata
   - `apps/[id]/landing.ts` = Landing-specific data
   - `apps/[id]/ui-schema.ts` = App-specific config
   - `apps/[id]/config.ts` = App-specific metadata

---

Chiaro così? 👈
