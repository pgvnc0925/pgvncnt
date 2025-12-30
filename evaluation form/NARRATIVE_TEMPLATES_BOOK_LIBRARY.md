# Pagine Vincenti — Narrative Templates & Book Library
## Versione: 1.0

---

## PARTE 1: NARRATIVE TEMPLATES

### Struttura Template

```typescript
interface NarrativeTemplate {
  cluster: string; // es: "Novice_acquisizione"
  situation: string; // Descrizione della situazione attuale (2-3 righe)
  need: string; // Cosa serve migliorare
  intro: string; // Intro ai libri consigliati
}
```

---

### NOVICE CLUSTER

#### Novice_Acquisizione
```
situation: "Sei all'inizio e non sai come trovare clienti in modo sistematico. 
           Al momento dipendi principalmente dal passaparola o non hai una fonte 
           controllata di nuovi clienti."

need: "Capire il sistema di acquisizione che usano i professionisti migliori 
       per non dipendere più dal caso."

intro: "Ecco i libri che insegnano come attrarre il cliente giusto, 
        comunque e in modo ripetibile, basato su principi testati."
```

#### Novice_Conversione
```
situation: "Contatti persone o loro ti contattano, ma pochi si trasformano in clienti paganti. 
           Non è chiaro cosa blocchi la decisione di acquisto."

need: "Capire come comunichi il valore e come si forma la decisione di comprare."

intro: "Ecco i libri che svelano i veri meccanismi psicologici dietro la vendita 
       (spoiler: non è quello che pensi)."
```

#### Novice_Esperienza
```
situation: "I clienti arrivano, ma non tornano. O tornano solo se fai tu il lavoro, 
           non hanno un'esperienza coerente con quello che prometti."

need: "Progettare l'esperienza cliente e i processi che la garantiscono."

intro: "Ecco i libri che ti insegnano come far sentire il cliente valorizzato 
       in ogni momento, non solo alla vendita."
```

#### Novice_Sistemi
```
situation: "Tutto quello che fai è nella tua testa. Se non sei tu, non accade. 
           Quando lavori, è caotico e inconsistente."

need: "Costruire processi documentati che funzionano senza di te."

intro: "Ecco i libri che insegnano come sistematizzare: processi chiari, 
       documentazione, ripetibilità."
```

---

### PRACTITIONER CLUSTER

#### Practitioner_Acquisizione
```
situation: "Hai già fonti di clienti (email, social, advertising), 
           ma vorresti espanderle o renderle più efficienti. 
           Il ROI non è ancora ottimo."

need: "Ottimizzare le tue fonti di acquisizione e testare nuovi canali."

intro: "Ecco i libri che ti insegnano come testare, misurare e scalare 
       le tue strategie di acquisizione basandoti su dati reali."
```

#### Practitioner_Conversione
```
situation: "Attiri traffico (tramite advertising, social, email), 
           ma la conversione è bassa. Sai che il problema è tra 'contatto' e 'vendita'."

need: "Fissare il collo di bottiglia della conversione."

intro: "Ecco i libri che spiegano come trasformare più persone in clienti 
       paganti, attraverso il messaggio giusto e l'offerta giusta."
```

#### Practitioner_Esperienza
```
situation: "I clienti comprano, ma non tornano. O tornano una volta. 
           La fedeltà non è automatica e dipende molto dal tuo intervento personale."

need: "Creare un'esperienza cliente sistematica che genera ritorno e referenze."

intro: "Ecco i libri che insegnano come costruire fedeltà vera, 
       dove il cliente ritorna e consiglia senza che tu debba chiedere."
```

#### Practitioner_Sistemi
```
situation: "Hai risultati, ma tutto dipende da te. Se aggiungi un cliente, 
           crolla tutto. Vuoi scalare senza diventare il collo di bottiglia."

need: "Sistematizzare processi, delegare, costruire un team allineato."

intro: "Ecco i libri che insegnano come costruire sistemi che generano risultati 
       senza la tua presenza costante."
```

---

### ADVANCED CLUSTER

#### Advanced_Acquisizione
```
situation: "Hai multiple canali di acquisizione ben rodati e conosci il ROI di ognuno. 
           Vuoi espandere o ottimizzare ulteriormente."

need: "Strategia di acquisizione multi-channel e scalabilità."

intro: "Ecco i libri che svelano come costruire un funnel di acquisizione resiliente, 
       diversificato e scalabile senza perdere il controllo."
```

