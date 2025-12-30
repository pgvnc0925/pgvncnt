// components/app/app-landing.tsx

'use client';

import Link from 'next/link';
import type { AppMetadata } from '@/apps/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Book } from 'lucide-react';

interface AppLandingProps {
  app: AppMetadata;
}

export function AppLanding({ app }: AppLandingProps) {
  const { landing } = app;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-16 border-b border-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back link */}
            <Link
              href="/app"
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors text-sm"
            >
              ← Torna alle app
            </Link>

            {/* Icon */}
            <div className="text-6xl mb-4">{app.icon}</div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {landing.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-200 max-w-2xl">
              {landing.subheadline}
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href={app.appPath}>
                  {landing.cta.primary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {landing.pricing.freeTrialCount === 0 && (
                <Button size="lg" variant="outline" className="text-white border-white/40" asChild>
                  <Link href="/abbonati">{landing.cta.secondary}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Per chi è */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">{landing.sections.whoIsFor.title}</h2>
            <ul className="space-y-3">
              {landing.sections.whoIsFor.items.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Su quali libri */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">{landing.sections.basedOnBooks.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {landing.sections.basedOnBooks.books.map((book, idx) => (
                <Card key={idx} className="border-secondary/20">
                  <CardContent className="p-4">
                    <div className="flex gap-3 items-start">
                      <Book className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-foreground">{book.title}</strong>
                        <span className="text-sm text-muted-foreground">{book.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Cosa ottieni */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">{landing.sections.whatYouGet.title}</h2>
            <ul className="space-y-3">
              {landing.sections.whatYouGet.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <ArrowRight className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA Section */}
          <section className="bg-muted/50 rounded-lg p-8 border border-secondary/20 space-y-6">
            <h2 className="text-2xl font-bold">Inizia Adesso</h2>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {landing.pricing.subscriptionPlans.map((plan, idx) => (
                <Card key={idx} className="border-2 border-secondary/40">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.period}
                      </span>
                    </p>
                    {plan.credits < 999 && (
                      <p className="text-sm text-muted-foreground">{plan.credits} crediti</p>
                    )}
                    {plan.credits >= 999 && (
                      <Badge variant="secondary">Accesso illimitato</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Final CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" asChild>
                <Link href={app.appPath}>{landing.cta.primary}</Link>
              </Button>

              {landing.pricing.freeTrialCount === 0 && (
                <Button size="lg" variant="outline" className="flex-1" asChild>
                  <Link href="/abbonati">{landing.cta.secondary}</Link>
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
