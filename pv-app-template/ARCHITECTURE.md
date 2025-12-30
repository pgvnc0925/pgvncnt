# Architettura — Pagine Vincenti App Engine

## 🏗 Filosofia Progettuale

### Principio 1: Config-Driven, Not Code-Driven

**Vecchio (sbagliato)**
```
Nuova app = Copia page.tsx + Modifica codice + Deploy
Tempo: 3-5 giorni
```

**Nuovo (corretto)**
```
Nuova app = Scrivi ui-schema.ts + Nuovo workflow n8n
Tempo: 1-2 ore
```

**Implementazione**: `page.tsx` è un motore universale. **Non cambia mai.**

---

### Principio 2: Separation of Concerns (Netto)

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                 │
├─────────────────────────────────────────────────────┤
│ Responsabilità:                                     │
│ ✓ Raccogliere input                                │
│ ✓ Validare strutturalmente                         │
│ ✓ Presentare UI                                    │
│ ✓ Costruire DOSSIER                                │
│ ✓ Passare a backend                                │
│                                                     │
│ NON responsabile di:                               │
│ ✗ Generare verdetti                                │
│ ✗ Analisi profonda                                 │
│ ✗ Sintesi strategica                               │
│ ✗ Generazione testo                                │
└─────────────────────────────────────────────────────┘
                        ↓ API / Webhook
┌─────────────────────────────────────────────────────┐
│                  BACKEND (n8n)                      │
├─────────────────────────────────────────────────────┤
│ Responsabilità:                                     │
│ ✓ Interpretare contesto                            │
│ ✓ Logica diagnostica                               │
│ ✓ Generare verdetti                                │
│ ✓ Costruire tension map                            │
│ ✓ Produrre narrativa strategica                    │
│                                                     │
│ Input riceve:                                       │
│ - DOSSIER (dati strutturati dal frontend)          │
│ - RAG layers (conoscenza PV)                        │
│ - Agenti specializzati (context, positioning, etc) │
└─────────────────────────────────────────────────────┘
```

**Vantaggio**: Cambio agenti n8n senza toccare frontend.

---

### Principio 3: Componenti Stratificati

```
LIVELLO 3: Page.tsx (motore universale)
↓ usa
LIVELLO 2: Blocks semantici (ContextFrame, Verdict, TensionMap)
↓ usa
LIVELLO 1: Componenti atomici (Input, Select, Scale)
```

**Non saltare livelli.** Sempre attraverso la gerarchia.

---

## 📦 Struttura Tecnica Dettagliata

### 1. App Routing (Next.js)

```
/apps/[app-id]/
├── page.tsx         ← Il motore universale (non cambia mai)
├── layout.tsx       ← Wrapper (vuoto, opzionale)
├── config.ts        ← Metadati app
├── ui-schema.ts     ← Domande, flusso, verdetti (CAMBIA QUI)
└── rag-manifest.ts  ← Governance conoscenza
```

**page.tsx è sacro.** Una volta scritto correttamente, rimane identico per tutte le app.

### 2. Componenti Atomici

```
/components/atomic/
├── Input.tsx        ← <input type="text" />
├── Select.tsx       ← <select />
├── Scale.tsx        ← <input type="range" />
├── Textarea.tsx     ← <textarea />
└── Checkbox.tsx     ← <input type="checkbox" />
```

Caratteristiche:
- Zero logica di business
- Props: `id`, `label`, `value`, `onChange`, `error`
- Tailwind CSS
- Inline validation errors

### 3. Blocks Semantici PV

```
/components/blocks/
├── ContextFrame     ← "Cosa faremo, cosa non faremo"
├── StepCard         ← "Step X di Y" + progress
├── Verdict          ← "La tua verità diagnostica"
├── TensionMap       ← "2×2: Percezione vs Realtà"
└── Accordion        ← Layer opzionali collassati
```

Caratteristiche:
- Incorporano UX Canon PV
- Props semantiche (non generiche)
- Styled in Tailwind
- Accessibili e reattive

### 4. Hooks Astratti

```
/hooks/
├── useAppSession()    ← Sessione + salva dati
├── useCredits()       ← Gestisce crediti utente
├── useAppConfig()     ← Carica config app
└── useSubmitStep()    ← Valida + sottomette
```

**Regola d'oro**: I componenti non sanno come funzionano i backend. Chiedono ai hook.

```typescript
// ✅ Corretto
const { session, submitStep } = useAppSession();
await submitStep(stepId, response); // Hook sa come salvare

