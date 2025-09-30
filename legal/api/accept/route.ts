// /api/legal/accept  (POST)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/boilerplate/supabase/server"; // <— tuo helper

const Body = z.object({
  slug: z.enum(["tos", "privacy", "dpa"]),
  version: z.string().min(1),
  pdf_sha256: z.string().min(32),
  method: z.enum(["scroll+checkbox", "otp+checkbox"]),
  evidence: z.record(z.any())
});

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.ip ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";

  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { slug, version, pdf_sha256, method, evidence } = parsed.data;

  // Verifica versione/hash esistano davvero
  const { data: doc, error: docErr } = await supabase
    .from("legal_documents")
    .select("slug, version, pdf_sha256, archived_at")
    .eq("slug", slug)
    .eq("version", version)
    .is("archived_at", null)
    .maybeSingle();

  if (docErr || !doc || doc.pdf_sha256 !== pdf_sha256) {
    return NextResponse.json({ error: "Document mismatch" }, { status: 400 });
  }

  const { error: insErr } = await supabase.from("legal_acceptances").insert({
    user_id: user.id,
    document_slug: slug,
    document_version: version,
    document_sha256: pdf_sha256,
    method,
    evidence,
    ip,
    user_agent: ua,
  });

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
