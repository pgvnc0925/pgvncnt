"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface AIFAQGeneratorProps {
  title: string;
  description: string;
  content: string;
  currentFAQs: FAQItem[];
  onFAQsGenerated: (faqs: FAQItem[]) => void;
  maxFAQs?: number;
}

export function AIFAQGenerator({
  title,
  description,
  content,
  currentFAQs,
  onFAQsGenerated,
  maxFAQs = 10,
}: AIFAQGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    // Validation
    if (!title.trim()) {
      setError("Inserisci un titolo prima di generare le FAQ");
      return;
    }

    if (!description.trim() && !content.trim()) {
      setError("Inserisci una descrizione o del contenuto prima di generare le FAQ");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      // Calculate how many FAQs to generate (fill up to maxFAQs)
      const emptySlots = currentFAQs.filter((faq) => !faq.question && !faq.answer).length;
      const faqsToGenerate = Math.max(1, Math.min(emptySlots || 5, maxFAQs - currentFAQs.length + emptySlots));

      const response = await fetch("/api/ai/generate-faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          count: faqsToGenerate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore nella generazione delle FAQ");
      }

      if (data.faqs && data.faqs.length > 0) {
        onFAQsGenerated(data.faqs);
        setSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Nessuna FAQ generata. Prova ad aggiungere più contenuto.");
      }
    } catch (err) {
      console.error("Error generating FAQs:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsGenerating(false);
    }
  };

  const hasContent = title.trim() || description.trim() || content.trim();
  const canGenerate = hasContent && currentFAQs.length < maxFAQs;

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Generatore FAQ con AI
        </CardTitle>
        <CardDescription>
          Genera automaticamente domande frequenti basate sul contenuto dell&apos;articolo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            variant="outline"
            className="w-full border-purple-300 hover:bg-purple-100 hover:text-purple-900 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generazione in corso...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Genera FAQ Automaticamente
              </>
            )}
          </Button>

          {!hasContent && (
            <p className="text-xs text-muted-foreground text-center">
              Compila il titolo e il contenuto per abilitare la generazione AI
            </p>
          )}

          {currentFAQs.length >= maxFAQs && (
            <p className="text-xs text-amber-600 text-center">
              Hai raggiunto il limite massimo di {maxFAQs} FAQ
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-red-900">Errore</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-green-900">FAQ generate con successo!</p>
              <p className="text-xs text-green-700 mt-1">
                Le FAQ sono state aggiunte ai campi sottostanti. Puoi modificarle prima di salvare.
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-900">
            <strong>Come funziona:</strong> L&apos;AI analizzerà il titolo, la descrizione e il contenuto
            dell&apos;articolo per generare domande frequenti pertinenti e risposte complete. Le FAQ verranno
            aggiunte ai campi sottostanti dove potrai modificarle prima di pubblicare.
          </p>
          <p className="text-xs text-purple-700 mt-2">
            💡 <strong>Suggerimento:</strong> Più contenuto fornisci, migliori saranno le FAQ generate.
          </p>
        </div>

        {/* Cost Estimate (optional) */}
        {content.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Costo stimato: ~$0.0005 per generazione
          </p>
        )}
      </CardContent>
    </Card>
  );
}
