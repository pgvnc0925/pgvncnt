"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Tool {
  name: string;
  description: string;
  href: string;
}

interface ToolsCTAProps {
  bookSlug: string;
}

export function ToolsCTA({ bookSlug }: ToolsCTAProps) {
  // These would be dynamic based on the book
  const tools: Tool[] = [
    {
      name: "Quiz Interattivo",
      description: "Testa la tua comprensione",
      href: `/libri/${bookSlug}/quiz`
    },
    {
      name: "Mappa Mentale",
      description: "Visualizza i concetti chiave",
      href: `/libri/${bookSlug}/mappa`
    }
  ];

  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-bold">Strumenti di Apprendimento</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Consolida le tue conoscenze con strumenti interattivi
        </p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block p-4 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm mb-1 group-hover:text-green-700">
                  {tool.name}
                </h4>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
