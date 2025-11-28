import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardData } from "@/data/mock-dashboard";
import { BookOpen, Users, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LiveDashboard() {
    const { activeStudents, currentPath, currentBook } = dashboardData;
    const progressPercentage = (currentPath.completedBooks / currentPath.totalBooks) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Dashboard Live
                </h2>
                <div className="flex items-center gap-2 text-sm text-green-600 animate-pulse">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    System Online
                </div>
            </div>

            <Card className="border-2 border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Column 1: Current Path */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <BookOpen className="h-5 w-5" />
                                <span>Percorso in corso</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{currentPath.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {currentPath.completedBooks}/{currentPath.totalBooks} libri completati
                                </p>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>

                        {/* Column 2: Current Book */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <Clock className="h-5 w-5" />
                                <span>Libro attuale</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold truncate">{currentBook.title}</h3>
                                <p className="text-sm text-muted-foreground">{currentBook.author}</p>
                            </div>
                            <div className="text-sm font-medium">
                                Giorno {currentBook.day}/{currentBook.totalDays}
                            </div>
                        </div>

                        {/* Column 3: Community & CTA */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-primary font-medium mb-2">
                                    <Users className="h-5 w-5" />
                                    <span>Community</span>
                                </div>
                                <p className="text-2xl font-bold">{activeStudents}</p>
                                <p className="text-sm text-muted-foreground">studenti attivi ora</p>
                            </div>

                            <Button asChild className="w-full group">
                                <Link href={`/percorsi/${currentPath.name.toLowerCase()}`}>
                                    Continua Percorso
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
