# Pagine Vincenti — PRD Valutazione & Recommendation Form
## Versione: 1.0 (DEV)
Data: 2025-12-24

---

## 1. OVERVIEW

Creare una **form di valutazione interattiva** (13 domande) che:
- Valuta il livello di maturità e i problemi principali dell'utente
- Suggerisce 3–4 libri personalizzati con spiegazione narrativa
- Raccoglie email e nome (opzionale all'inizio, obbligatorio al fine)
- Trigga email di follow-up automatiche

**Success metric**: User completa form → riceve consigli → salva email → riceve prima email entro 1 minuto

---

## 2. POSITIONING & CTA IN HOME PAGE

### Placement
- **Above the fold** (sezione hero o sotto primo contenuto visibile)
- **Bottone / Link primario**: "Scopri da dove iniziare" o "Quale libro per te?"
- **Micro-copy**: "Rispondi a 13 domande rapide e ricevi i 3 libri personalizzati per la tua situazione"

### Design UX
- Bottone in contrasto
- Icona semplice (es: libro + freccia, o check + arrow)
- No popup aggressivo; link pulito verso `/form`

### Varianti CTAssay (opzionale per dopo):
- "Non sai da dove iniziare?"
- "Scopri il tuo percorso di lettura"
- "Qual è il tuo prossimo passo?"

---

## 3. FORM FLOW & FRONTEND

### URL / Route
`/valutazione` oppure `/scopri-i-tuoi-libri`

### Struttura
```
1. Schermata intro (2 righe di micro-copy, bottone "Inizia")
2. Form 13 domande (progress bar visibile)
3. Schermata risultati (narrativa + 3-4 libri consigliati)
4. Email capture (nome + email)
5. Schermata di chiusura (messaggio di grazie + CTA secondaria)
```

### Frontend Requirements

#### Schermata 1: Intro
```
Titolo: "Scopri quale libro leggere per te"
Sottotitolo: "13 domande rapide, 2 minuti di tempo. Ti diremo esattamente da dove iniziare."
Bottone: "Inizia la valutazione"

[Opzionale: Privacy note minuscolo]
"Le tue risposte rimarranno anonime e usate solo per personalizzare i consigli."
```

#### Schermata 2: Form
- **Progress bar** (numero domanda / 13)
- **Una domanda per volta** (non scroll infinito)
- **Transizione smooth** tra domande
- **Tasto "Indietro"** per correggere
- **Tasto "Continua"** (attivo solo se selezione fatta)

**Domande single choice**: Radio button o button group  
**Domanda 7 (multiple)**: Checkbox group

**Mobile**: Responsive, touch-friendly.

#### Schermata 3: Risultati (PRIMA di email capture)
```
┌────────────────────────────────────────┐
│  Ecco quello che abbiamo visto:         │
│                                        │
│  [NARRATIVA DINAMICA — 2-3 righe]      │
│                                        │
│  Quello che ti serve migliorare:       │
│  • [Dominio principale]                │
│  • [Dominio secondario, opzionale]     │
│                                        │
│  ════════════════════════════════════  │
│  I tuoi 3 libri consigliati            │
│  ════════════════════════════════════  │
│                                        │
│  📖 [Titolo Libro 1]                   │
│     Perché: [Una riga beneficio]       │
│     [ Leggi la pagina ]                │
│                                        │
│  📖 [Titolo Libro 2]                   │
│     Perché: [...]                      │
│     [ Leggi la pagina ]                │
│                                        │
│  📖 [Titolo Libro 3]                   │
│     Perché: [...]                      │
│     [ Leggi la pagina ]                │
│                                        │
│  ════════════════════════════════════  │
│  Continua scrollando ↓                 │
└────────────────────────────────────────┘
```

#### Schermata 4: Email Capture
```
┌────────────────────────────────────────┐
│  Ricevi i consigli sulla lettura via   │
│  email + feedback personalizzato       │
│                                        │
│  [ Nome completo ]                     │
│  [ Indirizzo email ]                   │
│                                        │
│  [ ✓ Continua ]                        │
│  [ Skip, non grazie ]                  │
│                                        │
│  [Privacy: "Non spam, max 1 email a    │
│   settimana"]                          │
└────────────────────────────────────────┘
```

#### Schermata 5: Grazie
```
✓ Fatto!

Abbiamo inviato i tuoi libri consigliati a [email].

Prossimo passo: Leggi il primo libro.
In 5 giorni ti manderemo un breve feedback.

[ ← Torna alla home ] [ Scopri di più su PV ]
```

### Technical Stack
- **Frontend**: React / Next.js (TS recommended)
- **State**: React Context oppure Redux (semplice)
- **Form validation**: React Hook Form
- **UI**: Tailwind CSS / custom
- **Icons**: Lucide o Feather
- **Analytics**: Evento page view, form_started, form_completed

---

## 4. LOGIC DI SCORING

### Input
```typescript
{
  "answers": {
    "d1": 2,
    "d2": 3,
    "d3": 1,
    "d4": 2,
    "d5": 3,
    "d6": 1,
    "d7": [0, 2, 3],  // Multiple choice (indici)
    "d8": 2,
    "d9": 1,
    "d10": 1,
    "d11": 2,
    "d12": 3,
    "d13": 2
  }
}
```

### Matrice di Scoring (Semplificata)

Vedi il file `PV_FORM_QUESTIONS_CORRECTED.md` per scoring dettagliato.

**Resume**:
- Ogni domanda contribuisce a **Livello** (0-4), **Domini** (4 categorie), **Interessi** (4 categorie)
- **Domini**: Acquisizione, Conversione, Esperienza, Sistemi
- **Interessi**: Strategia, Sistemi, Psicologia, Dati

### Calcolo
```typescript
interface ScoreResult {
  scoreLivello: number; // 1–52
  scoreDomini: {
    acquisizione: number;
    conversione: number;
    esperienza: number;
    sistemi: number;
  };
  scoreInteressi: {
    strategia: number;
    sistemi: number;
    psicologia: number;
    dati: number;
  };
  primaryDomain: string; // max dominio
  secondaryDomain?: string; // se tie, includi entrambi
  maturity: "Novice" | "Practitioner" | "Advanced";
  // Novice: scoreLiv 1–15
  // Practitioner: 16–35
  // Advanced: 36–52
}
```

### Algoritmo (pseudocode)
```
1. Per ogni risposta d1..d13:
   - Aggiungi scoreLiv
   - Aggiungi punti a scoreDomini[dominio]
   - Aggiungi punti a scoreInteressi[interesse]

2. Somma tutti gli score

3. Calcola:
   - maturity = bucket(scoreLiv)
   - primaryDomain = max(scoreDomini)
   - secondaryDomain = se max(scoreDomini) - 2nd max < 3, includi 2nd

4. Return ScoreResult
```

---

## 5. LOGICA DI SUGGERIMENTO LIBRI

### Input
```typescript
{
  scoreResult: ScoreResult,
  sectorContext: string // d12
}
```

### Algoritmo

#### Passo 1: Seleziona cluster narrativo
```typescript
const narrativeKey = `${maturity}_${primaryDomain}`
// es: "Novice_acquisizione"
// es: "Practitioner_conversione"
```

#### Passo 2: Seleziona narrativa e libri
```typescript
const narrative = narrativeLibrary[narrativeKey];
// Restituisce: { situation, need, intro }

const candidateBooks = booksLibrary
  .filter(b => b.clusters.includes(narrativeKey))
  .sort(b => b.priority);
```

**Regola di selezione**:
- Sempre 3 libri minimo
- Max 4 libri (solo se Advanced + multi-domain)
- Se tie tra domini, includi 1 libro per dominio secondario

#### Passo 3: Personalizza "reason" per ogni libro
```typescript
const reason = generateDynamicReason(
  book.id,
  primaryDomain,
  secondaryDomain,
  maturity,
  sector
);
```

Esempio: Se `book="ogilvy"` e `primaryDomain="acquisizione"`:
> "Questo libro insegna come attrarre il cliente giusto senza sprecare budget. Nel tuo settore (beauty), significa clienti che tornano e consigliano."

---

## 6. LIBRARY DEI LIBRI

### Struttura
```typescript
interface BookCanonical {
  id: string;
  title: string;
  author: string;
  year: number;
  slug: string;
  
  // Metadati per recommendation
  clusters: string[]; // es: ["Novice_acquisizione", "Practitioner_conversione"]
  priority: number; // 1 (massima) a 5
  domains: ("acquisizione" | "conversione" | "esperienza" | "sistemi")[];
  interests: ("strategia" | "sistemi" | "psicologia" | "dati")[];
  levels: ("Novice" | "Practitioner" | "Advanced")[];
  
  // Template reason
  reasonTemplate: {
    [cluster: string]: string;
    // es: "Novice_acquisizione": "Questo libro insegna..."
  }
}
```

### Esempio di libreria (JSON)
```json
[
  {
    "id": "ogilvy-advising",
    "title": "Ogilvy on Advertising",
    "author": "David Ogilvy",
    "year": 1983,
    "slug": "ogilvy-on-advertising",
    "clusters": [
      "Novice_acquisizione",
      "Practitioner_acquisizione"
    ],
    "priority": 1,
    "domains": ["acquisizione", "conversione"],
    "interests": ["strategia", "psicologia"],
    "levels": ["Novice", "Practitioner"],
    "reasonTemplate": {
      "Novice_acquisizione": "Insegna il sistema per attrarre clienti con messaggi chiari e coerenti, senza dipendere dal passaparola.",
      "Practitioner_acquisizione": "Approfondisce come testare e migliorare l'efficacia dei tuoi messaggi per attirare clienti specifici."
    }
  },
  {
    "id": "cialdini-influence",
    "title": "Influence: The Psychology of Persuasion",
    "author": "Robert Cialdini",
    "year": 1984,
    "slug": "influence-psychology-persuasion",
    "clusters": [
      "Novice_conversione",
      "Practitioner_conversione",
      "Practitioner_esperienza"
    ],
    "priority": 1,
    "domains": ["conversione", "esperienza"],
    "interests": ["psicologia", "strategia"],
    "levels": ["Novice", "Practitioner", "Advanced"],
    "reasonTemplate": {
      "Novice_conversione": "Svela i principi psicologici che fanno decidere una persona di comprare. Applica subito al tuo business.",
      "Practitioner_conversione": "Approfondisce come sfruttare questi principi per aumentare le conversioni senza manipolare.",
      "Practitioner_esperienza": "Mostra come costruire fiducia e credibilità per mantenere i clienti a lungo termine."
    }
  }
  // ... altri libri (Sharp, Ries & Trout, Dunford, Kotler, ecc.)
]
```

---

## 7. NARRATIVE TEMPLATES

### Struttura
```typescript
interface NarrativeTemplate {
  situation: string; // Come descrivi la situazione attuale
  need: string; // Cosa serve migliorare
  intro: string; // Intro ai libri
}

const narratives: Record<string, NarrativeTemplate> = {
  "Novice_acquisizione": {
    situation: "Sei all'inizio e non sai come trovare clienti in modo sistematico",
    need: "Capire il sistema di acquisizione che usano i professionisti migliori",
    intro: "Ecco i libri che insegnano come attrarre clienti senza dipendere dal passaparola"
  },
  
  "Practitioner_conversione": {
    situation: "Applichi idee di marketing ma il traffico che porti non si trasforma in vendite",
    need: "Fissare il collo di bottiglia della conversione",
    intro: "Ecco come trasformare più persone che contatti in clienti paganti"
  },
  
  "Advanced_sistemi": {
    situation: "Hai risultati buoni ma dipendono principalmente da te, non riesci a scalare",
    need: "Sistematizzare: processi chiari, team allineato, ripetibilità",
    intro: "Ecco come costruire un sistema che funziona senza di te"
  },
  
  // ... 8-10 altri cluster
}
```

---

## 8. EMAIL FLOW & BACKEND

### Campagne Email Automatiche

#### Email 1: Welcome (trigger: form_completed, delay: 0 min)
**Subject**: "Ecco i 3 libri per te — inizia da [Libro A]"

```
Ciao [Nome],

Dalle tue risposte ho visto che sei un professionista che [situazione breve].
Il tuo prossimo passo è leggere:

→ [Titolo Libro A]
   [Una riga beneficio]
   Clicca qui per leggere la pagina

Buona lettura!
— Timoteo
```

#### Email 2: Follow-up Engagement (trigger: email_1_opened, delay: 7 giorni)
**Condition**: `last_email_click > 0 AND no_reply_yet`

**Subject**: "Hai iniziato il libro? Dimmi come va"

```
Ciao [Nome],

Spero tu abbia iniziato a leggere [Libro A]. Mi piacerebbe sapere:

→ Lo stai leggendo? Sì / No / Tra giorni
→ [Link a form breve con 2-3 domande]

Rispondi pure, leggo tutto.
— Timoteo
```

#### Email 3: Reassess (trigger: form_completed, delay: 14 giorni)
**Condition**: Nessun engagement rilevato

**Subject**: "Rifacciamo il test? Forse il libro non è il tuo"

```
Ciao [Nome],

È passato un po' di tempo dalla valutazione. Se non hai iniziato 
a leggere il primo libro, potrebbe non essere quello giusto.

Rifacciamo il test in 5 minuti?
→ Ripeti la valutazione

Oppure, se hai domande: rispondi a questa email.
— Timoteo
```

### Database Schema (essenziale)

```sql
-- Sessioni form
CREATE TABLE form_sessions (
  id UUID PRIMARY KEY,
  uuid_anonimo VARCHAR(36) UNIQUE,
  
  -- Dati utente (opzionali fino al fine)
  email VARCHAR(255),
  nome VARCHAR(255),
  
  -- Risposte
  answers JSONB, -- { "d1": 2, "d2": 3, ... }
  
  -- Risultati scoring
  score_livello INT,
  score_domini JSONB, -- { "acquisizione": X, ... }
  score_interessi JSONB,
  maturity VARCHAR(20), -- Novice | Practitioner | Advanced
  primary_domain VARCHAR(50),
  
  -- Libri consigliati
  recommended_books JSONB, -- [{ "id": "...", "title": "...", "reason": "..." }]
  
  -- Tracciamento email
  email_captured_at TIMESTAMP,
  email_1_sent_at TIMESTAMP,
  email_1_opened_at TIMESTAMP,
  email_1_clicked_at TIMESTAMP,
  
  email_2_sent_at TIMESTAMP,
  email_2_opened_at TIMESTAMP,
  email_2_replied BOOLEAN,
  
  email_3_sent_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sector VARCHAR(50), -- da d12
  market_type VARCHAR(20) -- B2C | B2B | Services | eCommerce (da d11)
);

-- Tracciamento email events (opzionale, per granularità)
CREATE TABLE email_events (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES form_sessions(id),
  email_number INT,
  event_type VARCHAR(50), -- sent | opened | clicked | replied
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### POST `/api/form/start`
**Request**
```json
{
  "uuid_anonimo": "generated-uuid-v4"
}
```
**Response**
```json
{
  "session_id": "uuid",
  "questions": [ { "id": "d1", "text": "...", "options": [...] }, ... ]
}
```

#### POST `/api/form/submit-answers`
**Request**
```json
{
  "session_id": "uuid",
  "answers": {
    "d1": 2,
    "d2": 3,
    ...
  }
}
```
**Response**
```json
{
  "scoreResult": { ... },
  "narrative": { "situation": "...", "need": "...", "intro": "..." },
  "recommendedBooks": [
    { "id": "...", "title": "...", "slug": "...", "reason": "..." },
    ...
  ]
}
```

#### POST `/api/form/capture-email`
**Request**
```json
{
  "session_id": "uuid",
  "email": "user@example.com",
  "nome": "John Doe"
}
```
**Response**
```json
{
  "success": true,
  "message": "Email salvata. Controlla il tuo inbox."
}
```
Trigger automatico: email 1 entro 60 secondi.

#### GET `/api/form/session/:session_id`
**Use**: Per recuperare sessione salvata (dopo email magic link)
**Response**: Stessi dati di submit-answers

---

## 9. BACKEND JOBS & AUTOMATION

### Scheduled Jobs (Cron / Task Queue)

#### Job 1: Email 1 - Welcome (ogni minuto)
```
SELECT * FROM form_sessions 
WHERE email_captured_at IS NOT NULL 
AND email_1_sent_at IS NULL
AND email_captured_at <= NOW() - INTERVAL 1 MINUTE
LIMIT 100

FOR EACH:
  - Genera email personalizzata
  - Invia via SendGrid / Mailgun
  - Registra email_1_sent_at
  - Log: form_email_1_sent
```

#### Job 2: Email 2 - Follow-up (ogni 12 ore)
```
SELECT * FROM form_sessions
WHERE email_1_opened_at IS NOT NULL
AND email_1_opened_at <= NOW() - INTERVAL 7 DAYS
AND email_2_sent_at IS NULL

FOR EACH:
  - Invia email 2
  - Registra email_2_sent_at
```

#### Job 3: Email 3 - Reassess (ogni 12 ore)
```
SELECT * FROM form_sessions
WHERE email_captured_at <= NOW() - INTERVAL 14 DAYS
AND email_2_replied = FALSE
AND email_3_sent_at IS NULL

FOR EACH:
  - Invia email 3
  - Registra email_3_sent_at
```

#### Job 4: Sync Email Events (ogni 6 ore)
```
- Interroga SendGrid / Mailgun API
- Aggiorna email_opened_at, email_clicked_at
- Crea record in email_events
```

---

## 10. TRACKING & ANALYTICS

### Frontend Events (via Google Analytics / Mixpanel / custom)

```
event: "form_page_view"
  - url: /valutazione
  - device: mobile / desktop

event: "form_started"
  - session_id: uuid
  
event: "form_question_answered"
  - question_id: d1
  - answer: 2
  - time_to_answer: 5 (secondi)

event: "form_completed"
  - session_id: uuid
  - score_livello: 28
  - maturity: Practitioner
  - primary_domain: conversione
  - time_to_completion: 142 (secondi)

event: "email_captured"
  - session_id: uuid

event: "cta_clicked" (libri suggeriti)
  - book_id: ogilvy-advising
```

### Backend Events (database log)

```
form_started: session_id, timestamp
form_completed: session_id, score_livello, maturity, timestamp
email_captured: session_id, email, timestamp
email_1_sent: session_id, timestamp
email_1_opened: session_id, timestamp
email_1_clicked: session_id, timestamp
```

---

## 11. OPTIONAL: MAGIC LINK & SESSION RECOVERY

Se l'utente vuole tornare alla sua valutazione via email:

#### Email Template Link
```
Recupera la tua valutazione:
→ [https://paginevinenti.com/recovery/[magic_token]]
```

#### POST `/api/form/request-recovery`
**Request**
```json
{
  "email": "user@example.com"
}
```
**Response**
```json
{
  "success": true,
  "message": "Check your email for recovery link"
}
```

#### GET `/api/form/recovery/:token`
Restituisce `session_id`, reload sessione, pre-popola risposte.

---

## 12. DEPLOYMENT & HOSTING

### Frontend
- Deployment: Vercel / Netlify
- Build: `npm run build`
- Env vars: API_BASE_URL, ANALYTICS_KEY

### Backend
- Hosting: Supabase / Firebase / AWS Lambda
- Database: PostgreSQL (Supabase) oppure Firebase Firestore
- Email: SendGrid / Mailgun API
- Scheduler: GitHub Actions / AWS EventBridge / Supabase Functions

### Monitoraggio
- Error tracking: Sentry
- Logs: Datadog / CloudWatch
- Form drop-off: Analytics heatmap (Hotjar opzionale)

---

## 13. TIMELINE & MILESTONE

| Fase | Durata | Deliverable |
|------|--------|-------------|
| Setup infra + DB | 3-4 gg | Schema DB, API base, env |
| Frontend form | 5-6 gg | UI, form logic, state |
| Scoring engine | 3-4 gg | Algoritmo, narrative lib |
| Email automation | 3-4 gg | Job scheduler, templates |
| Testing | 3-4 gg | E2E, edge cases, QA |
| **Total** | **18-22 gg** | **Go live** |

---

## 14. ACCEPTANCE CRITERIA

- [ ] Form carica in < 2 sec
- [ ] Utente completa 13 domande in 2-3 minuti (media)
- [ ] Risultati personalizz. basati su risposte (non random)
- [ ] Email 1 arriva entro 60 sec da email capture
- [ ] Email 2 trigga correttamente dopo 7 giorni
- [ ] Email 3 trigga correttamente dopo 14 giorni
- [ ] Magic link recovery funziona
- [ ] Analytics trackano: form_started, form_completed, email_captured
- [ ] Database pulito: no dati sensibili, GDPR compliant
- [ ] Mobile responsive (form usabile su phone)

---

## 15. NOTES FOR DEV

1. **Scoring matrix**: Vedi `PV_FORM_QUESTIONS_CORRECTED.md` per dettagli ogni domanda
2. **Narrative library**: Prepare 8-12 template narrativa + libro reasons
3. **Book library**: Prepare JSON canon con almeno 15-20 libri PV
4. **Email service**: Configura SendGrid / Mailgun API key
5. **Database**: Se usi Supabase, migrations SQL ready
6. **Testing**: Setup mock data per 3-5 user persona
7. **Performance**: Cache narrativa + book library in memoria / Redis
8. **Security**: Sanitizza input form, rate-limit API endpoints, encrypt email

---

## Appendice A: Domande Form

Vedi: `PV_FORM_QUESTIONS_CORRECTED.md`

## Appendice B: Scoring Matrix Dettagliato

Vedi: `PV_FORM_QUESTIONS_CORRECTED.md` (sezione Scoraggio)

## Appendice C: Book Library Template

Vedi sopra (sezione 6)

---

**Per domande**: Contatta il product owner (Timoteo)
