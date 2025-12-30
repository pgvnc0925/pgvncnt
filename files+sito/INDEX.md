# 📑 INDEX — Pagine Vincenti App Engine Template

**Ultima update**: 2025-12-29  
**Versione template**: 1.0.0  
**Stato**: Production-Ready ✅

---

## 🗂 Navigazione Rapida

### Per Iniziare (5-15 minuti)

1. **Leggi [DELIVERY.md](./DELIVERY.md)** — Cosa hai ricevuto
2. **Leggi [QUICKSTART.md](./QUICKSTART.md)** — Fai partire in 5 minuti
3. **Prova [/apps/core-app-v1](./apps/core-app-v1)** — App di esempio

### Per Capire (30-60 minuti)

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Deep dive su design
2. **[README.md](./README.md)** — Overview tecnico completo
3. **[MANIFEST.md](./MANIFEST.md)** — Cosa è incluso/escluso

### Per Customizzare (1-2 ore)

1. **Studia [page.tsx](./apps/core-app-v1/page.tsx)** — Motore rendering
2. **Studia [ui-schema.ts](./apps/core-app-v1/ui-schema.ts)** — Config example
3. **Crea una nuova app** (vedi QUICKSTART.md)

---

## 📁 Struttura Folder Commentata

### `/app` — Next.js Root

```
app/
├── layout.tsx       ← Root layout provider
├── page.tsx         ← Home page (placeholder)
└── globals.css      ← Global styles + Tailwind directives
```

**Uso**: Root boilerplate di Next.js. Non modificare salvo necessario.

### `/apps/[app-id]` — App Container

```
apps/
└── core-app-v1/     ← App di esempio (pronta a testare)
    ├── page.tsx     ← 🔥 Motore universale (config-driven)
    ├── layout.tsx   ← Wrapper (solitamente vuoto)
    ├── config.ts    ← Metadati app (nome, crediti, limiti)
    ├── ui-schema.ts ← 🔥 Configurazione (domande, verdetti)
    └── rag-manifest.ts ← Governance della conoscenza
```

**Uso**: Questo è dove crei le app. Una folder per app.

**Come creare una nuova app**:
```bash
mkdir apps/my-app-v1
cp apps/core-app-v1/{config.ts,rag-manifest.ts,layout.tsx,page.tsx} apps/my-app-v1/
# Modifica only:
# - config.ts (name, credits, etc)
# - ui-schema.ts (domande nuove)
# - page.tsx > import da tuo ui-schema
```

### `/components/atomic` — UI Base

```
components/atomic/
├── Input.tsx         ← <input type="text" />
├── Select.tsx        ← <select />
├── Scale.tsx         ← <input type="range" /> (slider)
├── Textarea.tsx      ← <textarea />
├── Checkbox.tsx      ← <input type="checkbox" /> (group)
└── index.ts          ← Esportazioni
```

**Uso**: Non conosco nulla di business. Sono pure UI.  
**Proprietà**:
- `id`, `label`, `value`, `onChange`, `error`, `help`
- Tailwind styled
- Accessibili (ARIA labels)

**Quando creare un component nuovo**: Raramente. La maggior parte del contenuto usa questi 5.

### `/components/blocks` — Semantica PV

```
components/blocks/
├── ContextFrame.tsx  ← "Cosa faremo, cosa non faremo"
├── StepCard.tsx      ← "Step X di Y" con progress bar
├── Verdict.tsx       ← "La tua verità diagnostica" (colori per severità)
├── TensionMap.tsx    ← "Matrice 2×2 percezione-realtà"
├── Accordion.tsx     ← Layer opzionali collassati
└── index.ts          ← Esportazioni
```

**Uso**: Incorporano UX Canon PV. Sempre usare questi, non creare custom.  
**Proprietà semantiche**: Non "bg", "title", "open". Invece "verdict", "severity", "axes".

**Quando creare un block nuovo**: Se UX Canon evolve (raro).

### `/components/layout` — Struttura Globale

```
components/layout/
├── AppShell.tsx      ← Header + progress + main + footer
└── index.ts          ← Esportazioni
```

