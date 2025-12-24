import { Button } from "@/components/ui/button";
import { RealStatsDashboard } from "@/components/dashboard/real-stats-dashboard";
import { BookCard } from "@/components/books/book-card";
import { getAllBooks } from "@/lib/books";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Award, ShoppingCart, Wrench } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  // Get top 3 books for "Classifica Utilità"
  const books = getAllBooks();
  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const levels = [
    {
      key: "base",
      title: "Base",
      subtitle: "",
      icon: CheckCircle2,
      intro:
        "Qui costruisci il modo corretto di pensare. Niente tattiche, niente hype: solo ciò che un professionista deve sapere per non navigare a caso.",
      signals: [
        "Non hai chiara la differenza tra bisogni, desideri, tensioni e valore percepito.",
        "Non sai rispondere con certezza alle tre domande fondamentali del marketing: cosa vende davvero l'azienda, a quali bisogni risponde, come li soddisfa meglio degli altri.",
        "Non hai familiarità profonda con posizionamento, USP, marketing mix, piramide di Maslow, segmentazione reale.",
        "Usi la pratica senza un modello mentale che la guidi.",
      ],
      build:
        "Strategia, differenziazione, senso del mercato e regole che governano ogni decisione. È il punto di partenza di chi vuole smettere di improvvisare.",
    },
    {
      key: "intermedio",
      title: "Intermedio",
      subtitle: "",
      icon: TrendingUp,
      intro:
        "Qui impari a leggere la mente del cliente, interpretarne le motivazioni e far rispondere il mercato ai tuoi messaggi.",
      signals: [
        "Vuoi scoprire perché le persone comprano davvero, non perché dicono di comprare.",
        "Vuoi capire i bias cognitivi che alterano ogni decisione (e come usarli in modo etico).",
        "Vuoi creare messaggi che toccano i tasti giusti e collegarli alla tua nicchia reale.",
        "Vuoi capire cosa succede nella testa del cliente quando vede un annuncio, un prezzo, un'offerta.",
      ],
      build:
        "Lettura profonda del consumatore, mappe motivazionali, segmentazione psicografica e situazionale, copy che parla al sistema 1 e 2, offerte costruite per generare risposta.",
      note:
        "È il livello che porta sopra l'80% dei professionisti operativi, perché qui nasce la capacità di influenzare.",
    },
    {
      key: "avanzato",
      title: "Avanzato",
      subtitle: "",
      icon: Award,
      intro:
        "Qui arrivi al punto in cui il marketing diventa un sistema, non un insieme di tecniche.",
      signals: [
        "Vuoi pensare come i top marketer e decidere con lucidità.",
        "Vuoi delegare con criterio e creare processi ripetibili.",
        "Vuoi integrare strategia, copywriting, storytelling, selling, branding.",
        "Vuoi costruire un punto di vista elevato sul mercato.",
      ],
      build:
        "Leggere un mercato come un analista, progettare sistemi di marketing interi, integrare psicologia, strategia, narrazione, economics e costruire un vantaggio competitivo mentale difficile da eguagliare.",
      note: "È il livello che porta nel top 2,5% del settore. Non è più apprendimento: è trasformazione.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Added back Header */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0b1024] via-[#0f172a] to-[#16294a]" />
        <div className="absolute inset-0 -z-10 opacity-80 bg-[radial-gradient(circle_at_18%_24%,rgba(212,175,55,0.28),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(12,18,36,0.55),transparent_40%)]" />
        <div className="absolute inset-0 z-[-5] bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-secondary/25 blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-12 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl opacity-60" />
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Il marketing non è difficile. <br className="hidden md:block" />
            <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-amber-200">È difficile farlo senza basi.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            E le basi sono nei libri che quasi nessuno studia. Libri che ti insegnano a fare marketing o a delegarlo con consapevolezza.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-secondary text-primary hover:bg-secondary/90 font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-105" asChild>
              <Link href="/percorsi/base">
                Inizia il Percorso
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-secondary/50 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all" asChild>
              <Link href="/chi-sono">
                Scopri il Metodo
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto text-left glass-surface-dark border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] space-y-4">
            <p className="text-base md:text-lg text-slate-100 leading-relaxed">
              Pagine Vincenti è lo studio guidato dei libri che formano davvero un marketer: riassunti chiari, mappe mentali, checklist operative, audio da ripassare e strumenti applicativi per trasformare ogni concetto in decisioni, strategie e deleghe più intelligenti. Niente fuffa, niente hype, nessun metodino: solo fondamenta che reggono nel tempo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Sections - Risorse & App */}
      <section className="relative py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 z-[-1] opacity-70 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.2),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_38%)]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Risorse CTA */}
            <Card className="glass-surface-strong border-2 border-white/60 hover:border-secondary/70 transition-all hover:shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Risorse Pratiche</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  Guide specifiche per settore, checklist operative e strumenti pronti all'uso per applicare subito i concetti dei libri.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Guide per Settore</p>
                      <p className="text-xs text-muted-foreground">Strategie pronte per ristoranti, e-commerce, servizi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Checklist Operative</p>
                      <p className="text-xs text-muted-foreground">Worksheet compilabili per positioning, messaging, customer research</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Template Pronti</p>
                      <p className="text-xs text-muted-foreground">Framework di analisi competitor, template messaging</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/risorse">
                    Esplora le Risorse <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* App CTA */}
            <Card className="glass-surface-strong border-2 border-white/60 hover:border-secondary/70 transition-all hover:shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">App & Strumenti</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  Calcolatori interattivi, tool di analisi e strumenti avanzati per trasformare la teoria in decisioni concrete.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Calcolatori LTV & CAC</p>
                      <p className="text-xs text-muted-foreground">Ottimizza il valore lifetime dei clienti e il costo di acquisizione</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Tool di Pricing</p>
                      <p className="text-xs text-muted-foreground">Analizza elasticità della domanda e strategie di prezzo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Dashboard Metriche</p>
                      <p className="text-xs text-muted-foreground">Monitora KPI e performance marketing in tempo reale</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/app">
                    Scopri le App <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Real Stats Dashboard Section */}
      <section className="px-4 md:px-6 lg:px-8 mt-10 relative z-10 mb-20">
        <RealStatsDashboard />
      </section>

      {/* I 3 Percorsi Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 z-[-1] opacity-60 bg-[radial-gradient(circle_at_25%_10%,rgba(212,175,55,0.14),transparent_32%),radial-gradient(circle_at_75%_90%,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4 glass-surface border border-white/40 rounded-3xl px-6 py-8 shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
            <p className="uppercase tracking-[0.3em] text-sm text-secondary font-semibold">I Percorsi di Pagine Vincenti</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Tre livelli, un'unica direzione: costruire una mente di marketing solida, lucida e ripetibile.</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ogni percorso è pensato per farti smettere di improvvisare e farti ragionare come un decisore: prima le fondamenta, poi la lettura profonda del consumatore, infine la maestria nel progettare sistemi completi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => {
              const Icon = level.icon;
              return (
                <div key={level.key} className="relative group glass-surface-strong rounded-2xl border border-white/60 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/70 flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/80 via-white/60 to-secondary/80 rounded-t-2xl opacity-80" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{level.key}</p>
                      <h3 className="text-xl font-bold text-primary">{level.title}</h3>
                      {level.subtitle ? (
                        <p className="text-sm text-[rgb(15,23,42)]">{level.subtitle}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow">
                    <p className="text-base text-foreground">{level.intro}</p>
                    <details className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3">
                      <summary className="cursor-pointer text-sm font-semibold text-primary leading-relaxed">
                        Questo percorso è per te se...
                      </summary>
                      <ul className="list-disc ml-5 mt-3 space-y-2 text-sm text-muted-foreground">
                        {level.signals.map((signal) => (
                          <li key={signal}>{signal}</li>
                        ))}
                      </ul>
                    </details>
                    <details className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
                      <summary className="cursor-pointer text-sm font-semibold text-primary leading-relaxed">
                        Alla fine sarai in grado di...
                      </summary>
                      <p className="text-sm text-muted-foreground mt-3">{level.build}</p>
                    </details>
                    {level.note && <p className="text-xs text-primary font-semibold">{level.note}</p>}
                  </div>
                  <Button variant="outline" asChild className="mt-4">
                    <Link href={`/percorsi/${level.key}`}>Esplora il percorso</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Classifica Utilità Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 z-[-1] opacity-60 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.16),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.16),transparent_36%)]" />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 glass-surface border border-white/40 rounded-2xl px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
            <div>
              <h2 className="text-3xl font-bold mb-2">Classifica Utilità</h2>
              <p className="text-muted-foreground">I libri più votati dalla community per impatto pratico.</p>
            </div>
            <Button variant="ghost" className="text-primary" asChild>
              <Link href="/libri">
                Vedi classifica completa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      <Footer /> {/* Added back Footer */}
    </div>
  );
}
