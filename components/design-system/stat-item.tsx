import { cn } from "@/lib/utils"

interface StatItemProps {
  value: string | number
  label: string
  sublabel?: string
  className?: string
}

export function StatItem({ value, label, sublabel, className }: StatItemProps) {
  return (
    <div className={cn("text-center space-y-2", className)}>
      <div className="text-4xl md:text-5xl font-bold text-primary">{value}</div>
      <div className="text-sm md:text-base font-medium text-foreground">{label}</div>
      {sublabel && (
        <div className="text-xs text-muted-foreground">{sublabel}</div>
      )}
    </div>
  )
}
