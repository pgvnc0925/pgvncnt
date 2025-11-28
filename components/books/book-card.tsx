import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "@/data/mock-books";
import { Star, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BookCardProps {
    book: Book;
}

export function BookCard({ book }: BookCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/30">
                    <span className="text-lg font-bold text-center px-4">{book.title}</span>
                </div>
            </div>

            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="uppercase text-[10px] tracking-[0.2em]">
                        {book.level}
                    </Badge>
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        {book.rating}
                    </div>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                    {book.author}
                </div>
                <h3 className="font-bold text-lg leading-tight line-clamp-2">{book.title}</h3>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {book.description}
                </p>

                <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Full: {book.readingTimeFull}
                    </div>
                    <div className="flex items-center text-green-600 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        PV: {book.readingTimeSystem}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full" variant="outline">
                    <Link href={`/libri/${book.slug}`}>
                        Studia Libro
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
