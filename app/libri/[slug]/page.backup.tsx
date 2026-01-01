import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBookWithContent, getBookBySlug, getNextBookInLevel } from "@/lib/books";
import { NextBookCTA } from "@/components/CTA/NextBookCTA";
import { BookViewTracker } from "@/components/book-view-tracker";
import { ArrowLeft, Clock, Download, PlayCircle, CheckSquare, FileText, Star, Lock } from "lucide-react";
import SummaryWithCTA from "@/components/SummaryWithCTA";
import { InsightBox } from "@/components/books/insight-box";
import { BookFAQ } from "@/components/books/book-faq";
import { BookQuiz } from "@/components/books/book-quiz";

interface BookPageProps {
  params: {
    slug: string;
  };
}

const buildUnlockHref = (slug: string) => `/unlock?next=${encodeURIComponent(`/libri/${slug}`)}`;

function resolveAudio(slug: string) {
  const candidates = [
    path.join("public", "audio", `${slug}.mp3`),
    path.join("public", "audio", `${slug}.m4a`),
    path.join("public", "audio", `${slug}.wav`),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`;
    }
  }
  return null;
}

function resolvePdf(slug: string) {
  const candidates = [
    path.join("public", "downloads", `${slug}.pdf`),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`;
    }
  }
  return null;
}

export default async function BookPage({ params }: BookPageProps) {
  const slug = params.slug;

  // Get book with full content
  const bookWithContent = getBookWithContent(slug);

  if (!bookWithContent) {
    notFound();
  }

  const cookieStore = await cookies();
  const hasFree = !!cookieStore.get("pv_free");
  const hasPro = !!cookieStore.get("pv_pro");
  const hasAccess = hasFree || hasPro;

  const { content, frontmatter, ...book } = bookWithContent;
  const title = book.title;
  const author = book.author;
  const level = book.level;
  const description = book.description;
  const coverImage = book.coverImage;
  const rating = book.rating;
  const readingTimeFull = book.readingTimeFull;
  const readingTimeSystem = book.readingTimeSystem;
  const audioSrc = resolveAudio(slug);
  const pdfSrc = resolvePdf(slug);
  const nextBook = getNextBookInLevel(slug);

  return (
    <div className="flex flex-col min-h-screen">
      <BookViewTracker bookSlug={slug} />
      <Header />
      <main className="flex-grow">
        <div className="bg-muted/30 py-12 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" asChild>
              <Link href={`/percorsi/${level}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna al percorso {level}
              </Link>
            </Button>

            <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
              <div className="relative w-full aspect-[2/3] bg-secondary/20 rounded-lg overflow-hidden border shadow-sm">
                {coverImage ? (
                  <Image src={coverImage} alt={title} fill className="object-cover" sizes="240px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground px-4 text-center">
                    {title}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {level}
                    </Badge>
                    <div className="flex items-center text-amber-500 text-sm font-bold">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      {rating}
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                  {author && <p className="text-xl text-muted-foreground font-medium">{author}</p>}
                </div>

                {(readingTimeFull || readingTimeSystem) && (
                  <div className="flex flex-wrap gap-6 text-sm">
                    {readingTimeFull && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-5 w-5 mr-2" />
                        <div>
                          <p className="font-medium text-foreground">Tempo integrale</p>
                          <p>{readingTimeFull}</p>
                        </div>
                      </div>
                    )}
                    {readingTimeSystem && (
                      <div className="flex items-center text-green-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <div>
                          <p className="font-medium">Tempo sistema PV</p>
                          <p>{readingTimeSystem}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-wrap gap-4">
                    {hasAccess ? (
                      <Button size="sm" className="gap-2" asChild>
                        {pdfSrc ? (
                          <a href={pdfSrc} download>
                            <Download className="h-4 w-4" />
                            Scarica Riassunto PDF
                          </a>
                        ) : (
                          <span className="opacity-50 cursor-not-allowed">
                            <Download className="h-4 w-4" />
                            PDF non disponibile
                          </span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 opacity-60 hover:opacity-100"
                        asChild
                      >
                        <Link href={buildUnlockHref(slug)}>
                          <Download className="h-4 w-4" />
                          Sblocca Riassunto PDF
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-primary">Audio-ripasso</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {audioSrc ? (
                        hasAccess ? (
                          <div className="flex flex-col gap-3">
                            <audio controls preload="none" className="h-10" src={audioSrc}>
                              Il tuo browser non supporta l'audio.
                            </audio>
                            <div className="flex flex-wrap gap-3">
                              <Button size="sm" className="gap-2" asChild>
                                <a href={audioSrc} download>
                                  <Download className="h-4 w-4" />
                                  Scarica audio ripasso
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2" asChild>
                                <a href={audioSrc}>
                                  <PlayCircle className="h-4 w-4" />
                                  Ascolta ora
                                </a>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 opacity-60 hover:opacity-100"
                            asChild
                          >
                            <Link href={buildUnlockHref(slug)}>
                              <Lock className="h-4 w-4" />
                              Sblocca audio ripasso
                            </Link>
                          </Button>
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">Audio non disponibile.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Riassunto completo
                </h2>
                <div className="article-content">
                  <SummaryWithCTA
                    mdxContent={content}
                    bookSlug={slug}
                    bookTitle={title}
                    bookAuthor={author}
                    amazonLink={book.amazonLink}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Contenuti del pacchetto
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-bold mb-2">I 6 principi in 6 minuti</h3>
                    <p className="text-sm text-muted-foreground">Sintesi estrema dei concetti chiave per ripasso veloce.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-bold mb-2">Caso studio pratico</h3>
                    <p className="text-sm text-muted-foreground">Esempio reale di applicazione nel mercato italiano.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-bold mb-2">Come applicarlo domani</h3>
                    <p className="text-sm text-muted-foreground">3 azioni concrete da fare subito nel tuo business.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-bold mb-2">Gli errori da evitare</h3>
                    <p className="text-sm text-muted-foreground">Trappole comuni quando si applica questo metodo.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckSquare className="h-6 w-6 text-primary" />
                  Checklist Applicativa
                </h2>
                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded border-2 border-primary flex-shrink-0 mt-0.5"></div>
                    <p>Analizza i tuoi attuali touchpoint con il cliente</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded border-2 border-primary flex-shrink-0 mt-0.5"></div>
                    <p>Identifica dove manca la riprova sociale</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded border-2 border-primary flex-shrink-0 mt-0.5"></div>
                    <p>Crea 3 varianti di copy usando il principio di scarsità</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded border-2 border-primary flex-shrink-0 mt-0.5"></div>
                    <p>Testa l'offerta su un segmento del 10% della lista</p>
                  </div>
                </div>
              </section>

              {/* Insight Boxes */}
              {frontmatter.insightBoxes && frontmatter.insightBoxes.length > 0 && (
                <section>
                  {frontmatter.insightBoxes.map((insight, index) => (
                    <InsightBox
                      key={index}
                      title={insight.title}
                      content={insight.content}
                      articleSlug={insight.articleSlug}
                      articleTitle={insight.articleTitle}
                    />
                  ))}
                </section>
              )}

              {/* FAQs */}
              {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                <BookFAQ faqs={frontmatter.faqs} />
              )}

              {/* Quiz */}
              {frontmatter.quiz && frontmatter.quiz.length > 0 && (
                <BookQuiz quiz={frontmatter.quiz} bookTitle={title} />
              )}
            </div>

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
        </div>
      </main>
      <Footer />
    </div>
  );
}
