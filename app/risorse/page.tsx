import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent, FeatureCard } from "@/components/design-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Download, FileText, Wrench } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Risorse | Pagine Vincenti",
  description: "Guide specifiche per settore, checklist operative e strumenti pronti all'uso",
}

export default function RisorsePage() {
  const resources = [
    {
      icon: FileText,
      title: "Persuasione per Ristoranti",
      price: "€4.90",
      description:
        "12 strategie pronte da applicare nel tuo ristorante basate su 'Le Armi della Persuasione' di Cialdini",
      features: [
        "Menu design ottimizzato",
        "Script per upselling",
        "Tecniche di fidelizzazione",
        "PDF 15 pagine + esempi reali",
      ],
      category: "Guide Settore",
    },
    {
      icon: FileText,
      title: "Checklist Positioning",
      price: "€2.90",
      description:
        "Guida step-by-step per definire il posizionamento del tuo business in 7 giorni",
      features: [
        "25 domande chiave",
        "Worksheet compilabile",
        "Framework di analisi competitor",
        "Template messaging",
      ],
      category: "Checklist",
    },
    {
      icon: Wrench,
      title: "Calcolatore LTV",
      price: "€9.90",
      description:
        "Tool interattivo per calcolare il Lifetime Value dei tuoi clienti e ottimizzare CAC",
      features: [
        "Accesso web illimitato",
        "Export dati CSV",
        "Template scenario analysis",
        "Video tutorial incluso",
      ],
      category: "Tool & App",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Pill variant="accent" icon={ShoppingCart}>
              Risorse Pratiche
            </Pill>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Strumenti Pronti
                <br />
                per Applicare Subito
              </h1>
              <div className="flex justify-center">
                <UnderlineAccent width="medium" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Guide specifiche per settore, checklist operative e strumenti pronti
              all'uso per trasformare teoria in pratica.
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="container mx-auto px-6 pb-8">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center">
            <Button variant="default" size="sm">
              Tutti
            </Button>
            <Button variant="outline" size="sm">
              Guide Settore
            </Button>
            <Button variant="outline" size="sm">
              Checklist
            </Button>
            <Button variant="outline" size="sm">
              Tool & App
            </Button>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="container mx-auto px-6 pb-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card
                  key={index}
                  className="flex flex-col border-2 hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <Badge className="bg-secondary text-primary font-semibold">
                        {resource.price}
                      </Badge>
                    </div>
                    <Pill variant="muted" className="mb-2 w-fit">
                      {resource.category}
                    </Pill>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {resource.description}
                    </p>
                    <ul className="space-y-2 flex-1">
                      {resource.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" disabled>
                      Prossimamente
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="container mx-auto px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Card className="border-secondary/30 bg-secondary/5 overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Risorse in Costruzione
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Stiamo preparando guide specifiche per settore, checklist operative
                  e strumenti pratici. Iscriviti alla newsletter per essere avvisato
                  quando saranno disponibili.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/percorsi/base">Inizia con i Libri Gratuiti</Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link href="/unlock">Iscriviti alla Newsletter</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-6 py-12 md:py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perché scegliere le nostre risorse
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Download}
                title="Download Immediato"
                description="Accesso istantaneo dopo l'acquisto. Niente attese, inizia subito a lavorare."
                iconColor="bg-blue-100 text-blue-600"
              />
              <FeatureCard
                icon={FileText}
                title="Pronti all'Uso"
                description="Template e strategie applicabili immediatamente al tuo business senza modifiche."
                iconColor="bg-secondary/20 text-secondary"
              />
              <FeatureCard
                icon={ShoppingCart}
                title="Prezzo Accessibile"
                description="Micro-prodotti da €2.90 a €9.90. Investimento minimo, valore massimo."
                iconColor="bg-green-100 text-green-600"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
