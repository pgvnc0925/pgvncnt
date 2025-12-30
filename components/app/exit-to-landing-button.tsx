// components/app/exit-to-landing-button.tsx

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExitToLandingButtonProps {
  appSlug: string;
}

export function ExitToLandingButton({ appSlug }: ExitToLandingButtonProps) {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Button variant="outline" size="sm" asChild className="bg-background/95 backdrop-blur">
        <Link href={`/app/${appSlug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla presentazione
        </Link>
      </Button>
    </div>
  );
}
