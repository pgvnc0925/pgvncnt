# ✅ Guida Step-by-Step: Implementazione Completa

## Prerequisiti

- ✅ Next.js 15 + App Router (già hai nel template)
- ✅ Vercel account
- ✅ Supabase project
- ✅ n8n instance

---

## 🎯 FASE 1: Preparazione (30 minuti)

### Step 1: Crea la cartella apps/index.ts

```bash
# Nella root del tuo progetto
touch apps/index.ts
```

**Contenuto**:

```typescript
// apps/index.ts

export interface LandingData {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  sections: {
    whoIsFor: { title: string; items: string[] };
    basedOnBooks: { title: string; books: Array<{ title: string; author: string }> };
    whatYouGet: { title: string; features: string[] };
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
  cta: { primary: string; secondary: string };
}

export interface AppMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  landing: LandingData;
}

// Importa tutte le app
import coreAppLanding from './core-app-v1/landing';
import workbookLanding from './workbook-v1/landing';

const apps: AppMetadata[] = [
  {
    id: 'core-app-v1',
    slug: 'core-app',
    name: 'Core-App: Diagnosi Strategica',
    description: 'Assessment completo dei tuoi 4 sistemi',
    icon: '📊',
    landing: coreAppLanding,
  },
  {
    id: 'workbook-v1',
    slug: 'workbook',
    name: 'Workbook: Allenamento Cognitivo',
    description: 'Esercizi guidati per applicare i concetti',
    icon: '📚',
    landing: workbookLanding,
  },
];

export function getAllApps() {
  return apps;
}

export function getAppBySlug(slug: string) {
  return apps.find(app => app.slug === slug);
}

export function getAppById(id: string) {
  return apps.find(app => app.id === id);
}

export function getAllAppSlugs() {
  return apps.map(app => app.slug);
}

export default apps;
```

### Step 2: Crea apps/[app]/landing.ts per ogni app

```bash
# Per Core-App
touch apps/core-app-v1/landing.ts

# Contenuto:
```

```typescript
// apps/core-app-v1/landing.ts

import type { LandingData } from '@/apps/index';

const landing: LandingData = {
  metaTitle: 'Core-App: Diagnosi Strategica | Pagine Vincenti',
  metaDescription: 'Valuta i tuoi 4 sistemi in 15 minuti. Verdetto personalizzato.',
  headline: 'Conosci il Vero Problema del Tuo Business',
  subheadline: 'Scopri dove perdi energia davvero.',
  sections: {
    whoIsFor: {
      title: 'Per chi è',
      items: [
        'PMI italiane senza reparto marketing',
        'Freelancer e professionisti',
        'Imprenditori stanchi di tentativi',
      ],
    },
    basedOnBooks: {
      title: 'Basato su',
      books: [
        { title: 'The 22 Immutable Laws of Marketing', author: 'Ries & Trout' },
        { title: 'How Brands Grow', author: 'Byron Sharp' },
      ],
    },
    whatYouGet: {
      title: 'Cosa ottieni',
      features: [
        'Diagnosi in 15 minuti',
        'Una verità centrale',
        'Mappa delle tensioni',
      ],
    },
  },
  pricing: {
    freeTrialCount: 1,
    creditCost: 5,
    subscriptionPlans: [
      { name: 'Starter', price: 29, credits: 20, period: 'mese' },
      { name: 'Pro', price: 79, credits: 100, period: 'mese' },
    ],
  },
  cta: { primary: 'Prova Gratis', secondary: 'Abbonati Ora' },
};

export default landing;
```

---

## 🎯 FASE 2: Pagina /app (Lista App) - 20 minuti

### Step 3: Crea app/app/page.tsx

```bash
touch app/app/page.tsx
```

**Contenuto**:

```typescript
// app/app/page.tsx

import { getAllApps } from '@/apps';
import { AppCard } from '@/components/app/AppCard';

export const metadata = {
  title: 'Le nostre App | Pagine Vincenti',
  description: 'Strumenti interattivi per decisioni strategiche',
};

export default function AppsPage() {
  const apps = getAllApps();

  return (
    <div className="min-h-screen bg-pv-light">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Le nostre App</h1>
          <p className="mt-2 text-lg text-slate-600">
            Strumenti interattivi per decisioni strategiche
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Crea components/app/AppCard.tsx

```bash
mkdir -p components/app
touch components/app/AppCard.tsx
```

**Contenuto**:

```typescript
// components/app/AppCard.tsx

import Link from 'next/link';
import type { AppMetadata } from '@/apps';

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

---

## 🎯 FASE 3: Landing Page /app/[slug] - 30 minuti

### Step 5: Crea app/app/[slug]/page.tsx

```bash
mkdir -p app/app/[slug]
touch app/app/[slug]/page.tsx
touch app/app/[slug]/layout.tsx
```

**Contenuto page.tsx**:

```typescript
// app/app/[slug]/page.tsx

import { getAppBySlug, getAllAppSlugs } from '@/apps';
import { AppLanding } from '@/components/app/AppLanding';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate ogni ora

export async function generateStaticParams() {
  const slugs = getAllAppSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const app = getAppBySlug(params.slug);
  if (!app) return {};
  
  return {
    title: app.landing.metaTitle,
    description: app.landing.metaDescription,
    openGraph: {
      title: app.landing.metaTitle,
      description: app.landing.metaDescription,
    },
  };
}

export default function AppLandingPage({ params }) {
  const app = getAppBySlug(params.slug);
  
  if (!app) {
    notFound();
  }

  return <AppLanding app={app} />;
}
```

