// apps/corsi/landing.ts

import type { LandingData } from '@/apps/index';

const landing: LandingData = {
  metaTitle: 'Corsi Avanzati | Pagine Vincenti',
  metaDescription: 'Percorsi formativi completi su marketing e imprenditoria. Dai fundamentals ai sistemi avanzati.',

  headline: 'Diventa Esperto di Marketing e Imprenditoria',
  subheadline: 'Percorsi strutturati basati sui migliori libri del settore. Non teoria, ma frameworks applicabili.',

  sections: {
    whoIsFor: {
      title: 'Per chi è',
      items: [
        'Imprenditori che vogliono competenze solide',
        'Professionisti del marketing in formazione',
        'Chi ha fatto la valutazione e vuole approfondire',
        'Team che necessitano di formazione strutturata',
      ],
    },

    basedOnBooks: {
      title: 'Basato su',
      books: [
        { title: 'The 22 Immutable Laws of Marketing', author: 'Al Ries & Jack Trout' },
        { title: 'How Brands Grow', author: 'Byron Sharp' },
        { title: 'Influence: The Psychology of Persuasion', author: 'Robert Cialdini' },
        { title: 'The E-Myth Revisited', author: 'Michael Gerber' },
        { title: 'Built to Sell', author: 'John Warrillow' },
        { title: 'Traction', author: 'Gino Wickman' },
      ],
    },

    whatYouGet: {
      title: 'Cosa ottieni',
      features: [
        '2 percorsi completi (Marketing & Imprenditoria)',
        'Video lezioni strutturate per modulo',
        'Esercizi pratici e casi studio',
        'Frameworks e template scaricabili',
        'Accesso a vita con aggiornamenti continui',
      ],
    },
  },

  pricing: {
    freeTrialCount: 0,
    creditCost: 0,
    subscriptionPlans: [
      {
        name: 'Mensile',
        price: 29,
        credits: 999,
        period: 'mese',
      },
      {
        name: 'Annuale',
        price: 290,
        credits: 999,
        period: 'anno',
      },
    ],
  },

  cta: {
    primary: 'Inizia Ora',
    secondary: 'Vedi Programma Completo',
  },
};

export default landing;
