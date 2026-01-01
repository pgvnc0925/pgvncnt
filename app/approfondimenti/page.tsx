import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent, LongformCard, InsightCard } from "@/components/design-system"
import { getAllArticles } from "@/lib/articles"

export const metadata = {
  title: "Approfondimenti | Pagine Vincenti",
  description: "Analisi brevi per affinare il tuo approccio strategico",
}

export default function ContenutiPage() {
  const articles = getAllArticles()

  // Mock longform content
  const longformContent = [
    {
      category: "MARKETING",
      title: "Marketing Strutturato",
      description:
        "Un modello operativo per costruire strategie di marketing sostenibili, basate su analisi e non su intuizioni. Dalla segmentazione alla misurazione, un percorso completo.",
      readTime: 45,
      href: "/approfondimenti/marketing-strutturato",
      saved: false,
      progress: 0,
    },
    {
      category: "PRICING",
      title: "Pricing Strategy Framework",
      description:
        "Come costruire una strategia di pricing che riflette value, posizionamento ed elasticità della domanda. Un framework in 5 step applicabile immediatamente.",
      readTime: 38,
      href: "/approfondimenti/pricing-framework",
      saved: true,
      progress: 65,
    },
    {
      category: "METRICHE",
      title: "La metrica che stai ignorando",
      description:
        "Revenue è solo la superficie. Il tasso di conversione per la maggior parte dei business nasconde insights critici. Come calcolare e usare la metrica giusta.",
      readTime: 28,
      href: "/approfondimenti/metrica-conversione",
      saved: false,
      progress: 0,
    },
  ]

  // Mock insights (short articles)
  const insights = [
    {
      tag: "PRICING",
      date: "15 Dic 2025",
      title: "Il prezzo non è solo un numero",
      excerpt:
        "Prezzo è posizionamento. Una strategy che riflette value percepito, contesto economico e competitive positioning. Un framework in 5 step applicabile immediatamente.",
      href: "/approfondimenti/prezzo-numero",
      featured: false,
    },
    {
      tag: "METRICHE",
      date: "10 Dic 2025",
      title: "La metrica che stai ignorando",
      excerpt:
        "Revenue è più importante del tasso di conversione per la maggior parte dei business, ma nasconde insights. Come calcolare e usare conversion value.",
      href: "/approfondimenti/metrica-conversione",
      featured: true,
    },
    {
      tag: "STRATEGIA",
      date: "5 Dic 2025",
      title: "Processo decisionale in 4 step",
      excerpt:
        "Un framework ripetibile per migliorare le decisioni di marketing con maggiore lucidità e ridurre decisioni basate su 200+ scelte strategiche.",
      href: "/approfondimenti/processo-decisionale",
      featured: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Pill variant="accent">Approfondimenti</Pill>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Approfondiamo le Basi
                <br />
                per Decisioni Migliori
              </h1>
              <div className="flex justify-center">
                <UnderlineAccent width="medium" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Contenuti pensati per chi cerca struttura e profondità. Non troverai
              trucchi rapidi, ma modelli di pensiero applicabili alla realtà italiana.
            </p>
          </div>
        </section>

        {/* Longform Section - "Libri e guide" */}
        <section className="container mx-auto px-6 py-12 md:py-20">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Section header */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Analisi e Framework
                </h2>
                <p className="text-muted-foreground">
                  Approfondimenti strutturati per PMI e professionisti
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {longformContent.length} pubblicazioni
              </div>
            </div>

            {/* Longform cards */}
            <div className="space-y-4">
              {longformContent.map((content, index) => (
                <LongformCard key={index} {...content} />
              ))}
            </div>
          </div>
        </section>

        {/* Insights Section - Short articles */}
        <section className="container mx-auto px-6 py-12 md:py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Section header */}
            <div className="text-center space-y-4">
              <Pill variant="muted">INSIGHTS RECENTI</Pill>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Approfondimenti e riflessioni
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Analisi brevi per affinare il tuo approccio strategico
              </p>
            </div>

            {/* Insight cards grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
