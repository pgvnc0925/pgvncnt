"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NextBookCTAProps {
  nextBook: {
    slug: string;
    title: string;
    author: string;
    coverImage: string;
    excerpt: string;
  };
}

export function NextBookCTA({ nextBook }: NextBookCTAProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-bold">Prossimo nel Percorso</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Continua il tuo percorso di apprendimento
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-4">
          <Image
            src={nextBook.coverImage}
            alt={nextBook.title}
            fill
            className="object-contain"
          />
        </div>
        <h4 className="font-bold text-lg mb-1">{nextBook.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{nextBook.author}</p>
        <p className="text-sm mb-6 line-clamp-3">{nextBook.excerpt}</p>
        <Button asChild size="sm" className="w-full">
          <Link href={`/libri/${nextBook.slug}`}>
            Leggi Ora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
