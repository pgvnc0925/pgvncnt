import { useCallback, useEffect, useState } from "react";

export function useLegalAcceptance(slug: "tos" | "privacy" | "dpa") {
  const [doc, setDoc] = useState<{
    slug: string;
    version: string;
    pdf_url: string;
    pdf_sha256: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/legal/${slug}/current`, { cache: "no-store" });
        if (!res.ok) throw new Error("Document not found");
        const data = await res.json();
        if (mounted) setDoc(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  const accept = useCallback(async (method: "scroll+checkbox" | "otp+checkbox", evidence: Record<string, any>) => {
    if (!doc) throw new Error("Document not loaded");
    const res = await fetch("/api/legal/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        version: doc.version,
        pdf_sha256: doc.pdf_sha256,
        method,
        evidence,
      }),
    });
    if (!res.ok) throw new Error("Acceptance failed");
    return true;
  }, [doc, slug]);

  return { doc, loading, accept };
}
