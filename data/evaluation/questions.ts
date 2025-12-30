export type QuestionType = "single" | "multi";

export interface QuestionOption {
  label: string;
}

export interface EvaluationQuestion {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options: QuestionOption[];
}

export const evaluationQuestions: EvaluationQuestion[] = [
  {
    id: "d1",
    title: "Domanda 1 — Fase attuale",
    description: "Come descriveresti il tuo punto attuale nel percorso di marketing/business?",
    type: "single",
    options: [
      { label: "Non ho ancora iniziato a fare marketing sistematico" },
      { label: "Ho letto alcuni concetti di marketing ma non li applico regolarmente" },
      { label: "Applico idee di marketing ma i risultati non soddisfano le mie aspettative" },
      { label: "Ho risultati buoni ma dipendono principalmente dalla mia presenza personale" },
    ],
  },
  {
    id: "d2",
    title: "Domanda 2 — Acquisizione di clienti",
    description: "In questo momento, come acquisisci i tuoi clienti? (cosa funziona?)",
    type: "single",
    options: [
      { label: "Principalmente dal passaparola e referenze" },
      { label: "Cerco attivamente clienti online (advertising, social, email) ma senza una strategia precisa" },
      { label: "Ho una fonte primaria di clienti (es. email list, SEO) ma voglio espanderla" },
      { label: "Ho multiple fonti controllate e so quale funziona meglio" },
    ],
  },
  {
    id: "d3",
    title: "Domanda 3 — Comprensione del valore",
    description: "Quando un nuovo cliente interagisce con te per la prima volta, cosa accade più spesso?",
    type: "single",
    options: [
      { label: "Non capisce cosa offro o perché è diverso da altri" },
      { label: "Capisce cosa offro ma non capisce il valore (pensa sia una commodity)" },
      { label: "Capisce il valore ma non lo percepisce come risolutivo per il suo problema" },
      { label: "Capisce subito il valore e il problema che risolvo" },
    ],
  },
  {
    id: "d4",
    title: "Domanda 4 — Conversione da potenziali clienti a cliente",
    description: "Dei potenziali clienti che contatti o che ti contattano, quanti effettivamente pagano?",
    type: "single",
    options: [
      { label: "Poco chiaro, non misuro questo" },
      { label: "Contatto molte persone ma pochi convertono (< 10%)" },
      { label: "Ho un'idea approssimativa (20-40% conversione)" },
      { label: "Conosco il numero esatto e lo miglioro regolarmente" },
    ],
  },
  {
    id: "d5",
    title: "Domanda 5 — Fedeltà e ritorno dei clienti",
    description: "I tuoi clienti tornano a fare acquisti/usare i tuoi servizi una seconda volta?",
    type: "single",
    options: [
      { label: "Raramente, è difficile farli tornare" },
      { label: "Alcuni tornano, ma principalmente dipende dall'incontro personale con me" },
      { label: "Una buona parte torna, ma ci sono cali importanti" },
      { label: "La maggior parte ritorna e consiglia ai suoi contatti" },
    ],
  },
  {
    id: "d6",
    title: "Domanda 6 — Comprensione dei processi interni",
    description:
      "Se dovessi spiegare il tuo processo di lavoro (da quando contatti un cliente a quando gli consegni il risultato), cosa accade?",
    type: "single",
    options: [
      { label: "È inconsistente, cambio metodo ogni volta" },
      { label: "Lo so, ma è tutto nella mia testa, non documentato" },
      { label: "Ho il processo definito ma non sempre lo seguo" },
      { label: "Ho processo chiaro, documentato, tutti lo seguono" },
    ],
  },
  {
    id: "d7",
    title: "Domanda 7 — Strumenti e canali attivi",
    description: "Quali di questi usi ATTIVAMENTE per contattare o mantenere relazione con clienti/prospect?",
    type: "multi",
    options: [
      { label: "Email (ho una lista e la uso regolarmente)" },
      { label: "Social media (posto contenuti o interagisco)" },
      { label: "Sito web / landing page (la gente la visita)" },
      { label: "Contenuti formativi (articoli, video, guide)" },
      { label: "Advertising (Google, Meta, LinkedIn)" },
      { label: "Nessuno di questi, mi affido al passaparola" },
    ],
  },
  {
    id: "d8",
    title: "Domanda 8 — Misurazione dei risultati",
    description: "Come misuri se le tue azioni di marketing stanno funzionando?",
    type: "single",
    options: [
      { label: "Guardo se arrivano clienti, non ho metriche precise" },
      { label: "Misuro traffico / visualizzazioni / like ma non il collegamento con le vendite" },
      { label: "Collego alcune azioni ai risultati (es: so che via email guadagno X al mese)" },
      { label: "Ho dashboard di metriche, so ROI di ogni canale" },
    ],
  },
  {
    id: "d9",
    title: "Domanda 9 — Principale difficoltà percepita",
    description:
      "Se dovessi dire una cosa che frena la tua crescita più di tutte le altre, quale sarebbe?",
    type: "single",
    options: [
      { label: "Non so come trovare nuovi clienti" },
      { label: "I clienti mi capiscono male, mi metto in cattiva luce" },
      { label: "Trovare i clienti è difficile, ma quando li trovo è un disastro gestirli" },
      { label: "Ho clienti, ma non riesco a scalare senza fare tutto io personalmente" },
    ],
  },
  {
    id: "d10",
    title: "Domanda 10 — Tempo dedicato a crescita/marketing",
    description: "Quante ore alla settimana dedichi attivamente a marketing/creazione sistemi?",
    type: "single",
    options: [
      { label: "< 5 ore" },
      { label: "5-10 ore" },
      { label: "10-20 ore" },
      { label: "20+ ore" },
    ],
  },
  {
    id: "d11",
    title: "Domanda 11 — Tipo di mercato",
    description: "Il tuo modello di business è principalmente:",
    type: "single",
    options: [
      { label: "B2C (vendo direttamente a consumatori finali)" },
      { label: "B2B (vendo a imprese o professionisti)" },
      { label: "Servizi professionali (consulenza, coaching, formazione)" },
      { label: "Prodotti / E-commerce" },
    ],
  },
  {
    id: "d12",
    title: "Domanda 12 — Settore principale",
    description: "In quale settore lavori principalmente?",
    type: "single",
    options: [
      { label: "Ristorazione / Ospitalità" },
      { label: "Beauty / Fitness / Wellness" },
      { label: "Servizi medici o paramedici" },
      { label: "Consulenza / Coaching / Formazione" },
      { label: "Vendita prodotti / Retail" },
      { label: "Agenzia di servizi (marketing, design, IT, etc.)" },
      { label: "Artigianato / Produzione" },
      { label: "Servizi alla persona" },
      { label: "Immobiliare" },
      { label: "Altro" },
    ],
  },
  {
    id: "d13",
    title: "Domanda 13 — Cosa vuoi migliorare SUBITO",
    description: "Se potessi risolvere UNA cosa nel tuo business nei prossimi 30 giorni, quale sarebbe?",
    type: "single",
    options: [
      { label: "Trovare più clienti" },
      { label: "Far sì che i clienti capiscano meglio quello che offro" },
      { label: "Convertire più persone che contatto" },
      { label: "Mantenere i clienti e farli tornare" },
      { label: "Automatizzare o delegare parte del mio lavoro" },
      { label: "Misurare meglio i risultati" },
    ],
  },
];
