import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/articles"
import { Calendar, Tag, ArrowRight, BookOpen } from "lucide-react"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Articolo non trovato',
    }
  }

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      images: article.frontmatter.featuredImage ? [article.frontmatter.featuredImage] : [],
    },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const { frontmatter, content } = article

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <article className="container mx-auto px-6 py-16 max-w-4xl">
          {/* Header */}
          <header className="mb-12">
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {frontmatter.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {frontmatter.description}
            </p>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(frontmatter.publishedAt).toLocaleDateString('it-IT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {frontmatter.author && (
                <span className="text-sm">• {frontmatter.author}</span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {frontmatter.featuredImage && (
            <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
              <Image
                src={frontmatter.featuredImage}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="article-content mb-16">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </div>

          {/* Auto CTA - Middle of article */}
          <Card className="my-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Vuoi applicare questi concetti?</h3>
              <p className="text-muted-foreground">
                Prova i nostri tool interattivi basati su framework professionali
              </p>
              <Button size="lg" asChild>
                <Link href="/tools">
                  Scopri i tool <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Related Books */}
          {frontmatter.relatedBooks && frontmatter.relatedBooks.length > 0 && (
            <section className="my-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-secondary" />
                Libri citati
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frontmatter.relatedBooks.map((book) => (
                  <Card key={book} className="p-6">
                    <p className="font-semibold mb-3">{book}</p>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/libri/${book.toLowerCase().replace(/\s+/g, '-')}`}>
                        Scopri di più →
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools */}
          {frontmatter.relatedTools && frontmatter.relatedTools.length > 0 && (
            <section className="my-16">
              <h2 className="text-3xl font-bold mb-6">Tool correlati</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frontmatter.relatedTools.map((tool) => (
                  <Card key={tool} className="p-6 hover:border-primary/40 transition-colors">
                    <p className="font-semibold mb-3">{tool}</p>
                    <Button size="sm" asChild>
                      <Link href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}>
                        Usa gratis →
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {frontmatter.faq && frontmatter.faq.length > 0 && (
            <section className="my-16">
              <h2 className="text-3xl font-bold mb-8">Domande frequenti</h2>
              <div className="space-y-6">
                {frontmatter.faq.map((item, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-bold mb-3">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Custom CTA */}
          {frontmatter.ctaText && frontmatter.ctaLink && (
            <Card className="my-16 p-8 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">{frontmatter.ctaText}</h3>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={frontmatter.ctaLink}>
                    Scopri di più <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          )}

          {/* Bottom CTA */}
          <Card className="my-16 p-8 bg-primary text-primary-foreground">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ti è piaciuto questo articolo?</h3>
              <p className="text-lg opacity-95">
                Iscriviti alla newsletter per ricevere contenuti esclusivi e nuovi tool
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/#newsletter">
                  Iscriviti gratis <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  )
}