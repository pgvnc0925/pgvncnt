# Architettura Completa: paginevincenti.it

## 🗺 Routing Hierarchy

```
paginevincenti.it
│
├── /                           [Homepage]
│
├── /app                        [Pagina lista app - Static/SSG]
│   └── Mostra tutte le app
│       Con card + "Scopri di più" button
│
├── /app/[slug]                 [Landing app specifica - SSG + Dynamic]
│   └── /app/core-app
│       /app/workbook
│       /app/quiz
│       ecc
│       ├── Presentazione app
│       ├── Per chi è
│       ├── Su quali libri
│       ├── CTA: "Prova gratis" + "Abbonati"
│       └── Torna a /app button
│
└── /apps/[app-id]              [App vera e propria - Dynamic/CSR]
    └── /apps/core-app-v1
        /apps/workbook-v1
        ecc
        ├── ContextFrame
        ├── StepCard + Input
        ├── Verdict + TensionMap
        └── ExitToLandingButton → /app/core-app
```

---

## 📁 File Structure

```
paginevincenti/
│
├── app/
│   ├── page.tsx                    ← / (Homepage)
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── app/
│   │   ├── page.tsx                ← /app (Lista app - SSG)
│   │   │
│   │   └── [slug]/
│   │       ├── page.tsx            ← /app/[slug] (Landing - SSG)
│   │       ├── layout.tsx
│   │       └── opengraph-image.tsx ← OG image dinamica
│   │
│   ├── apps/
│   │   └── [app-id]/
│   │       ├── page.tsx            ← /apps/[app-id] (App vera - CSR)
│   │       ├── layout.tsx
│   │       └── loading.tsx
│   │
│   └── api/                        ← Optional: API routes
│       └── apps/
│           └── route.ts            ← GET /api/apps (lista app metadata)
│
├── components/
│   ├── app/
│   │   ├── AppCard.tsx             ← Card singola app per /app
│   │   ├── AppLanding.tsx          ← Landing wrapper per /app/[slug]
│   │   ├── ExitToLandingButton.tsx ← Bottone exit dall'app
│   │   └── PricingSection.tsx      ← Sezione pricing/CTA
│   │
│   ├── atomic/                     ← (Come prima)
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Scale.tsx
│   │   └── ...
│   │
│   ├── blocks/                     ← (Come prima)
│   │   ├── ContextFrame.tsx
│   │   ├── Verdict.tsx
│   │   ├── TensionMap.tsx
│   │   └── ...
│   │
│   └── layout/
│       ├── AppShell.tsx
│       └── Navbar.tsx
│
├── apps/                           ← Configurazione app
│   ├── index.ts                    ← Registry + metadata
│   ├── core-app-v1/
│   │   ├── page.tsx                ← Motore universale
│   │   ├── ui-schema.ts
│   │   ├── config.ts
│   │   ├── rag-manifest.ts
│   │   └── landing.ts              ← Dati per /app/[slug]
│   │
│   ├── workbook-v1/
│   │   ├── page.tsx
│   │   ├── ui-schema.ts
│   │   ├── config.ts
│   │   └── landing.ts
│   │
│   └── quiz-v1/
│       ├── page.tsx
│       ├── ui-schema.ts
│       ├── config.ts
│       └── landing.ts
│
├── lib/
│   ├── types.ts
│   ├── api/
│   │   ├── supabaseClient.ts
│   │   └── n8nClient.ts
│   └── apps.ts                     ← Helper per app registry
│
├── hooks/                          ← (Come prima)
│   ├── useAppSession.ts
│   ├── useCredits.ts
│   └── ...
│
├── styles/
│   └── globals.css
│
└── [Config files]
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 🔄 Data Flow

### 1. GET /app (SSG - Build time)

```typescript
// app/app/page.tsx

import { getAllApps } from '@/lib/apps';

export const revalidate = 3600; // Revalidate ogni ora

