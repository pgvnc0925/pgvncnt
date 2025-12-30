import { supabaseAdmin } from "@/lib/supabase/admin";

export interface EvaluationSavePayload {
  uuid: string;
  answers: Record<string, number | number[]>;
  scores: any;
  email?: string;
  name?: string;
}

const TABLE = "form_sessions";

export async function saveSessionData(payload: EvaluationSavePayload) {
  if (!supabaseAdmin) {
    return { ok: true, message: "supabase admin not configured, skipped" };
  }

  try {
    const { error } = await supabaseAdmin.from(TABLE).upsert(
      {
        uuid: payload.uuid,
        answers: payload.answers,
        scores: payload.scores,
        email: payload.email || null,
        name: payload.name || null,
      },
      { onConflict: "uuid" }
    );

    if (error) {
      console.error("saveSessionData error", error);
      return { ok: false, message: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("saveSessionData exception", err);
    return { ok: false, message: err?.message || "unknown error" };
  }
}

export async function recoverSessionByEmail(email: string) {
  if (!supabaseAdmin) return { ok: false, message: "supabase not configured" };
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("recoverSessionByEmail error", error);
      return { ok: false, message: error.message };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, message: err?.message || "unknown error" };
  }
}

export async function recoverSessionByUuid(uuid: string) {
  if (!supabaseAdmin) return { ok: false, message: "supabase not configured" };
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("uuid", uuid)
      .maybeSingle();

    if (error) {
      console.error("recoverSessionByUuid error", error);
      return { ok: false, message: error.message };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, message: err?.message || "unknown error" };
  }
}
