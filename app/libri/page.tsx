import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent } from "@/components/design-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllBooks } from "@/lib/books"
import { BookOpen, Star, Clock } from "lucide-react"

export const metadata = {
  title: "Libri | Pagine Vincenti",
  description: "Analisi complete dei migliori libri di marketing e business",
}

export default function LibriPage() {
  const allBooks = getAllBooks()

  // Group books by level
  const booksByLevel = {
    base: allBooks.filter((book) => book.level === "base"),
    intermedio: allBooks.filter((book) => book.level === "intermedio"),
    avanzato: allBooks.filter((book) => book.level === "avanzato"),
  }

  const levelInfo = {
    base: {
      title: "Base",
      description: "Fondamenta essenziali per iniziare",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    intermedio: {
      title: "Intermedio",
      description: "Approfondimenti per chi ha le basi",
      color: "bg-secondary/20 text-secondary border-secondary/30",
    },
    avanzato: {
      title: "Avanzato",
      description: "Strategie avanzate per professionisti",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Pill variant="accent" icon={BookOpen}>
              Biblioteca Marketing
            </Pill>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                I Migliori Libri
                <br />
                Analizzati per Te
              </h1>
              <div className="flex justify-center">
                <UnderlineAccent width="medium" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sintesi complete, mappe mentali e checklist operative dei libri più
              importanti per marketing e business.
            </p>
          </div>
        </section>

        {/* Books by Level */}
        {(["base", "intermedio", "avanzato"] as const).map((level) => {
          const books = booksByLevel[level]
          if (books.length === 0) return null

          return (
            <section key={level} className="container mx-auto px-6 py-12 md:py-16">
              <div className="max-w-6xl mx-auto">
                {/* Level Header */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      className={`${levelInfo[level].color} font-semibold uppercase tracking-wide`}
                    >
                      {levelInfo[level].title}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {books.length} {books.length === 1 ? "libro" : "libri"}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {levelInfo[level].description}
                  </p>
                </div>

                {/* Books Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <Card
                      key={book.slug}
                      className="group flex flex-col overflow-hidden border-2 hover:border-secondary/40 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Book Cover */}
                      <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
                        {book.coverImage ? (
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground px-4 text-center">
                            {book.title}
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <CardHeader className="space-y-3">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-bold">
                              {book.rating}
                            </span>
                          </div>
                          {book.reviewCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({book.reviewCount} recensioni)
                            </span>
                          )}
                        </div>

                        {/* Title & Author */}
                        <div>
                          <CardTitle className="text-lg leading-tight group-hover:text-secondary transition-colors">
                            {book.title}
                          </CardTitle>
                          {book.author && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {book.author}
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col space-y-4">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {book.description}
                        </p>

                        {/* Reading Time */}
                        {book.readingTimeSystem && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{book.readingTimeSystem}</span>
                          </div>
                        )}

                        {/* CTA */}
                        <Button asChild className="w-full mt-auto">
                          <Link href={`/libri/${book.slug}`}>Leggi Analisi</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* Empty State */}
        {allBooks.length === 0 && (
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">
                Nessun libro disponibile
              </h2>
              <p className="text-muted-foreground">
                Stiamo preparando le analisi dei migliori libri di marketing.
                Torna presto!
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
