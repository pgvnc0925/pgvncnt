# Pagine Vincenti — SOMMARIO ESECUTIVO & CHECKLIST
## Quick Start per il Developer

---

## 📦 COSA HAI RICEVUTO

4 file pronti all'uso:

1. **PV_FORM_QUESTIONS_CORRECTED.md** — 13 domande ottimizzate (comportamenti osservabili)
2. **PRD_FORM_COMPLETO_DEV.md** — PRD succinto ma completo (home CTA, frontend, backend, email automation)
3. **SCORING_MATRIX_DETAILED.md** — Matrice di scoring precisa per ogni domanda
4. **NARRATIVE_TEMPLATES_BOOK_LIBRARY.md** — Template narrativa + libreria libri canonici

---

## 🚀 COME LEGGERLI

### Per il Frontend Developer
Leggi in ordine:
1. **PRD_FORM_COMPLETO_DEV.md** → sezioni 2, 3 (Positioning, Form Flow)
2. **PV_FORM_QUESTIONS_CORRECTED.md** → le 13 domande
3. **NARRATIVE_TEMPLATES_BOOK_LIBRARY.md** → come renderizzare risultati

### Per il Backend Developer
Leggi in ordine:
1. **PRD_FORM_COMPLETO_DEV.md** → sezioni 4, 5, 8, 9, 10 (Scoring, Book Recommendation, Backend, Email)
2. **SCORING_MATRIX_DETAILED.md** → implementazione pseudocode
3. **NARRATIVE_TEMPLATES_BOOK_LIBRARY.md** → strutture dati

### Per il Project Manager / Product Owner
Leggi:
1. **PRD_FORM_COMPLETO_DEV.md** → Overview, Timeline, Acceptance Criteria
2. Poi delegati i dettagli tecnici ai dev

---

## ✅ CHECKLIST DI SETUP INIZIALE (Dev)

### Infrastruttura & Database
- [ ] Crea DB PostgreSQL (Supabase o cloud)
- [ ] Applica schema SQL da PRD sezione 8 (form_sessions, email_events)
- [ ] Configura SendGrid / Mailgun API
- [ ] Configura GitHub Actions / AWS EventBridge per scheduled jobs
- [ ] Setup Sentry per error tracking

### Frontend Setup
- [ ] Repo React/Next.js iniziale
- [ ] Tailwind CSS configurato
- [ ] Struttura folder: pages/form, components/FormQuestion, components/Results
- [ ] Setup Google Analytics / custom tracking
- [ ] Copia le 13 domande da PV_FORM_QUESTIONS_CORRECTED.md

