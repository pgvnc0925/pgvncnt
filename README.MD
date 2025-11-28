Perfetto.
Ecco il README.md definitivo, scritto esattamente come serve a Claude Code (e a qualsiasi dev-AI) per capire l’architettura, il flusso operativo, i file system, i formati da supportare e come automatizzare il tutto.

È pensato per essere incollato direttamente nella root del repository come documento di riferimento.

Pulito, tecnico, completo.
E soprattutto “AI-friendly”: strutturato per essere interpretato da un assistente di sviluppo.

⸻

📘 README – Pagine Vincenti (PV) – Sistema Editoriale + Toolbox App

⸻

🏛️ Panoramica del progetto

Pagine Vincenti è una piattaforma composta da due elementi principali:
	1.	Sito (riassunti dei libri + analisi PV)
	2.	App (toolbox di concetti, checklist, quiz, template) basata su file JSON derivati dai libri.

L’obiettivo è automatizzare al massimo il flusso di lavoro:
	•	si genera un riassunto via ChatGPT/Claude
	•	si incolla il file .mdx nella folder dedicata
	•	si incolla la copertina nella folder dedicata
	•	il sito costruisce automaticamente la pagina libro, con CTA posizionate automaticamente
	•	l’app carica automaticamente i JSON dei concetti e genera gli strumenti nei moduli PV

Questo README spiega come strutturare il repository, le cartelle, i file, il parser e le regole.

⸻

📁 Struttura delle Cartelle

/content
  /books               → riassunti in formato .mdx
  /cta                 → file CTA in testo (.mdx o .txt)
    cta_percorso_base.mdx
    cta_acquista_libro.mdx
    cta_usa_app.mdx

/public
  /book-covers         → immagini copertina (.jpg .png)

/pv_rag
  /books               → JSON con concetti estratti dai libri

/app (o /src/app)
  /moduli              → pagine dei moduli PV (Fondamenti, etc.)
  /tools               → tool generati dai JSON
  /components          → componenti UI (CTA inserter, BookCover, Layout)
  /lib                 → parser, loader, utility


⸻

📚 1. File Riassunti – Formato MDX Standard

Ogni libro ha un file .mdx in /content/books/.

Struttura OBBLIGATORIA:

---
title: "Titolo leggibile"
slug: "titolo-in-minuscolo"
author: "Autore"
year: 2008
pvCategory: "BASE" # oppure INTERMEDIO / AVANZATO
metaTitle: "Meta title SEO"
metaDescription: "Meta description SEO"
excerpt: "1–2 frasi introduttive"
tags:
  - "Fondamenti di Marketing"
  - "Posizionamento"
coverImage: "titolo.jpg"
---

## Introduzione
[TESTO]

## Idee principali del libro
[TESTO]

## Applicazioni pratiche
[TESTO]

## Analisi Pagine Vincenti
[TESTO]

## Errori che questo libro aiuta a evitare
- punto 1
- punto 2
- punto 3

## Come proseguire lo studio
[TESTO]

NON devono esserci CTA nel contenuto: saranno iniettate automaticamente.

⸻

📌 2. File CTA – Formato .mdx o .txt

Tre file in /content/cta/
	•	cta_percorso_base.mdx
	•	cta_acquista_libro.mdx
	•	cta_usa_app.mdx

Contengono testo puro, senza HTML.

⸻

⚙️ 3. Inserimento Automatico delle CTA

Claude deve implementare un parser che:
	1.	legge il file .mdx
	2.	identifica le sezioni per header H2
	3.	inietta CTA nei punti predefiniti:

Sezione	CTA da inserire
## Introduzione	cta_percorso_base
## Idee principali del libro	cta_acquista_libro
## Come proseguire lo studio	cta_usa_app

CTA integrate come paragrafi di testo, non bottoni HTML.

La resa visiva è responsabilità dei componenti front-end.

⸻

📂 4. File JSON per RAG

Ogni libro ha un file JSON in /pv_rag/books/.

Formato OBBLIGATORIO:

