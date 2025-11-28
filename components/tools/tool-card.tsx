import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

interface ToolCardProps {
  slug: string
  name: string
  description: string
  category: string
  bookCount: number
  icon?: React.ReactNode
}

export function ToolCard({ slug, name, description, category, bookCount, icon }: ToolCardProps) {
  return (
    <Card className="flex flex-col h-full group">
      <CardHeader>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors">
            {icon || <BookOpen className="w-6 h-6" />}
          </div>
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
          <span className="capitalize">{category}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-stretch pt-6">
        <div className="text-sm text-muted-foreground text-center font-medium">
          📚 Basato su {bookCount} {bookCount === 1 ? 'libro' : 'libri'}
        </div>
        <Button asChild className="w-full" size="default">
          <Link href={`/tools/${slug}`}>
            Usa Gratis →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}