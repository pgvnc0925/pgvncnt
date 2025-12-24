import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import fs from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AddBookForm } from "@/components/admin/add-book-form";

const ADMIN_COOKIE = "pv_admin_session";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateMDX(data: {
  title: string;
  author: string;
  slug: string;
  level: string;
  pvCategory: string;
  tags: string;
  rating: string;
  readingTimeFull: string;
  readingTimeSystem: string;
  excerpt: string;
  year?: string;
  amazonLink?: string;
  insightBoxes?: string;
  faqs?: string;
  quiz?: string;
  content: string;
}): string {
  const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);

  let frontmatter = `---
title: "${data.title}"
slug: "${data.slug}"
author: "${data.author}"
${data.year ? `year: ${data.year}` : ''}
level: "${data.level}"
pvCategory: "${data.pvCategory}"
metaTitle: "${data.title} - Riassunto e Analisi | Pagine Vincenti"
metaDescription: "${data.excerpt}"
excerpt: "${data.excerpt}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
coverImage: "${data.slug}.jpg"
rating: ${data.rating}
reviewCount: 0
readingTimeFull: "${data.readingTimeFull}"
readingTimeSystem: "${data.readingTimeSystem}"
${data.amazonLink ? `amazonLink: "${data.amazonLink}"` : ''}`;

  // Add insight boxes if provided
  if (data.insightBoxes) {
    try {
      const parsed = JSON.parse(data.insightBoxes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        frontmatter += `\ninsightBoxes: ${JSON.stringify(parsed)}`;
      }
    } catch (e) {
      console.error('Invalid insightBoxes JSON');
    }
  }

  // Add FAQs if provided
  if (data.faqs) {
    try {
      const parsed = JSON.parse(data.faqs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        frontmatter += `\nfaqs: ${JSON.stringify(parsed)}`;
      }
    } catch (e) {
      console.error('Invalid FAQs JSON');
    }
  }

  // Add quiz if provided
  if (data.quiz) {
    try {
      const parsed = JSON.parse(data.quiz);
      if (Array.isArray(parsed) && parsed.length > 0) {
        frontmatter += `\nquiz: ${JSON.stringify(parsed)}`;
      }
    } catch (e) {
      console.error('Invalid quiz JSON');
    }
  }

  frontmatter += `\n---\n\n`;

  return frontmatter + (data.content || '# Introduzione\n\nContenuto del libro da aggiungere...\n\n## Concetti Principali\n\n## Applicazioni Pratiche\n\n## Errori da Evitare');
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveFile(filePath: string, content: Buffer | string) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

async function uploadToSupabase(bucket: string, filePath: string, buffer: Buffer, contentType: string) {
  if (!supabaseAdmin) return;

  // Ensure bucket exists
  const { data: bucketData } = await supabaseAdmin.storage.getBucket(bucket);
  if (!bucketData) {
    await supabaseAdmin.storage.createBucket(bucket, { public: true });
  }

  await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, buffer, { upsert: true, contentType });
}

async function addBook(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const level = formData.get("level") as string;
  const pvCategory = formData.get("pvCategory") as string;
  const tags = formData.get("tags") as string;
  const rating = formData.get("rating") as string || "4.5";
  const readingTimeFull = formData.get("readingTimeFull") as string;
  const readingTimeSystem = formData.get("readingTimeSystem") as string;
  const excerpt = formData.get("excerpt") as string;
  const year = formData.get("year") as string;
  const amazonLink = formData.get("amazonLink") as string;
  const insightBoxes = formData.get("insightBoxes") as string;
  const faqs = formData.get("faqs") as string;
  const quiz = formData.get("quiz") as string;
  const content = formData.get("content") as string;
  const coverFile = formData.get("cover") as File | null;
  const audioFile = formData.get("audio") as File | null;
  const pdfFile = formData.get("pdf") as File | null;

  // Generate slug
  const slug = slugify(title);

  // Generate MDX content
  const mdxContent = generateMDX({
    title,
    author,
    slug,
    level,
    pvCategory,
    tags,
    rating,
    insightBoxes,
    faqs,
    quiz,
    readingTimeFull,
    readingTimeSystem,
    excerpt,
    year,
    amazonLink,
    content,
  });

  try {
    // Save MDX file
    const mdxPath = path.join(process.cwd(), "content", "books", `${slug}.mdx`);
    await saveFile(mdxPath, mdxContent);

    // Upload MDX to Supabase
    if (supabaseAdmin) {
      await uploadToSupabase(
        "pv-mdx",
        `books/${slug}.mdx`,
        Buffer.from(mdxContent),
        "text/markdown"
      );
    }

    // Save cover image
    if (coverFile && coverFile.size > 0) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const coverExt = path.extname(coverFile.name);
      const coverPath = path.join(process.cwd(), "public", "covers", `${slug}${coverExt}`);
      await saveFile(coverPath, coverBuffer);

      // Upload to Supabase
      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-covers",
          `covers/${slug}${coverExt}`,
          coverBuffer,
          coverFile.type
        );
      }
    }

    // Save audio file
    if (audioFile && audioFile.size > 0) {
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioExt = path.extname(audioFile.name);
      const audioPath = path.join(process.cwd(), "public", "audio", `${slug}${audioExt}`);
      await saveFile(audioPath, audioBuffer);

      // Upload to Supabase
      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-audio",
          `audio/${slug}${audioExt}`,
          audioBuffer,
          audioFile.type
        );
      }
    }

    // Save PDF file
    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      const pdfPath = path.join(process.cwd(), "public", "downloads", `${slug}.pdf`);
      await saveFile(pdfPath, pdfBuffer);

      // Upload to Supabase
      if (supabaseAdmin) {
        await uploadToSupabase(
          "pv-covers",
          `downloads/${slug}.pdf`,
          pdfBuffer,
          "application/pdf"
        );
      }
    }

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/percorsi/[level]", "page");
    revalidatePath("/admin/books");

  } catch (error) {
    console.error("Error adding book:", error);
    redirect("/admin/books/new?error=save_failed");
  }

  redirect(`/admin/books?added=${slug}`);
}

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;

  if (!hasAccess) {
    redirect("/admin?error=unauthorized");
  }

  const error = searchParams?.error as string | undefined;

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

          <div className="mb-8">
            <Badge className="bg-secondary text-primary mb-2">Admin Only</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Aggiungi Nuovo Libro</h1>
            <p className="text-muted-foreground">
              Carica un MDX esistente o compila il form manualmente per aggiungere un nuovo libro.
            </p>
          </div>

          {error === "save_failed" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">
                  Errore durante il salvataggio del libro. Verifica i dati e riprova.
                </p>
              </CardContent>
            </Card>
          )}

          <AddBookForm addBookAction={addBook} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
