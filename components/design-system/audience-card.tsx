import { cn } from "@/lib/utils"

interface AudienceCardProps {
  number: string
  title: string
  description: string
  className?: string
}

export function AudienceCard({ number, title, description, className }: AudienceCardProps) {
  return (
    <div
      className={cn(
        "group p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-secondary/40 transition-all duration-300 space-y-4",
        className
      )}
    >
      <div className="text-5xl font-bold text-secondary/30 group-hover:text-secondary transition-colors">
        {number}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