**Contenuto layout.tsx**:

```typescript
// app/app/[slug]/layout.tsx

export default function AppLandingLayout({ children }) {
  return <>{children}</>;
}
```

### Step 6: Crea components/app/AppLanding.tsx

```bash
touch components/app/AppLanding.tsx
```

**Contenuto**:

```typescript
// components/app/AppLanding.tsx

'use client';

import Link from 'next/link';
import type { AppMetadata } from '@/apps';

export function AppLanding({ app }: { app: AppMetadata }) {
  return (
    <div className="min-h-screen bg-pv-light">
      {/* Header */}
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
                <span className="text-pv-primary">✓</span>
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
            <Link
              href={`/apps/${app.id}`}
              className="pv-button-base bg-pv-primary text-white px-6 py-3"
            >
              {app.landing.cta.primary}
            </Link>

            <button
              onClick={() => {
                // TODO: Modal pricing
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

---

## 🎯 FASE 4: Exit Button nell'App - 10 minuti

### Step 7: Crea components/app/ExitToLandingButton.tsx

```bash
touch components/app/ExitToLandingButton.tsx
```

**Contenuto**:

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
      className="fixed top-4 right-4 pv-button-base bg-white border border-slate-300 text-slate-900 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow z-50"
      title="Torna alla presentazione dell'app"
    >
      ← Indietro
    </Link>
  );
}
```

### Step 8: Aggiungi ExitToLandingButton alla Core-App

```typescript
// apps/core-app-v1/page.tsx

'use client';

import { ExitToLandingButton } from '@/components/app/ExitToLandingButton';
// ... resto del codice

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

## 🎯 FASE 5: Route per l'App /apps/[app-id] - 15 minuti

### Step 9: Crea app/apps/[app-id]/page.tsx

```bash
mkdir -p app/apps/[app-id]
touch app/apps/[app-id]/page.tsx
touch app/apps/[app-id]/layout.tsx
```

**Contenuto page.tsx**:

```typescript
// app/apps/[app-id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { getAppById } from '@/apps';

// App components (importa le tue app)
import CoreAppPage from '@/apps/core-app-v1/page';
import WorkbookPage from '@/apps/workbook-v1/page';

const appComponents: Record<string, React.ComponentType> = {
  'core-app-v1': CoreAppPage,
  'workbook-v1': WorkbookPage,
};

export default function AppPage() {
  const params = useParams();
  const appId = params['app-id'] as string;

  const AppComponent = appComponents[appId];

  if (!AppComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">App non trovata</h1>
          <a href="/app" className="mt-4 inline-block text-pv-primary">
            ← Torna alle app
          </a>
        </div>
      </div>
    );
  }

  return <AppComponent />;
}
```

**Contenuto layout.tsx**:

```typescript
// app/apps/[app-id]/layout.tsx

export default function AppLayout({ children }) {
  return <>{children}</>;
}
```

---

## 🎯 FASE 6: Test Locale - 20 minuti

### Step 10: Test dei percorsi

```bash
# 1. Avvia dev server
npm run dev

# 2. Testa i percorsi
# http://localhost:3000/app
# → Vedi lista app con card

# 3. Clicca "Scopri di più"
# http://localhost:3000/app/core-app
# → Vedi landing page

# 4. Clicca "Prova Gratis"
# http://localhost:3000/apps/core-app-v1
# → Vedi app vera

# 5. Clicca "← Indietro"
# http://localhost:3000/app/core-app
# → Torna alla landing
```

---

## 🚀 FASE 7: Deploy su Vercel - 10 minuti

### Step 11: Deploy

```bash
# 1. Git push
git add .
git commit -m "Add app listing, landing, and routing"
git push

# 2. Vercel auto-deploy
# Vercel legge next.config.js
# Genera staticamente:
# - /app
# - /app/core-app
# - /app/workbook
# ecc

# 3. Verifica su vercel.com/dashboard
# Vedi i percorsi generati
```

---

## ✅ Checklist Completamento

- [ ] Crea apps/index.ts con registry
- [ ] Crea apps/[app]/landing.ts per ogni app
- [ ] Crea app/app/page.tsx (lista)
- [ ] Crea components/app/AppCard.tsx
- [ ] Crea app/app/[slug]/page.tsx (landing)
- [ ] Crea components/app/AppLanding.tsx
- [ ] Crea components/app/ExitToLandingButton.tsx
- [ ] Aggiungi ExitToLandingButton in apps/[app]/page.tsx
- [ ] Crea app/apps/[app-id]/page.tsx (router)
- [ ] Test locale: /app → /app/core-app → /apps/core-app-v1
- [ ] Test back button: /apps/core-app-v1 → /app/core-app
- [ ] Push su Vercel
- [ ] Verifica SSG generation
- [ ] Production ready ✅

---

## 🔗 URLs Finali

```
Lista app:
https://paginevincenti.it/app

Landing Core-App:
https://paginevincenti.it/app/core-app

App Core-App:
https://paginevincenti.it/apps/core-app-v1

(Back button torna a landing)
```

---

Segui i passaggi in ordine. Dovrebbe funzionare al primo colpo. 🚀
