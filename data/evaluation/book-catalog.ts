import { BookEntry } from "./scoring";

// Canonical catalog aligned to available MDX slugs and PV positioning
export const defaultBookCatalog: BookEntry[] = [
  {
    id: "positioning",
    title: "Positioning: The Battle for Your Mind",
    slug: "positioning-the-battle-for-your-mind",
    cover: "/covers/positioning-the-battle-for-your-mind.jpg",
    domains: ["acq", "conv"],
    interests: ["strat"],
    levels: ["Novice", "Practitioner", "Advanced"],
    priority: 1,
    reasonTemplate:
      "Per chiarire {domain} e comunicare meglio: questo libro definisce il posto che occupi nella mente del cliente.",
  },
  {
    id: "cialdini",
    title: "Le Armi della Persuasione",
    slug: "cialdini-le-armi-della-persuasione-sintesi",
    cover: "/covers/cialdini-le-armi-della-persuasione-sintesi.jpg",
    domains: ["conv", "exp"],
    interests: ["psy", "strat"],
    levels: ["Novice", "Practitioner", "Advanced"],
    priority: 1,
    reasonTemplate:
      "Se {domain} è il collo di bottiglia, servono leve psicologiche pulite: Cialdini ti aiuta a convertire e a far tornare i clienti.",
  },
  {
    id: "22-laws",
    title: "Le 22 Leggi del Marketing",
    slug: "le-22-leggi-del-marketing",
    cover: "/covers/le-22-leggi-del-marketing.jpg",
    domains: ["acq", "sist"],
    interests: ["strat"],
    levels: ["Novice", "Practitioner"],
    priority: 2,
    reasonTemplate:
      "Fondamentali per chi ha punteggi bassi in {domain}: regole chiare per evitare errori strategici e costruire coerenza.",
  },
  {
    id: "experience-systems",
    title: "Customer Experience & Systems",
    domains: ["exp", "sist"],
    interests: ["psy", "sist"],
    levels: ["Practitioner", "Advanced"],
    priority: 2,
    reasonTemplate:
      "Il tuo asse forte è {domain}: questo titolo ti guida a standardizzare l'esperienza e ridurre errori di team.",
  },
  {
    id: "conversion-optimization",
    title: "Conversion Optimization",
    domains: ["conv"],
    interests: ["dati", "strat"],
    levels: ["Practitioner", "Advanced"],
    priority: 2,
    reasonTemplate:
      "Se l'obiettivo è conversione, qui trovi processo + misurazione per trasformare traffico in clienti con approccio {interest}.",
  },
  {
    id: "scaling-leadership",
    title: "Scaling & Leadership",
    domains: ["sist"],
    interests: ["sist", "strat"],
    levels: ["Advanced", "Practitioner"],
    priority: 3,
    reasonTemplate:
      "Hai punteggi alti ma dipendi da te: questo libro ti sposta su sistemi e delega per scalare {domain}.",
  },
  {
    id: "offer-clarity",
    title: "Product/Offer Clarity",
    domains: ["acq", "conv"],
    interests: ["strat", "psy"],
    levels: ["Novice", "Practitioner"],
    priority: 2,
    reasonTemplate:
      "Se il valore non è percepito, lavora su messaggio e offerta. Questo aiuta su {domain} con focus {interest}.",
  },
  {
    id: "marketing-fundamentals",
    title: "Marketing Fundamentals",
    domains: ["acq", "conv"],
    interests: ["strat"],
    levels: ["Novice"],
    priority: 1,
    reasonTemplate:
      "Base solida per chi è all'inizio: chiarisce i concetti fondamentali e collega {domain} con esempi pratici.",
  },
  {
    id: "growth-loops",
    title: "Growth Loops",
    domains: ["acq", "sist"],
    interests: ["dati", "strat"],
    levels: ["Practitioner", "Advanced"],
    priority: 3,
    reasonTemplate:
      "Se vuoi scalare acquisizione con processi ripetibili, questo titolo combina {domain} e disciplina {interest}.",
  },
  {
    id: "team-operations",
    title: "Team Operations & QA",
    domains: ["sist", "exp"],
    interests: ["sist"],
    levels: ["Practitioner", "Advanced"],
    priority: 3,
    reasonTemplate:
      "Quando il team è il collo di bottiglia, serve standardizzare: focus su {domain} con un approccio di sistema.",
  },
];
