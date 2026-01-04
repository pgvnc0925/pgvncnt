import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent } from "@/components/design-system"
import { ApprofondimentiClientPage } from "./client-page"

export const metadata = {
  title: "Approfondimenti | Pagine Vincenti",
  description: "Guide complete per chi non vuole più improvvisare",
}

// Helper function to map tags to topics
function getTopicFromTags(tags: string[]): string {
  const tagString = tags.join(' ').toLowerCase()

  if (tagString.includes('marketing') || tagString.includes('posizionamento') || tagString.includes('branding')) {
    return 'Marketing & Posizionamento'
  }
  if (tagString.includes('acquisizione') || tagString.includes('lead') || tagString.includes('traffico')) {
    return 'Acquisizione Clienti'
  }
  if (tagString.includes('conversione') || tagString.includes('vendita') || tagString.includes('sales')) {
    return 'Conversione & Vendita'
  }
  if (tagString.includes('esperienza') || tagString.includes('customer') || tagString.includes('retention')) {
    return 'Esperienza Cliente'
  }
  if (tagString.includes('sistemi') || tagString.includes('organizzazione') || tagString.includes('management')) {
    return 'Sistemi & Organizzazione'
  }
  if (tagString.includes('strategia') || tagString.includes('strategy') || tagString.includes('modello')) {
    return 'Strategia & Modello di Business'
  }
  if (tagString.includes('crescita') || tagString.includes('scalabilità') || tagString.includes('scale')) {
    return 'Crescita & Scalabilità'
  }
  if (tagString.includes('decision') || tagString.includes('decisione') || tagString.includes('okr')) {
    return 'Decision Making'
  }

  return 'Marketing & Posizionamento' // default
}

// Helper function to determine article level
function getArticleLevel(tags: string[]): 'Base' | 'Intermedio' | 'Avanzato' {
  const tagString = tags.join(' ').toLowerCase()

  if (tagString.includes('avanzato') || tagString.includes('advanced')) {
    return 'Avanzato'
  }
  if (tagString.includes('intermedio') || tagString.includes('intermediate')) {
    return 'Intermedio'
  }

  return 'Base' // default
}

export default function ContenutiPage() {
  // Mock pillar content (guide fondamentali)
  const pillars = [
    {
      category: "MARKETING",
      title: "Marketing Strutturato",
      description:
        "Un modello operativo per costruire strategie di marketing sostenibili, basate su analisi e non su intuizioni. Dalla segmentazione alla misurazione, un percorso completo.",
      readTime: 45,
      href: "/approfondimenti/marketing-strutturato",
      topic: "Marketing & Posizionamento",
      level: "Intermedio" as const,
    },
    {
      category: "PRICING",
      title: "Pricing Strategy Framework",
      description:
        "Come costruire una strategia di pricing che riflette value, posizionamento ed elasticità della domanda. Un framework in 5 step applicabile immediatamente.",
      readTime: 38,
      href: "/approfondimenti/pricing-framework",
      topic: "Strategia & Modello di Business",
      level: "Avanzato" as const,
    },
    {
      category: "METRICHE",
      title: "La metrica che stai ignorando",
      description:
        "Revenue è solo la superficie. Il tasso di conversione per la maggior parte dei business nasconde insights critici. Come calcolare e usare la metrica giusta.",
      readTime: 28,
      href: "/approfondimenti/metrica-conversione",
      topic: "Conversione & Vendita",
      level: "Base" as const,
    },
  ]

  // Mock insights (articoli brevi)
  const insights = [
    {
      tag: "PRICING",
      date: "15 Dic 2025",
      title: "Il prezzo non è solo un numero",
      excerpt:
        "Prezzo è posizionamento. Una strategy che riflette value percepito, contesto economico e competitive positioning. Un framework in 5 step applicabile immediatamente.",
      href: "/approfondimenti/prezzo-numero",
      featured: false,
      topic: "Strategia & Modello di Business",
    },
    {
      tag: "METRICHE",
      date: "10 Dic 2025",
      title: "La metrica che stai ignorando",
      excerpt:
        "Revenue è più importante del tasso di conversione per la maggior parte dei business, ma nasconde insights. Come calcolare e usare conversion value.",
      href: "/approfondimenti/metrica-conversione",
      featured: true,
      topic: "Conversione & Vendita",
    },
    {
      tag: "STRATEGIA",
      date: "5 Dic 2025",
      title: "Processo decisionale in 4 step",
      excerpt:
        "Un framework ripetibile per migliorare le decisioni di marketing con maggiore lucidità e ridurre decisioni basate su 200+ scelte strategiche.",
      href: "/approfondimenti/processo-decisionale",
      featured: false,
      topic: "Decision Making",
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
                Guide complete per chi non vuole più improvvisare.
              </h1>
              <div className="flex justify-center -mt-3">
                <UnderlineAccent width="long" sketched />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Analisi, modelli e criteri per iniziare a decidere con metodo.
            </p>
          </div>
        </section>

        {/* Client Component with filters and content */}
        <ApprofondimentiClientPage pillars={pillars} insights={insights} articles={[]} />
      </main>

      <Footer />
    </div>
  )
}
