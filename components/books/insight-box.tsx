import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InsightBoxProps {
  title: string;
  content: string;
  articleSlug?: string;
  articleTitle?: string;
}

export function InsightBox({ title, content, articleSlug, articleTitle }: InsightBoxProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-grow space-y-3">
          <h3 className="text-lg font-bold text-amber-900">{title}</h3>
          <p className="text-sm text-amber-800 leading-relaxed">{content}</p>
          {articleSlug && (
            <Button asChild variant="outline" size="sm" className="border-amber-300 hover:bg-amber-100">
              <Link href={`/approfondimenti/${articleSlug}`}>
                Leggi l'approfondimento{articleTitle ? `: ${articleTitle}` : ''}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
