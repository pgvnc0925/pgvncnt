"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";
import Link from "next/link";

export function UpgradeProCTA() {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-2">Passa a Pagine Vincenti PRO</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Accedi a tutti i libri, quiz interattivi, mappe mentali e molto altro
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-amber-600" />
              <span>Libreria completa illimitata</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-amber-600" />
              <span>Quiz e mappe mentali</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-amber-600" />
              <span>Nuovi libri ogni mese</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-amber-600" />
              <span>Strumenti di apprendimento</span>
            </div>
          </div>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/pro">
              Scopri PRO →
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
