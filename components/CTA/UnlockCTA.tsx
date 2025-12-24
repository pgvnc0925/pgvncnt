"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Download, Headphones } from "lucide-react";
import Link from "next/link";

interface UnlockCTAProps {
  bookSlug: string;
}

export function UnlockCTA({ bookSlug }: UnlockCTAProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <Lock className="h-6 w-6 text-secondary" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-2">Sblocca Contenuti Extra</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ottieni accesso immediato a audio-ripasso e PDF scaricabile. Bastano 30 secondi.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Headphones className="h-4 w-4 text-primary" />
              <span>Audio-ripasso MP3</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4 text-primary" />
              <span>PDF riassunto</span>
            </div>
          </div>
          <Button asChild>
            <Link href={`/unlock?next=/libri/${bookSlug}`}>
              Sblocca Gratis con Email →
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
