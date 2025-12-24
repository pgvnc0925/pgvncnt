import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight, Settings, FileText, Users, Plus } from "lucide-react";
import { getBookStats } from "@/lib/books";

const ADMIN_COOKIE = "pv_admin_session";

async function authenticateAdmin(formData: FormData) {
  "use server";
  const token = (formData.get("token") as string | null)?.trim() ?? "";
  const adminSecret = process.env.ADMIN_PASSWORD;
  if (!adminSecret) {
    throw new Error("ADMIN_PASSWORD non configurata nell'ambiente");
  }
  if (token !== adminSecret) {
    redirect("/admin?error=1");
  }
  (await cookies()).set(ADMIN_COOKIE, adminSecret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/admin");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;
  const showError = searchParams?.error === "1";

  // Get book stats if authenticated
  let stats = { total: 0, byLevel: { base: 0, intermedio: 0, avanzato: 0 } };
  if (hasAccess) {
    stats = getBookStats();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto mb-10 text-center space-y-3">
          <Badge className="bg-secondary text-primary">Admin Only</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Dashboard Amministratore</h1>
          <p className="text-muted-foreground">
            Centro di controllo per la gestione del sito Pagine Vincenti
          </p>
        </div>

        {!hasAccess ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Accesso riservato</CardTitle>
                <CardDescription>Inserisci la password amministratore per continuare.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showError && (
                  <p className="text-sm text-red-600">Password errata. Riprova.</p>
                )}
                <form action={authenticateAdmin} className="space-y-3">
                  <Input type="password" name="token" placeholder="Password admin" required />
                  <Button type="submit" className="w-full">
                    Entra
                  </Button>
                </form>
                {!adminSecret && (
                  <p className="text-xs text-red-600">
                    Variabile d'ambiente ADMIN_PASSWORD mancante. Impostala per abilitare l'accesso.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Totale Libri</CardDescription>
                  <CardTitle className="text-3xl">{stats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Livello Base</CardDescription>
                  <CardTitle className="text-3xl text-slate-600">{stats.byLevel.base}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Livello Intermedio</CardDescription>
                  <CardTitle className="text-3xl text-amber-600">{stats.byLevel.intermedio}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Livello Avanzato</CardDescription>
                  <CardTitle className="text-3xl text-primary">{stats.byLevel.avanzato}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Azioni Rapide</h2>
              <div className="grid md:grid-cols-3 gap-6">

                {/* Gestione Libri */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Libri</CardTitle>
                        <CardDescription className="mt-1">
                          Elenco libri e nuovo inserimento
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Consulta i libri già caricati oppure aggiungine di nuovi con l'import MDX.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/admin/books">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Elenco
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href="/admin/books/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Nuovo
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Site Preview */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Anteprima Sito</CardTitle>
                        <CardDescription className="mt-1">
                          Visualizza il sito pubblico
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Visualizza il sito come lo vedono gli utenti. Controlla l'aspetto dei libri e delle pagine.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/" target="_blank">
                          Homepage
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/percorsi/base" target="_blank">
                          Percorsi
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Articoli */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Articoli</CardTitle>
                        <CardDescription className="mt-1">
                          Approfondimenti e contenuti editoriali
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Visualizza gli approfondimenti già pubblicati o aggiungine di nuovi.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/articles">
                          Elenco
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/admin/articles/new">
                          Nuovo
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

            {/* Info Section */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informazioni Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Environment</p>
                    <p className="font-mono">{process.env.NODE_ENV}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Supabase</p>
                    <p className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurato' : '❌ Non configurato'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Libri nel Sistema</p>
                    <p className="font-semibold">{stats.total} libri</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Admin Auth</p>
                    <p className="text-green-600 font-semibold">✓ Autenticato</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Section */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-900">📚 Dashboard Admin</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-900 space-y-2">
                <p>Dashboard amministratore di Pagine Vincenti.</p>
                <p className="text-muted-foreground">
                  Gestisci contenuti, visualizza statistiche e controlla il sito.
                </p>
              </CardContent>
            </Card>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
