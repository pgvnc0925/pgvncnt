import { cn } from "@/lib/utils"
import { Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill } from "./pill"

interface LongformCardProps {
  category: string
  title: string
  description: string
  readTime?: number
  href: string
  saved?: boolean
  progress?: number
  onSave?: () => void
  className?: string
}

export function LongformCard({
  category,
  title,
  description,
  readTime,
  href,
  saved = false,
  progress,
  onSave,
  className,
}: LongformCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Left: Content */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Pill variant="accent">{category}</Pill>
          {readTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{readTime} min</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground leading-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {/* Progress indicator */}
        {progress !== undefined && progress > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
          </div>
        )}
      </div>

      {/* Right: CTAs stacked */}
      <div className="flex flex-row md:flex-col gap-3 md:w-40">
        <Button asChild className="flex-1">
          <Link href={href}>
            {progress && progress > 0 ? "Riprendi" : "Leggi ora"}
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onSave}
        >
          {saved ? "Salvato" : "Salva"}
        </Button>
      </div>
    </div>
  )
}
