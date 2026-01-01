import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface PillProps {
  children: React.ReactNode
  icon?: LucideIcon
  variant?: "default" | "accent" | "muted" | "success" | "warning"
  className?: string
}

export function Pill({ children, icon: Icon, variant = "default", className }: PillProps) {
  const variantStyles = {
    default: "bg-muted/50 text-muted-foreground border-muted/30",
    accent: "bg-secondary/10 text-secondary border-secondary/20 font-semibold",
    muted: "bg-muted/30 text-muted-foreground/70 border-muted/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    warning: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] border",
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  )
}
