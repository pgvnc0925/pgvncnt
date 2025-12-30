import { RAGManifest } from '@/lib/app-types';

const coreAppRAGManifest: RAGManifest = {
  appId: 'core-app-v1',
  version: '1.0.0',
  enabledLayers: ['RAG-1', 'RAG-2', 'RAG-3'],
  dominance: {
    'RAG-0': 0.0, // No raw book theories here
    'RAG-1': 0.7, // PV proprietary models
    'RAG-2': 0.2, // Italian market context
    'RAG-3': 0.1, // User pattern learning
  },
  excludedSources: [],
  userInputUsage: 'pattern_only',
};

export default coreAppRAGManifest;
