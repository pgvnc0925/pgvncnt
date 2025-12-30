# Session Notes – Valutazione & Raccomandazione Libri (PV)

## Obiettivo
Implementare una form di valutazione (13 domande) che calcola profilo cognitivo/operativo, genera consigli di lettura personalizzati, salva anonimamente le risposte e permette il recupero via email/magic link. Aggiunto un CTA visibile in homepage per lanciare la valutazione.

## Cosa è stato fatto
- **UI / Flusso form**: `/valutazione` con intro, domande single/multi, progress bar, risultati con cluster/maturity, domini/interessi primari, libri consigliati (3–5), salvataggio, recupero e restart.
- **Question set**: `data/evaluation/questions.ts` aggiornato alle 13 domande richieste (nuove opzioni).
- **Scoring engine**:
  - `data/evaluation/scoring.ts` espone `calculateScores`/`computeScores` con matrice completa (livello, dominio, interesse) incluse domande multi.
  - Supporto cluster (Novice/Practitioner/Advanced) e dominanza primaria/secondaria.
  - `getRecommendedBooks` (rule-based) con motivazioni dinamiche (template + cluster).
- **Catalogo libri**: `data/evaluation/book-catalog.ts` ampliato con domini/interessi/levels/priority, cover e reason template parametrico `{domain}/{interest}/{maturity}`.
- **API**:
  - `POST /api/evaluate-form`: calcola punteggi + libri raccomandati.
  - `POST /api/save-session`: salva `uuid`, `answers`, `scores`, `email?`, `name?` (Supabase se configurato).
  - `POST /api/recover-session`: recupera per `email` o `uuid`.
- **Persistenza client**:
  - UUID generato e salvato in `localStorage` (`pv_eval_uuid`).
  - Risposte salvate in `localStorage` (`pv_eval_answers`); salvataggio remoto opzionale.
  - UI “Riprendi più tardi” (save), “Ricomincia”, e recupero via email.
  - Magic link Supabase OTP inviato su salvataggio (se env Supabase presente).
- **Homepage CTA**:
  - Bottone hero “Fai la Valutazione”.
  - Card dedicata sotto hero che spiega perché fare la valutazione (gratis, anonimo, no email/carta) con link a `/valutazione`.
  - Nav link “Valutazione”.

## File chiave
- `data/evaluation/questions.ts` – domande/risposte.
- `data/evaluation/scoring.ts` – matrice punteggi, calcolo, raccomandazioni.
- `data/evaluation/book-catalog.ts` – catalogo libri con meta e template ragioni.
- `components/evaluation/evaluation-form.tsx` – UI multi-step, salvataggi, risultati, recovery.
- API: `app/api/evaluate-form/route.ts`, `app/api/save-session/route.ts`, `app/api/recover-session/route.ts`.
- CTA: `app/page.tsx` (hero button + card), `components/layout/header.tsx` (nav).
- Persistence helper: `lib/evaluation/storage.ts`.

## Come funziona (sintesi tecnica)
1) L’utente risponde alle 13 domande (single/multi).  
2) `computeScores` somma Livello/Dominio/Interesse secondo la matrice; calcola maturity e domini/interessi principali.  
3) `getRecommendedBooks` filtra catalogo per livello, pesa dominio/interesse (con tie-handling) e genera 3–5 libri con motivazione dinamica.  
4) Risultati mostrati in pagina; opzionale: invio magic link Supabase e salvataggio remoto via `/api/save-session`.  
5) LocalStorage mantiene UUID e risposte; recupero via email/uuid con `/api/recover-session`.  

## Cose da configurare
- Supabase env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) e tabella `form_sessions` con colonne `uuid`, `answers` JSON, `scores` JSON, `email`, `name`, timestamps.
- Whitelist redirect per magic link (`/valutazione?uuid=...`).

## Gap / next steps
- Completare catalogo libri (più titoli reali + cover), affinare ragioni per cluster/dominio/interesse.
- UI: migliorare animazioni/errore/tap-target su mobile; pagina di recupero dedicata.
- Email/magic-link UX: conferma esplicita, pagina “email inviata”, integrazione con email templating se serve.
- Aggiungere test unitari per `calculateScores`/`getRecommendedBooks`.
