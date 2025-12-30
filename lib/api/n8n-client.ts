import { StructuredDossier } from '@/lib/app-types';

interface N8nPayload {
  app_id: string;
  session_id: string;
  dossier: StructuredDossier | Record<string, unknown>;
}

interface N8nResponse {
  success: boolean;
  verdict?: any;
  tensionMap?: any;
  narrative?: string;
  error?: string;
}

class N8nClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678';
  }

  /**
   * Manda il dossier a un agente n8n per elaborazione
   * Ritorna verdict + tensionMap
   */
  async processAssessment(payload: N8nPayload): Promise<N8nResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/pv-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`N8n request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8n assessment error:', error);
      return {
        success: false,
        error: 'Failed to process assessment',
      };
    }
  }

  /**
   * Agente per generare USP/Mission/Tone (post-assessment)
   */
  async generateStrategy(dossier: Record<string, unknown>, appId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/pv-strategy-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: appId,
          dossier,
        }),
      });

      if (!response.ok) {
        throw new Error(`N8n request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8n strategy generation error:', error);
      return {
        success: false,
        error: 'Failed to generate strategy',
      };
    }
  }

  /**
   * Agente per valutare esercizi/risposte (Workbook)
   */
  async evaluateExercise(
    exerciseId: string,
    userResponse: string,
    criteria: Record<string, unknown>
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/pv-exercise-evaluator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          user_response: userResponse,
          evaluation_criteria: criteria,
        }),
      });

      if (!response.ok) {
        throw new Error(`N8n request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8n exercise evaluation error:', error);
      return {
        success: false,
        error: 'Failed to evaluate exercise',
      };
    }
  }
}

export const n8nClient = new N8nClient();
