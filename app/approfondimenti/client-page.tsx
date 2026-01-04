'use client'

import { useState } from 'react'
import { LongformCard, InsightCard } from '@/components/design-system'
import { Article } from '@/types/article'
import { Clock, GraduationCap, Tag } from 'lucide-react'

interface ClientPageProps {
  articles: Article[]
  pillars: Array<{
    category: string
    title: string
    description: string
    readTime: number
    href: string
    topic: string
    level: 'Base' | 'Intermedio' | 'Avanzato'
  }>
  insights: Array<{
    tag: string
    date: string
    title: string
    excerpt: string
    href: string
    featured: boolean
    topic: string
  }>
}

const TOPICS = [
  'Marketing & Posizionamento',
  'Acquisizione Clienti',
  'Conversione & Vendita',
  'Esperienza Cliente',
  'Sistemi & Organizzazione',
  'Strategia & Modello di Business',
  'Crescita & Scalabilità',
  'Decision Making',
]

const LEVEL_COLORS = {
  Base: 'bg-green-100 text-green-800 border-green-200',
  Intermedio: 'bg-amber-100 text-amber-800 border-amber-200',
  Avanzato: 'bg-rose-100 text-rose-800 border-rose-200',
}

export function ApprofondimentiClientPage({ pillars, insights }: ClientPageProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const filteredPillars = selectedTopic
    ? pillars.filter((p) => p.topic === selectedTopic)
    : pillars

  const filteredInsights = selectedTopic
    ? insights.filter((i) => i.topic === selectedTopic)
    : insights

  return (
    <>
      {/* Topic Filter */}
      <section className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-muted/30 border-y border-border py-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">
                Filtra per tema
              </h3>
              <div className="flex flex-wrap gap-3 justify-center items-center max-w-4xl mx-auto">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    selectedTopic === null
                      ? 'bg-secondary text-secondary-foreground shadow-md scale-105'
                      : 'bg-background border border-border hover:border-secondary hover:shadow-sm'
                  }`}
                >
                  Tutti
                </button>
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedTopic === topic
                        ? 'bg-secondary text-secondary-foreground shadow-md scale-105'
                        : 'bg-background border border-border hover:border-secondary hover:shadow-sm'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              {selectedTopic && (
                <p className="text-center text-sm text-muted-foreground">
                  Filtri attivi: <span className="font-medium text-foreground">{selectedTopic}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section header */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Guide fondamentali – panoramiche complete sui temi chiave di PV
            </h2>
            <p className="text-muted-foreground">
              {filteredPillars.length} {filteredPillars.length === 1 ? 'guida' : 'guide'}
            </p>
          </div>

          {/* Pillar cards */}
          <div className="space-y-4">
            {filteredPillars.length > 0 ? (
              filteredPillars.map((pillar, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Left: Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold">
                        {pillar.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{pillar.readTime} min</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground leading-tight">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">Tema:</span>
                        <span>{pillar.topic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded border ${LEVEL_COLORS[pillar.level]}`}
                        >
                          {pillar.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex md:w-40 items-center">
                    <a
                      href={pillar.href}
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Leggi ora
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Nessuna guida trovata per questo tema.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="container mx-auto px-6 py-12 md:py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section header */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Articoli di approfondimento – analisi verticali collegate alle guide
            </h2>
            <p className="text-muted-foreground">
              {filteredInsights.length} {filteredInsights.length === 1 ? 'articolo' : 'articoli'}
            </p>
          </div>

          {/* Insight cards grid */}
          {filteredInsights.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredInsights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Nessun articolo trovato per questo tema.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
