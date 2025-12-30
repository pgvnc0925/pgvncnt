import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Interfacce pubbliche
export interface AppSession {
  userId: string;
  appId: string;
  sessionId: string;
  credits: number;
  startedAt: string;
  completedAt?: string;
  payload?: Record<string, unknown>;
}

export interface AppResult {
  sessionId: string;
  verdict: string;
  tensionMap: Record<string, unknown>;
  dossier: Record<string, unknown>;
  createdAt: string;
}

// Funzioni pubbliche (usate dai hook)
export async function createSession(userId: string, appId: string) {
  const { data, error } = await supabaseClient
    .from('app_sessions')
    .insert([
      {
        user_id: userId,
        app_id: appId,
        session_id: crypto.randomUUID(),
        credits_used: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSession(sessionId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabaseClient
    .from('app_sessions')
    .update({ payload })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeSession(sessionId: string, result: AppResult) {
  const { data, error } = await supabaseClient
    .from('app_sessions')
    .update({
      completed_at: new Date().toISOString(),
      result_verdict: result.verdict,
      result_tension_map: result.tensionMap,
      result_dossier: result.dossier,
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
