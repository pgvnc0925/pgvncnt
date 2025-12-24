import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-secondary text-primary mb-2">Prossimamente</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Pagine Vincenti PRO</h1>
            <p className="text-lg text-muted-foreground">
              L'abbonamento PRO sarà disponibile una volta completati tutti i percorsi formativi.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <CardTitle>Cosa includerà PRO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Accesso completo a tutti i percorsi</p>
                    <p className="text-muted-foreground">Base, Intermedio e Avanzato con tutti i materiali</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Tool e risorse premium</p>
                    <p className="text-muted-foreground">Strumenti applicativi, template e framework esclusivi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nel frattempo...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tutti i libri del percorso Base sono già disponibili gratuitamente con la tua email.
                </p>
                <Button asChild>
                  <Link href="/percorsi/base">
                    Inizia dal Percorso Base →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
