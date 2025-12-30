// apps/index.ts - Central registry for all Pagine Vincenti apps

export interface LandingData {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  sections: {
    whoIsFor: { title: string; items: string[] };
    basedOnBooks: { title: string; books: Array<{ title: string; author: string }> };
    whatYouGet: { title: string; features: string[] };
  };
  pricing: {
    freeTrialCount: number;
    creditCost: number;
    subscriptionPlans: Array<{
      name: string;
      price: number;
      credits: number;
      period: string;
    }>;
  };
  cta: { primary: string; secondary: string };
}

export interface AppMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  landing: LandingData;
  appPath: string; // Path to the actual app (e.g., "/apps/core-app-v1")
}

// Import landing data for each app
import coreAppLanding from './core-app-v1/landing';
import corsiLanding from './corsi/landing';

const apps: AppMetadata[] = [
  {
    id: 'core-app-v1',
    slug: 'core-app',
    name: 'Diagnosi Strategica',
    description: 'Scopri il vero problema del tuo business in 15 minuti',
    icon: '🎯',
    landing: coreAppLanding,
    appPath: '/apps/core-app-v1',
  },
  {
    id: 'corsi-v1',
    slug: 'corsi',
    name: 'Corsi Avanzati',
    description: 'Percorsi formativi completi su marketing e imprenditoria',
    icon: '🎓',
    landing: corsiLanding,
    appPath: '/corsi',
  },
];

export function getAllApps(): AppMetadata[] {
  return apps;
}

export function getAppBySlug(slug: string): AppMetadata | undefined {
  return apps.find((app) => app.slug === slug);
}

export function getAppById(id: string): AppMetadata | undefined {
  return apps.find((app) => app.id === id);
}

export function getAllAppSlugs(): string[] {
  return apps.map((app) => app.slug);
}

export default apps;