### Backend Setup
- [ ] Repo Node.js/Express (o Supabase Functions)
- [ ] Implementa endpoints da PRD sezione 9 (POST /api/form/*, GET /api/form/*)
- [ ] Implementa scoring engine (vedi SCORING_MATRIX_DETAILED.md)
- [ ] Importa narrative templates + book library (NARRATIVE_TEMPLATES_BOOK_LIBRARY.md)
- [ ] Configura email templates (3 email da PRD sezione 8)

### Environment Variables
```
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=...
ANALYTICS_KEY=...
API_BASE_URL=...
ENVIRONMENT=development|production
```

---

## 📋 PRIORITY DI IMPLEMENTAZIONE

### MVP (Sprint 1–2): 18–22 giorni

**Settimana 1**
- [ ] Setup infra + DB schema
- [ ] API endpoints base (POST /form/start, POST /form/submit-answers)
- [ ] Frontend form (UI + state management)
- [ ] Scoring engine (calcolo punteggi)

**Settimana 2–3**
- [ ] Pagina risultati con narrativa + libri
- [ ] Email capture + POST /form/capture-email
- [ ] Email 1 automation (Welcome)
- [ ] Magic link recovery (opzionale, può essere dopo MVP)

**Settimana 3**
- [ ] Testing (E2E, edge cases)
- [ ] QA & fix
- [ ] Deploy

### Nice-to-Have (Post-MVP)

- [ ] Email 2 & 3 automation (follow-up, reassess)
- [ ] Heatmap form drop-off (Hotjar)
- [ ] A/B test CTA in home page
- [ ] Dashboard admin per visualizzare dati form

---

## 🔑 KEY DECISIONS TO MAKE ASAP

1. **Tech Stack Definitivo**
   - Frontend: Next.js / React + Tailwind?
   - Backend: Supabase / Node.js / Firebase?
   - Database: PostgreSQL / Firebase Firestore?

2. **Home Page CTA Placement**
   - Where exactly in home? (hero, sotto primo contenuto, sidebar?)
   - Bottone o link?
   - Copy esatto?

3. **Email Service**
   - SendGrid o Mailgun?
   - Template design (HTML, non solo testo?)

4. **Book Library — Quali libri?**
   - 8 libri del template bastano?
   - Aggiungere altri autori PV (Dawar, ecc.)?
   - Ordine di priorità?

---

## 🎯 SUCCESS METRICS (post-launch)

- [ ] Form load time < 2 sec
- [ ] Completion rate > 60% (persone che iniziano = persone che finiscono)
- [ ] Email capture rate > 40% (di chi completa, quanti danno email)
- [ ] Email 1 open rate > 25%
- [ ] Email 1 click rate > 15% (click su "Leggi la pagina")
- [ ] CTA da home page ha CTR > 5%

---

## 📞 DOMANDE FREQUENTI DEL DEV

**Q: Che cosa succede se l'utente non completa tutte le domande?**
A: Non può clickare "Continua" senza rispondere. Se esce, la sessione si salva via UUID (localStorage), può tornare dopo.

**Q: Come gestisco le domande multiple (d7)?**
A: Accetta array di indici. Somma i punti di TUTTI gli indici selezionati.

**Q: Che cosa succede se l'utente seleziona "Nessuno" in d7?**
A: Aggiunge 0 punti a tutti i domini/interessi. È fine, significa non usa nessuno di quei canali.

**Q: Come calcolo il "secondaryDomain"?**
A: Se max(domini) - 2nd_max(domini) <= 3, includi entrambi nella narrativa.
   Altrimenti, secondaryDomain = null.

**Q: E se il punteggio è un tie tra due domini?**
A: Scegli arbitrariamente il primo in ordine alfabetico (o usa il libro che copre entrambi).

**Q: Che cosa succede ai dati raccolti?**
A: Rimangono anonimi a meno che non fornisca email.
   Solo punteggi aggregati (non risposte individuali) vengono analizzati.

**Q: Posso tracciare quale utente ha quali risposte?**
A: Solo se fornisce email. Altrimenti rimane UUID anonimo.

**Q: Che cosa succede se l'utente chiude il browser?**
A: UUID rimane in localStorage. Quando torna, riprende da dove era.
   Se pulisce cookie, ricomincia da zero (è fine).

---

## 📊 ANALISI DATI POST-LAUNCH

Una volta lanciato, puoi analizzare:

1. **Distribuzione dei cluster** — Quanti Novice vs Practitioner vs Advanced?
2. **Dominio prevalente** — Quale è il blocco principale? (Acquisizione? Conversione?)
3. **Settore (d12) + Cluster** — Ristoratori sono più Acquisizione, Medici più Esperienza?
4. **Time to completion** — Domanda media è risposta in 30 sec? Quali domande frenano?
5. **Email capture rate per cluster** — Novice cattura più email di Advanced?

Usa questi dati per:
- Ottimizzare CTA in home page
- Aggiustare narrativa templates
- Capire quale libro consigliare per quale cluster

---

## 🚨 GOTCHA & EDGE CASES

1. **UUID collision** — Generare UUID v4 server-side, non client.
2. **Email duplicati** — Se stessa email compila form 2 volte? Crea session nuova o recupera la vecchia?
   **Suggerimento**: Se email esiste, usa celle precompilate da session precedente.
3. **Email non valida** — Validare email lato client + server.
4. **Bot che completa form** — Aggiungere reCAPTCHA se necessario.
5. **Rate limiting** — Limitare POST /form/submit-answers a 1 ogni 5 secondi per IP.

---

## 📱 MOBILE UX CONSIDERATIONS

- [ ] Form questions in vertical stack (non side-by-side)
- [ ] Checkbox/radio in grande (target > 40px)
- [ ] Progress bar visibile
- [ ] Tasto "Indietro" solo da mobile (desktop scrolling)
- [ ] Risultati: stack verticale, card larghi full-width

---

## 🔐 SECURITY & PRIVACY

- [ ] Sanitizzare input form (escapeHtml)
- [ ] Encrypt email database (se usi cloud)
- [ ] CORS configurato per dominio PV solo
- [ ] Rate limit API endpoints (100 req/min per IP)
- [ ] Privacy policy menziona email anonime
- [ ] GDPR: possibilità di richiedere cancellazione dati (POST /api/form/delete?email=...)

---

## 📖 DOCUMENTAZIONE FINALE

Una volta lanciato, prepara:

1. **Admin dashboard** — Visualizzazione dati aggregati
2. **Email template repository** — Copia standardizzate
3. **Form analytics** — Dashboard drop-off per domanda
4. **Book recommendation logic** — Come cambiare i cluster o aggiungere libri

---

## 📧 TEMPLATE EMAIL PRONTI (Copy)

### Email 1: Welcome (subito)
```
Subject: Ecco i 3 libri per te — inizia da [Titolo Libro 1]

Ciao [Nome],

Dalle tue risposte ho visto che sei un professionista che [situazione breve].
Il tuo prossimo passo è leggere:

→ [Titolo Libro 1]
  [Una riga su cosa insegna]
  Leggi la pagina

Buona lettura!
— Timoteo
```

### Email 2: Follow-up (7 giorni)
```
Subject: Hai iniziato il libro? Dimmi come va

Ciao [Nome],

Spero tu abbia iniziato a leggere [Titolo Libro 1]. 
Mi piacerebbe sapere:

→ Lo stai leggendo? Sì / No / Tra giorni
→ Cosa ne pensi finora?
→ Vuoi che ti aiuti a capire qualcosa?

Rispondi pure, leggo tutto.
— Timoteo

[Link a form breve o reply diretto]
```

### Email 3: Reassess (14 giorni)
```
Subject: Rifacciamo il test? Forse il libro non è il tuo

Ciao [Nome],

È passato un po' di tempo dalla valutazione.
Se non hai ancora iniziato a leggere [Titolo Libro 1], 
potrebbe non essere quello giusto per te.

Rifacciamo il test in 5 minuti?
→ Ripeti la valutazione

O se hai domande, rispondi a questa email.

— Timoteo
```

---

## 🎁 BONUS: Post-MVP Features

Se il tempo lo permette:

1. **Share risultati** — Bottone "Condividi su LinkedIn"
2. **Quiz interno ai libri** — Dopo aver letto, verifica comprensione
3. **Learning path** — Sequenza di 3-5 libri personalizzata
4. **Progress tracker** — Quanto hai letto di ogni libro?
5. **Community Slack** — Gruppo di lettura chiuso

---

## 📞 PER DOMANDE TECNICHE

Contatta: Timoteo (product owner)

Per issues / bug: GitHub issue tracker (quando ready)

---

**Buona fortuna! Il dev può iniziare da domani. 🚀**
