export type DomainKey = "acq" | "conv" | "exp" | "sist";
export type InterestKey = "strat" | "sist" | "psy" | "dati";

export interface ScoreVector {
  liv: number;
  dom: Record<DomainKey, number>;
  int: Record<InterestKey, number>;
}

const domZero = { acq: 0, conv: 0, exp: 0, sist: 0 };
const intZero = { strat: 0, sist: 0, psy: 0, dati: 0 };

const v = (liv: number, dom: Partial<ScoreVector["dom"]>, int: Partial<ScoreVector["int"]>): ScoreVector => ({
  liv,
  dom: { ...domZero, ...dom },
  int: { ...intZero, ...int },
});

// Single choice question score maps (by option index)
export const questionScores: Record<string, ScoreVector[]> = {
  // d1 — Fase attuale
  d1: [
    v(1, { acq: 2, conv: 1, exp: 1, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 1 }),
    v(2, { acq: 2, conv: 2, exp: 1, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 1 }),
    v(2, { acq: 2, conv: 3, exp: 2, sist: 2 }, { strat: 2, sist: 2, psy: 2, dati: 1 }),
    v(3, { acq: 2, conv: 3, exp: 3, sist: 3 }, { strat: 3, sist: 3, psy: 2, dati: 2 }),
  ],

  // d2 — Acquisizione di clienti
  d2: [
    v(1, { acq: 4, conv: 1, exp: 2, sist: 1 }, { strat: 3, sist: 1, psy: 2, dati: 1 }),
    v(2, { acq: 3, conv: 2, exp: 1, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 1 }),
    v(3, { acq: 2, conv: 2, exp: 1, sist: 2 }, { strat: 3, sist: 1, psy: 1, dati: 2 }),
    v(4, { acq: 1, conv: 1, exp: 1, sist: 2 }, { strat: 3, sist: 2, psy: 1, dati: 3 }),
  ],

  // d3 — Comprensione del valore
  d3: [
    v(1, { acq: 1, conv: 4, exp: 3, sist: 1 }, { strat: 2, sist: 1, psy: 4, dati: 1 }),
    v(2, { acq: 1, conv: 4, exp: 2, sist: 1 }, { strat: 2, sist: 1, psy: 3, dati: 1 }),
    v(2, { acq: 1, conv: 3, exp: 3, sist: 1 }, { strat: 2, sist: 1, psy: 3, dati: 1 }),
    v(4, { acq: 1, conv: 1, exp: 1, sist: 1 }, { strat: 3, sist: 1, psy: 1, dati: 1 }),
  ],

  // d4 — Conversione da potenziali clienti a cliente
  d4: [
    v(1, { acq: 1, conv: 4, exp: 1, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 4 }),
    v(2, { acq: 2, conv: 4, exp: 1, sist: 1 }, { strat: 2, sist: 1, psy: 2, dati: 2 }),
    v(3, { acq: 1, conv: 3, exp: 2, sist: 2 }, { strat: 2, sist: 1, psy: 1, dati: 2 }),
    v(4, { acq: 1, conv: 1, exp: 1, sist: 2 }, { strat: 3, sist: 2, psy: 1, dati: 1 }),
  ],

  // d5 — Fedeltà e ritorno dei clienti
  d5: [
    v(1, { acq: 1, conv: 1, exp: 4, sist: 2 }, { strat: 1, sist: 2, psy: 4, dati: 1 }),
    v(2, { acq: 1, conv: 1, exp: 4, sist: 1 }, { strat: 1, sist: 1, psy: 3, dati: 1 }),
    v(3, { acq: 1, conv: 1, exp: 3, sist: 2 }, { strat: 1, sist: 1, psy: 2, dati: 1 }),
    v(4, { acq: 2, conv: 2, exp: 1, sist: 2 }, { strat: 2, sist: 2, psy: 1, dati: 1 }),
  ],

  // d6 — Comprensione dei processi interni
  d6: [
    v(1, { acq: 1, conv: 2, exp: 2, sist: 4 }, { strat: 1, sist: 4, psy: 1, dati: 2 }),
    v(2, { acq: 1, conv: 2, exp: 2, sist: 4 }, { strat: 1, sist: 3, psy: 1, dati: 1 }),
    v(2, { acq: 1, conv: 2, exp: 2, sist: 3 }, { strat: 2, sist: 2, psy: 1, dati: 1 }),
    v(4, { acq: 1, conv: 1, exp: 2, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 1 }),
  ],

  // d8 — Misurazione dei risultati
  d8: [
    v(1, { acq: 1, conv: 1, exp: 1, sist: 1 }, { strat: 1, sist: 1, psy: 1, dati: 4 }),
    v(2, { acq: 1, conv: 2, exp: 1, sist: 1 }, { strat: 1, sist: 1, psy: 1, dati: 3 }),
    v(3, { acq: 1, conv: 2, exp: 1, sist: 2 }, { strat: 2, sist: 1, psy: 1, dati: 2 }),
    v(4, { acq: 1, conv: 1, exp: 1, sist: 2 }, { strat: 2, sist: 2, psy: 1, dati: 1 }),
  ],

  // d9 — Principale difficoltà percepita
  d9: [
    v(1, { acq: 4, conv: 2, exp: 1, sist: 1 }, { strat: 3, sist: 1, psy: 1, dati: 1 }),
    v(2, { acq: 1, conv: 4, exp: 3, sist: 1 }, { strat: 2, sist: 1, psy: 4, dati: 1 }),
    v(2, { acq: 2, conv: 2, exp: 4, sist: 3 }, { strat: 2, sist: 2, psy: 3, dati: 1 }),
    v(3, { acq: 1, conv: 1, exp: 1, sist: 4 }, { strat: 2, sist: 4, psy: 1, dati: 2 }),
  ],

  // d10 — Tempo dedicato a crescita/marketing
  d10: [
    v(1, { acq: 1, conv: 1, exp: 1, sist: 1 }, { strat: 1, sist: 1, psy: 1, dati: 1 }),
    v(2, { acq: 2, conv: 2, exp: 2, sist: 2 }, { strat: 2, sist: 2, psy: 2, dati: 2 }),
    v(3, { acq: 3, conv: 3, exp: 3, sist: 3 }, { strat: 3, sist: 3, psy: 3, dati: 3 }),
    v(4, { acq: 4, conv: 4, exp: 4, sist: 4 }, { strat: 4, sist: 4, psy: 4, dati: 4 }),
  ],

  // d11 — Tipo di mercato
  d11: [
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
  ],

  // d12 — Settore principale
  d12: [
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
    v(2, domZero, intZero),
  ],

  // d13 — Cosa vuoi migliorare SUBITO
  d13: [
    v(2, { acq: 4, conv: 1, exp: 0, sist: 0 }, { strat: 3, sist: 0, psy: 1, dati: 1 }),
    v(2, { acq: 1, conv: 4, exp: 2, sist: 0 }, { strat: 2, sist: 0, psy: 3, dati: 0 }),
    v(2, { acq: 1, conv: 4, exp: 1, sist: 1 }, { strat: 2, sist: 0, psy: 2, dati: 2 }),
    v(2, { acq: 0, conv: 1, exp: 4, sist: 1 }, { strat: 1, sist: 1, psy: 2, dati: 1 }),
    v(2, { acq: 0, conv: 1, exp: 1, sist: 4 }, { strat: 1, sist: 3, psy: 0, dati: 1 }),
    v(2, { acq: 1, conv: 1, exp: 1, sist: 2 }, { strat: 1, sist: 1, psy: 1, dati: 4 }),
  ],
};

