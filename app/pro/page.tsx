import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Area Pro</h1>
            <p className="text-muted-foreground">Contenuti e strumenti riservati agli abbonati PV Pro.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Toolkit Pro</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Qui troverai i materiali avanzati (audio, mappe, quiz) e i tool premium.
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
