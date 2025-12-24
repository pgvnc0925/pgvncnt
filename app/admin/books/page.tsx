import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllBooks, getBookStats } from "@/lib/books";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Eye, BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";

const ADMIN_COOKIE = "pv_admin_session";

export default async function AdminBooksPage() {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;

  if (!hasAccess) {
    redirect("/admin?error=unauthorized");
  }

  const books = getAllBooks();
  const stats = getBookStats();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 pl-0" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla Dashboard Admin
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge className="bg-secondary text-primary mb-2">Admin Only</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Gestione Libri</h1>
              <p className="text-muted-foreground mt-2">
                Visualizza, modifica ed elimina i libri nella tua libreria
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/books/new">
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Nuovo Libro
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        {/* Books List */}
        {books.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">Nessun libro trovato</h3>
              <p className="text-muted-foreground">
                Inizia aggiungendo il tuo primo libro alla libreria.
              </p>
              <Button asChild>
                <Link href="/admin/books/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi Libro
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  {/* Cover Image */}
                  <div className="relative w-full md:w-32 h-48 md:h-auto aspect-[2/3] bg-muted rounded overflow-hidden flex-shrink-0">
                    {book.coverImage && book.coverImage !== '/covers/placeholder.jpg' ? (
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                        {book.title}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-grow space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {book.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">⭐ {book.rating}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description || "Nessuna descrizione disponibile"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Slug: <code className="bg-muted px-1 py-0.5 rounded">{book.slug}</code></span>
                      {book.readingTimeSystem && (
                        <span className="ml-auto">⏱️ {book.readingTimeSystem}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/libri/${book.slug}`} target="_blank">
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Anteprima</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/books/${book.slug}/edit`}>
                        <Edit className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Modifica</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" asChild>
                      <Link href={`/admin/books/${book.slug}/delete`}>
                        <Trash2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Elimina</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
