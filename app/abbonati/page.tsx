"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AbbonatiPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      if (!res.ok) {
        throw new Error("Errore durante la creazione della sessione di pagamento");
      }
      const data = await res.json();
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Errore inatteso");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Passa a PV Pro</h1>
          <p className="text-muted-foreground">
            Sblocca percorsi Intermedio e Avanzato, toolkit Pro, e materiali premium.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>PV Pro</CardTitle>
              <CardDescription>Accesso completo a percorsi e risorse avanzate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-left list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>Percorsi Intermedio e Avanzato</li>
                <li>Audio, mappe e quiz avanzati</li>
                <li>Accesso prioritario ai nuovi tool</li>
              </ul>
              <Button className="w-full" onClick={startCheckout} disabled={loading}>
                {loading ? "Reindirizzamento..." : "Abbonati ora"}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
