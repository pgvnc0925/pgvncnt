import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeProPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Benvenuto in PV Pro</h1>
          <p className="text-muted-foreground">
            Abbonamento attivato. Il tuo cookie PV Pro è impostato: accedi subito ai percorsi avanzati e ai materiali premium.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/pro">Vai all'area Pro</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/risorse-base">Risorse Base</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