#### Advanced_Conversione
```
situation: "Conosci il tuo funnel e sa già quali step convertono meglio. 
           Vuoi ottimizzare i micro-dettagli o espandere a nuovi mercati."

need: "Ottimizzazione avanzata della conversione e test A/B sistematico."

intro: "Ecco i libri che insegnano come il sondaggio di dettagli minuscoli 
       influisce in modo drammatico sulla conversione complessiva."
```

#### Advanced_Esperienza
```
situation: "I clienti tornano e consigliano. Ora vuoi renderlo sistematico 
           e aggiungere nuovi layer di fedeltà."

need: "Creare ecosystem di fedeltà avanzati, community, membership."

intro: "Ecco i libri che trasformano clienti normali in ambassador del brand, 
       attraverso esperienze progettate."
```

#### Advanced_Sistemi
```
situation: "Hai team, processi, sistemi. Funzionano bene. Ora vuoi scalare 
           in modo sostenibile senza perdere qualità."

need: "Leadership, cultura, sistemi per la crescita rapida e sostenuta."

intro: "Ecco i libri che insegnano come gestire la complessità quando cresci 
       10x o 100x senza perdere quello che funziona."
```

---

## PARTE 2: BOOK LIBRARY

### Struttura

```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  slug: string;
  
  // Metadati per recommendation
  clusters: string[]; // ["Novice_acquisizione", "Practitioner_acquisizione"]
  priority: number; // 1 (massima) a 5
  domains: string[]; // ["acquisizione", "conversione"]
  interests: string[]; // ["strategia", "psicologia"]
  levels: string[]; // ["Novice", "Practitioner", "Advanced"]
  
  // Reason templates per cluster
  reasonByCluster: {
    [cluster: string]: string;
  }
}
```

---

### BOOKS CANONICAL

#### BOOK 1: OGILVY
```json
{
  "id": "ogilvy-advising",
  "title": "Ogilvy on Advertising",
  "author": "David Ogilvy",
  "year": 1983,
  "slug": "ogilvy-on-advertising",
  
  "clusters": [
    "Novice_acquisizione",
    "Practitioner_acquisizione",
    "Practitioner_conversione"
  ],
  "priority": 1,
  "domains": ["acquisizione", "conversione"],
  "interests": ["strategia", "psicologia"],
  "levels": ["Novice", "Practitioner"],
  
  "reasonByCluster": {
    "Novice_acquisizione": 
      "Insegna il sistema per attrarre clienti con messaggi chiari e coerenti. 
       Non riguarda i 'trucchi', ma il criterio di ragionamento: come scrive chi sa veramente.",
    
    "Practitioner_acquisizione": 
      "Approfondisce come testare i tuoi messaggi e capire quale attira veramente il cliente giusto. 
       Ogni principio è basato su decenni di esperienza di publicità che ha funzionato.",
    
    "Practitioner_conversione": 
      "Spiega come il messaggio giusto converte anche quello che sembrerebbe impossibile. 
       Non è manipolazione, è chiarezza."
  }
}
```

#### BOOK 2: CIALDINI
```json
{
  "id": "cialdini-influence",
  "title": "Influence: The Psychology of Persuasion",
  "author": "Robert Cialdini",
  "year": 1984,
  "slug": "influence-psychology-persuasion",
  
  "clusters": [
    "Novice_conversione",
    "Practitioner_conversione",
    "Practitioner_esperienza",
    "Advanced_conversione"
  ],
  "priority": 1,
  "domains": ["conversione", "esperienza"],
  "interests": ["psicologia", "strategia"],
  "levels": ["Novice", "Practitioner", "Advanced"],
  
  "reasonByCluster": {
    "Novice_conversione": 
      "Svela i principi psicologici che fanno decidere una persona di comprare. 
       Capendoli, capirai perché la gente dice no, anche se il valore è chiaro.",
    
    "Practitioner_conversione": 
      "Approfondisce come applicare questi principi al tuo sales process 
       senza manipolare. È etica + efficacia.",
    
    "Practitioner_esperienza": 
      "Mostra come costruire fiducia e credibilità nel tempo, 
       in modo che il cliente torni e consigli.",
    
    "Advanced_conversione": 
      "Insegna come orchestrare questi principi in sequenza per massimizzare 
       conversione in mercati sofisticati."
  }
}
```

