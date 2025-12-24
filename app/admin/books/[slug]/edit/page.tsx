import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getBookWithContent } from "@/lib/books";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_COOKIE = "pv_admin_session";

function generateMDX(frontmatter: Record<string, any>, content: string): string {
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  return `---
title: "${frontmatter.title}"
slug: "${frontmatter.slug}"
author: "${frontmatter.author}"
${frontmatter.year ? `year: ${frontmatter.year}` : ''}
level: "${frontmatter.level}"
pvCategory: "${frontmatter.pvCategory}"
metaTitle: "${frontmatter.metaTitle || frontmatter.title}"
metaDescription: "${frontmatter.metaDescription || frontmatter.excerpt}"
excerpt: "${frontmatter.excerpt}"
tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]
coverImage: "${frontmatter.coverImage}"
rating: ${frontmatter.rating || 4.5}
reviewCount: ${frontmatter.reviewCount || 0}
readingTimeFull: "${frontmatter.readingTimeFull}"
readingTimeSystem: "${frontmatter.readingTimeSystem}"
${frontmatter.amazonLink ? `amazonLink: "${frontmatter.amazonLink}"` : ''}
---

${content}
`;
}

async function saveFile(filePath: string, content: Buffer | string) {
  await fs.writeFile(filePath, content);
}

async function uploadToSupabase(bucket: string, filePath: string, buffer: Buffer, contentType: string) {
  if (!supabaseAdmin) return;

  await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, buffer, { upsert: true, contentType });
}

async function updateBook(slug: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const level = formData.get("level") as string;
  const pvCategory = formData.get("pvCategory") as string;
  const tags = formData.get("tags") as string;
  const rating = formData.get("rating") as string;
  const readingTimeFull = formData.get("readingTimeFull") as string;
  const readingTimeSystem = formData.get("readingTimeSystem") as string;
  const excerpt = formData.get("excerpt") as string;
  const year = formData.get("year") as string;
  const amazonLink = formData.get("amazonLink") as string;
  const content = formData.get("content") as string;
  const coverFile = formData.get("cover") as File | null;
  const audioFile = formData.get("audio") as File | null;
  const pdfFile = formData.get("pdf") as File | null;

  const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

  const frontmatter = {
    title,
    slug,
    author,
    year: year ? parseInt(year) : undefined,
    level,
    pvCategory,
    tags: tagsArray,
    rating: parseFloat(rating),
    reviewCount: 0,
    readingTimeFull,
    readingTimeSystem,
    excerpt,
    amazonLink,
    coverImage: `${slug}.jpg`,
    metaTitle: `${title} - Riassunto | Pagine Vincenti`,
    metaDescription: excerpt,
  };

  const mdxContent = generateMDX(frontmatter, content);

  try {
    // Update MDX file
    const mdxPath = path.join(process.cwd(), "content", "books", `${slug}.mdx`);
    await saveFile(mdxPath, mdxContent);

    // Upload to Supabase
    if (supabaseAdmin) {
      await uploadToSupabase(
        "pv-mdx",
        `books/${slug}.mdx`,
        Buffer.from(mdxContent),
        "text/markdown"
      );
    }

    // Update cover if provided
    if (coverFile && coverFile.size > 0) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const coverExt = path.extname(coverFile.name);
      const coverPath = path.join(process.cwd(), "public", "covers", `${slug}${coverExt}`);
      await saveFile(coverPath, coverBuffer);

      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-covers",
          `covers/${slug}${coverExt}`,
          coverBuffer,
          coverFile.type
        );
      }
    }

    // Update audio if provided
    if (audioFile && audioFile.size > 0) {
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioExt = path.extname(audioFile.name);
      const audioPath = path.join(process.cwd(), "public", "audio", `${slug}${audioExt}`);
      await saveFile(audioPath, audioBuffer);

      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-audio",
          `audio/${slug}${audioExt}`,
          audioBuffer,
          audioFile.type
        );
      }
    }

    // Update PDF if provided
    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      const pdfPath = path.join(process.cwd(), "public", "downloads", `${slug}.pdf`);
      await saveFile(pdfPath, pdfBuffer);

      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-covers",
          `downloads/${slug}.pdf`,
          pdfBuffer,
          "application/pdf"
        );
      }
    }

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/percorsi/[level]", "page");
    revalidatePath(`/libri/${slug}`);
    revalidatePath("/admin/books");

  } catch (error) {
    console.error("Error updating book:", error);
    redirect(`/admin/books/${slug}/edit?error=save_failed`);
  }

  redirect(`/admin/books?updated=${slug}`);
}

export default async function EditBookPage({
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
  const book = getBookWithContent(slug);

  if (!book) {
    notFound();
  }

  const error = searchParams?.error as string | undefined;
  const { content, frontmatter } = book;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-8 pl-0" asChild>
            <Link href="/admin/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla Lista Libri
            </Link>
          </Button>

          <div className="mb-8 flex justify-between items-start">
            <div>
              <Badge className="bg-secondary text-primary mb-2">Admin Only</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Modifica Libro</h1>
              <p className="text-muted-foreground">
                Aggiorna i dettagli e il contenuto del libro <strong>{book.title}</strong>
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/libri/${slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Anteprima
              </Link>
            </Button>
          </div>

          {error === "save_failed" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">
                  Errore durante il salvataggio delle modifiche. Riprova.
                </p>
              </CardContent>
            </Card>
          )}

          <form action={updateBook.bind(null, slug)} className="space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titolo Libro *</label>
                    <Input name="title" defaultValue={frontmatter.title} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Autore *</label>
                    <Input name="author" defaultValue={frontmatter.author} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Livello *</label>
                    <select name="level" className="w-full h-10 px-3 rounded-md border border-input bg-background" defaultValue={frontmatter.level} required>
                      <option value="base">Base</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzato">Avanzato</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Anno</label>
                    <Input name="year" type="number" defaultValue={frontmatter.year} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <Input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={frontmatter.rating || 4.5} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria PV *</label>
                  <Input name="pvCategory" defaultValue={frontmatter.pvCategory} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags *</label>
                  <Input
                    name="tags"
                    defaultValue={Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : ''}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reading Times */}
            <Card>
              <CardHeader>
                <CardTitle>Tempi di Lettura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tempo Integrale *</label>
                    <Input name="readingTimeFull" defaultValue={frontmatter.readingTimeFull} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tempo Sistema PV *</label>
                    <Input name="readingTimeSystem" defaultValue={frontmatter.readingTimeSystem} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descrizione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt *</label>
                  <textarea
                    name="excerpt"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                    defaultValue={frontmatter.excerpt}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link Amazon</label>
                  <Input name="amazonLink" type="url" defaultValue={frontmatter.amazonLink || frontmatter.amazon_link} />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Contenuto MDX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    name="content"
                    rows={20}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-y"
                    defaultValue={content}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <CardTitle>Aggiorna File (Opzionale)</CardTitle>
                <CardDescription>Lascia vuoto per mantenere i file esistenti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nuova Copertina</label>
                  <Input name="cover" type="file" accept=".jpg,.jpeg,.png" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nuovo Audio</label>
                  <Input name="audio" type="file" accept=".mp3,.m4a,.wav" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nuovo PDF</label>
                  <Input name="pdf" type="file" accept=".pdf" />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/books">Annulla</Link>
              </Button>
              <Button type="submit" size="lg">
                Salva Modifiche
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
