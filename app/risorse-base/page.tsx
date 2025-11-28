import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RisorseBasePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Risorse Percorso Base</h1>
            <p className="text-muted-foreground">
              Audio, mappe mentali, quiz e materiali applicativi per il percorso Base.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audio-ripassi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>I file audio sono disponibili nella sezione download.</p>
                <Button variant="outline" asChild>
                  <Link href="/audio">Vai agli audio</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mappe e Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Scarica mappe mentali e quiz per ripassare rapidamente i concetti.</p>
                <Button variant="outline" asChild>
                  <Link href="/quiz">Vai ai quiz</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
