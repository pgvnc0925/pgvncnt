"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import matter from "gray-matter";

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

interface MdxImporterProps {
  onImport: (data: BookFormData) => void;
}

export function MdxImporter({ onImport }: MdxImporterProps) {
  const [isImported, setIsImported] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const trimmedFileName = file.name.trim().toLowerCase();
    const isValidExtension = trimmedFileName.endsWith(".mdx") || trimmedFileName.endsWith(".md");
    if (!isValidExtension) {
      alert("Carica solo file con estensione .mdx o .md");
      e.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const { data: frontmatter, content } = matter(text);

      setFileName(file.name);
      setIsImported(true);

      // Extract tags
      let tagsString = "";
      if (Array.isArray(frontmatter.tags)) {
        tagsString = frontmatter.tags.join(", ");
      } else if (typeof frontmatter.tags === "string") {
        tagsString = frontmatter.tags;
      }

      // Build the data object
      onImport({
        title: frontmatter.title || "",
        author: frontmatter.author || "",
        level: frontmatter.level || "base",
        pvCategory: frontmatter.pvCategory || "",
        tags: tagsString,
        rating: frontmatter.rating?.toString() || "4.5",
        readingTimeFull: frontmatter.readingTimeFull || "",
        readingTimeSystem: frontmatter.readingTimeSystem || "",
        excerpt: frontmatter.excerpt || frontmatter.metaDescription || "",
        year: frontmatter.year?.toString() || "",
        amazonLink: frontmatter.amazonLink || frontmatter.amazon_link || "",
        content: content.trim(),
        slug: frontmatter.slug || "",
      });

      // Reset the input so the same file can be re-uploaded
      e.target.value = "";
    } catch (error) {
      console.error("Error parsing MDX:", error);
      alert("Errore nel parsing del file MDX. Verifica che il formato sia corretto.");
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Importa MDX Esistente
        </CardTitle>
        <CardDescription>
          Hai già un file .mdx con frontmatter? Caricalo qui per auto-compilare il form
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <label htmlFor="mdx-import" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {fileName || "Clicca per selezionare un file .mdx o .md"}
                </span>
              </div>
              <Input
                id="mdx-import"
                type="file"
                // Restrict to markdown/MDX while keeping common MIME fallbacks for compatibility
                accept=".md,.mdx,text/mdx,text/x-mdx,text/markdown,text/x-markdown"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {isImported && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-green-900">MDX importato con successo!</p>
              <p className="text-xs text-green-700 mt-1">
                I campi del form sono stati compilati automaticamente. Verifica e modifica se necessario.
              </p>
            </div>
          </div>
        )}

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Come funziona:</strong> Carica un file .mdx con frontmatter valido e tutti i campi
            sottostanti verranno compilati automaticamente. Potrai poi modificarli se necessario prima
            di salvare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
