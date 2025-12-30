import { useState, useCallback, useEffect } from 'react';
import { AppSession, StepResponse } from '@/lib/types';
import * as supabase from '@/lib/api/supabaseClient';

export function useAppSession(appId: string, userId: string) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inizializza sessione
  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        const newSession = await supabase.createSession(userId, appId);
        setSession({
          sessionId: newSession.session_id,
          userId,
          appId,
          startedAt: newSession.created_at,
          currentStepId: 'step-1',
          responses: {},
          creditsUsed: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setLoading(false);
      }
    };

    if (userId && appId) {
      initSession();
    }
  }, [appId, userId]);

  // Salva risposta singola step
  const submitStep = useCallback(
    async (stepId: string, response: Record<string, unknown>) => {
      if (!session) return;

      try {
        const updatedResponses = {
          ...session.responses,
          [stepId]: response,
        };

        await supabase.updateSession(session.sessionId, {
          current_step: stepId,
          responses: updatedResponses,
        });

        setSession((prev) =>
          prev
            ? {
                ...prev,
                responses: updatedResponses,
                currentStepId: stepId,
              }
            : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit step');
        throw err;
      }
    },
    [session]
  );

  // Completa sessione
  const completeSession = useCallback(
    async (verdict: string, tensionMap: Record<string, unknown>, dossier: Record<string, unknown>) => {
      if (!session) return;

      try {
        await supabase.completeSession(session.sessionId, {
          sessionId: session.sessionId,
          verdict,
          tensionMap,
          dossier,
          createdAt: new Date().toISOString(),
        });

        setSession((prev) =>
          prev
            ? {
                ...prev,
                completedAt: new Date().toISOString(),
              }
            : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to complete session');
        throw err;
      }
    },
    [session]
  );

  return {
    session,
    loading,
    error,
    submitStep,
    completeSession,
  };
}
