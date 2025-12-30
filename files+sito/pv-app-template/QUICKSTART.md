# Quick Start — Pagine Vincenti App Engine

## 📦 Prima cosa: setup

```bash
# 1. Clona/scarica il template
cd pagine-vincenti-app-engine

# 2. Installa dipendenze
npm install

# 3. Configura .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678
EOF

# 4. Avvia dev server
npm run dev
```

Apri: **http://localhost:3000/apps/core-app-v1**

---

## 🎯 Capire il flusso in 2 minuti

### User Flow

```
1. Vedi ContextFrame
   ↓
2. Rispondi a Step 1 (3 domande)
   ↓
3. Rispondi a Step 2 (3 domande)
   ↓
4. ... Step N
   ↓
5. Clicca "Genera Verdetto"
   ↓
6. Frontend crea DOSSIER
   ↓
7. Passa a n8n via webhook
   ↓
8. n8n elabora e torna Verdict + TensionMap
   ↓
9. Vedi Verdict (una verità) + TensionMap (2x2)
   ↓
10. Pulsante "Vedi strategia completa"
```

### Code Flow

```
page.tsx (motore universale)
  ↓
Legge config/ui-schema.ts
  ↓
Renderizza dinamicamente basato su schema
  ↓
User riempie form
  ↓
Valida con useSubmitStep hook
  ↓
Salva sessione con useAppSession hook
  ↓
Step finale: genera DOSSIER
  ↓
Manda via n8nClient.processAssessment()
  ↓
Riceve back { verdict, tensionMap }
  ↓
Renderizza Verdict + TensionMap blocks
  ↓
Done
```

---

## 🔧 Personalizzare Core-App in 10 minuti

Vuoi cambiare le domande? Facile.

**File**: `apps/core-app-v1/ui-schema.ts`

### Cambiare una domanda

Prima:
```typescript
{
  id: 'industry',
  type: 'select',
  label: 'In quale settore operi?',
  options: [
    { label: 'E-commerce', value: 'ecommerce' },
    { label: 'Servizi', value: 'services' },
    // ...
  ]
}
```

Dopo:
```typescript
{
  id: 'industry',
  type: 'select',
  label: 'A quale settore/mercato serve il tuo prodotto?',
  options: [
    { label: 'Manifattura', value: 'manufacturing' },
    { label: 'Fintech', value: 'fintech' },
    // ...
  ]
}
```

**Ricarica il browser. Done.**

### Aggiungere un verdetto nuovo

```typescript
{
  id: 'verdict-custom',
  condition: (responses) => {
    return responses.industry === 'saas' && responses.teamSize < 5;
  },
  verdict:
    'Sei un SaaS micro con team tiny. Priorità: founder-driven acquisition.',
  tensionAxes: [
    {
      name: 'Scalabilità',
      leftLabel: 'Non scalable (dipendo da me)',
      rightLabel: 'Fully scalable',
      userPosition: 20,
      marketPosition: 80,
      insight: 'Il tuo business è bound a te. Serve autonomia operativa.',
    },
  ],
  explanation: 'Finché sei tu il collo di bottiglia, non cresci.',
}
```

**Ricarica. Il nuovo verdetto è live.**

---

## 🚀 Creare una nuova app in 15 minuti

### Step 1: Crea folder

```bash
mkdir -p apps/quick-audit-v1
```

### Step 2: Copia template files

```bash
cp apps/core-app-v1/{config.ts,rag-manifest.ts,layout.tsx,page.tsx} apps/quick-audit-v1/
```

### Step 3: Crea ui-schema.ts

