import { AppConfig } from '@/lib/types';

const coreAppConfig: AppConfig = {
  appId: 'core-app-v1',
  name: 'Core-App: Diagnosi Strategica',
  description:
    'Assessment completo dei tuoi 4 sistemi di business: valore, acquisizione, conversione, relazione.',
  category: 'assessment',
  version: '1.0.0',
  pricing: {
    creditCost: 5,
    accessLevel: 'premium',
  },
  limits: {
    maxAttempts: 2,
    timeoutMinutes: 60,
  },
  n8nWorkflow: 'pv-core-app-processor',
  ragManifest: 'core-app-v1',
};

export default coreAppConfig;