// ❌ Sbagliato
const response = await supabaseClient.from('...'); // No! Componente tocca backend
```

### 5. API Clients

```
/lib/api/
├── supabaseClient.ts  ← CRUD sessioni, crediti
└── n8nClient.ts       ← POST a webhook n8n
```

**Questi sono usati SOLO dai hook.** I componenti non li vedono.

### 6. Tipi Universali

```
/lib/types.ts
├── InputType, StepType                    ← Config
├── UISchema, VerdictRule, TensionAxis     ← Config
├── AppConfig, AppSession, RAGManifest     ← Metadati
├── StructuredDossier                      ← Payload frontend → backend
└── N8nProcessingResult                    ← Payload backend → frontend
```

**Questi garantiscono coerenza.** TypeScript catch errori **at build time**.

---

## 🔄 Data Flow Completo

### Scenario: User riempie form e chiede verdetto

```
┌────────────────────────────────────────────────────────────┐
│ 1. User vede ContextFrame                                  │
│    (Hook renderizza via config)                            │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 2. User vede StepCard + Input fields                       │
│    (page.tsx loop attraverso ui-schema.ts.fields)          │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 3. User clicca "Continua"                                  │
│    (onClick → handleStepSubmit)                            │
│                                                             │
│    const success = await submit(response, fields, ...)     │
│    // useSubmitStep valida rispetto fields                 │
│    // Se valido → chiama callback                          │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 4. Salva nel database                                      │
│    await submitStep(stepId, response)                      │
│    // useAppSession → supabaseClient.updateSession()       │
│    // Sessione aggiornata in Supabase                      │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Naviga al prossimo step                                 │
│    const nextStepId = step.nextStepId                      │
│    setCurrentStepId(nextStepId)                            │
│    // page.tsx re-render con nuovo step                    │
└────────────────────────────────────────────────────────────┘
                           ↓
           [User riempie altri step...]
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 6. Step finale: handleGenerateVerdict()                    │
│                                                             │
│    // Controlla crediti                                    │
│    if (!canAfford(cost)) return                            │
│                                                             │
│    // Consuma crediti                                      │
│    await useCredit(cost)                                   │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 7. Costruisci DOSSIER STRUTTURATO                          │
│                                                             │
│    const dossier: StructuredDossier = {                    │
│      context: { industry, market, teamSize, ... },         │
│      goals: { declared, implicit, conflicts },             │
│      constraints: { budget, team, timeframe },             │
│      biasSignals: [...],                                   │
│      languagePatterns: [...],                              │
│      diagnosticFlags: {...},                               │
│      allResponses: responses                               │
│    }                                                        │
│                                                             │
│    // Questo è ORO per gli agenti n8n                      │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 8. POST a n8n                                              │
│                                                             │
│    const result = await n8nClient.processAssessment({      │
│      app_id: appId,                                        │
│      session_id: session.sessionId,                        │
│      dossier                                               │
│    })                                                       │
│                                                             │
│    // n8n riceve, elabora, ritorna:                        │
│    // {                                                     │
│    //   verdict: { title, description, severity },         │
│    //   tensionMap: { axes, summary, implications }        │
│    // }                                                     │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 9. Renderizza Verdict block                                │
│                                                             │
│    <Verdict                                                │
│      title={verdictData.verdict.title}                     │
│      description={verdictData.verdict.description}         │
│      severity={verdictData.verdict.severity}               │
│    />                                                       │
│                                                             │
│    ✓ Una verità singola, leggibile in 5 secondi            │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│ 10. Renderizza TensionMap block                            │
│                                                             │
│    <TensionMap                                             │
│      axes={verdictData.tensionMap.axes}                    │
│      summary={verdictData.tensionMap.summary}              │
│      implications={verdictData.tensionMap.implications}    │
│    />                                                       │
│                                                             │
│    ✓ Matrice 2×2 che spiega le tensioni                    │
│    ✓ User capisce il gap percezione vs realtà              │
└────────────────────────────────────────────────────────────┘
```

---

## 🛡 Flussi di Errore

### Error 1: Validazione fallisce

```typescript
// In useSubmitStep.submit()
const errors = validateResponse(response, fields);
if (errors.length > 0) {
  setValidationErrors(errors);
  return false;  ← Submit cancellato
}
```

→ Messaggio d'errore inline sotto il campo
→ User corregge
→ Retry

### Error 2: Crediti insufficienti

```typescript
if (!canAfford(cost)) {
  alert('Crediti insufficienti');
  return;  ← Verdetto non generato
}
```

→ User vede messaggio
→ Non spende sessione
→ Opzione: acquista crediti

### Error 3: n8n non risponde

```typescript
const result = await n8nClient.processAssessment(...);
if (!result.success) {
  alert('Errore nel processing. Riprova.');
  return;
}
```

→ Dossier è salvato comunque
→ Retry possibile dopo
→ Log per debugging

---

## 🔐 Security Considerations

### 1. Client-Side Validation

```typescript
// ✓ Valida forma
const errors = validateResponse(response, fields);
```

**Non** blocca il vero controllo. È UX.

### 2. Server-Side Validation (n8n)

```javascript
// In n8n, valida di nuovo il dossier
if (!dossier.context.industry) {
  return { success: false, error: 'Invalid dossier' };
}
```

**Sempre.**

### 3. JWT/Auth

```typescript
// useAppSession chiede userId
const { session, submitStep } = useAppSession(appId, userId);
```

→ Todo: Integrare con auth provider (NextAuth, Supabase Auth, etc)

### 4. CSRF Protection

```typescript
// n8n webhook dovrebbe avere token secret
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/abc123?token=xyz
```

→ Non implementato nel template, ma aggiungi.

---

## 📈 Scalabilità

### Aggiungi una nuova app

**Tempo**: 30 minuti

```
1. mkdir apps/new-app-v1
2. cp config.ts, rag-manifest.ts, layout.tsx, page.tsx
3. Scrivi ui-schema.ts (nuove domande)
4. Scrivi workflow n8n
5. Test
6. Deploy
```

**Zero cambiamenti al core**.

### Scala il backend

```
1. Aggiungi agente n8n (per USP generation)
2. Aggiungi agente n8n (per narrative building)
3. Aggiungi agente n8n (per recommendations)
4. Frontend rimane uguale
5. Cambia solo config del flusso n8n
```

**Zero cambiamenti al frontend**.

---

## 🧪 Testing

### Unit Test (componenti)

```typescript
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/atomic/Input';

