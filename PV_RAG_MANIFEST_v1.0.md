---

# 📜 FILE 2  
## `PV_RAG_MANIFEST_v1.0.md`

```md
# COSTITUZIONE RAG DI PAGINE VINCENTI
## PV RAG MANIFEST — Versione 1.0

Questo documento definisce il sistema epistemologico
che governa l’uso della conoscenza nelle app di Pagine Vincenti.

Il RAG non è una libreria.
È un sistema di vincoli cognitivi.

---

## 1. PRINCIPIO FONDANTE

Il RAG di Pagine Vincenti non serve a “sapere di più”.
Serve a **pensare meglio entro confini chiari**.

Ogni app:
- attiva solo la conoscenza necessaria
- esclude deliberatamente il resto

---

## 2. STRATI UFFICIALI DEL RAG PV

### RAG-0 — Fondamenta teoriche
- libri e guru selezionati
- estratti rilevanti
- mai opere complete
- mai citati come autorità assoluta

---

### RAG-1 — Rielaborazione Pagine Vincenti (STRATO DOMINANTE)

- modelli mentali proprietari
- sintesi operative
- contraddizioni risolte
- trade-off esplicitati
- adattamento al contesto reale

Questo strato è il **vero asset competitivo** di PV.

---

### RAG-2 — Contesto reale italiano

- casi italiani
- settori locali
- vincoli culturali
- errori tipici del mercato italiano

Serve a evitare:
“Questo funziona solo all’estero.”

---

### RAG-3 — Pattern emergenti dagli utenti

- bias ricorrenti
- errori frequenti
- linguaggio spontaneo
- schemi decisionali inconsci

Questo strato:
- non parla direttamente all’utente
- informa gli altri strati
- migliora il sistema nel tempo

---

## 3. RAG MANIFEST PER APP (OBBLIGATORIO)

Ogni app PV deve dichiarare:

- quali strati RAG sono attivi
- quali fonti sono permesse
- quali fonti sono escluse
- quale strato è dominante
- come vengono usati i dati utente

Formato minimo:

```json
{
  "app_id": "example_app",
  "rag_layers_enabled": ["RAG-0", "RAG-1", "RAG-2"],
  "rag_dominance": {
    "RAG-1": 0.6,
    "RAG-2": 0.3,
    "RAG-0": 0.1
  },
  "excluded_sources": [],
  "user_input_usage": "pattern_only"
}
