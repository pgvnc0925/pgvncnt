import { cn } from "@/lib/utils"
import { LucideIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill } from "./pill"

interface ToolCardProps {
  icon: LucideIcon
  title: string
  tagline: string
  description: string
  features: string[]
  status: "live" | "beta" | "development"
  href?: string
  iconBgColor?: string
  gradientFrom?: string
  gradientTo?: string
  className?: string
}

const statusLabels = {
  live: "LIVE",
  beta: "BETA",
  development: "IN SVILUPPO",
}

const statusVariants = {
  live: "success" as const,
  beta: "warning" as const,
  development: "muted" as const,
}

export function ToolCard({
  icon,
  title,
  tagline,
  description,
  features,
  status,
  href,
  iconBgColor = "bg-secondary/20",
  gradientFrom = "rgba(212, 175, 55, 0.03)",
  gradientTo = "rgba(15, 23, 42, 0.02)",
  className,
}: ToolCardProps) {
  const Icon = icon

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      }}
    >
      {/* Status pill */}
      <div className="absolute top-4 right-4 z-10">
        <Pill variant={statusVariants[status]}>{statusLabels[status]}</Pill>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {/* Icon */}
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", iconBgColor)}>
          <Icon className="w-8 h-8 text-foreground" />
        </div>

        {/* Title & Tagline */}
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium mb-4">{tagline}</p>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex gap-3">
          {href && status !== "development" ? (
            <>
              <Button asChild className="flex-1 group">
                <Link href={href}>
                  {status === "live" ? "Apri" : "Prova"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href={`${href}/info`}>Dettagli</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" disabled className="flex-1">
              Prossimamente
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
