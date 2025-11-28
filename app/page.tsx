import { Button } from "@/components/ui/button";
import { LiveDashboard } from "@/components/dashboard/live-dashboard";
import { BookCard } from "@/components/books/book-card";
import { books } from "@/data/mock-books";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Award } from "lucide-react";
import { Header } from "@/components/layout/header"; // Added back Header and Footer imports
import { Footer } from "@/components/layout/footer";

export default function Home() {
  // Get top 3 books for "Classifica Utilità"
  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const levels = [
    {
      key: "base",
      title: "Base",
      subtitle: "",
      icon: CheckCircle2,
      intro:
        "Qui costruisci il modo corretto di pensare. Niente tattiche, niente hype: solo cio che un professionista deve sapere per non navigare a caso.",
      signals: [
        "Non hai chiara la differenza tra bisogni, desideri, tensioni e valore percepito.",
        "Non sai rispondere con certezza alle tre domande fondamentali del marketing: cosa vende davvero l'azienda, a quali bisogni risponde, come li soddisfa meglio degli altri.",
        "Non hai familiarita profonda con posizionamento, USP, marketing mix, piramide di Maslow, segmentazione reale.",
        "Usi la pratica senza un modello mentale che la guidi.",
      ],
      build:
        "Strategia, differenziazione, senso del mercato e regole che governano ogni decisione. E il punto di partenza di chi vuole smettere di improvvisare.",
    },
    {
      key: "intermedio",
      title: "Intermedio",
      subtitle: "",
      icon: TrendingUp,
      intro:
        "Qui impari a leggere la mente del cliente, interpretarne le motivazioni e far rispondere il mercato ai tuoi messaggi.",
      signals: [
        "Vuoi scoprire perche le persone comprano davvero, non perche dicono di comprare.",
        "Vuoi capire i bias cognitivi che alterano ogni decisione (e come usarli in modo etico).",
        "Vuoi creare messaggi che toccano i tasti giusti e collegarli alla tua nicchia reale.",
        "Vuoi capire cosa succede nella testa del cliente quando vede un annuncio, un prezzo, un'offerta.",
      ],
      build:
        "Lettura profonda del consumatore, mappe motivazionali, segmentazione psicografica e situazionale, copy che parla al sistema 1 e 2, offerte costruite per generare risposta.",
      note:
        "E il livello che porta sopra l'80% dei professionisti operativi, perche qui nasce la capacita di influenzare.",
    },
    {
      key: "avanzato",
      title: "Avanzato",
      subtitle: "",
      icon: Award,
      intro:
        "Qui arrivi al punto in cui il marketing diventa un sistema, non un insieme di tecniche.",
      signals: [
        "Vuoi pensare come i top marketer e decidere con lucidita.",
        "Vuoi delegare con criterio e creare processi ripetibili.",
        "Vuoi integrare strategia, copywriting, storytelling, selling, branding.",
        "Vuoi costruire un punto di vista elevato sul mercato.",
      ],
      build:
        "Leggere un mercato come un analista, progettare sistemi di marketing interi, integrare psicologia, strategia, narrazione, economics e costruire un vantaggio competitivo mentale difficile da eguagliare.",
      note: "E il livello che porta nel top 2,5% del settore. Non e piu apprendimento: e trasformazione.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Added back Header */}

      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-6 lg:px-8 bg-primary overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Il marketing non e difficile. <br className="hidden md:block" />
            <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-amber-200">E difficile farlo senza basi.</span>
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

          <div className="max-w-4xl mx-auto text-left bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg space-y-4">
            <p className="text-base md:text-lg text-slate-100 leading-relaxed">
              Pagine Vincenti e lo studio guidato dei libri che formano davvero un marketer: riassunti chiari, mappe mentali, checklist operative, audio da ripassare e strumenti applicativi per trasformare ogni concetto in decisioni, strategie e deleghe piu intelligenti. Niente fuffa, niente hype, nessun metodino: solo fondamenta che reggono nel tempo.
            </p>
          </div>
        </div>
      </section>

      {/* Live Dashboard Section */}
      <section className="px-4 md:px-6 lg:px-8 mt-10 relative z-10 mb-20">
        <LiveDashboard />
      </section>

      {/* I 3 Percorsi Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <p className="uppercase tracking-[0.3em] text-sm text-secondary font-semibold">I Percorsi di Pagine Vincenti</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Tre livelli, un'unica direzione: costruire una mente di marketing solida, lucida e ripetibile.</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ogni percorso e pensato per farti smettere di improvvisare e farti ragionare come un decisore: prima le fondamenta, poi la lettura profonda del consumatore, infine la maestria nel progettare sistemi completi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => {
              const Icon = level.icon;
              return (
                <div key={level.key} className="relative group rounded-2xl border border-border bg-card p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary rounded-t-2xl opacity-70" />
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
                        Questo percorso e per te se...
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
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
