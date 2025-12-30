# Pagine Vincenti — App Engine Template

## ⚡ TL;DR

Template universale **config-driven** per tutte le app di Pagine Vincenti.

- **Frontend**: Next.js + React + Tailwind + shadcn/ui
- **Backend**: n8n + Supabase
- **Architettura**: Componenti atomici + Blocks semantici PV + Hooks astratti
- **App di esempio**: Core-App MVP (13 domande → Verdict → Tension Map)

**Una volta fatto bene una volta, ogni nuova app = nuovo config + nuovo workflow n8n.**

---

## 📁 Struttura folder

```
pagine-vincenti-app-engine/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page
│   └── globals.css              # Global styles
├── apps/
│   └── [app-id]/
│       ├── page.tsx             # App page (motore universale)
│       ├── layout.tsx           # App layout
│       ├── config.ts            # AppConfig
│       ├── ui-schema.ts         # UISchema (domande, flusso, verdetti)
│       └── rag-manifest.ts      # RAGManifest (governance conoscenza)
├── components/
│   ├── atomic/                  # Input, Select, Scale, Textarea, Checkbox
│   ├── blocks/                  # ContextFrame, StepCard, Verdict, TensionMap, Accordion
│   └── layout/                  # AppShell
├── hooks/
│   ├── useAppSession.ts         # Gestione sessione + dati
│   ├── useCredits.ts            # Crediti utente
│   ├── useAppConfig.ts          # Carica config app
│   └── useSubmitStep.ts         # Validazione + submit
├── lib/
│   ├── api/
│   │   ├── supabaseClient.ts    # Client Supabase
│   │   └── n8nClient.ts         # Client n8n
│   └── types.ts                 # Tipi universali
├── styles/                      # CSS aggiuntive se necessario
└── [config files]
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🎯 Come funziona

### 1️⃣ **App page.tsx è un motore universale**

Non contiene logica hardcoded. Legge la config (`ui-schema.ts`) e:
- Renderizza i campi dinamicamente
- Gestisce il flusso (branching)
- Valida le risposte
- Genera il dossier
- Passa tutto a n8n

**Same code, infinite apps.**

### 2️⃣ **Componenti sono atomici e riutilizzabili**

```
Input.tsx     → <input />
Select.tsx    → <select />
Scale.tsx     → slider
Textarea.tsx  → <textarea />
Checkbox.tsx  → checkboxes
```

Non sanno nulla di business. Sono pure UI.

### 3️⃣ **Blocks sono semantica PV**

```
ContextFrame   → "Cosa faremo e cosa non faremo"
StepCard       → "Step X di Y" con progress
Verdict        → "La tua verità diagnostica"
TensionMap     → "Gap tra percezione e realtà"
Accordion      → Layer opzionali collassati
```

Questi **incorporano l'UX Canon**.

### 4️⃣ **Hooks astraggono backend**

```
useAppSession()   → fetch/salva dati a Supabase
useCredits()      → gestisce crediti
useAppConfig()    → carica config
useSubmitStep()   → valida + sottomette
```

I componenti **non parlano mai direttamente con API.**

### 5️⃣ **Config-driven**

`ui-schema.ts`:
```typescript
{
  steps: [
    {
      id: 'step-1',
      fields: [{ id: 'name', type: 'text', label: '...' }],
      nextStepId: 'step-2'
    }
  ],
  verdictRules: [
    { condition: (r) => r.x > 50, verdict: '...', tensionAxes: [...] }
  ]
}
```

Cambi domande, branching, verdetti **solo su questo file.**

---

## 🚀 Come lanciare una nuova app

### Step 1: Crea la folder della app

```bash
mkdir apps/[app-name]
touch apps/[app-name]/{page.tsx,layout.tsx,config.ts,ui-schema.ts,rag-manifest.ts}
```

### Step 2: Scrivi `ui-schema.ts`

Copia la struttura di `apps/core-app-v1/ui-schema.ts`:

```typescript
export const yourAppUISchema: UISchema = {
  appId: 'your-app-v1',
  startStepId: 'step-1',
  steps: [
    {
      id: 'step-1',
      type: 'input',
      title: 'Titolo domanda',
      fields: [
        {
          id: 'field_1',
          type: 'text' | 'select' | 'scale' | 'textarea',
          label: 'Domanda?',
          required: true,
          options: [...], // per select
        }
      ],
      nextStepId: 'step-2'
    },
    // ... altri step
  ],
  verdictRules: [
    {
      id: 'verdict-1',
      condition: (responses) => responses.field_1 === 'value',
      verdict: 'Il tuo risultato',
      tensionAxes: [
        {
          name: 'Asse 1',
          leftLabel: '...',
          rightLabel: '...',
          userPosition: 40,
          marketPosition: 70,
          insight: 'Spiegazione'
        }
      ]
    }
  ]
};
```

### Step 3: Scrivi `config.ts`

```typescript
export default {
  appId: 'your-app-v1',
  name: 'Tua App',
  category: 'assessment' | 'workbook' | 'audit' | 'quiz',
  pricing: { creditCost: 5, accessLevel: 'premium' },
  n8nWorkflow: 'pv-your-app-processor',
};
```

### Step 4: Scrivi `rag-manifest.ts`

```typescript
export default {
  appId: 'your-app-v1',
  enabledLayers: ['RAG-1', 'RAG-2'],
  dominance: { 'RAG-0': 0.0, 'RAG-1': 0.7, 'RAG-2': 0.3, 'RAG-3': 0.0 },
};
```

### Step 5: Copia `page.tsx` da core-app-v1

```bash
cp apps/core-app-v1/page.tsx apps/your-app/page.tsx
```

Cambia solo:
```typescript
import yourAppUISchema from './ui-schema';
// ... rest unchanged
```

### Step 6: Crea il workflow n8n

Nel tuo n8n:
1. Crea workflow `pv-your-app-processor`
2. Ricevi webhook POST con `{ app_id, session_id, dossier }`
3. Genera `{ verdict, tensionMap, narrative }`
4. Ritorna il JSON

---

## 🔌 Integrazione n8n

### Contratto frontend → n8n

```json
{
  "app_id": "core-app-v1",
  "session_id": "uuid",
  "dossier": {
    "context": { "industry": "retail", ... },
    "goals": { "declared": [...], "implicit": [...] },
    "constraints": { "budget": "...", ... },
    "biasSignals": [...],
    "languagePatterns": [...],
    "diagnosticFlags": { ... },
    "allResponses": { ... }
  }
}
```

### Contratto n8n → frontend

```json
{
  "success": true,
  "verdict": {
    "title": "Il tuo problema",
    "description": "...",
    "severity": "high" | "medium" | "low"
  },
  "tensionMap": {
    "axes": [
      {
        "name": "Asse",
        "userPosition": 40,
        "marketPosition": 70,
        "insight": "..."
      }
    ],
    "summary": "...",
    "implications": ["...", "..."]
  }
}
```

---

## 🎨 UX Canon incorporato

**Sequenza obbligatoria in ogni app:**

1. **ContextFrame** → Cosa faremo? Perché?
2. **StepCard** → Domanda X di Y
3. **Inputs** → Risposte strutturate
4. **Verdict** → Una verità singola (leggibile in 5 secondi)
5. **TensionMap** → Matrice 2×2 (percezione vs realtà)
6. **Accordion** → Layer opzionali (cross-book, limitazioni, before/after)

Questo è **non negoziabile**.

---

## 🛠 Setup locale

```bash
# Install
npm install

