import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolCard } from "@/components/tools/tool-card"
import { tools } from "@/data/tools"

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map(t => t.category)))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Tutti i Tool</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scegli lo strumento che fa per te. Ogni tool è basato su framework celebri
              e ti guida passo dopo passo verso risultati concreti.
            </p>
          </div>

          {/* Categories filter - future enhancement */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full bg-muted text-sm capitalize"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                description={tool.description}
                category={tool.category}
                bookCount={tool.bookCount}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}