{
  "book_title": "",
  "author": "",
  "publication_year": "",
  "pv_category": "",
  "core_thesis": "",
  "primary_concepts": [
    {
      "name": "",
      "definition": "",
      "relationships": ["", ""],
      "secondary_concepts": [
        {
          "name": "",
          "definition": "",
          "tertiary_points": ["", "", ""],
          "examples": ["", ""],
          "applications": ["", ""],
          "common_mistakes": ["", ""],
          "diagnostic_questions": ["", ""]
        }
      ]
    }
  ],
  "pv_meta_analysis": {
    "agreement_points": ["", ""],
    "disagreement_points": ["", ""],
    "connections_to_other_books": [
      {
        "related_book": "",
        "relation_type": "",
        "explanation": ""
      }
    ]
  }
}

JSON generati dall’AI devono essere trasformativi, senza citazioni o riferimenti letterali.

Il parser JSON deve:
	•	importare i concetti
	•	mapparli nei moduli PV
	•	generare i tool (checklist, quiz, domande diagnostiche, template)

⸻

🧠 5. Moduli PV (tassonomia accademica)

Questi moduli sono canonici e non vanno cambiati:
	1.	Fondamenti di Marketing
	2.	Psicologia del Consumatore
	3.	Comportamento d’Acquisto
	4.	Strategia di Marketing
	5.	Analisi del Mercato e dei Segmenti
	6.	Architettura del Brand
	7.	Comunicazione Persuasiva
	8.	Architettura dell’Offerta
	9.	Sistemi di Vendita e Conversione
	10.	Analisi, Misurazione e Apprendimento

Ogni concetto JSON è assegnato a uno o più moduli.

⸻

🛠️ 6. Tool generati automaticamente

Per ogni concetto, creare tool:

✔ Checklist

– lista di punti operativi

✔ Domande diagnostiche

– da presentare come elenco semplice

✔ Template operativi

– campi precompilati e input utente

✔ Mini-quiz

– 5–10 domande multiple choice estratte da:
	•	definition
	•	errors
	•	applications

Questi tool sono visualizzati nelle pagine dei moduli.

⸻

🎨 7. UI / Stile
	•	Palette:
	•	Blu PV (#0c1c3c)
	•	Oro PV (#d4af37)
	•	Layout accademico, pulito, molto spazio bianco
	•	Font semplice e leggibile
	•	Card per i moduli
	•	Componente <BookCover /> che usa frontmatter.coverImage

⸻

🔄 8. Workflow completo

Utente/Admin:
	1.	genera riassunto su ChatGPT/Claude → riceve file .mdx
	2.	copia .mdx in /content/books/
	3.	copia la copertina in /public/book-covers/
	4.	copia JSON concetti in /pv_rag/books/

Sistema:
	1.	parser frontmatter
	2.	iniezione CTA
	3.	costruzione pagina libro
	4.	parser JSON → tool
	5.	popolamento toolbox app
	6.	pagina modulo aggiornata automaticamente

Nessun copia-incolla manuale.
Nessuna modifica HTML.
Solo 3 file: .mdx, .json, .jpg.

⸻

🧩 9. Requisiti essenziali per Claude Code

Claude deve implementare:

1. MDX parser
	•	legge frontmatter
	•	rileva sezioni
	•	inietta CTA

2. CTA loader
	•	legge i tre file /content/cta/
	•	li inserisce nei punti predefiniti

3. JSON loader
	•	importa concetti
	•	li classifica nei moduli
	•	genera tool

4. Components UI
	•	<CTA />
	•	<BookCover />
	•	<ToolList />
	•	<ModulePage />

5. Routing automatico
	•	/libri/[slug] per ogni libro
	•	/moduli/[nome-modulo] per la toolbox

⸻

🧪 10. Test da eseguire

✔ Test CTA injection
	•	dare un file .mdx finto e verificare che CTA appaiano nel punto giusto

✔ Test JSON import
	•	dare un JSON finto e vedere tutti i tool generati

✔ Test pagina modulo
	•	moduli popolati correttamente

✔ Test SEO
	•	metaTitle, metaDescription, excerpt devono apparire nel <head>

⸻

🏁 Conclusione

Questo sistema:
	•	elimina i colli di bottiglia editoriali
	•	rende la pubblicazione dei riassunti automatica
	•	crea una toolbox viva che cresce da sola libro dopo libro
	•	mantiene una struttura accademica coerente
	•	è 100% AI-friendly per te e per Claude Code

Questo README è il documento principale per l’intero progetto PV.
