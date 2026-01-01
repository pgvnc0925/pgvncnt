"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArticleMdxImporter } from "./article-mdx-importer";
import { AIFAQGenerator } from "./ai/AIFAQGenerator";

interface ArticleFormData {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  tags: string[];
  featuredImage: string;
  featuredImageFile?: File | null;
  content: string;
  slug: string;
  ctaBookSlug: string;
  ctaBookText: string;
  affiliateLink: string;
  faq: { question: string; answer: string }[];
}

interface AddArticleFormProps {
  addArticleAction: (formData: FormData) => Promise<void>;
}

const MAX_FAQ = 10;
const TAG_OPTIONS = [
  "marketing",
  "strategia",
  "product",
  "growth",
  "psicologia",
  "vendite",
  "leadership",
  "copywriting",
  "posizionamento",
  "pricing",
];

const EMPTY_FAQ = { question: "", answer: "" };

export function AddArticleForm({ addArticleAction }: AddArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    description: "",
    publishedAt: "",
    author: "",
    tags: [],
    featuredImage: "",
    content: "",
    slug: "",
    ctaBookSlug: "",
    ctaBookText: "Vuoi approfondire questi concetti? Dai un'occhiata alla nostra analisi del libro →",
    affiliateLink: "",
    faq: Array.from({ length: 3 }, () => ({ ...EMPTY_FAQ })),
  });

  const handleImport = (data: ArticleFormData) => {
    const tagsArray = Array.isArray(data.tags)
      ? data.tags
      : (data.tags as unknown as string)?.split(",").map((t) => t.trim()).filter(Boolean);

    setFormData({
      ...formData,
      ...data,
      tags: tagsArray,
      faq:
        data.faq && data.faq.length > 0
          ? data.faq.slice(0, MAX_FAQ)
          : Array.from({ length: 3 }, () => ({ ...EMPTY_FAQ })),
    });
  };

  const handleFaqChange = (index: number, key: "question" | "answer", value: string) => {
    const updated = [...formData.faq];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, faq: updated });
  };

  const addFaq = () => {
    if (formData.faq.length >= MAX_FAQ) return;
    setFormData({ ...formData, faq: [...formData.faq, { ...EMPTY_FAQ }] });
  };

  const handleAIFAQsGenerated = (generatedFaqs: { question: string; answer: string }[]) => {
    // Merge generated FAQs with existing ones
    // Replace empty FAQs first, then add new ones
    const updatedFaqs = [...formData.faq];
    let insertIndex = 0;

    generatedFaqs.forEach((generatedFaq) => {
      // Find next empty slot
      while (
        insertIndex < updatedFaqs.length &&
        (updatedFaqs[insertIndex].question || updatedFaqs[insertIndex].answer)
      ) {
        insertIndex++;
      }

      // If we found an empty slot, replace it; otherwise append
      if (insertIndex < updatedFaqs.length) {
        updatedFaqs[insertIndex] = generatedFaq;
        insertIndex++;
      } else if (updatedFaqs.length < MAX_FAQ) {
        updatedFaqs.push(generatedFaq);
      }
    });

    setFormData({ ...formData, faq: updatedFaqs });
  };

  return (
    <form action={addArticleAction} className="space-y-8">
      <input type="hidden" name="faqCount" value={formData.faq.length} />
      <ArticleMdxImporter onImport={handleImport} />

      <Card>
        <CardHeader>
          <CardTitle>Dati principali</CardTitle>
          <CardDescription>Titolo, descrizione, data e autore</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titolo *</label>
              <Input
                name="title"
                placeholder="Titolo articolo"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (opzionale)</label>
              <Input
                name="slug"
                placeholder="slug-automatico-se-vuoto"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrizione breve *</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              placeholder="Riassunto dell'articolo"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data pubblicazione *</label>
              <Input
                name="publishedAt"
                type="date"
                required
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Autore</label>
              <Input
                name="author"
                placeholder="Nome autore"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Immagine di copertina (URL)</label>
              <Input
                name="featuredImage"
                type="url"
                placeholder="https://... (oppure carica un file sotto)"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags *</label>
            <select
              name="tags"
              multiple
              required
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
              value={formData.tags}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                setFormData({ ...formData, tags: selected });
              }}
            >
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Seleziona uno o più tag (Ctrl/Cmd + click per selezione multipla).
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Immagine 400x300 (upload)</label>
            <Input name="featuredImageFile" type="file" accept=".jpg,.png" />
            <p className="text-xs text-muted-foreground">
              Verrà salvata come immagine dell'articolo; se carichi un file, il campo URL sopra verrà ignorato.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTA verso un libro</CardTitle>
          <CardDescription>Collega questo articolo al libro di riferimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug libro (es. le-22-leggi-del-marketing)</label>
              <Input
                name="ctaBookSlug"
                placeholder="slug-del-libro"
                value={formData.ctaBookSlug}
                onChange={(e) => setFormData({ ...formData, ctaBookSlug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Testo CTA</label>
              <Input
                name="ctaBookText"
                placeholder="Vuoi approfondire questi concetti? Dai un'occhiata alla nostra analisi del libro →"
                value={formData.ctaBookText}
                onChange={(e) => setFormData({ ...formData, ctaBookText: e.target.value })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Se impostato, il CTA apparirà a metà articolo e porterà alla pagina del libro specificato.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTA Amazon affiliato</CardTitle>
          <CardDescription>Link affiliato da mostrare subito dopo le FAQ (opzionale)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <label className="text-sm font-medium">Link Amazon affiliato</label>
          <Input
            name="affiliateLink"
            type="url"
            placeholder="https://www.amazon.it/..."
            value={formData.affiliateLink}
            onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Se compilato, verrà mostrata una CTA subito dopo le FAQ e prima dell'articolo. Lascia vuoto per non mostrarla.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenuto MDX</CardTitle>
          <CardDescription>Il contenuto dell'articolo in Markdown/MDX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            name="content"
            rows={18}
            className="w-full px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-y"
            placeholder={`# Introduzione\n\nScrivi il contenuto in Markdown/MDX...`}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Puoi usare componenti MDX e titoli per strutturare l&apos;articolo.
          </p>
        </CardContent>
      </Card>

      {/* AI FAQ Generator */}
      <AIFAQGenerator
        title={formData.title}
        description={formData.description}
        content={formData.content}
        currentFAQs={formData.faq}
        onFAQsGenerated={handleAIFAQsGenerated}
        maxFAQs={MAX_FAQ}
      />

      <Card>
        <CardHeader>
          <CardTitle>FAQ Articolo</CardTitle>
          <CardDescription>Queste FAQ appariranno subito sotto l&apos;intestazione</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.faq.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-sm font-medium">Domanda #{idx + 1}</label>
              <Input
                name={`faqQuestion${idx}`}
                placeholder="Domanda"
                value={item.question}
                onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
              />
              <textarea
                name={`faqAnswer${idx}`}
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                placeholder="Risposta"
                value={item.answer}
                onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
              />
            </div>
          ))}
          {formData.faq.length < MAX_FAQ && (
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              + Aggiungi FAQ
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Lascia vuoto per saltare una FAQ; solo quelle compilate saranno salvate.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/articles">Annulla</Link>
        </Button>
        <Button type="submit" size="lg">
          Crea Articolo
        </Button>
      </div>
    </form>
  );
}
