"use client";

import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RelatedBook {
  slug: string;
  title: string;
  author: string;
  coverImage: string;
}

interface RelatedBooksCTAProps {
  books: RelatedBook[];
  title?: string;
}

export function RelatedBooksCTA({
  books,
  title = "Libri Correlati"
}: RelatedBooksCTAProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Altri libri che potrebbero interessarti
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {books.map((book) => (
          <Link
            key={book.slug}
            href={`/libri/${book.slug}`}
            className="group"
          >
            <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h4>
            <p className="text-xs text-muted-foreground">{book.author}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