**Uso**: Wrapper per tutte le pagine app.  
**Props**: `appName`, `currentStep`, `totalSteps`, `children`

### `/hooks` — Astrazione Backend

```
hooks/
├── useAppSession.ts   ← Sessione + salva dati (Supabase)
├── useCredits.ts      ← Crediti utente
├── useAppConfig.ts    ← Carica config app dinamicamente
├── useSubmitStep.ts   ← Validazione + submit
└── index.ts           ← Esportazioni
```

**Uso**: I componenti DEVONO usare questi hook. Non parlare mai direttamente con API.  
**Esempio**:
```typescript
const { session, submitStep } = useAppSession(appId, userId);
// Componente non sa che sotto c'è Supabase
```

### `/lib/api` — API Clients

```
lib/api/
├── supabaseClient.ts  ← Client Supabase (CRUD)
└── n8nClient.ts       ← Client n8n (webhook POST)
```

**Uso**: Usati SOLO dai hook. Componenti non li vedono.  
**Funzioni pubbliche**: `createSession`, `updateSession`, `completeSession`, `processAssessment`, ecc.

### `/lib/types.ts` — Contratto Universale

```
lib/types.ts
├── InputType, StepType
├── UISchema, VerdictRule, TensionAxis
├── AppConfig, AppSession, RAGManifest
├── StructuredDossier (payload frontend → n8n)
└── N8nProcessingResult (payload n8n → frontend)
```

**Uso**: Tutti i file TypeScript importano da qui.  
**Garanzia**: Se compila TypeScript, la data flow è coerente.

### `/lib/` — Utilities

```
lib/
├── types.ts           ← Tipi
├── api/               ← Client (vedi sopra)
└── [future]           ← Helpers, validators, ecc
```

### Config Files

```
package.json           ← Dipendenze npm
tsconfig.json          ← TypeScript config (strict mode)
next.config.js         ← Next.js config
tailwind.config.js     ← Tailwind config + colori PV
postcss.config.js      ← PostCSS (per Tailwind)
.env.example           ← Template variabili d'ambiente
.gitignore             ← Git config
```

### Documentazione

```
README.md              ← Overview completo + setup
QUICKSTART.md          ← 15 minuti per lanciare
ARCHITECTURE.md        ← Deep dive progettuale
MANIFEST.md            ← Cosa è incluso
DELIVERY.md            ← Riepilogo di cosa hai ricevuto
INDEX.md               ← Questo file
```

---

## 🎯 Quale File Modificare?

### Vuoi personalizzare le **domande**?
→ `apps/[app-id]/ui-schema.ts` (campo `steps`)

### Vuoi aggiungere/cambiare **verdetti**?
→ `apps/[app-id]/ui-schema.ts` (campo `verdictRules`)

### Vuoi creare una **nuova app**?
→ Crea `apps/new-app/` e copia i 5 file

### Vuoi customizzare **CSS/colori**?
→ `tailwind.config.js` oppure `app/globals.css`

### Vuoi aggiungere un **nuovo input type**?
→ Aggiungi a `/components/atomic/` + update `lib/types.ts`

### Vuoi aggiungere un **nuovo block PV**?
→ Aggiungi a `/components/blocks/` + importa in `page.tsx`

### Vuoi connettere un **backend diverso**?
→ Modifica `/lib/api/*Client.ts`

### Vuoi cambiare **validazione**?
→ `hooks/useSubmitStep.ts`

---

## 📊 File Essenziali vs Opzionali

### ✅ Essenziali (non toccare se non sai cosa fai)

- `app/layout.tsx`
- `apps/[app-id]/page.tsx` (motore)
- `components/atomic/*` (UI pura)
- `components/blocks/*` (semantica PV)
- `lib/types.ts` (contratto)
- `lib/api/*` (backend)
- `hooks/*` (astrazione)

### 🟡 Opzionali (customizza liberamente)

