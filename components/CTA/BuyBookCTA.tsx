"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ExternalLink } from "lucide-react";

interface BuyBookCTAProps {
  title: string;
  author: string;
  amazonLink: string;
}

export function BuyBookCTA({ title, author, amazonLink }: BuyBookCTAProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-2">Acquista il Libro Completo</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Vuoi approfondire? Acquista "{title}" di {author} su Amazon
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Supporta l'autore e accedi alla versione integrale con tutti i dettagli e gli esempi
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href={amazonLink} target="_blank" rel="noopener noreferrer">
              Vedi su Amazon
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
