"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdxImporter } from "./mdx-importer";
import Link from "next/link";

interface BookFormData {
  title: string;
  author: string;
  level: string;
  pvCategory: string;
  tags: string;
  rating: string;
  readingTimeFull: string;
  readingTimeSystem: string;
  excerpt: string;
  year: string;
  amazonLink: string;
  content: string;
  slug: string;
}

interface AddBookFormProps {
  addBookAction: (formData: FormData) => Promise<void>;
}

export function AddBookForm({ addBookAction }: AddBookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    level: "base",
    pvCategory: "",
    tags: "",
    rating: "4.5",
    readingTimeFull: "",
    readingTimeSystem: "",
    excerpt: "",
    year: "",
    amazonLink: "",
    content: "",
    slug: "",
  });

  const handleImport = (data: BookFormData) => {
    setFormData(data);
  };

  return (
    <form action={addBookAction} className="space-y-8">
      {/* MDX Importer */}
      <MdxImporter onImport={handleImport} />

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Base</CardTitle>
          <CardDescription>Titolo, autore e metadati principali</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titolo Libro *</label>
              <Input
                name="title"
                placeholder="Es: Le 22 Leggi del Marketing"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Autore *</label>
              <Input
                name="author"
                placeholder="Es: Al Ries & Jack Trout"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Livello *</label>
              <select
                name="level"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="base">Base</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzato">Avanzato</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Anno Pubblicazione</label>
              <Input
                name="year"
                type="number"
                placeholder="2024"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (0-5)</label>
              <Input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria PV *</label>
            <Input
              name="pvCategory"
              placeholder="Es: marketing-strategico, psicologia-consumatore"
              required
              value={formData.pvCategory}
              onChange={(e) => setFormData({ ...formData, pvCategory: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Usa kebab-case (parole-separate-da-trattini)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags *</label>
            <Input
              name="tags"
              placeholder="marketing, strategia, posizionamento"
              required
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separati da virgola</p>
          </div>
        </CardContent>
      </Card>

      {/* Reading Times */}
      <Card>
        <CardHeader>
          <CardTitle>Tempi di Lettura</CardTitle>
          <CardDescription>Tempo per leggere il libro completo vs. il riassunto PV</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo Integrale *</label>
              <Input
                name="readingTimeFull"
                placeholder="Es: 5 ore"
                required
                value={formData.readingTimeFull}
                onChange={(e) => setFormData({ ...formData, readingTimeFull: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo Sistema PV *</label>
              <Input
                name="readingTimeSystem"
                placeholder="Es: 35 minuti"
                required
                value={formData.readingTimeSystem}
                onChange={(e) => setFormData({ ...formData, readingTimeSystem: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Descrizione</CardTitle>
          <CardDescription>Breve descrizione che apparirà nelle card e nei risultati di ricerca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt / Descrizione Breve *</label>
            <textarea
              name="excerpt"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              placeholder="Una breve descrizione del libro (1-2 frasi)"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link Amazon (opzionale)</label>
            <Input
              name="amazonLink"
              type="url"
              placeholder="https://amazon.it/..."
              value={formData.amazonLink}
              onChange={(e) => setFormData({ ...formData, amazonLink: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenuto MDX</CardTitle>
          <CardDescription>Il contenuto del riassunto in formato Markdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contenuto</label>
            <textarea
              name="content"
              rows={15}
              className="w-full px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-y"
              placeholder={`# Introduzione

Scrivi il contenuto del riassunto qui usando Markdown...

## Idee Principali

## Applicazioni Pratiche

## Analisi PV

## Errori da Evitare`}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Usa Markdown per la formattazione. Lascia vuoto per generare un template base.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      <Card>
        <CardHeader>
          <CardTitle>File Allegati</CardTitle>
          <CardDescription>Carica copertina, audio e PDF del riassunto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Copertina Libro (.jpg/.png) *</label>
            <Input name="cover" type="file" accept=".jpg,.png" required />
            <p className="text-xs text-muted-foreground">Consigliato: 400x600px, formato JPG</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Audio Riassunto (.mp3) - Opzionale</label>
            <Input name="audio" type="file" accept=".mp3" />
            <p className="text-xs text-muted-foreground">Audio della sintesi del libro</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">PDF Riassunto (.pdf) - Opzionale</label>
            <Input name="pdf" type="file" accept=".pdf" />
            <p className="text-xs text-muted-foreground">Versione PDF scaricabile del riassunto</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/books">Annulla</Link>
        </Button>
        <Button type="submit" size="lg">
          Crea Libro
        </Button>
      </div>
    </form>
  );
}
