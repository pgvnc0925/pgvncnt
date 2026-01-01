import fs from "fs"
import path from "path"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Pill, UnderlineAccent } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getBookWithContent, getNextBookInLevel } from "@/lib/books"
import { NextBookCTA } from "@/components/CTA/NextBookCTA"
import { BookViewTracker } from "@/components/book-view-tracker"
import {
  ArrowLeft,
  Clock,
  Download,
  PlayCircle,
  CheckSquare,
  FileText,
  Star,
  Lock,
  BookOpen,
} from "lucide-react"
import SummaryWithCTA from "@/components/SummaryWithCTA"
import { InsightBox } from "@/components/books/insight-box"
import { BookFAQ } from "@/components/books/book-faq"
import { BookQuiz } from "@/components/books/book-quiz"

interface BookPageProps {
  params: {
    slug: string
  }
}

const buildUnlockHref = (slug: string) =>
  `/unlock?next=${encodeURIComponent(`/libri/${slug}`)}`

function resolveAudio(slug: string) {
  const candidates = [
    path.join("public", "audio", `${slug}.mp3`),
    path.join("public", "audio", `${slug}.m4a`),
    path.join("public", "audio", `${slug}.wav`),
  ]
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`
    }
  }
  return null
}

function resolvePdf(slug: string) {
  const candidates = [path.join("public", "downloads", `${slug}.pdf`)]
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`
    }
  }
  return null
}

export default async function BookPage({ params }: BookPageProps) {
  const slug = params.slug

  const bookWithContent = getBookWithContent(slug)

  if (!bookWithContent) {
    notFound()
  }

  const cookieStore = await cookies()
  const hasFree = !!cookieStore.get("pv_free")
  const hasPro = !!cookieStore.get("pv_pro")
  const hasAccess = hasFree || hasPro

  const { content, frontmatter, ...book } = bookWithContent
  const audioSrc = resolveAudio(slug)
  const pdfSrc = resolvePdf(slug)
  const nextBook = getNextBookInLevel(slug)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <BookViewTracker bookSlug={slug} />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-8 pl-0 hover:bg-transparent hover:text-secondary"
              asChild
            >
              <Link href="/libri">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna ai Libri
              </Link>
            </Button>

            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
              {/* Book Cover */}
              <div className="relative w-full max-w-[280px] mx-auto lg:mx-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border-2 border-border">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground px-4 text-center">
                    <BookOpen className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Level & Rating */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className="capitalize font-semibold uppercase tracking-wide"
                    >
                      {book.level}
                    </Badge>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="h-5 w-5 fill-current mr-1" />
                      {book.rating}
                      {book.reviewCount > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                          ({book.reviewCount} recensioni)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
                      {book.title}
                    </h1>
                    <UnderlineAccent width="short" />
                  </div>
                  {book.author && (
                    <p className="text-xl text-muted-foreground font-medium">
                      {book.author}
                    </p>
                  )}
                </div>

                {/* Reading Times */}
                {(book.readingTimeFull || book.readingTimeSystem) && (
                  <div className="flex flex-wrap gap-6 p-4 rounded-xl bg-muted/30">
                    {book.readingTimeFull && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Tempo integrale
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {book.readingTimeFull}
                          </p>
                        </div>
                      </div>
                    )}
                    {book.readingTimeSystem && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-secondary">
                            Tempo sistema PV
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {book.readingTimeSystem}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Download Actions */}
                <div className="flex flex-col gap-4 p-6 rounded-xl border-2 border-border bg-card">
                  {/* PDF Download */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">
                        Riassunto PDF
                      </span>
                    </div>
                    {hasAccess ? (
                      <Button size="lg" className="w-full" asChild disabled={!pdfSrc}>
                        {pdfSrc ? (
                          <a href={pdfSrc} download>
                            <Download className="h-4 w-4 mr-2" />
                            Scarica Riassunto PDF
                          </a>
                        ) : (
                          <span>PDF non disponibile</span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        asChild
                      >
                        <Link href={buildUnlockHref(slug)}>
                          <Lock className="h-4 w-4 mr-2" />
                          Sblocca Riassunto PDF
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Audio Player */}
                  {audioSrc && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">
                          Audio-ripasso
                        </span>
                      </div>
                      {hasAccess ? (
                        <div className="space-y-3">
                          <audio
                            controls
                            preload="none"
                            className="w-full h-10"
                            src={audioSrc}
                          >
                            Il tuo browser non supporta l'audio.
                          </audio>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <a href={audioSrc} download>
                              <Download className="h-4 w-4 mr-2" />
                              Scarica audio
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <Link href={buildUnlockHref(slug)}>
                            <Lock className="h-4 w-4 mr-2" />
                            Sblocca audio ripasso
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <div className="space-y-12">
              {/* Summary */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Riassunto completo
                  </h2>
                </div>
                <div className="article-content">
                  <SummaryWithCTA
                    mdxContent={content}
                    bookSlug={slug}
                    bookTitle={book.title}
                    bookAuthor={book.author}
                    amazonLink={book.amazonLink}
                  />
                </div>
              </div>

              {/* Package Contents */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Contenuti del pacchetto
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "I 6 principi in 6 minuti",
                      desc: "Sintesi estrema dei concetti chiave per ripasso veloce.",
                    },
                    {
                      title: "Caso studio pratico",
                      desc: "Esempio reale di applicazione nel mercato italiano.",
                    },
                    {
                      title: "Come applicarlo domani",
                      desc: "3 azioni concrete da fare subito nel tuo business.",
                    },
                    {
                      title: "Gli errori da evitare",
                      desc: "Trappole comuni quando si applica questo metodo.",
                    },
                  ].map((item, i) => (
                    <Card key={i} className="p-5">
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckSquare className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Checklist Applicativa
                  </h2>
                </div>
                <Card className="p-6 bg-muted/20">
                  <div className="space-y-4">
                    {[
                      "Analizza i tuoi attuali touchpoint con il cliente",
                      "Identifica dove manca la riprova sociale",
                      "Crea 3 varianti di copy usando il principio di scarsità",
                      "Testa l'offerta su un segmento del 10% della lista",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded border-2 border-secondary flex-shrink-0 mt-0.5"></div>
                        <p className="text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Insight Boxes */}
              {frontmatter.insightBoxes &&
                frontmatter.insightBoxes.length > 0 && (
                  <div>
                    {frontmatter.insightBoxes.map((insight, index) => (
                      <InsightBox
                        key={index}
                        title={insight.title}
                        content={insight.content}
                        articleSlug={insight.articleSlug}
                        articleTitle={insight.articleTitle}
                      />
                    ))}
                  </div>
                )}

              {/* FAQs */}
              {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                <BookFAQ faqs={frontmatter.faqs} />
              )}

              {/* Quiz */}
              {frontmatter.quiz && frontmatter.quiz.length > 0 && (
                <BookQuiz quiz={frontmatter.quiz} bookTitle={book.title} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {nextBook && (
                <NextBookCTA
                  nextBook={{
                    slug: nextBook.slug,
                    title: nextBook.title,
                    author: nextBook.author,
                    coverImage: nextBook.coverImage,
                    excerpt: nextBook.description,
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
