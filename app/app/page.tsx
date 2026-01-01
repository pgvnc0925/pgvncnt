import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, ToolCard, UnderlineAccent } from "@/components/design-system"
import { BarChart3, Target, Lightbulb, Calculator, Users, TrendingUp } from "lucide-react"

export const metadata = {
  title: "Suite Applicativa | Pagine Vincenti",
  description: "Strumenti che lavorano insieme per marketing e organizzazione",
}

export default function SuitePage() {
  const tools = [
    {
      icon: BarChart3,
      title: "Marketing Monitor",
      tagline: "Traccia le metriche che contano davvero",
      description:
        "Dashboard centralizzata per monitorare acquisition, conversion e retention su campagne e canali. Dati in tempo reale con insight su metriche chiave.",
      features: [
        "Analisi multi-canale in tempo reale",
        "ROI dettagliato per campagna",
        "Alert automatici su anomalie",
      ],
      status: "live" as const,
      href: "/app/marketing-monitor",
      iconBgColor: "bg-blue-100",
      gradientFrom: "rgba(59, 130, 246, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
    {
      icon: Target,
      title: "Positioning Lab",
      tagline: "Costruisci posizionamento distintivo",
      description:
        "Framework guidato per definire e validare il tuo posizionamento strategico. Dal canvas alla comunicazione.",
      features: [
        "Canvas di posizionamento iterativo",
        "Test di messaggistica A/B",
        "Export per brief e briefing",
      ],
      status: "live" as const,
      href: "/app/positioning-lab",
      iconBgColor: "bg-purple-100",
      gradientFrom: "rgba(168, 85, 247, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
    {
      icon: Lightbulb,
      title: "Value Prop Builder",
      tagline: "Proposta di valore chiara e testabile",
      description:
        "Strumento per costruire value proposition basate su jobs-to-be-done e pain/gain analysis.",
      features: [
        "Canvas Jobs-to-be-Done",
        "Mappatura pain/gain",
        "Test di validazione messaggio",
      ],
      status: "beta" as const,
      href: "/app/value-prop",
      iconBgColor: "bg-amber-100",
      gradientFrom: "rgba(245, 158, 11, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
    {
      icon: Calculator,
      title: "Pricing Calculator",
      tagline: "Strategie di pricing data-driven",
      description:
        "Calcolatore avanzato per analizzare elasticità della domanda, posizionamento prezzo e margini.",
      features: [
        "Analisi elasticità domanda",
        "Simulazione scenari pricing",
        "Break-even e margini dinamici",
      ],
      status: "beta" as const,
      href: "/app/pricing",
      iconBgColor: "bg-green-100",
      gradientFrom: "rgba(34, 197, 94, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
    {
      icon: Users,
      title: "Customer DNA",
      tagline: "Profili cliente basati su comportamenti",
      description:
        "Costruisci segmenti comportamentali basati su dati reali, non demographic fantasy.",
      features: [
        "Segmentazione comportamentale",
        "Journey mapping per segmento",
        "Insight azionabili su messaging",
      ],
      status: "development" as const,
      iconBgColor: "bg-rose-100",
      gradientFrom: "rgba(244, 63, 94, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
    {
      icon: TrendingUp,
      title: "Funnel Optimizer",
      tagline: "Ottimizza conversion step-by-step",
      description:
        "Analizza ogni fase del funnel, identifica colli di bottiglia e testa ipotesi di ottimizzazione.",
      features: [
        "Analisi granulare per step",
        "Test ipotesi strutturati",
        "Prediction modelli di miglioramento",
      ],
      status: "development" as const,
      iconBgColor: "bg-indigo-100",
      gradientFrom: "rgba(99, 102, 241, 0.05)",
      gradientTo: "rgba(15, 23, 42, 0.02)",
    },
  ]

  const liveCount = tools.filter((t) => t.status === "live").length
  const betaCount = tools.filter((t) => t.status === "beta").length
  const devCount = tools.filter((t) => t.status === "development").length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero/Intro */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="space-y-6 flex-1">
                <Pill variant="muted">TUTTI GLI STRUMENTI</Pill>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                    Ecosistema integrato
                  </h1>
                  <UnderlineAccent width="medium" />
                </div>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                  Strumenti che lavorano insieme per marketing e organizzazione
                </p>
              </div>

              {/* Summary stats */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>
                    {liveCount} live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>
                    {betaCount} beta
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>
                    {devCount} in sviluppo
                  </span>
                </div>
              </div>
            </div>

            {/* Tool Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
