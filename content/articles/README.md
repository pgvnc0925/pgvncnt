# 📝 Sistema Articoli - Guida Completa

Questo sistema permette di pubblicare articoli semplicemente caricando file Markdown (.md) con metadata (frontmatter).

## 🚀 Come funziona

1. Crei un file `.md` nella cartella `content/articles/`
2. Aggiungi frontmatter YAML in cima al file
3. Scrivi il contenuto in Markdown
4. Il sistema automaticamente:
   - Renderizza l'articolo con styling professionale
   - Aggiunge CTAs strategici (inizio, metà, fine)
   - Mostra libri correlati con link
   - Mostra tool correlati
   - Crea sezione FAQ strutturata
   - Ottimizza per SEO

## 📋 Template Base

Crea un nuovo file: `content/articles/il-mio-articolo.md`

```markdown
---
title: "Il tuo titolo accattivante"
description: "Meta description per SEO (max 160 caratteri)"
publishedAt: "2025-01-15"
author: "Timoteo Pasquali"
tags: ["Tag1", "Tag2", "Tag3"]
featuredImage: "/images/articles/nome-immagine.jpg"
relatedBooks: ["Nome Libro 1", "Nome Libro 2"]
relatedTools: ["Nome Tool 1", "Nome Tool 2"]
ctaText: "Testo CTA personalizzata (opzionale)"
ctaLink: "/link-cta"
faq:
  - question: "Domanda 1?"
    answer: "Risposta alla domanda 1"
  - question: "Domanda 2?"
    answer: "Risposta alla domanda 2"
---

# Introduzione

Il tuo contenuto inizia qui...

## Sezione 1

Contenuto della sezione...

## Sezione 2

Altro contenuto...
```

## 🎨 Frontmatter - Campi Disponibili

### Campi Obbligatori

- **title** (string): Titolo dell'articolo
- **description** (string): Meta description per SEO
- **publishedAt** (string): Data pubblicazione formato YYYY-MM-DD
- **tags** (array): Lista di tag/categorie

### Campi Opzionali

- **author** (string): Nome autore (default: Timoteo Pasquali)
- **featuredImage** (string): Path dell'immagine principale
- **relatedBooks** (array): Lista libri citati
- **relatedTools** (array): Lista tool correlati
- **ctaText** (string): Testo CTA personalizzata
- **ctaLink** (string): Link CTA personalizzata
- **faq** (array): Lista domande/risposte

## 🖼️ Immagini

### Featured Image
Aggiungi l'immagine principale nel frontmatter:

```yaml
featuredImage: "/images/articles/mia-immagine.jpg"
```

Carica l'immagine in: `public/images/articles/mia-immagine.jpg`

**Dimensioni consigliate:** 1200x630px (ratio 1.91:1 per Open Graph)

### Immagini nel contenuto
Usa Markdown standard:

```markdown
![Alt text descrittivo](/images/articles/immagine-inline.jpg)
```

## 🎯 CTAs Automatiche

Il sistema aggiunge **3 CTAs automatiche**:

1. **CTA Metà Articolo** - Invita a provare i tool
2. **CTA Libri/Tool Correlati** - Se specificati nel frontmatter
3. **CTA Fine Articolo** - Newsletter/engagement

### CTA Personalizzata
Aggiungi una CTA custom con:

```yaml
ctaText: "Vuoi una consulenza personalizzata?"
ctaLink: "https://timoteopasquali.it/consulenza"
```

## ❓ FAQ (Structured Data)

Le FAQ vengono renderizzate in modo strutturato e sono ottime per SEO:

```yaml
faq:
  - question: "Quanto costa implementare gli OKR?"
    answer: "Dipende dalla dimensione del team. Per startup, può essere fatto internamente con training. Per aziende più grandi, considera un consulente per 1-2 trimestri."
  - question: "Gli OKR funzionano anche per freelance?"
    answer: "Assolutamente! Gli OKR sono perfetti per freelance che vogliono strutturare obiettivi trimestrali e crescita personale."
```

## 📚 Libri e Tool Correlati

### Libri
```yaml
relatedBooks:
  - "Measure What Matters - John Doerr"
  - "High Output Management - Andy Grove"
```

Il sistema crea automaticamente card con link alla pagina libro corrispondente.

### Tool
```yaml
relatedTools:
  - "OKR Builder"
  - "Decision Validator"
```

Crea card cliccabili che portano ai tool correlati.

## ✍️ Markdown Features

Supporto completo per:

- **Intestazioni:** `#` `##` `###`
- **Bold/Italic:** `**bold**` `*italic*`
- **Liste:** `- item` o `1. item`
- **Link:** `[testo](url)`
- **Immagini:** `![alt](url)`
- **Quote:** `> quote`
- **Codice inline:** `` `code` ``
- **Code blocks:**
  ```javascript
  const example = "code"
  ```
- **Tabelle:**
  ```markdown
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
  ```

## 📂 Struttura File

```
content/
└── articles/
    ├── README.md (questo file)
    ├── esempio-articolo-framework-okr.md
    └── tuo-nuovo-articolo.md

public/
└── images/
    └── articles/
        ├── okr-framework.jpg
        └── tua-immagine.jpg
```

## 🔍 SEO

Il sistema genera automaticamente:
- **Title tag** dal frontmatter
- **Meta description** dal frontmatter
- **Open Graph tags** per social sharing
- **Structured data** per FAQ
- **Canonical URL**
- **Schema.org Article markup**

## 🚀 Workflow Pubblicazione

1. **Crea file MD:**
   ```bash
   touch content/articles/nuovo-articolo.md
   ```

2. **Aggiungi frontmatter e contenuto**

3. **Aggiungi immagini:**
   ```bash
   # Carica in public/images/articles/
   ```

4. **Verifica in sviluppo:**
   ```bash
   npm run dev
   # Vai a http://localhost:3000/articoli
   ```

5. **Deploy automatico su Vercel** al push su main

## 💡 Best Practices

### SEO
- **Title:** 50-60 caratteri
- **Description:** 150-160 caratteri
- **Tags:** 3-5 tag rilevanti
- **Featured Image:** Sempre presente, 1200x630px

### Contenuto
- **Lunghezza:** 1500-3000 parole per SEO
- **Struttura:** H2 ogni 300-500 parole
- **Liste/tabelle:** Migliora leggibilità
- **Link interni:** Collega ad altri articoli/tool

### Immagini
- **Formato:** JPG (foto), PNG (grafiche)
- **Ottimizzazione:** Max 200KB per immagine
- **Alt text:** Sempre presente per accessibilità

## 🎯 Esempi Completi

Vedi `esempio-articolo-framework-okr.md` per un esempio completo funzionante.

## ❗ Troubleshooting

**Articolo non appare:**
- Verifica che il file sia in `content/articles/`
- Verifica che l'estensione sia `.md`
- Controlla che il frontmatter sia valido YAML

**Immagine non si carica:**
- Verifica che il path inizi con `/images/`
- Controlla che il file esista in `public/images/`

**Errore build:**
- Verifica sintassi YAML nel frontmatter
- Controlla che non ci siano caratteri speciali non escaped

## 📞 Supporto

Per domande o problemi, apri una issue su GitHub o contatta Timoteo.