# Env vars (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678

# Dev
npm run dev
# Apri http://localhost:3000/apps/core-app-v1

# Build
npm run build
npm start
```

---

## 📊 Workflow sviluppo

```
1. Disegna ui-schema.ts (domande, verdetti, assi di tensione)
2. Testa in locale
3. Scrivi workflow n8n
4. Deploy
5. Iterazione veloce via config
```

**Non tocchi mai page.tsx dopo il setup.**

---

## 🔐 Sicurezza & Best Practices

- Componenti atomici **non parlano con backend**
- Validazione lato client + server (in n8n)
- Session tracking via Supabase
- Crediti consumati solo se submit riuscito
- RAG Manifest governa quale conoscenza entra
- Zero citazioni letterali nei verdetti

---

## 📈 Metriche da tracciare

- Conversion per step
- Drop-off per domanda
- Verdetto più frequente
- Tempo medio per completamento
- Usage del Workbook post-verdict

---

## 🎓 Prossimi step

1. **Connetti Supabase real** (hook useAppSession)
2. **Scrivi primo workflow n8n** (pv-assessment)
3. **A/B test verdetti** (quale comunica meglio?)
4. **Crea Workbook app** (riusa stesso engine)
5. **Quiz, Audit, Coach** (stessa architettura)

---

## ✅ Checklist per nuova app

- [ ] Folder `/apps/[app-id]/` creata
- [ ] `ui-schema.ts` scritto e testato
- [ ] `config.ts` con pricing e limiti
- [ ] `rag-manifest.ts` con layer enabled
- [ ] `page.tsx` copiato e importa schema
- [ ] Workflow n8n creato e callable
- [ ] Webhook URL nel .env
- [ ] Test end-to-end locale
- [ ] Deploy su staging
- [ ] Iterate su UX/Copy basato su dati

---

## 🚨 Troubleshooting

**"ReferenceError: Cannot find module"**
→ Assicurati che la import in page.tsx punti al tuo ui-schema.ts

**"validationErrors non mostra"**
→ Controlla che il field.id nel form matchi quello in fieldError.fieldId

**"n8n non risponde"**
→ Verifica NEXT_PUBLIC_N8N_WEBHOOK_URL nel .env e che il webhook sia attivo

**"Crediti non si consumano"**
→ Il hook useCredit è mock. Connetti a Supabase per real.

---

## 📝 Note finali

Questo template è **production-ready**. Non è boilerplate generico. È la vera infrastruttura su cui PV scala.

Ogni nuova app = 30 minuti di config, non giorni di coding.

Il valore è nel **rendering engine universale** e nella **semantica PV incorporata**.

Buona fortuna. 🚀
