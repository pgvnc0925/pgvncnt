import { cn } from "@/lib/utils"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Pill } from "./pill"
import Image from "next/image"

interface InsightCardProps {
  tag: string
  date: string
  title: string
  excerpt: string
  href: string
  featured?: boolean
  image?: string
  className?: string
}

export function InsightCard({
  tag,
  date,
  title,
  excerpt,
  href,
  featured = false,
  image,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
        featured ? "border-secondary/40" : "border-border",
        className
      )}
    >
      {/* Image */}
      {image && (
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 space-y-4">
        {/* Tag & Date */}
        <div className="flex items-center gap-3">
          <Pill variant="accent">{tag}</Pill>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Link */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:gap-3 transition-all"
        >
          Continua a leggere
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
