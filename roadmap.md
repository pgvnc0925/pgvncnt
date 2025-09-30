Roadmap di sviluppo – Pagine Vincenti (Showcase MVP)

⸻

Sprint 1 – Setup & fondamenta (Settimana 1)

Obiettivo: avere il progetto Next.js + Supabase + Vercel che gira, anche se vuoto.
	•	Setup repo GitHub (Next.js 14, TypeScript, Tailwind, shadcn).
	•	Configurare Supabase (DB + Auth + Storage).
	•	Creare schema base DB (tools, books, profiles, tool_sessions).
	•	Setup deploy automatico su Vercel (preview + prod).
	•	Pagina / con placeholder “Coming soon”.

✅ Deliverable: sito online con deploy automatico e DB connesso.

⸻

Sprint 2 – Homepage & layout (Settimana 2)

Obiettivo: struttura marketing base.
	•	Layout con header/footer/responsive grid.
	•	Homepage con griglia tool (mock data in JSON).
	•	Componenti UI base (card, button, input, textarea, select).
	•	Pagina statica /chi-sono + /privacy-policy.

✅ Deliverable: homepage con tool finti, ma navigabile.

⸻

Sprint 3 – Primo tool end-to-end (Settimana 3)

Obiettivo: avere Decision Validator funzionante.
	•	Pagina /tools/[slug] con workflow multi-step.
	•	Gestione state step (Next.js + React state).
	•	Salvataggio sessione in tool_sessions.
	•	Output finale con template base.
	•	Pulsante “Scarica PDF” → placeholder.

✅ Deliverable: un tool usabile, dati salvati in DB.

⸻

Sprint 4 – Lead capture & email (Settimana 4)

Obiettivo: trasformare utenti in lead.
	•	Creare tabella leads.
	•	Integrazione con Brevo (API key).
	•	Download PDF → richiede email → salva in Supabase + invia a Brevo.
	•	Email di benvenuto (flow base).

✅ Deliverable: raccolta lead funzionante.

⸻

Sprint 5 – Books & affiliate (Settimana 5)

Obiettivo: monetizzazione “soft”.
	•	Pagina /libri con schede (mock + 2 reali).
	•	Dettaglio libro /libri/[slug] con CTA Amazon.
	•	Tracciamento click affiliate (affiliate_clicks).
	•	Collegare libri a tool (related_books).

✅ Deliverable: libri online con link affiliati tracciati.

⸻

Sprint 6 – AI integration (Settimana 6)

Obiettivo: dare la botta “wow” AI.
	•	Mini chat contestuale in tool step (Claude API).
	•	Rate limiting (5 messaggi/giorno per guest).
	•	Versione loggati = illimitato.
	•	Messaggio AI con citazione framework (hardcoded per ora).

✅ Deliverable: AI assistant in almeno 1 tool.

⸻

Sprint 7 – Secondo tool & articoli SEO (Settimana 7)

Obiettivo: avere almeno 2 tool veri + contenuti per traffico.
	•	Creare “Marketing Campaign Architect” (workflow a 3 step).
	•	Creare sezione /articoli (Next.js MDX o markdown da Supabase).
	•	Pubblicare 2 articoli SEO-ready (riassunti libri).

✅ Deliverable: sito con 2 tool, sezione blog, prime keyword indicizzate.

⸻

Sprint 8 – Refinement & lancio soft (Settimana 8)

Obiettivo: sistemare UX, sicurezza e lanciare beta.
	•	Migliorare output PDF (template brandizzato).
	•	UI polishing (card, animazioni leggere).
	•	GDPR: pulsante “Cancella account” + cookie banner.
	•	Collegare in modo chiaro CTA a [timoteopasquali.it].
	•	Test mobile + fix bug.

✅ Deliverable: MVP pronto al lancio, con funnel email attivo.

⸻

Roadmap “oltre il lancio” (post-MVP)
	•	Sprint 9+: aggiungere nuovi tool verticali (ristoranti, professionisti).
	•	Sprint 10+: micro-prodotti digitali (PDF a pagamento).
	•	Sprint 11+: paywall freemium (opzionale).
	•	Sprint 12+: analisi usage per capire cosa monetizza davvero.