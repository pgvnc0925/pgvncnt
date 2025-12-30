import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";
import { ExitToLandingButton } from "@/components/app/exit-to-landing-button";
import Link from "next/link";

const courses = [
  {
    id: "marketing-customer-behavior",
    title: "Marketing & Customer Behavior",
    description:
      "Percorso completo su acquisizione, messaggistica e comportamento del cliente. Dai fondamentali ai sistemi di conversione.",
    modules: [
      "Fundamentals: posizionamento, proposta di valore",
      "Psicologia del cliente e leve persuasive",
      "Sistemi di acquisizione e ottimizzazione della conversione",
    ],
    cta: "Accedi al corso",
  },
  {
    id: "entrepreneurship-systems",
    title: "Imprenditoria & Sistemi",
    description:
      "Costruisci processi, delega e governance per un business che funziona senza la tua presenza costante.",
    modules: [
      "Architettura dei processi e SOP",
      "Team, QA e leadership operativa",
      "Metriche, automazione e miglioramento continuo",
    ],
    cta: "Accedi al corso",
  },
];

export default function CorsiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ExitToLandingButton appSlug="corsi" />
      <Header />

      <main className="flex-grow">
        <section className="bg-primary py-16 border-b border-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <Badge className="bg-secondary text-primary">Accesso a pagamento</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                I nostri corsi avanzati
              </h1>
              <p className="text-xl text-slate-200">
                Prima compila la valutazione: ti diremo quale corso è più adatto al tuo caso. I corsi sono protetti e richiedono abbonamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/valutazione">
                    Fai la valutazione
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white/40" asChild>
                  <Link href="/abbonati">
                    Abbonati e accedi
                    <ShoppingCart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Accesso protetto
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Contenuti premium
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{course.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-grow">
                  <div className="space-y-2">
                    {course.modules.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-secondary mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <Button className="w-full" asChild>
                      <Link href="/abbonati">{course.cta}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
