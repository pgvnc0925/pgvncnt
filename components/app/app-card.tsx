// components/app/app-card.tsx

import Link from 'next/link';
import type { AppMetadata } from '@/apps/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AppCardProps {
  app: AppMetadata;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-secondary/20 hover:border-secondary/40">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="text-5xl">{app.icon}</div>
        </div>
        <CardTitle className="text-2xl">{app.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <p className="text-muted-foreground mb-4">{app.description}</p>

        {/* Books preview */}
        <div className="text-xs text-muted-foreground mb-6">
          <strong className="text-foreground">Basato su:</strong>{' '}
          {app.landing.sections.basedOnBooks.books
            .slice(0, 2)
            .map((b) => b.title)
            .join(', ')}
          {app.landing.sections.basedOnBooks.books.length > 2 && '...'}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Button asChild className="w-full group">
            <Link href={`/app/${app.slug}`}>
              Scopri di più
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