#### BOOK 3: SHARP
```json
{
  "id": "sharp-brand-building",
  "title": "How Brands Grow",
  "author": "Byron Sharp",
  "year": 2010,
  "slug": "how-brands-grow",
  
  "clusters": [
    "Practitioner_acquisizione",
    "Practitioner_esperienza",
    "Advanced_acquisizione",
    "Advanced_esperienza"
  ],
  "priority": 1,
  "domains": ["acquisizione", "esperienza"],
  "interests": ["strategia", "dati"],
  "levels": ["Practitioner", "Advanced"],
  
  "reasonByCluster": {
    "Practitioner_acquisizione": 
      "Capovolge molte verità di marketing che dai per scontate. 
       Basato su dati da centinaia di brand, insegna come crescere davvero.",
    
    "Practitioner_esperienza": 
      "Spiega perché la fedeltà non è quello che pensi. 
       Come costruirla basandoti su abitudineedditità, non su emotività.",
    
    "Advanced_acquisizione": 
      "Fornisce il framework per dominare la tua categoria senza necessarily avere 
       il miglior prodotto o il budget più alto.",
    
    "Advanced_esperienza": 
      "Mostra come creare brand preference durevole e acquisizione sostenuta nel tempo."
  }
}
```

#### BOOK 4: RIES & TROUT
```json
{
  "id": "ries-trout-positioning",
  "title": "Positioning: The Battle for Your Mind",
  "author": "Al Ries & Jack Trout",
  "year": 1981,
  "slug": "positioning-battle-mind",
  
  "clusters": [
    "Novice_acquisizione",
    "Novice_conversione",
    "Practitioner_acquisizione",
    "Practitioner_conversione"
  ],
  "priority": 1,
  "domains": ["acquisizione", "conversione"],
  "interests": ["strategia", "psicologia"],
  "levels": ["Novice", "Practitioner"],
  
  "reasonByCluster": {
    "Novice_acquisizione": 
      "Insegna come posizionarti nella mente del cliente, 
       in modo che lui ti cerchi per primo. Non è sulla distribuzione, è sulla percezione.",
    
    "Novice_conversione": 
      "Spiega perché il 'migliore' non vince. Vince chi occupa il primo posto nella mente. 
       Questo cambia tutto il modo in cui pensi al marketing.",
    
    "Practitioner_acquisizione": 
      "Approfondisce come testare il tuo posizionamento e capire se è difendibile. 
       Molti hanno un positioning fantasma.",
    
    "Practitioner_conversione": 
      "Mostra come il positioning giusto rende la conversione 10x più facile, 
       perché non combatti contro la percezione consolidata."
  }
}
```

#### BOOK 5: GERBER (The E-Myth)
```json
{
  "id": "gerber-emyth",
  "title": "The E-Myth Revisited",
  "author": "Michael Gerber",
  "year": 1995,
  "slug": "e-myth-revisited",
  
  "clusters": [
    "Novice_sistemi",
    "Practitioner_sistemi",
    "Advanced_sistemi"
  ],
  "priority": 1,
  "domains": ["sistemi"],
  "interests": ["sistemi", "strategia"],
  "levels": ["Novice", "Practitioner", "Advanced"],
  
  "reasonByCluster": {
    "Novice_sistemi": 
      "Insegna il principio fondamentale: un business che funziona solo se c'è tu 
       non è un business, è un lavoro. Questo libro ti mostra come sfuggire a questa trappola.",
    
    "Practitioner_sistemi": 
      "Approfondisce come documentare, standardizzare e testare i tuoi processi. 
       Come costruire un sistema che ti permette di delegare.",
    
    "Advanced_sistemi": 
      "Mostra come scalare senza perdere il controllo qualitativo. 
       Come i sistemi permettono crescita sostenuta."
  }
}
```

#### BOOK 6: SUGARMAN (Triggers)
```json
{
  "id": "sugarman-triggers",
  "title": "Triggers: 30 Sales Tools You Can Use to Control the Mind of Your Prospect",
  "author": "Joseph Sugarman",
  "year": 1999,
  "slug": "triggers-joseph-sugarman",
  
  "clusters": [
    "Novice_conversione",
    "Practitioner_conversione",
    "Advanced_conversione"
  ],
  "priority": 2,
  "domains": ["conversione"],
  "interests": ["psicologia", "strategia"],
  "levels": ["Novice", "Practitioner", "Advanced"],
  
  "reasonByCluster": {
    "Novice_conversione": 
      "Insegna i micro-meccanismi psicologici che scatenano la decisione di comprare. 
       Pratico e applicabile subito.",
    
    "Practitioner_conversione": 
      "Approfondisce come combinare i trigger per massimizzare conversione 
       senza scrivere copy manipolativo.",
    
    "Advanced_conversione": 
      "Mostra come orchestrare i trigger in sequenza per dominare 
       categorie competitive."
  }
}
```

