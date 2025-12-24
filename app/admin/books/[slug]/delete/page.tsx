import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import fs from "fs/promises";
import path from "path";
import { getBookBySlug } from "@/lib/books";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Image from "next/image";

const ADMIN_COOKIE = "pv_admin_session";

async function deleteBook(slug: string) {
  "use server";

  try {
    // Delete MDX file
    const mdxPath = path.join(process.cwd(), "content", "books", `${slug}.mdx`);
    try {
      await fs.unlink(mdxPath);
    } catch (e) {
      console.warn(`Could not delete MDX: ${mdxPath}`);
    }

    // Delete cover files
    const coverExtensions = ['.jpg', '.jpeg', '.png'];
    for (const ext of coverExtensions) {
      const coverPath = path.join(process.cwd(), "public", "covers", `${slug}${ext}`);
      try {
        await fs.unlink(coverPath);
      } catch (e) {
        // File might not exist
      }
    }

    // Delete audio files
    const audioExtensions = ['.mp3', '.m4a', '.wav'];
    for (const ext of audioExtensions) {
      const audioPath = path.join(process.cwd(), "public", "audio", `${slug}${ext}`);
      try {
        await fs.unlink(audioPath);
      } catch (e) {
        // File might not exist
      }
    }

    // Delete PDF
    const pdfPath = path.join(process.cwd(), "public", "downloads", `${slug}.pdf`);
    try {
      await fs.unlink(pdfPath);
    } catch (e) {
      // File might not exist
    }

    // Delete from Supabase Storage
    if (supabaseAdmin) {
      // Delete from each bucket
      await supabaseAdmin.storage.from("pv-mdx").remove([`books/${slug}.mdx`]);
      await supabaseAdmin.storage.from("pv-covers").remove([`covers/${slug}.jpg`, `covers/${slug}.png`]);
      await supabaseAdmin.storage.from("pv-audio").remove([`audio/${slug}.mp3`, `audio/${slug}.m4a`]);
      await supabaseAdmin.storage.from("pv-covers").remove([`downloads/${slug}.pdf`]);
    }

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/percorsi/[level]", "page");
    revalidatePath("/admin/books");

  } catch (error) {
    console.error("Error deleting book:", error);
    redirect(`/admin/books/${slug}/delete?error=delete_failed`);
  }

  redirect("/admin/books?deleted=true");
}

export default async function DeleteBookPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;

  if (!hasAccess) {
    redirect("/admin?error=unauthorized");
  }

  const slug = params.slug;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const error = searchParams?.error as string | undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-8 pl-0" asChild>
            <Link href="/admin/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla Lista Libri
            </Link>
          </Button>

          <div className="mb-8">
            <Badge className="bg-red-600 text-white mb-2">Azione Irreversibile</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Elimina Libro</h1>
            <p className="text-muted-foreground">
              Stai per eliminare definitivamente questo libro e tutti i suoi file associati.
            </p>
          </div>

          {error === "delete_failed" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">
                  Errore durante l'eliminazione. Alcuni file potrebbero non essere stati rimossi.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Warning Card */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Attenzione!
              </CardTitle>
              <CardDescription className="text-red-700">
                Questa azione è permanente e non può essere annullata.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-5 space-y-2 text-sm text-red-700">
                <li>Il file MDX verrà eliminato da <code>/content/books/</code></li>
                <li>La copertina verrà eliminata da <code>/public/covers/</code></li>
                <li>L'audio verrà eliminato da <code>/public/audio/</code> (se presente)</li>
                <li>Il PDF verrà eliminato da <code>/public/downloads/</code> (se presente)</li>
                <li>Tutti i file verranno rimossi anche da Supabase Storage</li>
                <li>Il libro non apparirà più sul sito</li>
              </ul>
            </CardContent>
          </Card>

          {/* Book Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Libro da Eliminare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative w-24 h-36 bg-muted rounded overflow-hidden flex-shrink-0">
                  {book.coverImage && book.coverImage !== '/covers/placeholder.jpg' ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                      {book.title}
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <Badge variant="outline" className="capitalize mb-2">
                    {book.level}
                  </Badge>
                  <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Slug: <code className="bg-muted px-1 py-0.5 rounded">{book.slug}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Form */}
          <form action={deleteBook.bind(null, slug)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conferma Eliminazione</CardTitle>
                <CardDescription>
                  Per procedere con l'eliminazione, clicca sul pulsante rosso qui sotto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Se hai bisogno di questo libro in futuro, dovrai ricaricarlo manualmente con tutti i suoi file.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="button" variant="outline" className="flex-1 sm:order-1" asChild>
                <Link href="/admin/books">
                  Annulla - Torna Indietro
                </Link>
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="lg"
                className="flex-1 sm:order-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Elimina Definitivamente
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
