import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, FileText, Wrench } from "lucide-react";
import Link from "next/link";

export default function StorePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-16 border-b border-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShoppingCart className="h-8 w-8 text-secondary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Risorse</h1>
              <p className="text-xl text-slate-300">
                Guide specifiche per settore, checklist operative e strumenti pronti all'uso
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Categories Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              <Button variant="default">Tutti</Button>
              <Button variant="outline">Guide Settore</Button>
              <Button variant="outline">Checklist</Button>
              <Button variant="outline">Tool & App</Button>
            </div>

            {/* Example Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Example Product: Industry Guide */}
              <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge className="bg-secondary text-primary">€4.90</Badge>
                  </div>
                  <CardTitle className="text-lg">Persuasione per Ristoranti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    12 strategie pronte da applicare nel tuo ristorante basate su "Le Armi della Persuasione" di Cialdini
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Menu design ottimizzato</li>
                    <li>✓ Script per upselling</li>
                    <li>✓ Tecniche di fidelizzazione</li>
                    <li>✓ PDF 15 pagine + esempi reali</li>
                  </ul>
                  <Button className="w-full" disabled>
                    Prossimamente
                  </Button>
                </CardContent>
              </Card>

              {/* Example Product: Checklist */}
              <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge className="bg-secondary text-primary">€2.90</Badge>
                  </div>
                  <CardTitle className="text-lg">Checklist Positioning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Guida step-by-step per definire il posizionamento del tuo business in 7 giorni
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ 25 domande chiave</li>
                    <li>✓ Worksheet compilabile</li>
                    <li>✓ Framework di analisi competitor</li>
                    <li>✓ Template messaging</li>
                  </ul>
                  <Button className="w-full" disabled>
                    Prossimamente
                  </Button>
                </CardContent>
              </Card>

              {/* Example Product: Tool Access */}
              <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Wrench className="h-8 w-8 text-primary" />
                    <Badge className="bg-secondary text-primary">€9.90</Badge>
                  </div>
                  <CardTitle className="text-lg">Calcolatore LTV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Tool interattivo per calcolare il Lifetime Value dei tuoi clienti e ottimizzare CAC
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Accesso web illimitato</li>
                    <li>✓ Export dati CSV</li>
                    <li>✓ Template scenario analysis</li>
                    <li>✓ Video tutorial incluso</li>
                  </ul>
                  <Button className="w-full" disabled>
                    Prossimamente
                  </Button>
                </CardContent>
              </Card>

            </div>

            {/* Coming Soon Notice */}
            <Card className="mt-12 border-secondary/30 bg-secondary/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-3">Risorse in Costruzione</h3>
                <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                  Stiamo preparando guide specifiche per settore, checklist operative e strumenti pratici.
                  Iscriviti alla newsletter per essere avvisato quando saranno disponibili.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/percorsi/base">
                      Inizia con i Libri Gratuiti
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/unlock">
                      Iscriviti alla Newsletter
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Download className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">Download Immediato</h4>
                <p className="text-sm text-muted-foreground">
                  Accesso istantaneo dopo l'acquisto
                </p>
              </div>
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">Pronti all'Uso</h4>
                <p className="text-sm text-muted-foreground">
                  Template e strategie applicabili subito
                </p>
              </div>
              <div className="text-center space-y-2">
                <ShoppingCart className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">Prezzo Accessibile</h4>
                <p className="text-sm text-muted-foreground">
                  Micro-prodotti da €2.90 a €9.90
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