// Multi-response score maps (each selected option contributes)
export const multiScores: Record<string, ScoreVector[]> = {
  // d7 — Strumenti e canali attivi
  d7: [
    v(2, { acq: 1, conv: 2, exp: 2, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 2 }), // Email
    v(2, { acq: 3, conv: 1, exp: 1, sist: 1 }, { strat: 1, sist: 1, psy: 1, dati: 1 }), // Social media
    v(2, { acq: 2, conv: 2, exp: 1, sist: 1 }, { strat: 1, sist: 1, psy: 1, dati: 1 }), // Sito / landing
    v(2, { acq: 2, conv: 1, exp: 1, sist: 1 }, { strat: 3, sist: 1, psy: 2, dati: 1 }), // Contenuti formativi
    v(2, { acq: 4, conv: 2, exp: 0, sist: 1 }, { strat: 2, sist: 1, psy: 1, dati: 2 }), // Advertising
    v(0, domZero, intZero), // Nessuno
  ],
};

export interface DefinitionMatrix {
  single: Record<string, ScoreVector[]>;
  multi: Record<string, ScoreVector[]>;
}

export const defaultDefinitionMatrix: DefinitionMatrix = {
  single: questionScores,
  multi: multiScores,
};

export interface ScoreTotals {
  liv: number;
  dom: Record<DomainKey, number>;
  int: Record<InterestKey, number>;
  maturity: "Novice" | "Practitioner" | "Advanced";
  primaryDomain: DomainKey;
  secondaryDomain?: DomainKey;
  primaryInterest: InterestKey;
}