- `apps/[app-id]/ui-schema.ts` (domande, verdetti)
- `apps/[app-id]/config.ts` (metadati)
- `apps/[app-id]/rag-manifest.ts` (RAG)
- `tailwind.config.js` (colori, spacing)
- `app/globals.css` (global styles)
- `.env.example` (variabili)

### ❌ Non modificare

- `package.json` (solo se aggiungi dipendenze)
- `tsconfig.json` (strict mode è obbligatorio)
- `next.config.js` (salvo deploy specifici)

---

## 🔍 Come Navigare il Codice

### Traccia un user action

```
1. User clicca "Continua" in page.tsx
   ↓
2. onClick → handleStepSubmit()
   ↓
3. Chiama submit() da useSubmitStep hook
   ↓
4. Hook valida rispetto fields
   ↓
5. Se valido, chiama callback: submitStep(stepId, response)
   ↓
6. submitStep() da useAppSession hook
   ↓
7. chiama supabaseClient.updateSession()
   ↓
8. API Supabase salva
   ↓
9. Return al component
   ↓
10. setCurrentStepId(nextStepId)
   ↓
11. page.tsx re-render con nuovo step
```

**Regola**: Segui i flussi di dati. Non saltare livelli.

---

## 📚 Reading Order

### Se hai 30 minuti
1. DELIVERY.md (5 min)
2. QUICKSTART.md (10 min)
3. Fai il setup (15 min)

### Se hai 2 ore
1. DELIVERY.md
2. README.md
3. QUICKSTART.md
4. Fai il setup
5. ARCHITECTURE.md

### Se hai un giorno
1. Tutto sopra
2. MANIFEST.md
3. Leggi page.tsx linea per linea
4. Leggi ui-schema.ts
5. Crea una nuova app
6. Testala

### Se hai una settimana
1. Setup production
2. Supabase DB schema
3. n8n workflows
4. Auth integration
5. Deploy staging
6. Iterate basato su feedback

---

## 🚀 Checklist Operativa

### Prima di toccare il codice

- [ ] Leggi DELIVERY.md
- [ ] Leggi QUICKSTART.md
- [ ] Esegui npm install
- [ ] Esegui npm run dev
- [ ] Apri http://localhost:3000/apps/core-app-v1
- [ ] Compila il form, vedi il verdetto
- [ ] Leggi il codice di page.tsx

### Prima di creare una nuova app

- [ ] Capisco ui-schema.ts
- [ ] Capisco config.ts
- [ ] Capisco rag-manifest.ts
- [ ] Ho scritto il workflow n8n
- [ ] Ho testato il webhook in Postman

### Prima di production

- [ ] Supabase setup
- [ ] DB schema created
- [ ] Auth working
- [ ] n8n workflow tested
- [ ] CORS configured
- [ ] Error handling comprehensive
- [ ] Tested end-to-end
- [ ] Sentry/monitoring setup
- [ ] Deploy to staging
- [ ] UAT passed
- [ ] Ready for production

---

## 🆘 Troubleshooting Quick Links

| Problema | Soluzione | File |
|----------|-----------|------|
| Non capisco la struttura | Leggi ARCHITECTURE.md | ARCHITECTURE.md |
| Vuoi lanciare veloce | Leggi QUICKSTART.md | QUICKSTART.md |
| Errore TypeScript | Controlla lib/types.ts | lib/types.ts |
| Componente non appare | Controlla page.tsx import | apps/core-app-v1/page.tsx |
| Verdetto non genera | Controlla n8n webhook | lib/api/n8nClient.ts |
| CSS sbagliato | Controlla tailwind.config.js | tailwind.config.js |
| Sessione non salva | Controlla Supabase config | lib/api/supabaseClient.ts |

---

## 📞 Support

1. **Leggi la documentazione** (90% risposte sono lì)
2. **Controlla il codice** (è commentato)
3. **GitHub Issues** (per bug reports)
4. **Discord/Slack** (per domande)

---

## ✅ Summary

Hai un template **completo, production-ready, config-driven**.

**Non è boilerplate.** È infrastruttura.

Leggi bene.  
Usa bene.  
Scala velocemente.

Buona fortuna. 🚀
