import { Hammer } from "lucide-react";

export const metadata = {
  title: "Pagine Vincenti — Sito in costruzione",
  description: "Stiamo finalizzando la nuova esperienza di Pagine Vincenti.",
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_18%_22%,rgba(212,175,55,0.2),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_50%_78%,rgba(12,18,36,0.65),transparent_36%)]" />
      <div className="relative w-full max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 px-8 py-12 text-center shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-100">
          Pagine Vincenti
        </span>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/40 bg-secondary/15 text-secondary shadow-inner">
          <Hammer className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Stiamo costruendo la nuova esperienza
        </h1>
        <p className="text-lg leading-relaxed text-slate-200/90">
          Il sito è temporaneamente non disponibile mentre completiamo gli ultimi dettagli. Non ci sono sezioni
          navigabili al momento: torna presto per esplorare i nuovi contenuti.
        </p>
        <p className="text-sm text-slate-400">
          Grazie per la pazienza — il team di Pagine Vincenti
        </p>
      </div>
    </main>
  );
}