export const domainLabels: Record<DomainKey, string> = {
  acq: "Acquisizione",
  conv: "Conversione",
  exp: "Esperienza",
  sist: "Sistemi",
};

export const interestLabels: Record<InterestKey, string> = {
  strat: "Strategia",
  sist: "Sistemi",
  psy: "Psicologia",
  dati: "Dati",
};

const sumVector = (a: ScoreTotals, b: ScoreVector): ScoreTotals => {
  return {
    liv: a.liv + b.liv,
    dom: {
      acq: a.dom.acq + b.dom.acq,
      conv: a.dom.conv + b.dom.conv,
      exp: a.dom.exp + b.dom.exp,
      sist: a.dom.sist + b.dom.sist,
    },
    int: {
      strat: a.int.strat + b.int.strat,
      sist: a.int.sist + b.int.sist,
      psy: a.int.psy + b.int.psy,
      dati: a.int.dati + b.int.dati,
    },
    maturity: a.maturity,
    primaryDomain: a.primaryDomain,
    secondaryDomain: a.secondaryDomain,
    primaryInterest: a.primaryInterest,
  };
};

const baseTotals = (): ScoreTotals => ({
  liv: 0,
  dom: { ...domZero },
  int: { ...intZero },
  maturity: "Novice",
  primaryDomain: "acq",
  primaryInterest: "strat",
});

const inferMaturity = (score: number): ScoreTotals["maturity"] => {
  if (score <= 15) return "Novice";
  if (score <= 35) return "Practitioner";
  return "Advanced";
};