#### BOOK 7: KOTLER (Marketing Management)
```json
{
  "id": "kotler-marketing-management",
  "title": "Marketing Management",
  "author": "Philip Kotler",
  "year": 1967,
  "slug": "marketing-management-kotler",
  
  "clusters": [
    "Practitioner_acquisizione",
    "Advanced_acquisizione",
    "Advanced_conversione"
  ],
  "priority": 2,
  "domains": ["acquisizione", "conversione"],
  "interests": ["strategia", "dati"],
  "levels": ["Practitioner", "Advanced"],
  
  "reasonByCluster": {
    "Practitioner_acquisizione": 
      "Fornisce il framework strutturale per pensare al marketing 
       come sistema, non come tattica.",
    
    "Advanced_acquisizione": 
      "Insegna come segmentare, targetizzare e posizionare 
       in modo sistematico.",
    
    "Advanced_conversione": 
      "Mostra come il marketing strategico influisce su tutta la value chain, 
       dalla produzione alla vendita."
  }
}
```

#### BOOK 8: DUNFORD (3x Thinking)
```json
{
  "id": "dunford-3x-thinking",
  "title": "3X Thinking: Redefining Your Business Model for Growth",
  "author": "Beth Comstock & Dunford",
  "year": 2018,
  "slug": "3x-thinking",
  
  "clusters": [
    "Advanced_sistemi",
    "Advanced_acquisizione",
    "Advanced_esperienza"
  ],
  "priority": 2,
  "domains": ["sistemi", "acquisizione", "esperienza"],
  "interests": ["strategia", "sistemi"],
  "levels": ["Advanced"],
  
  "reasonByCluster": {
    "Advanced_sistemi": 
      "Insegna come ripensare il tuo modello di business quando scala. 
       Come evitare la trappola di 'più dello stesso'.",
    
    "Advanced_acquisizione": 
      "Mostra come trovare nuovi canali e modelli di acquisizione 
       quando quelli attuali raggiungono il plateau.",
    
    "Advanced_esperienza": 
      "Approfondisce come evolvere l'esperienza cliente 
       quando il mercato cambia."
  }
}
```

---

### AGGIUNTA FUTURA (Database JSON pronto)

```json
{
  "books": [
    {
      "id": "ogilvy-advising",
      "title": "Ogilvy on Advertising",
      ...
    },
    {
      "id": "cialdini-influence",
      "title": "Influence: The Psychology of Persuasion",
      ...
    }
    // Altre 6-8 ancora da definire
  ]
}
```

---

## PARTE 3: IMPLEMENTAZIONE

### Come usare questi template

#### Nel Frontend (React)
```typescript
import { narratives } from './narratives';
import { books } from './books';

function ShowResults(scoreResult) {
  const narrativeKey = `${scoreResult.maturity}_${scoreResult.primaryDomain}`;
  const narrative = narratives[narrativeKey];
  
  const candidateBooks = books
    .filter(b => b.clusters.includes(narrativeKey))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
  
  return (
    <div>
      <h2>Ecco quello che abbiamo visto:</h2>
      <p>{narrative.situation}</p>
      <p>Quello che ti serve: {narrative.need}</p>
      <p>{narrative.intro}</p>
      
      {candidateBooks.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>Perché: {book.reasonByCluster[narrativeKey]}</p>
          <a href={`/pagina-libro/${book.slug}`}>Leggi la pagina</a>
        </div>
      ))}
    </div>
  );
}
```

#### Nel Backend (Node.js)
```typescript
const narrativeMap = {
  "Novice_acquisizione": {...},
  "Novice_conversione": {...},
  // ... tutti i template
};

const bookLibrary = [
  {
    id: "ogilvy-advising",
    title: "Ogilvy on Advertising",
    // ... altri campi
  },
  // ... altri libri
];

function getRecommendations(scoreResult) {
  const narrative = narrativeMap[`${scoreResult.maturity}_${scoreResult.primaryDomain}`];
  
  const recommendations = bookLibrary
    .filter(b => b.clusters.includes(`${scoreResult.maturity}_${scoreResult.primaryDomain}`))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      reason: b.reasonByCluster[`${scoreResult.maturity}_${scoreResult.primaryDomain}`]
    }));
  
  return {
    narrative,
    recommendedBooks: recommendations
  };
}
```

---

**Tutto pronto per il dev!**
