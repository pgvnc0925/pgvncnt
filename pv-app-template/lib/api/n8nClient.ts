import axios, { AxiosInstance } from 'axios';

const N8N_WEBHOOK_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678';

interface N8nPayload {
  app_id: string;
  session_id: string;
  dossier: Record<string, unknown>;
}

interface N8nResponse {
  success: boolean;
  verdict?: string;
  tensionMap?: Record<string, unknown>;
  narrative?: string;
  error?: string;
}

class N8nClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: N8N_WEBHOOK_BASE,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Manda il dossier a un agente n8n per elaborazione
   * Ritorna verdict + tensionMap
   */
  async processAssessment(payload: N8nPayload): Promise<N8nResponse> {
    try {
      const response = await this.client.post('/webhook/pv-assessment', payload);
      return response.data;
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
      const response = await this.client.post('/webhook/pv-strategy-generator', {
        app_id: appId,
        dossier,
      });
      return response.data;
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
      const response = await this.client.post('/webhook/pv-exercise-evaluator', {
        exercise_id: exerciseId,
        user_response: userResponse,
        evaluation_criteria: criteria,
      });
      return response.data;
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