export default function AppsPage() {
  const apps = getAllApps(); // Legge da apps/index.ts
  
  return (
    <div>
      <h1>Le nostre App</h1>
      {apps.map(app => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
```

### 2. GET /app/[slug] (SSG - Build time con Dynamic paths)

```typescript
// app/app/[slug]/page.tsx

import { getAppBySlug, getAllAppSlugs } from '@/lib/apps';
import { AppLanding } from '@/components/app/AppLanding';

// Genera staticamente i percorsi
export async function generateStaticParams() {
  return getAllAppSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const app = getAppBySlug(params.slug);
  return {
    title: app.landing.metaTitle,
    description: app.landing.metaDescription,
  };
}

export default function AppLandingPage({ params }) {
  const app = getAppBySlug(params.slug);
  
  if (!app) {
    return <NotFound />;
  }

  return <AppLanding app={app} />;
}
```

### 3. GET /apps/[app-id] (CSR - Runtime con Auth)

```typescript
// app/apps/[app-id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useAppSession, useCredits } from '@/hooks';
import { getAppById } from '@/lib/apps';

export default function AppPage() {
  const params = useParams();
  const appId = params['app-id'] as string;
  
  // Auth + sessione
  const { session } = useAppSession(appId, userId);
  const { credits } = useCredits(userId);
  
  if (!session) return <LoadingSpinner />;

  const app = getAppById(appId);
  const AppComponent = app.component;

  return (
    <div>
      <AppComponent sessionId={session.id} />
      {/* Bottone exit in alto a sinistra */}
      <ExitToLandingButton appSlug={app.slug} />
    </div>
  );
}
```

---

## 📝 File Specifici da Creare

### 1. apps/index.ts (Registry Centrale)

```typescript
// apps/index.ts

import coreAppConfig from './core-app-v1/config';
import coreAppLanding from './core-app-v1/landing';
import CoreAppPage from './core-app-v1/page';

import workbookConfig from './workbook-v1/config';
import workbookLanding from './workbook-v1/landing';
import WorkbookPage from './workbook-v1/page';

export interface AppMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  config: any;
  landing: LandingData;
  component: React.ComponentType;
}

export interface LandingData {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  
  sections: {
    whoIsFor: {
      title: string;
      items: string[];
    };
    basedOnBooks: {
      title: string;
      books: { title: string; author: string }[];
    };
    whatYouGet: {
      title: string;
      features: string[];
    };
  };
  
  pricing: {
    freeTrialCount: number;
    creditCost: number;
    subscriptionPlans: Array<{
      name: string;
      price: number;
      credits: number;
      period: string;
    }>;
  };
  
  cta: {
    primary: string;
    secondary: string;
  };
}

const apps: AppMetadata[] = [
  {
    id: 'core-app-v1',
    slug: 'core-app',
    name: 'Core-App: Diagnosi Strategica',
    description: 'Assessment completo dei tuoi 4 sistemi',
    icon: '📊',
    config: coreAppConfig,
    landing: coreAppLanding,
    component: CoreAppPage,
  },
  
  {
    id: 'workbook-v1',
    slug: 'workbook',
    name: 'Workbook: Allenamento Cognitivo',
    description: 'Esercizi guidati per applicare i concetti',
    icon: '📚',
    config: workbookConfig,
    landing: workbookLanding,
    component: WorkbookPage,
  },
];

export function getAllApps(): AppMetadata[] {
  return apps;
}

export function getAllAppSlugs(): string[] {
  return apps.map(app => app.slug);
}

export function getAppBySlug(slug: string): AppMetadata | undefined {
  return apps.find(app => app.slug === slug);
}

export function getAppById(id: string): AppMetadata | undefined {
  return apps.find(app => app.id === id);
}

export default apps;
```

### 2. apps/core-app-v1/landing.ts

```typescript
// apps/core-app-v1/landing.ts

import type { LandingData } from '@/apps/index';

const landing: LandingData = {
  metaTitle: 'Core-App: Diagnosi Strategica Completa | Pagine Vincenti',
  metaDescription: 'Valuta i tuoi 4 sistemi di business in 15 minuti. Verdetto personalizzato + Mappa delle tensioni.',
  
  headline: 'Conosci il Vero Problema del Tuo Business',
  subheadline: 'Non è traffico. Non è conversione. Scopri dove perdi energia davvero.',
  
  sections: {
    whoIsFor: {
      title: 'Per chi è',
      items: [
        'PMI italiane senza reparto marketing',
        'Freelancer e professionisti',
        'Imprenditori stanchi di tentativi',
        'Chi vuole decisioni consapevoli',
      ],
    },
    
    basedOnBooks: {
      title: 'Basato su',
      books: [
        { title: 'The 22 Immutable Laws of Marketing', author: 'Ries & Trout' },
        { title: 'How Brands Grow', author: 'Byron Sharp' },
        { title: 'The E-Myth Revisited', author: 'Michael Gerber' },
      ],
    },
    
    whatYouGet: {
      title: 'Cosa ottieni',
      features: [
        'Diagnosi in 15 minuti',
        'Una verità centrale (il tuo vero problema)',
        'Mappa delle tensioni (percezione vs realtà)',
        'Dossier dettagliato',
        'Consigli sui prossimi step',
      ],
    },
  },
  
  pricing: {
    freeTrialCount: 1,
    creditCost: 5,
    subscriptionPlans: [
      {
        name: 'Starter',
        price: 29,
        credits: 20,
        period: 'mese',
      },
      {
        name: 'Professional',
        price: 79,
        credits: 100,
        period: 'mese',
      },
    ],
  },
  
  cta: {
    primary: 'Prova Gratis',
    secondary: 'Abbonati Ora',
  },
};

export default landing;
```

### 3. components/app/AppCard.tsx (per /app)

```typescript
// components/app/AppCard.tsx

import Link from 'next/link';
import type { AppMetadata } from '@/apps/index';

export function AppCard({ app }: { app: AppMetadata }) {
  return (
    <div className="pv-card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl mb-2">{app.icon}</div>
            <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-600">{app.description}</p>

        {/* Su quali libri */}
        <div className="text-xs text-slate-500">
          <strong>Basato su:</strong> {app.landing.sections.basedOnBooks.books.map(b => b.title).join(', ')}
        </div>

        <Link
          href={`/app/${app.slug}`}
          className="pv-button-base bg-pv-primary text-white px-4 py-2 w-full text-center block mt-4"
        >
          Scopri di più →
        </Link>
      </div>
    </div>
  );
}
```

### 4. components/app/AppLanding.tsx (per /app/[slug])

```typescript
// components/app/AppLanding.tsx

'use client';

import Link from 'next/link';
import { useCredits } from '@/hooks/useCredits';
import type { AppMetadata } from '@/apps/index';

export function AppLanding({ app }: { app: AppMetadata }) {
  const { credits } = useCredits('user-123'); // TODO: get real userId from auth
  const canTryFree = (credits?.availableTrials ?? 0) > 0;

  return (
    <div className="min-h-screen bg-pv-light">
      {/* Header con back button */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/app" className="text-pv-primary hover:underline text-sm">
            ← Torna alle app
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero */}
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            {app.landing.headline}
          </h1>
          <p className="text-xl text-slate-600">
            {app.landing.subheadline}
          </p>
        </section>

        {/* Per chi è */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {app.landing.sections.whoIsFor.title}
          </h2>
          <ul className="space-y-2">
            {app.landing.sections.whoIsFor.items.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700">
                <span className="text-pv-primary font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Su quali libri */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {app.landing.sections.basedOnBooks.title}
          </h2>
          <div className="space-y-2">
            {app.landing.sections.basedOnBooks.books.map((book, idx) => (
              <div key={idx} className="pv-card">
                <strong>{book.title}</strong> — {book.author}
              </div>
            ))}
          </div>
        </section>

        {/* Cosa ottieni */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {app.landing.sections.whatYouGet.title}
          </h2>
          <ul className="space-y-2">
            {app.landing.sections.whatYouGet.features.map((feature, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700">
                <span className="text-pv-primary">→</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Section */}
        <section className="bg-white rounded-lg p-8 border border-slate-200 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Inizia Adesso</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Trial */}
            {canTryFree && (
              <Link
                href={`/apps/${app.id}`}
                className="pv-button-base bg-pv-primary text-white px-6 py-3"
              >
                {app.landing.cta.primary} (1 volta)
              </Link>
            )}

            {/* Subscription */}
            <button
              onClick={() => {
                // TODO: Apri modal pricing / redirect a checkout
              }}
              className="pv-button-base border border-pv-primary text-pv-primary px-6 py-3"
            >
              {app.landing.cta.secondary}
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {app.landing.pricing.subscriptionPlans.map((plan, idx) => (
              <div key={idx} className="pv-card border-2 border-pv-primary">
                <h3 className="font-bold text-slate-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-pv-primary mt-2">
                  €{plan.price}/{plan.period}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {plan.credits} crediti
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

### 5. components/app/ExitToLandingButton.tsx (nell'app)

```typescript
// components/app/ExitToLandingButton.tsx

'use client';

import Link from 'next/link';

interface ExitToLandingButtonProps {
  appSlug: string;
}

export function ExitToLandingButton({ appSlug }: ExitToLandingButtonProps) {
  return (
    <Link
      href={`/app/${appSlug}`}
      className="fixed top-4 right-4 pv-button-base bg-white border border-slate-300 text-slate-900 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      title="Torna alla presentazione dell'app"
    >
      ← Indietro
    </Link>
  );
}
```

### 6. apps/core-app-v1/page.tsx (Aggiornato)

```typescript
// apps/core-app-v1/page.tsx

'use client';

import { ExitToLandingButton } from '@/components/app/ExitToLandingButton';
// ... resto del codice come prima

export default function CoreAppPage() {
  // ... logica

  return (
    <>
      <ExitToLandingButton appSlug="core-app" />
      {/* Rest of app */}
    </>
  );
}
```

---

## 🔗 URLs Finali

```
Homepage
paginevincenti.it/

Lista app
paginevincenti.it/app

Landing Core-App
paginevincenti.it/app/core-app

Landing Workbook
paginevincenti.it/app/workbook

App Core-App (vera)
paginevincenti.it/apps/core-app-v1

App Workbook (vera)
paginevincenti.it/apps/workbook-v1
```

---

## 🚀 Build & Deploy

```bash
# Vercel auto-genera i percorsi statici
# Build time:
# - /app (SSG)
# - /app/core-app (SSG)
# - /app/workbook (SSG)
# Runtime:
# - /apps/core-app-v1 (CSR con auth)
# - /apps/workbook-v1 (CSR con auth)
```

---

## 📊 Request Flow

```
1. Utente visita paginevincenti.it/app
   ↓ [Static, cached, fast]
   Vede lista app con card

2. Clicca "Scopri di più"
   ↓ [Static, cached, fast]
   paginevincenti.it/app/core-app
   Vede landing con features, pricing, CTA

3. Clicca "Prova Gratis" o "Abbonati"
   ↓ [Dynamic, auth required]
   paginevincenti.it/apps/core-app-v1
   Entra nell'app vera e propria

4. Dentro l'app, clicca "← Indietro"
   ↓ [Naviga back]
   paginevincenti.it/app/core-app
   Torna alla landing
```

---

## ✅ Checklist Implementazione

- [ ] Crea `apps/index.ts` (registry centrale)
- [ ] Aggiungi `landing.ts` per ogni app
- [ ] Crea `app/app/page.tsx` (lista)
- [ ] Crea `app/app/[slug]/page.tsx` (landing dinamica)
- [ ] Crea `app/apps/[app-id]/page.tsx` (app vera)
- [ ] Crea `components/app/AppCard.tsx`
- [ ] Crea `components/app/AppLanding.tsx`
- [ ] Aggiungi `ExitToLandingButton.tsx` in ogni app
- [ ] Test: /app → /app/core-app → /apps/core-app-v1 → /app/core-app
- [ ] Deploy a Vercel
- [ ] Verifica SSG + CSR separation

---

Chiaro? Vuoi che generi i file specifici? 👈