```typescript
// apps/quick-audit-v1/ui-schema.ts
import { UISchema } from '@/lib/types';

export const quickAuditUISchema: UISchema = {
  appId: 'quick-audit-v1',
  version: '1.0.0',
  startStepId: 'step-1',
  steps: [
    {
      id: 'step-1',
      type: 'input',
      title: 'Quick Audit — 5 minuti',
      description: 'Rapida valutazione dei tuoi 4 sistemi',
      fields: [
        {
          id: 'business_model',
          type: 'select',
          label: 'Qual è il tuo modello di business?',
          options: [
            { label: 'Prodotto (one-shot)', value: 'product' },
            { label: 'Servizio (project)', value: 'service' },
            { label: 'Subscription', value: 'subscription' },
          ],
          required: true,
        },
        {
          id: 'main_blocker',
          type: 'textarea',
          label: 'Qual è il tuo blocco principale?',
          required: true,
        },
      ],
      nextStepId: 'step-verdict',
    },
  ],
  verdictRules: [
    {
      id: 'verdict-1',
      condition: (r) => (r.business_model as string) === 'product',
      verdict: 'Sei un product builder. Focus: product-market fit.',
      tensionAxes: [
        {
          name: 'PMF clarity',
          leftLabel: 'Vago',
          rightLabel: 'Cristallino',
          userPosition: 40,
          marketPosition: 70,
          insight: 'Devi capire esattamente chi ha il problema che risolvi.',
        },
      ],
      explanation: 'Per te, il verdetto è uno.',
    },
  ],
};

export default quickAuditUISchema;
```

### Step 4: Update page.tsx

```typescript
// In page.tsx, cambia:
import quickAuditUISchema from './ui-schema';
// ... rest é uguale
```

### Step 5: Test

```bash
# Apri http://localhost:3000/apps/quick-audit-v1
```

**Done. Nuova app live in 15 minuti.**

---

## 🔌 Connettere n8n

### Passo 1: Crea workflow in n8n

Url: `http://localhost:5678` (local)

1. Aggiungi nodo **Webhook**
   - URL: `/webhook/pv-assessment`
   - Method: POST
   
2. Aggiungi nodo **Code** (il tuo agente)
   ```javascript
   // Ricevi dossier dal frontend
   const dossier = $input.first().json.dossier;
   
   // Logica diagnostica
   let verdict = "Base verdict";
   if (dossier.context.industry === "ecommerce") {
     verdict = "Sei ecommerce. Focus: conversion rate optimization.";
   }
   
   // Torna al frontend
   return {
     success: true,
     verdict: {
       title: "Il tuo problema",
       description: verdict,
       severity: "medium"
     },
     tensionMap: {
       axes: [
         {
           name: "Asse 1",
           userPosition: 40,
           marketPosition: 70,
           insight: "Gap tra quello che pensi e la realtà."
         }
       ],
       summary: "Sintesi",
       implications: ["Implicazione 1", "Implicazione 2"]
     }
   };
   ```

3. Testa con cURL
   ```bash
   curl -X POST http://localhost:5678/webhook/pv-assessment \
     -H "Content-Type: application/json" \
     -d '{
       "app_id": "core-app-v1",
       "session_id": "test-123",
       "dossier": { ... }
     }'
   ```

### Passo 2: Connetti nel .env

```
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678
```

### Passo 3: Test end-to-end

Apri l'app, riempi form, clicca "Genera Verdetto".

Dovresti vedere il verdetto che viene da n8n.

---

## 📊 Debug

### Il verdetto non appare

```
1. Apri browser DevTools → Network
2. Cerca POST a /webhook/pv-assessment
3. Controlla response (dovrebbe avere verdict + tensionMap)
4. Se 404 → n8n non è raggiungibile
5. Se timeout → agente n8n è lento
```

### Domande non appaiono

```
1. Verifica ui-schema.ts è importato in page.tsx
2. Controlla che step.id sia corretto
3. Controlla che fields non sia undefined
```

### Stile wrong

```
1. Controlla tailwind.config.js ha il content giusto
2. Riavvia dev server
3. Pulisci cache browser (Ctrl+Shift+R)
```

---

## 📈 Prossimi step

1. **Connetti Supabase** (salva sessioni real)
2. **Scrivi workflow n8n** (agente di strategia)
3. **Lancia Core-App in beta**
4. **Raccogli feedback** (cosa confonde?)
5. **Itera on verdetti** (quale comunica meglio?)
6. **Crea Workbook app** (stessa infra)
7. **Quiz, Audit, Coach** (scala)

---

## 🎓 Capire meglio

- **UX Canon**: leggi `components/blocks/*` — sono i principi PV incorporati
- **Hooks**: leggi `hooks/*` — sono l'astrazione dal backend
- **Types**: leggi `lib/types.ts` — è il contratto universale

Tutto in quel template ha un **perché architetturale**. Non è boilerplate.

---

Buona fortuna. 🚀

Se hai domande, controlla il README principale.
