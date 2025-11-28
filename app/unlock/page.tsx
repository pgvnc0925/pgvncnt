"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function UnlockPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 md:px-6 py-12">Caricamento...</main>
          <Footer />
        </div>
      }
    >
      <UnlockForm />
    </Suspense>
  );
}

function UnlockForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/magic-callback?email=${encodeURIComponent(
      email
    )}&next=${encodeURIComponent(nextParam)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    // store email/next locally so callback can verify even if provider strips params
    document.cookie = `pv_magic_email=${encodeURIComponent(email)}; path=/; max-age=600`;
    document.cookie = `pv_magic_next=${encodeURIComponent(nextParam)}; path=/; max-age=600`;

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sblocca le risorse Base</CardTitle>
              <CardDescription>
                Inserisci la tua email. Riceverai un link magico per accedere a tutte le risorse gratuite.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                <Button type="submit" className="w-full" disabled={status === "sending"}>
                  {status === "sending" ? "Invio in corso..." : "Invia link magico"}
                </Button>
              </form>
              {status === "sent" && (
                <p className="text-sm text-green-600 mt-3">
                  Controlla la tua email: abbiamo inviato un link di accesso.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-600 mt-3">
                  {error || "Si è verificato un errore. Riprova."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