test('Input renders with label', () => {
  render(<Input id="test" label="Name" value="" onChange={() => {}} />);
  expect(screen.getByText('Name')).toBeInTheDocument();
});
```

### Integration Test (page + hooks)

```typescript
test('Form submission works', async () => {
  render(<CoreAppPage />);
  
  // Fill step 1
  await userEvent.type(screen.getByLabelText('Industry'), 'retail');
  await userEvent.click(screen.getByText('Continua'));
  
  // Expect step 2
  expect(screen.getByText('Step 2')).toBeInTheDocument();
});
```

### E2E Test (full flow)

```typescript
test('Full assessment works', async () => {
  // Fill all steps
  // Submit to n8n mock
  // Expect verdict rendered
});
```

---

## 📚 Estensibilità

### Custom Block?

```typescript
// Crea /components/blocks/CustomBlock.tsx
// Usa nel page.tsx se step.type === 'custom-block'

if (step.type === 'custom-block') {
  return <CustomBlock {...step.data} />;
}
```

### Custom Hook?

```typescript
// Crea /hooks/useMyFeature.ts
// Usa nel page.tsx come qualsiasi altro hook
```

### Custom Input Type?

```typescript
// Aggiungi a InputType
export type InputType = '...' | 'my-custom-input';

// Renderizza nel page.tsx
if (field.type === 'my-custom-input') {
  return <MyCustomInput {...field} />;
}
```

---

## 🎓 Principi di Design

1. **Single Responsibility**: Ogni file ha un ruolo unico
2. **DRY**: Niente codice duplicato. Se scritto 2 volte, estrai
3. **Config Over Code**: Cambi dal config, non dal codice
4. **Types First**: TypeScript previene bug prima del runtime
5. **Progressive Enhancement**: Base HTML, poi JS, poi UI flourishes
6. **Accessibility**: WCAG baseline (non ignorare)
7. **Performance**: Lazy load, memoize, no unnecessary re-renders

---

## 🚀 Roadmap

- [ ] Autenticazione real (Supabase Auth o NextAuth)
- [ ] Supabase queries real
- [ ] n8n workflows production
- [ ] Workbook app (same infra)
- [ ] Quiz engine
- [ ] Analytics tracking
- [ ] Error boundaries + Sentry
- [ ] i18n (italiano + inglese)
- [ ] A/B testing verdetti
- [ ] Dark mode

---

Questo è il vero cuore del progetto. Leggi bene. 🚀
