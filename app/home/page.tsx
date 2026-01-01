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
                La complessità va strutturata, non semplificata
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Non offriamo ricette veloci o trucchi di crescita. Il nostro approccio è basato
                su analisi, modelli e strumenti che aiutano a ragionare meglio sul proprio
                business.
              </p>
            </div>

            {/* Right: 2 cards stacked */}
            <div className="space-y-6">
              <FeatureCard
                icon={Shield}
                title="Contenuti editoriali"
                description="Analisi approfondite, framework di pensiero e guide operative per marketing e organizzazione aziendale. Ogni contenuto è pensato per essere applicabile alla realtà italiana delle PMI."
                iconColor="bg-blue-100 text-blue-600"
              />
              <FeatureCard
                icon={Target}
                title="Suite applicativa"
                description="Strumenti operativi progettati per trasformare i modelli concettuali in decisioni concrete e tracciabili. Ogni app riflette un framework editoriale specifico."
                iconColor="bg-secondary/20 text-secondary"
              />
            </div>
          </div>
        </section>

        {/* Audience Section - 3 cards */}
        <section className="container mx-auto px-6 py-20 md:py-28 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Pill variant="accent">PER CHI È</Pill>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Per chi cerca struttura,
                <br />
                non intrattenimento
              </h2>
              <p className="text-lg text-muted-foreground">
                PV è progettato per professionisti che vogliono chiarezza strategica e strumenti che
                aiutano a pensare meglio.
              </p>
            </div>

            {/* 3 audience cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <AudienceCard
                number="01"
                title="Imprenditori"
                description="Chi deve strutturare marketing e organizzazione con metodo."
              />
              <AudienceCard
                number="02"
                title="Freelance"
                description="Chi applica framework e concetti per posizionamento, pricing e strategia."
              />
              <AudienceCard
                number="03"
                title="Decision Maker PMI"
                description="Chi dev'ono prendere decisioni di marketing o deleghe con consapevolezza."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
