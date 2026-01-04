"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent } from "@/components/design-system"
import { BookSearch } from "@/components/books/book-search"
import { BookCardSmall } from "@/components/books/book-card-small"
import { BookOpen } from "lucide-react"
import { Book } from "@/types/book"

interface ClientPageProps {
  initialBooks: Book[]
}

export function LibriClientPage({ initialBooks }: ClientPageProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})

  // Load view counts from API
  useEffect(() => {
    async function fetchViewCounts() {
      try {
        const response = await fetch("/api/track-view")
        if (response.ok) {
          const counts = await response.json()
          setViewCounts(counts)
        }
      } catch (error) {
        console.error("Failed to fetch view counts:", error)
      }
    }
    fetchViewCounts()
  }, [])

  // Get all unique authors
  const allAuthors = useMemo(() => {
    const authors = new Set<string>()
    initialBooks.forEach((book) => {
      if (book.author) authors.add(book.author)
    })
    return Array.from(authors).sort()
  }, [initialBooks])

  // Map topics to tag keywords
  const topicToTags: Record<string, string[]> = {
    Marketing: ["marketing", "branding", "posizionamento", "strategie-di-mercato"],
    "Comportamento del Consumatore": [
      "comportamento",
      "consumatore",
      "psicologia",
      "persuasione",
    ],
    "Organizzazione Aziendale": ["organizzazione", "management", "strategia"],
  }

  // Filter books based on topic and author
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      // Topic filter
      const matchesTopic =
        !selectedTopic ||
        (book.tags &&
          topicToTags[selectedTopic]?.some((keyword) =>
            book.tags.some((tag) =>
              tag.toLowerCase().includes(keyword.toLowerCase())
            )
          ))

      // Author filter
      const matchesAuthor =
        !selectedAuthor || book.author === selectedAuthor

      return matchesTopic && matchesAuthor
    })
  }, [initialBooks, selectedTopic, selectedAuthor])

  // Sort books with most viewed first, then alphabetically
  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      const aViews = viewCounts[a.slug] || 0
      const bViews = viewCounts[b.slug] || 0

      // Sort by views descending, then by title ascending
      if (aViews !== bViews) {
        return bViews - aViews
      }
      return a.title.localeCompare(b.title)
    })
  }, [filteredBooks, viewCounts])

  // Get top 3 books globally (unaffected by filters)
  const topThreeBooks = useMemo(() => {
    return [...initialBooks]
      .sort((a, b) => {
        const aViews = viewCounts[a.slug] || 0
        const bViews = viewCounts[b.slug] || 0
        if (aViews !== bViews) {
          return bViews - aViews
        }
        return a.title.localeCompare(b.title)
      })
      .slice(0, 3)
  }, [initialBooks, viewCounts])

  const handleFilterChange = (topic: string | null, author: string | null) => {
    setSelectedTopic(topic)
    setSelectedAuthor(author)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Pill variant="accent" icon={BookOpen}>
              Biblioteca dell'Imprenditore
            </Pill>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Libri per Costruire Aziende Solide e Scalabili
              </h1>
              <div className="flex justify-center -mt-3">
                <UnderlineAccent width="long" sketched={true} />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I libri su marketing, comportamento del consumatore e
              organizzazione analizzati per aiutarti a ragionare meglio e
              applicare con criterio nella realtà italiana.
            </p>

            {/* Book count */}
            <p className="text-xl md:text-2xl font-semibold text-foreground">
              {initialBooks.length}{" "}
              {initialBooks.length === 1
                ? "libro analizzato per voi fino ad oggi"
                : "libri analizzati per voi fino ad oggi"}
            </p>
          </div>
        </section>

        {/* Search & Filter - Visually Separated */}
        <section className="bg-muted/30 border-y border-border py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Filtra i libri
              </h3>
              <BookSearch
                allAuthors={allAuthors}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </section>

        <>
          {/* Top 3 Most Read Books - Always visible */}
          {topThreeBooks.length > 0 && (
            <section className="container mx-auto px-6 py-12">
              <div className="max-w-6xl mx-auto space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Le 3 analisi più lette dagli utenti
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topThreeBooks.map((book) => (
                    <BookCardSmall
                      key={book.slug}
                      book={book}
                      featured={true}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Books - Alphabetical */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-6xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Tutti i Libri
              </h2>
              {filteredBooks.length === 0 ? (
                <div className="text-center space-y-4 py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      Nessun libro trovato
                    </h3>
                    <p className="text-muted-foreground">
                      Prova a modificare i filtri di ricerca
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...filteredBooks]
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((book) => (
                      <BookCardSmall
                        key={book.slug}
                        book={book}
                        featured={false}
                      />
                    ))}
                </div>
              )}
            </div>
          </section>
        </>
      </main>

      <Footer />
    </div>
  )
}
