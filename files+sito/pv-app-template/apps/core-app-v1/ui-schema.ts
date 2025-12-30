import { UISchema, VerdictRule, TensionAxis } from '@/lib/types';

/**
 * CORE-APP UI SCHEMA
 * Definisce:
 * - 13 domande su 4 sistemi (Valore, Acquisizione, Conversione, Relazione)
 * - Branching condizionale
 * - Regole per il verdetto
 * - Assi di tensione
 *
 * QUESTO FILE È TUTTO CIÒ CHE CAMBIA TRA UNA APP E L'ALTRA
 * Il resto del codice rimane uguale
 */

export const coreAppUISchema: UISchema = {
  appId: 'core-app-v1',
  version: '1.0.0',
  startStepId: 'step-context',

  steps: [
    // STEP 0 - Context Framing
    {
      id: 'step-context',
      type: 'input',
      title: 'Contestualizziamo la tua situazione',
      description:
        'Per darti una diagnosi accurata, abbiamo bisogno di capire il tuo contesto. Rispondi con sincerità.',
      fields: [
        {
          id: 'industry',
          type: 'select',
          label: 'In quale settore operi?',
          required: true,
          options: [
            { label: 'E-commerce / Retail', value: 'ecommerce' },
            { label: 'Servizi professionali', value: 'services' },
            { label: 'SaaS / Software', value: 'saas' },
            { label: 'Consulenza / Coaching', value: 'consulting' },
            { label: 'Ristorazione', value: 'food' },
            { label: 'Bellezza / Wellness', value: 'beauty' },
            { label: 'Altro', value: 'other' },
          ],
        },
        {
          id: 'teamSize',
          type: 'scale',
          label: 'Quante persone nel team (incluso te)?',
          min: 1,
          max: 50,
          required: true,
          help: '1 = solo tu, 50 = team grande',
        },
        {
          id: 'yearsInBusiness',
          type: 'scale',
          label: 'Da quanti anni sei in questo business?',
          min: 0,
          max: 30,
          required: true,
        },
      ],
      nextStepId: 'step-value-1',
    },

    // SISTEMA 1: VALORE (2 domande)
    {
      id: 'step-value-1',
      type: 'input',
      title: 'Sistema 1: Valore',
      description: 'Capire come comunichi il valore è fondamentale.',
      fields: [
        {
          id: 'valueProposition',
          type: 'textarea',
          label: 'In una frase, che cosa offri esattamente?',
          placeholder: 'Es: "Aiuto PMI a vendere online" o "Creo strategie di marketing"',
          required: true,
          help: 'Senza convoluzione. Detto in parole tue.',
        },
        {
          id: 'differentiation',
          type: 'scale',
          label:
            'Quanto sei sicuro che il tuo valore è DIVERSO dai competitor (non "migliore", diverso)?',
          min: 0,
          max: 100,
          leftLabel: 'Non so cosa mi differenzia',
          rightLabel: 'So esattamente cosa mi rende unico',
          required: true,
        },
      ],
      nextStepId: 'step-acquisition-1',
    },

    // SISTEMA 2: ACQUISIZIONE (3 domande)
    {
      id: 'step-acquisition-1',
      type: 'input',
      title: 'Sistema 2: Acquisizione',
      description: 'Come trova te il tuo cliente ideale?',
      fields: [
        {
          id: 'primaryChannel',
          type: 'select',
          label: 'Quale canale genera più clienti oggi?',
          required: true,
          options: [
            { label: 'Referral / Word of mouth', value: 'referral' },
            { label: 'Google / SEO', value: 'seo' },
            { label: 'Social media (Instagram, LinkedIn, etc)', value: 'social' },
            { label: 'Google Ads / Paid', value: 'ads' },
            { label: 'Email marketing', value: 'email' },
            { label: 'Contatti diretti / Cold outreach', value: 'cold' },
            { label: 'Non so / Non ho dati', value: 'unknown' },
          ],
        },
        {
          id: 'marketGeography',
          type: 'select',
          label: 'A quale mercato geografico miri?',
          required: true,
          options: [
            { label: 'Locale (città/provincia)', value: 'local' },
            { label: 'Regionale', value: 'regional' },
            { label: 'Nazionale', value: 'national' },
            { label: 'Internazionale', value: 'international' },
          ],
        },
        {
          id: 'acquisitionCost',
          type: 'select',
          label: 'Conosci il costo medio per acquisire un cliente?',
          required: true,
          options: [
            { label: 'Sì, lo conosco e lo tracciamo', value: 'tracked' },
            { label: 'Più o meno', value: 'approximate' },
            { label: 'No, non lo so', value: 'unknown' },
          ],
        },
      ],
      nextStepId: 'step-conversion-1',
    },

    // SISTEMA 3: CONVERSIONE & DELIVERY (4 domande)
    {
      id: 'step-conversion-1',
      type: 'input',
      title: 'Sistema 3: Conversione & Delivery',
      description: 'Come convieni i prospect in clienti e li servi?',
      fields: [
        {
          id: 'conversionProcess',
          type: 'textarea',
          label: 'Descrivi brevemente il tuo processo di vendita (da prospect a cliente)',
          placeholder:
            'Es: "Chiamata, demo, proposta, firma" o "Chat, contratto, inizio servizio"',
          required: true,
        },
        {
          id: 'conversionRate',
          type: 'select',
          label: 'Su 100 prospect, quanti diventano clienti?',
          required: true,
          options: [
            { label: 'Meno del 5%', value: 'under5' },
            { label: '5-15%', value: '5-15' },
            { label: '15-30%', value: '15-30' },
            { label: 'Più del 30%', value: 'above30' },
            { label: 'Non lo so', value: 'unknown' },
          ],
        },
        {
          id: 'deliveryQuality',
          type: 'scale',
          label:
            'Quanto sei soddisfatto della qualità di come consegni il tuo servizio/prodotto?',
          min: 0,
          max: 100,
          leftLabel: 'Molto insoddisfatto',
          rightLabel: 'Completamente soddisfatto',
          required: true,
        },
        {
          id: 'clientRetention',
          type: 'scale',
          label:
            'Che percentuale di clienti torna a fare affari con te o rimane fedele nel tempo?',
          min: 0,
          max: 100,
          leftLabel: 'La maggior parte va via',
          rightLabel: 'La maggior parte rimane',
          required: true,
        },
      ],
      nextStepId: 'step-relationship-1',
    },

    // SISTEMA 4: RELAZIONE & RITORNO (4 domande)
    {
      id: 'step-relationship-1',
      type: 'input',
      title: 'Sistema 4: Relazione & Ritorno',
      description: 'Come mantieni relazioni e generi valore ricorrente?',
      fields: [
        {
          id: 'recurringModel',
          type: 'select',
          label: 'Il tuo modello di business è principalmente:',
          required: true,
          options: [
            { label: 'Una tantum (vendo una volta)', value: 'oneshot' },
            { label: 'Subscription / Ricorrente', value: 'subscription' },
            { label: 'Misto (una tantum + ricorrente)', value: 'mixed' },
          ],
        },
        {
          id: 'customerCommunication',
          type: 'textarea',
          label:
            'Come comunichi regolarmente con i tuoi clienti attuali? (Email, newsletter, SMS, etc)',
          placeholder: 'Es: "Non comunico regolarmente" o "Email mensile"',
          required: true,
        },
        {
          id: 'referralGeneration',
          type: 'scale',
          label: 'I tuoi clienti ti consigliano attivamente a altri?',
          min: 0,
          max: 100,
          leftLabel: 'Quasi mai',
          rightLabel: 'Molto spesso',
          required: true,
        },
        {
          id: 'businessGrowth',
          type: 'select',
          label: 'Come è cresciuto il tuo business negli ultimi 12 mesi?',
          required: true,
          options: [
            { label: 'Decrescita (meno fatturato)', value: 'declining' },
            { label: 'Stagnazione (fatturato simile)', value: 'stagnant' },
            { label: 'Crescita lenta (10-25%)', value: 'slow' },
            { label: 'Crescita forte (>25%)', value: 'strong' },
          ],
        },
      ],
      nextStepId: 'step-bias-signals',
    },

    // STEP: Segnali di bias (nascosto ma importante)
    {
      id: 'step-bias-signals',
      type: 'input',
      title: 'Ultimi dettagli',
      description:
        'Permettici di capire meglio il tuo modo di pensare (senza rispondere "correttamente").',
      fields: [
        {
          id: 'mainFocus',
          type: 'select',
          label: 'Su cosa tendi a focalizzarti più spesso?',
          required: true,
          options: [
            { label: 'Traffico / Visite / Reach', value: 'traffic' },
            { label: 'Costi / Efficienza / Risparmio', value: 'costs' },
            { label: 'Qualità / Perfezionismo', value: 'quality' },
            { label: 'Innovazione / Nuove idee', value: 'innovation' },
            { label: 'Relazioni / Persone', value: 'relationships' },
          ],
        },
        {
          id: 'biggestFrustration',
          type: 'textarea',
          label: 'Qual è la tua frustrazione più grande nel business?',
          placeholder:
            'Es: "Non riesco a scalare" o "I clienti non capiscono il mio valore"',
          required: true,
        },
      ],
      nextStepId: 'step-verdict',
    },

    // STEP: Verdict finale
    {
      id: 'step-verdict',
      type: 'verdict',
      title: 'La tua diagnosi',
      description: 'Basato su ciò che hai condiviso, ecco la nostra analisi',
    },
  ],

  // ============================================
  // REGOLE DI VERDETTO (PV CORE LOGIC)
  // ============================================
  verdictRules: [
    {
      id: 'verdict-value-gap',
      condition: (responses) => {
        const differentiation = (responses.differentiation as number) || 0;
        return differentiation < 40;
      },
      verdict:
        'Il tuo problema principale NON è traffico o conversione. È la chiarezza del valore.',
      tensionAxes: [
        {
          name: 'Chiarezza di valore',
          leftLabel: 'Vago, generico',
          rightLabel: 'Cristallino, specifico',
          userPosition: 35,
          marketPosition: 25,
          insight:
            'Pensi di comunicare bene, ma il mercato non capisce cosa ti rende diverso dai competitor.',
        },
        {
          name: 'Posizionamento difendibile',
          leftLabel: 'Nessuno (competo su prezzo)',
          rightLabel: 'Forte (unico nel mio spazio)',
          userPosition: 20,
          marketPosition: 30,
          insight:
            'Il mercato ti vede come "uno come gli altri". Serve rifondare il posizionamento.',
        },
      ],
      explanation:
        'Senza un valore chiaro e differenziato, ogni altra tattica (traffico, conversione) è costruita su sabbia. Questo è il fondamento.',
    },

    {
      id: 'verdict-acquisition-gap',
      condition: (responses) => {
        const acquisitionCost = responses.acquisitionCost as string;
        return acquisitionCost === 'unknown';
      },
      verdict:
        'Stai generando clienti al buio. Non sai quanto costa acquisire e quindi non puoi decidere consapevolmente dove investire.',
      tensionAxes: [
        {
          name: 'Tracciamento dati',
          leftLabel: 'Nessun dato',
          rightLabel: 'Dati completi',
          userPosition: 15,
          marketPosition: 70,
          insight:
            'I tuoi competitor probabilmente tracceranno dati di acquisizione; tu no. È uno svantaggio competitivo.',
        },
      ],
      explanation:
        'Senza sapere quanto costa un cliente, stai semplicemente spendendo speranza. Prima azione: installa analytics e traccia.',
    },

    {
      id: 'verdict-conversion-weak',
      condition: (responses) => {
        const conversionRate = responses.conversionRate as string;
        const retention = (responses.clientRetention as number) || 50;
        return (conversionRate === 'under5' || conversionRate === '5-15') && retention < 40;
      },
      verdict:
        'Converti male E non riesci a trattenere i clienti. È un doppio problema: processo di vendita + promessa non mantenuta.',
      tensionAxes: [
        {
          name: 'Efficienza di vendita',
          leftLabel: 'Perdo la maggior parte',
          rightLabel: 'Converto la maggior parte',
          userPosition: 20,
          marketPosition: 50,
          insight:
            'Se anche avessi traffico infinito, la tua pipeline funnerebbe: il processo non funziona.',
        },
        {
          name: 'Soddisfazione cliente',
          leftLabel: 'I clienti si pentono',
          rightLabel: 'I clienti sono felicissimi',
          userPosition: 35,
          marketPosition: 20,
          insight:
            'Forse prometti troppo in vendita e non consegni. O viceversa, prometti poco e non comunichi il valore reale.',
        },
      ],
      explanation:
        'Prima di scalare acquisizione, devi aggiustare il processo di conversione E la qualità di delivery. Non è una tattica di crescita, è una questione di sostenibilità.',
    },

    {
      id: 'verdict-default',
      condition: () => true, // default fallback
      verdict:
        'Il tuo business ha fondamenti solidi, ma ci sono aree di miglioramento strategico che moltiplicheranno il valore.',
      tensionAxes: [
        {
          name: 'Maturità di acquisizione',
          leftLabel: 'Ad hoc, senza dati',
          rightLabel: 'Sistemica, tracciata',
          userPosition: 50,
          marketPosition: 70,
          insight: 'Stai facendo bene, ma il mercato segue processi più strutturati.',
        },
        {
          name: 'Scalabilità del modello',
          leftLabel: 'Limitata (legato a me)',
          rightLabel: 'Illimitata (sistematizzato)',
          userPosition: 45,
          marketPosition: 60,
          insight:
            'Finché sei tu il collo di bottiglia, non puoi crescere. Serve delegare e automatizzare.',
        },
      ],
      explanation:
        'I tuoi sistemi funzionano, ma non sono ancora industrializzati. Il prossimo passo è scalabilità sistematica.',
    },
  ],
};

export default coreAppUISchema;
