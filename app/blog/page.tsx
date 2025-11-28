import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllArticles } from "@/lib/articles"
import { Calendar, Tag } from "lucide-react"

export default function ArticoliPage() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="bg-primary py-20 border-b border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-amber-200">Articoli</span> & Risorse
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Approfondimenti, analisi e guide pratiche su business, marketing e produttività.
              <br className="hidden md:block" />
              Contenuti basati sui migliori framework internazionali.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-8">
                Nessun articolo disponibile al momento. Torna presto!
              </p>
              <Button asChild>
                <Link href="/tools">Scopri i nostri tool</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.slug} className="flex flex-col h-full overflow-hidden border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg group">
                  {article.frontmatter.featuredImage && (
                    <div className="relative w-full h-48 bg-muted overflow-hidden">
                      <Image
                        src={article.frontmatter.featuredImage}
                        alt={article.frontmatter.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>
                          {new Date(article.frontmatter.publishedAt).toLocaleDateString('it-IT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.frontmatter.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {article.frontmatter.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.frontmatter.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium border border-secondary/20"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full group-hover:bg-secondary group-hover:text-primary transition-all">
                      <Link href={`/blog/${article.slug}`}>
                        Leggi articolo →
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}