import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowRight } from "lucide-react"

export default function ChiSonoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">Chi sono</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ciao, sono <strong>Timoteo Pasquali</strong>, consulente specializzato in{" "}
              <strong>AI e business automation</strong>.
            </p>

            <p className="leading-relaxed">
              Ho creato <strong>Pagine Vincenti</strong> per un motivo semplice: troppi libri di business
              rimangono sulla mensola, ricchi di idee ma poveri di applicazione pratica.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">La filosofia</h2>

            <p className="leading-relaxed">
              &ldquo;Non limitarti a leggere il framework. Usalo.&rdquo;
            </p>

            <p className="leading-relaxed">
              Ogni strumento su questo sito prende concetti da bestseller internazionali e li trasforma
              in tool interattivi che puoi usare subito. Niente teoria astratta, solo applicazione pratica.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Perché è gratis?</h2>

            <p className="leading-relaxed">
              Questo è il mio showcase pubblico: dimostro che so trasformare framework complessi in
              software utilizzabile. Se ti servono soluzioni personalizzate di AI o automazione per
              il tuo business, parliamone.
            </p>

            <div className="bg-muted rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">Cosa faccio</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Integrazione AI in processi aziendali</li>
                <li>✓ Automazione di workflow complessi</li>
                <li>✓ Sviluppo di tool personalizzati per PMI</li>
                <li>✓ Consulenza strategica su AI e produttività</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Vuoi lavorare insieme?</h2>

            <p className="leading-relaxed">
              Se questi tool ti hanno dato valore e pensi che potrei aiutare la tua azienda,
              visita il mio sito principale.
            </p>

            <div className="flex gap-4 mt-8">
              <Button size="lg" asChild>
                <a
                  href="https://timoteopasquali.it"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scopri i miei servizi <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tools">Esplora i tool</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}