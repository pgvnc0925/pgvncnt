import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "bg-secondary/10 text-secondary",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className={cn("flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center", iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
