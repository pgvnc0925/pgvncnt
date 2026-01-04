import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book } from "@/types/book"
import { Star, Clock } from "lucide-react"

interface BookCardSmallProps {
  book: Book
  featured?: boolean
}

export function BookCardSmall({ book, featured = false }: BookCardSmallProps) {
  return (
    <Link href={`/libri/${book.slug}`}>
      <Card
        className={`group flex flex-row overflow-hidden border hover:border-secondary/40 hover:shadow-md transition-all duration-300 h-full ${
          featured ? "ring-1 ring-secondary/30" : ""
        }`}
      >
        {/* Book Cover - Smaller, left side */}
        <div className="relative w-20 flex-shrink-0 bg-muted overflow-hidden">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground px-1 text-center text-[10px]">
              {book.title}
            </div>
          )}
          {featured && (
            <div className="absolute top-1 left-1">
              <Badge className="bg-secondary text-secondary-foreground text-[9px] px-1 py-0 h-3.5">
                Top
              </Badge>
            </div>
          )}
        </div>

        {/* Book Info - Right side, more space */}
        <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-2">
          {/* Title & Author */}
          <div>
            <h3 className="text-sm font-bold leading-tight group-hover:text-secondary transition-colors line-clamp-2 mb-1">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {book.description}
            </p>
          )}

          {/* Rating & Reading Time */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="font-semibold">{book.rating}</span>
              {book.reviewCount > 0 && (
                <span className="text-muted-foreground">({book.reviewCount})</span>
              )}
            </div>

            {/* Reading Time */}
            {book.readingTimeSystem && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{book.readingTimeSystem}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
