import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { books } from "@/data/mock-books";
import { ArrowLeft, Clock, Download, PlayCircle, CheckSquare, FileText, Star } from "lucide-react";
import SummaryWithCTA from "@/components/SummaryWithCTA";

interface BookPageProps {
  params: {
    slug: string;
  };
}

const CANONICAL_SLUG = "le-22-leggi-del-marketing";
const LEGACY_SLUG = "22-immutable-laws-of-marketing";
const buildUnlockHref = (slug: string) => `/unlock?next=${encodeURIComponent(`/libri/${slug}`)}`;

function loadMdx(slug: string) {
  const candidates = [
    path.join(process.cwd(), "content", "books", `${slug}.mdx`),
    path.join(process.cwd(), "content", "books", `${CANONICAL_SLUG}.mdx`),
    path.join(process.cwd(), "content", "books", `${LEGACY_SLUG}.mdx`),
  ];
  for (const mdxPath of candidates) {
    if (fs.existsSync(mdxPath)) {
      const raw = fs.readFileSync(mdxPath, "utf8");
      const parsed = matter(raw);
      return { frontmatter: parsed.data as Record<string, any>, content: parsed.content };
    }
  }
  return null;
}

function resolveCover(slug: string, frontCover?: string, fallback?: string) {
  const candidates = [
    frontCover ? path.join("public", "covers", frontCover) : null,
    path.join("public", "covers", `${slug}.jpg`),
    path.join("public", "covers", `${slug}.png`),
    path.join("public", "covers", `${CANONICAL_SLUG}.jpg`),
    path.join("public", "covers", `${CANONICAL_SLUG}.png`),
    path.join("public", "covers", `${LEGACY_SLUG}.jpg`),
    path.join("public", "covers", `${LEGACY_SLUG}.png`),
  ].filter(Boolean) as string[];
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`;
    }
  }
  return fallback || null;
}

function resolveAudio(slug: string) {
  const candidates = [
    path.join("public", "audio", `${slug}.mp3`),
    path.join("public", "audio", `${slug}.m4a`),
    path.join("public", "audio", `${slug}.wav`),
    path.join("public", "audio", `${CANONICAL_SLUG}.mp3`),
    path.join("public", "audio", `${CANONICAL_SLUG}.m4a`),
    path.join("public", "audio", `${LEGACY_SLUG}.mp3`),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      return `/${path.relative("public", filePath)}`;
    }
  }
  return null;
}

export default function BookPage({ params }: BookPageProps) {
  const slug = params.slug;
  if (slug === LEGACY_SLUG) {
    redirect(`/libri/${CANONICAL_SLUG}`);
  }
  const mdx = loadMdx(slug);
  const book = books.find((b) => b.slug === slug || b.slug === CANONICAL_SLUG || b.slug === LEGACY_SLUG);
  if (!mdx && !book) {
    notFound();
  }
  const cookieStore = cookies();
  const hasFree = !!cookieStore.get("pv_free");
  const hasPro = !!cookieStore.get("pv_pro");

  const front = mdx?.frontmatter ?? {};
  const overrideTitle =
    slug === CANONICAL_SLUG || slug === LEGACY_SLUG
      ? "Le 22 Immutabili Leggi del Marketing"
      : undefined;
  const title = overrideTitle || front.title || book?.title || slug;
  const author = front.author || book?.author || "";
  const level = (front.pvCategory || book?.level || "base").toLowerCase();
  const description = front.excerpt || front.metaDescription || book?.description || "";
  const coverImage = resolveCover(slug, front.coverImage, book?.coverImage || undefined);
  const rating = book?.rating ?? front.rating ?? 4.8;
  const readingTimeFull = book?.readingTimeFull ?? "";
  const readingTimeSystem = book?.readingTimeSystem ?? "";
  const audioSrc = resolveAudio(slug);

  return (
    <div className="flex flex-col min-h-screen">
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
                    {hasFree || hasPro ? (
                      <Button size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Scarica Riassunto PDF
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
                        hasFree || hasPro ? (
                          <>
                            <audio controls preload="none" className="h-10" src={audioSrc}>
                              Il tuo browser non supporta l'audio.
                            </audio>
                            <Link
                              href={audioSrc}
                              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              download
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Link>
                          </>
                        ) : (
                          <Link
                            href={buildUnlockHref(slug)}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Sblocca per ascoltare →
                          </Link>
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
                  {mdx ? (
                    <SummaryWithCTA mdxContent={mdx.content} />
                  ) : (
                    <p className="text-muted-foreground">Riassunto MDX non trovato per questo libro.</p>
                  )}
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
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-bold mb-4">Prossimo Libro nel percorso</h3>
                <div className="space-y-4">
                  <div className="aspect-[2/3] bg-background rounded border flex items-center justify-center text-xs text-center p-2 text-muted-foreground">
                    Copertina Positioning
                  </div>
                  <div>
                    <p className="font-bold">Positioning</p>
                    <p className="text-sm text-muted-foreground">Al Ries &amp; Jack Trout</p>
                  </div>
                  <Button className="w-full" size="sm">
                    Inizia Lunedì
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
