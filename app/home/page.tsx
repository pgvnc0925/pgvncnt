import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Pill,
  UnderlineAccent,
  StatItem,
  FeatureCard,
  AudienceCard,
  PrimaryButton,
  SecondaryButton,
} from "@/components/design-system"
import { Target, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-6xl space-y-8">
            {/* Headline with underline accent */}
            <div className="space-y-1">
              <h1 className="text-7xl md:text-8xl lg:text-9xl xl:text-[3.5rem] font-bold text-foreground leading-[1.1] tracking-tight max-w-6xl">
                Il problema non sono le informazioni.
                <br />
                È trasformarle in decisioni che funzionano.
              </h1>
              <div className="flex justify-start -mt-3">
                <UnderlineAccent width="long" sketched />
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Ti aiutiamo a capire come pensano davvero le grandi menti del marketing e dell'organizzazione aziendale,
              e a trasformare quei principi in sistemi applicabili tutti i giorni in azienda.
            </p>

            {/* Closing statement */}
            <p className="text-base md:text-lg text-foreground font-medium max-w-xl">
              Niente trucchetti. Niente mode.
              <br />
              Solo ragionamento, contesto e applicazione concreta.
            </p>

            {/* Problem statement */}
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl italic">
              Se alcune cose ti sembrano logiche,
              <br />
              – altre applicabili,
              <br />
              – ma quando devi decidere cosa fare davvero, tutto è meno chiaro di quanto dovrebbe...
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-4 items-start">
              <PrimaryButton size="default" className="text-base px-6 py-5" asChild>
                <Link href="/valutazione">Scopri da dove iniziare</Link>
              </PrimaryButton>
              <p className="text-sm text-muted-foreground">
                13 domande. 2 minuti. Nessuna email obbligatoria.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="border-y border-border bg-muted/30 mt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
                <StatItem value="15+" label="Libri analizzati" />
                <StatItem value="5+" label="App create" />
                <StatItem value="120+" label="File scaricati" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ultimo aggiornamento: 02.01.26
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section - 2 columns */}
        <section className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Left: Kicker + Title + Paragraph */}
            <div className="space-y-6">
              <div>
                <Pill variant="muted">FILOSOFIA</Pill>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                La complessità non si elimina.
                <br />
                Si capisce e si governa.
                <br />
                È nella complessità che si trovano le vere opportunità.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Le scorciatoie in azienda non esistono.
                Ti aiutiamo a gestire problemi complessi: capire cosa conta davvero, collegare le decisioni tra loro e trasformare intuizioni sparse in sistemi che funzionano ogni giorno.
              </p>
            </div>

            {/* Right: 2 cards stacked */}
            <div className="space-y-6">
              <Link href="/libri" className="block">
                <FeatureCard
                  icon={Shield}
                  title="Contenuti editoriali"
                  description="Analisi e framework pensati per aiutarti a fare ordine: capire cosa non sta funzionando, cosa ha senso migliorare ora e cosa può aspettare. Tutto è calato nella realtà delle PMI italiane."
                  iconColor="bg-blue-100 text-blue-600"
                />
              </Link>
              <Link href="/app" className="block">
                <FeatureCard
                  icon={Target}
                  title="Apps"
                  description="Strumenti pratici per trasformare le analisi in scelte operative: decidere dove intervenire, cosa testare e come misurare se sta funzionando davvero. Ogni app nasce da un framework preciso e lo rende applicabile senza ambiguità."
                  iconColor="bg-secondary/20 text-secondary"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Audience Section - 3 cards */}
        <section className="container mx-auto px-6 py-20 md:py-28 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-14">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Pill variant="accent">PER CHI È PAGINE VINCENTI</Pill>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Per chi deve prendere decisioni ogni giorno
                <br />
                e vuole farlo su basi solide.
              </h2>
              <div className="text-sm text-muted-foreground text-left max-w-2xl mx-auto space-y-2 leading-tight">
                <p>Pagine Vincenti aiuta professionisti e imprenditori a:</p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-base mt-0.5">🎯</span>
                    <span>capire cosa vuole davvero il mercato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-base mt-0.5">💬</span>
                    <span>interpretare correttamente ciò che il cliente sta chiedendo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-base mt-0.5">🔍</span>
                    <span>individuare dove l&apos;azienda può migliorare, senza interventi a caso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-base mt-0.5">⚙️</span>
                    <span>costruire sistemi e procedure per rendere il lavoro più efficiente e sostenibile</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3 audience cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <AudienceCard
                number="01"
                title="Imprenditori e professionisti"
                description="Chi deve strutturare marketing e organizzazione con metodo, prendere decisioni consapevoli e imparare a delegare senza perdere controllo sull'azienda."
              />
              <AudienceCard
                number="02"
                title="Freelance e consulenti"
                description="Chi utilizza framework e modelli strategici per lavorare meglio su posizionamento, pricing e strategia, per sé o per i propri clienti."
              />
              <AudienceCard
                number="03"
                title="Chi vuole crescere senza perdere il controllo"
                description="Attività che funzionano bene, ma sentono il bisogno di strutturare marketing, organizzazione e delega per creare sistemi prima che la complessità le travolga."
              />
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-2 items-center">
              <PrimaryButton size="default" className="text-base px-6 py-5" asChild>
                <Link href="/valutazione">Scopri da dove iniziare</Link>
              </PrimaryButton>
              <p className="text-sm text-muted-foreground">
                13 domande. 2 minuti. Nessuna email obbligatoria.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
