import { useState, useEffect } from 'react';
import { UISchema, AppConfig, RAGManifest } from '@/lib/types';

/**
 * Hook universale che carica:
 * - ui-schema.ts (flusso e domande)
 * - config.ts (metadati app)
 * - rag-manifest.ts (regole di conoscenza)
 *
 * Permette a qualsiasi componente di accedere alla configurazione
 * senza dipendere da file locali
 */
export function useAppConfig(appId: string) {
  const [uiSchema, setUiSchema] = useState<UISchema | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [ragManifest, setRagManifest] = useState<RAGManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        // Importa dinamicamente i file della app specifica
        const uiSchemaModule = await import(`@/apps/${appId}/ui-schema`);
        const configModule = await import(`@/apps/${appId}/config`);
        const ragModule = await import(`@/apps/${appId}/rag-manifest`);

        setUiSchema(uiSchemaModule.default);
        setAppConfig(configModule.default);
        setRagManifest(ragModule.default);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load config for app: ${appId}`);
      } finally {
        setLoading(false);
      }
    };

    if (appId) {
      loadConfig();
    }
  }, [appId]);

  return {
    uiSchema,
    appConfig,
    ragManifest,
    loading,
    error,
  };
}
