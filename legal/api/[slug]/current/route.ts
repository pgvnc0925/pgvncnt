// /api/legal/[slug]/current  (GET)
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/boilerplate/supabase/server"; // <— punta al tuo helper

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("legal_documents")
    .select("slug, version, pdf_url, pdf_sha256, effective_from")
    .eq("slug", params.slug)
    .is("archived_at", null)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