const pickPrimary = <T extends string>(bucket: Record<T, number>): { primary: T; secondary?: T } => {
  const entries = Object.entries(bucket) as [T, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const [first, second] = entries;
  if (second && first[1] - second[1] <= 3) {
    return { primary: first[0], secondary: second[0] };
  }
  return { primary: first[0] };
};

// computeScores: given answer map, return totals and primary/secondary
export function computeScores(answers: Record<string, number | number[]>): ScoreTotals {
  return calculateScores(answers, defaultDefinitionMatrix);
}

// calculateScores: explicit definition matrix for testability and custom overrides
export function calculateScores(
  answers: Record<string, number | number[]>,
  matrix: DefinitionMatrix
): ScoreTotals {
  let total = baseTotals();

  Object.entries(answers).forEach(([qid, raw]) => {
    const singleList = matrix.single[qid];
    const multiList = matrix.multi[qid];

    if (singleList && typeof raw === "number") {
      const vec = singleList[raw];
      if (vec) total = sumVector(total, vec);
    } else if (multiList && Array.isArray(raw)) {
      raw.forEach((idx) => {
        const vec = multiList[idx];
        if (vec) total = sumVector(total, vec);
      });
    }
  });

  const maturity = inferMaturity(total.liv);
  const { primary: primaryDomain, secondary: secondaryDomain } = pickPrimary(total.dom);
  const { primary: primaryInterest } = pickPrimary(total.int);

  return { ...total, maturity, primaryDomain, secondaryDomain, primaryInterest };
}

// Recommended book selection – rule-based using domains/interests + maturity
export interface BookEntry {
  id: string;
  title: string;
  slug?: string;
  cover?: string;
  domains: DomainKey[];
  interests: InterestKey[];
  levels: Array<ScoreTotals["maturity"]>;
  priority: number; // 1 = highest
  reasonTemplate?: string;
}

export interface RecommendedBook {
  id: string;
  title: string;
  slug?: string;
  cover?: string;
  reason: string;
}

const formatReason = (
  template: string | undefined,
  score: ScoreTotals
): string => {
  const domainLabel = domainLabels[score.primaryDomain];
  const interestLabel = interestLabels[score.primaryInterest];
  if (!template) {
    return `Per rafforzare ${domainLabel.toLowerCase()} con un approccio orientato a ${interestLabel.toLowerCase()}.`;
  }
  return template
    .replace(/{domain}/gi, domainLabel.toLowerCase())
    .replace(/{interest}/gi, interestLabel.toLowerCase())
    .replace(/{maturity}/gi, score.maturity.toLowerCase());
};

const clusterReasons: Record<string, string> = {
  "Novice_acq": "Stai costruendo le fondamenta: parti da messaggi chiari e posizionamento per acquisire clienti con metodo.",
  "Novice_conv": "Serve struttura di conversione: lavora su valore percepito e leve psicologiche essenziali.",
  "Novice_exp": "Consolidare esperienza e retention: crea basi per far tornare i clienti e generare passaparola.",
  "Novice_sist": "Metti in ordine i processi di base: documenta e rendi replicabile ogni passaggio.",
  "Practitioner_acq": "Hai trazione iniziale: punta su sistemi di acquisizione e test disciplinati.",
  "Practitioner_conv": "Hai traffico ma vuoi più risultati: ottimizza copy, offerte e misurazione.",
  "Practitioner_exp": "Rendi l'esperienza consistente: standardizza onboarding, delivery e follow-up.",
  "Practitioner_sist": "Riduci dipendenza dalla tua presenza: sistemi e delega per scalare.",
  "Advanced_acq": "Punta a scalare l'acquisizione con loop e processi ripetibili.",
  "Advanced_conv": "Ottimizza conversioni con dati e sperimentazione continua.",
  "Advanced_exp": "Diffondi cultura CX: ogni touchpoint deve rinforzare fiducia e retention.",
  "Advanced_sist": "Costruisci un'azienda che funziona senza di te: processi, QA e leadership.",
};

export function getRecommendedBooks(
  score: ScoreTotals,
  catalog: BookEntry[]
): RecommendedBook[] {
  const candidates = catalog
    .filter((b) => b.levels.includes(score.maturity))
    .map((b) => {
      const domainHit = b.domains.includes(score.primaryDomain)
        ? 2
        : score.secondaryDomain && b.domains.includes(score.secondaryDomain)
        ? 1
        : 0;
      const interestHit = b.interests.includes(score.primaryInterest) ? 1 : 0;
      const tieBoost = score.secondaryDomain && b.domains.includes(score.secondaryDomain) ? 0.5 : 0;
      const scoreValue = (5 - b.priority) * 0.5 + domainHit * 2 + interestHit + tieBoost;
      return { book: b, scoreValue };
    })
    .sort((a, b) => b.scoreValue - a.scoreValue);

  const top = candidates.slice(0, 5).map(({ book }) => {
    const clusterKey = `${score.maturity}_${score.primaryDomain}`;
    const clusterReason = clusterReasons[clusterKey];
    const reason = clusterReason
      ? `${clusterReason} ${formatReason(book.reasonTemplate, score)}`
      : formatReason(book.reasonTemplate, score);
    return {
      id: book.id,
      title: book.title,
      slug: book.slug,
      cover: book.cover,
      reason,
    };
  });

  return top.slice(0, Math.max(3, Math.min(5, top.length)));
}
