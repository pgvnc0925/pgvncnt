import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllArticles } from "@/lib/articles";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, Calendar, Tag, Eye, Link as LinkIcon } from "lucide-react";

const ADMIN_COOKIE = "pv_admin_session";

export default async function AdminArticlesPage() {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;

  if (!hasAccess) {
    redirect("/admin?error=unauthorized");
  }

  const articles = getAllArticles();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="mb-8 flex flex-col gap-4">
          <Button variant="ghost" className="mb-2 pl-0" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla Dashboard Admin
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge className="bg-secondary text-primary mb-2">Admin Only</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Gestione Articoli</h1>
              <p className="text-muted-foreground mt-2">
                Visualizza gli approfondimenti pubblicati o aggiungi un nuovo articolo.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/articles/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Articolo
              </Link>
            </Button>
          </div>
        </div>

        {articles.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <h3 className="text-xl font-semibold">Nessun articolo trovato</h3>
            <p className="text-muted-foreground">Aggiungi il tuo primo articolo per iniziare.</p>
            <Button asChild>
              <Link href="/admin/articles/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Articolo
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {articles.map((article) => (
              <Card key={article.slug} className="hover:shadow-md transition-shadow">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">{article.frontmatter.title}</CardTitle>
                  <CardDescription>{article.frontmatter.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.frontmatter.publishedAt).toLocaleDateString("it-IT", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {article.frontmatter.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {article.frontmatter.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {article.frontmatter.ctaBookSlug && (
                      <Badge variant="secondary" className="inline-flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        {article.frontmatter.ctaBookSlug}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/approfondimenti/${article.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" />
                        Apri
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
