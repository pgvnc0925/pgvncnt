/**
 * TYPES — Contratto universale per tutte le app PV
 * Questi tipi garantiscono coerenza tra frontend, config e backend
 */

// ============================================
// CONFIGURAZIONE APP (ui-schema + config)
// ============================================

export type InputType = 'text' | 'select' | 'scale' | 'multiselect' | 'textarea' | 'checkbox';
export type StepType = 'input' | 'verdict' | 'explanation' | 'accordion';

export interface InputField {
  id: string;
  type: InputType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}

export interface ConditionalBranch {
  condition: (responses: Record<string, unknown>) => boolean;
  nextStepId: string;
}

export interface Step {
  id: string;
  type: StepType;
  title?: string;
  description?: string;
  fields?: InputField[];
  branches?: ConditionalBranch[];
  nextStepId?: string;
  content?: string;
}

export interface UISchema {
  appId: string;
  version: string;
  steps: Step[];
  startStepId: string;
  verdictRules: VerdictRule[];
}

export interface VerdictRule {
  id: string;
  condition: (responses: Record<string, unknown>) => boolean;
  verdict: string;
  tensionAxes: TensionAxis[];
  explanation: string;
}

export interface TensionAxis {
  name: string;
  leftLabel: string;
  rightLabel: string;
  userPosition: number; // 0-100
  marketPosition: number; // 0-100
  insight: string;
}

// ============================================
// CONFIGURAZIONE GENERALE DELL'APP
// ============================================

export interface AppConfig {
  appId: string;
  name: string;
  description: string;
  category: 'assessment' | 'workbook' | 'audit' | 'quiz';
  version: string;
  pricing: {
    creditCost: number;
    accessLevel: 'free' | 'premium' | 'exclusive';
  };
  limits: {
    maxAttempts?: number;
    timeoutMinutes?: number;
  };
  n8nWorkflow?: string;
  ragManifest?: string;
}

// ============================================
// RAG MANIFEST (Governance della conoscenza)
// ============================================

export interface RAGManifest {
  appId: string;
  version: string;
  enabledLayers: ('RAG-0' | 'RAG-1' | 'RAG-2' | 'RAG-3')[];
  dominance: {
    'RAG-0': number;
    'RAG-1': number;
    'RAG-2': number;
    'RAG-3': number;
  };
  excludedSources: string[];
  userInputUsage: 'full' | 'pattern_only' | 'aggregated';
}

// ============================================
// SESSIONE E RISPOSTA UTENTE
// ============================================

export interface AppSession {
  sessionId: string;
  userId: string;
  appId: string;
  startedAt: string;
  completedAt?: string;
  currentStepId: string;
  responses: Record<string, unknown>;
  creditsUsed: number;
}

export interface StepResponse {
  stepId: string;
  response: Record<string, unknown>;
  timestamp: string;
}

// ============================================
// VERDETTO E OUTPUT (Frontend → n8n)
// ============================================

export interface VerdictOutput {
  verdictId: string;
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export interface TensionMapOutput {
  axes: TensionAxis[];
  summary: string;
  implications: string[];
}

/**
 * DOSSIER STRUTTURATO — Ciò che il frontend passa a n8n
 * È il contratto definitivo tra frontend intelligence e backend agenti
 */
export interface StructuredDossier {
  // Metadati
  appId: string;
  sessionId: string;
  userId: string;
  timestamp: string;

  // Contesto aziendale
  context: {
    industry: string;
    market: 'locale' | 'regionale' | 'nazionale' | 'internazionale';
    teamSize: number;
    yearsInBusiness: number;
    pricePositioning: 'basso' | 'medio' | 'alto' | 'premium';
  };

  // Obiettivi dichiarati e impliciti
  goals: {
    declared: string[];
    implicit: string[];
    conflicts?: string[];
  };

  // Vincoli operativi
  constraints: {
    budget: string;
    team: string;
    technicalSkills: string;
    timeframe: string;
  };

  // Segnali di bias
  biasSignals: string[];

  // Pattern linguistici (per tone generation)
  languagePatterns: string[];

  // Flag diagnostici
  diagnosticFlags: Record<string, string | number | boolean>;

  // Tutte le risposte normalizzate
  allResponses: Record<string, unknown>;
}

export interface N8nProcessingResult {
  success: boolean;
  verdict: VerdictOutput;
  tensionMap: TensionMapOutput;
  dossier: StructuredDossier;
  nextAction?: string;
  error?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Maybe<T> = T | null | undefined;
export type AsyncResult<T> = Promise<{ data: T; error: null } | { data: null; error: Error }>;
