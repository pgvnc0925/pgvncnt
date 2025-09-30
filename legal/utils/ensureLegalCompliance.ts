// Da usare in middleware/server actions: verifica se l'utente ha accettato le versioni correnti
import { createSupabaseServerClient } from "@/boilerplate/supabase/server";

export async function ensureLegalCompliance(userId: string, slugs: Array<"tos" | "privacy" | "dpa">) {
  const supabase = createSupabaseServerClient();

  // leggi versioni correnti
  const { data: docs } = await supabase
    .from("legal_documents")
    .select("slug, version, pdf_sha256, archived_at")
    .in("slug", slugs)
    .is("archived_at", null);

  if (!docs || docs.length !== slugs.length) return { ok: false, missing: slugs };

  // per ogni slug verifica esista acceptance con quella version
  const missing: string[] = [];
  for (const d of docs) {
    const { data: acc } = await supabase
      .from("legal_acceptances")
      .select("id")
      .eq("user_id", userId)
      .eq("document_slug", d.slug)
      .eq("document_version", d.version)
      .limit(1)
      .maybeSingle();
    if (!acc) missing.push(d.slug);
  }

  return { ok: missing.length === 0, missing };
}
