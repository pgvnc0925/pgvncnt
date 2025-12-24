import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import fs from "fs/promises";
import path from "path";
import { AddArticleForm } from "@/components/admin/add-article-form";

const ADMIN_COOKIE = "pv_admin_session";

async function addArticle(formData: FormData) {
  "use server";

  const title = (formData.get("title") as string).trim();
  const slugInput = (formData.get("slug") as string | null)?.trim() || "";
  const description = (formData.get("description") as string).trim();
  const publishedAt = (formData.get("publishedAt") as string).trim();
  const author = (formData.get("author") as string | null)?.trim() || "";
  const tagsRaw = (formData.get("tags") as string | null) ?? "";
  const tags =
    formData.getAll("tags")?.length > 0
      ? (formData.getAll("tags") as string[]).map((t) => t.trim()).filter(Boolean)
      : tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
  const featuredImageUrl = (formData.get("featuredImage") as string | null)?.trim() || "";
  const featuredImageFile = formData.get("featuredImageFile") as File | null;
  const content = (formData.get("content") as string | null) ?? "";
  const ctaBookSlug = (formData.get("ctaBookSlug") as string | null)?.trim() || "";
  const ctaBookText = (formData.get("ctaBookText") as string | null)?.trim() || "";
  const affiliateLink = (formData.get("affiliateLink") as string | null)?.trim() || "";
  const faq: { question: string; answer: string }[] = [];
  const faqCount = Math.min(parseInt((formData.get("faqCount") as string) || "0", 10), 10);
  for (let i = 0; i < faqCount; i++) {
    const question = (formData.get(`faqQuestion${i}`) as string | null)?.trim() || "";
    const answer = (formData.get(`faqAnswer${i}`) as string | null)?.trim() || "";
    if (question && answer) {
      faq.push({ question, answer });
    }
  }

  if (!title || !description || !publishedAt) {
    redirect("/admin/articles/new?error=missing");
  }

  const slug = slugInput || title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let featuredImage = featuredImageUrl;

  if (featuredImageFile && featuredImageFile.size > 0) {
    const buffer = Buffer.from(await featuredImageFile.arrayBuffer());
    const ext = path.extname(featuredImageFile.name).toLowerCase() || ".jpg";
    const fileName = `${slug}${ext}`;
    const savePath = path.join(process.cwd(), "public", "articles", fileName);
    await fs.mkdir(path.dirname(savePath), { recursive: true });
    await fs.writeFile(savePath, buffer);
    featuredImage = `/articles/${fileName}`;
  }

  const mdxContent = `---
title: "${title}"
slug: "${slug}"
description: "${description}"
publishedAt: "${publishedAt}"
${author ? `author: "${author}"` : ""}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
${featuredImage ? `featuredImage: "${featuredImage}"` : ""}
${ctaBookSlug ? `ctaBookSlug: "${ctaBookSlug}"` : ""}
${ctaBookText ? `ctaBookText: "${ctaBookText}"` : ""}
${affiliateLink ? `amazonAffiliateLink: "${affiliateLink}"` : ""}
${faq.length ? `faq:\n${faq.map((item) => `  - question: "${item.question.replace(/"/g, '\\"')}"\n    answer: "${item.answer.replace(/"/g, '\\"')}"`).join("\n")}` : ""}
---

${content || "# Introduzione\n\nScrivi il contenuto dell'articolo qui."}
`;

  try {
    const articlesDir = path.join(process.cwd(), "content", "articles");
    await fs.mkdir(articlesDir, { recursive: true });
    const filePath = path.join(articlesDir, `${slug}.mdx`);
    await fs.writeFile(filePath, mdxContent);

    revalidatePath("/approfondimenti");
    revalidatePath(`/approfondimenti/${slug}`);
  } catch (error) {
    console.error("Error adding article:", error);
    redirect("/admin/articles/new?error=save_failed");
  }

  redirect("/admin/articles");
}

export default async function NewArticlePage({
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
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-8 pl-0" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna agli Articoli
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Nuovo Articolo</h1>
            <p className="text-muted-foreground">
              Importa un MDX con frontmatter oppure compila il form per creare un nuovo approfondimento.
            </p>
          </div>

          {error === "missing" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">Compila tutti i campi obbligatori.</p>
              </CardContent>
            </Card>
          )}
          {error === "save_failed" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">
                  Errore durante il salvataggio dell&apos;articolo. Riprova.
                </p>
              </CardContent>
            </Card>
          )}

          <AddArticleForm addArticleAction={addArticle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
