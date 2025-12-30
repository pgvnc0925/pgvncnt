// apps/core-app-v1/landing.ts

import type { LandingData } from '@/apps/index';

const landing: LandingData = {
  metaTitle: 'Core-App: Diagnosi Strategica | Pagine Vincenti',
  metaDescription: 'Scopri il vero problema del tuo business in 15 minuti. Assessment completo su 4 sistemi: valore, acquisizione, conversione, relazione.',

  headline: 'Conosci il Vero Problema del Tuo Business',
  subheadline: 'Non è traffico. Non è conversione. In 15 minuti scopri dove perdi energia davvero.',

  sections: {
    whoIsFor: {
      title: 'Per chi è',
      items: [
        'PMI italiane senza reparto marketing strutturato',
        'Imprenditori stanchi di tentativi a vuoto',
        'Freelancer e consulenti che vogliono chiarezza strategica',
        'Chi cerca decisioni basate su principi solidi, non su mode',
      ],
    },

    basedOnBooks: {
      title: 'Basato su',
      books: [
        { title: 'The 22 Immutable Laws of Marketing', author: 'Al Ries & Jack Trout' },
        { title: 'How Brands Grow', author: 'Byron Sharp' },
        { title: 'The E-Myth Revisited', author: 'Michael Gerber' },
        { title: 'Positioning', author: 'Al Ries & Jack Trout' },
        { title: 'Built to Sell', author: 'John Warrillow' },
      ],
    },

    whatYouGet: {
      title: 'Cosa ottieni',
      features: [
        'Assessment completo in 15 minuti (13 domande strategiche)',
        'Diagnosi precisa del tuo vero problema di business',
        'Mappa delle tensioni (percezione vs realtà di mercato)',
        'Dossier strutturato scaricabile',
        'Indicazioni sui prossimi step strategici concreti',
      ],
    },
  },

  pricing: {
    freeTrialCount: 0,
    creditCost: 5,
    subscriptionPlans: [
      {
        name: 'Singola Diagnosi',
        price: 29,
        credits: 5,
        period: 'una tantum',
      },
      {
        name: 'Pro',
        price: 99,
        credits: 999,
        period: 'mese',
      },
    ],
  },

  cta: {
    primary: 'Inizia la Diagnosi',
    secondary: 'Abbonati per accesso illimitato',
  },
};

export default landing;
