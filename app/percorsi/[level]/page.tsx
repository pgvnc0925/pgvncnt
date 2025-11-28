import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { books, BookLevel } from "@/data/mock-books";
import { ArrowLeft, CheckCircle2, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";

interface PercorsoLevelPageProps {
    params: {
        level: string;
    };
}

const levelConfig: Record<string, { title: string; subtitle: string; description: string; icon: any; color: string; bg: string }> = {
    base: {
        title: "Base",
        subtitle: "Fundamentals",
        description: "10 Libri essenziali per costruire le fondamenta del marketing scientifico.",
        icon: CheckCircle2,
        color: "text-slate-600",
        bg: "bg-slate-100",
    },
    intermedio: {
        title: "Intermedio",
        subtitle: "Advanced",
        description: "25 Libri per approfondire e specializzarsi nelle strategie di crescita.",
        icon: TrendingUp,
        color: "text-secondary-foreground",
        bg: "bg-secondary/20",
    },
    avanzato: {
        title: "Avanzato",
        subtitle: "Master",
        description: "50 Libri per dominare il mercato e raggiungere il top 2.5%.",
        icon: Award,
        color: "text-primary",
        bg: "bg-primary/10",
    },
};

export default function PercorsoLevelPage({ params }: PercorsoLevelPageProps) {
    const level = params.level.toLowerCase();

    if (!levelConfig[level]) {
        notFound();
    }

    const config = levelConfig[level];
    const Icon = config.icon;

    // Filter books for this level
    const levelBooks = books.filter((book) => book.level === level);
    const firstBook = levelBooks[0];
    const cookieStore = cookies();
    const hasPvFree = !!cookieStore.get("pv_free");
    const hasPvPro = !!cookieStore.get("pv_pro");
    const hasBaseAccess = level !== "base" ? true : hasPvFree || hasPvPro;

    const outcomes: Record<string, string[]> = {
        base: [
            "Leggere il mercato e definire un posizionamento chiaro.",
            "Collegare strategia e azione senza improvvisare tattiche.",
            "Delegare o gestire il marketing con criteri verificabili.",
        ],
        intermedio: [
            "Leggere le motivazioni e i bias del cliente in modo pratico.",
            "Progettare messaggi e offerte che generano risposta.",
            "Segmentare per situazioni reali, non solo demografia.",
        ],
        avanzato: [
            "Pensare e decidere come un decisore di marketing senior.",
            "Progettare sistemi di marketing end-to-end.",
            "Integrare strategia, psicologia, economics e narrativa.",
        ],
    };

    const durationText =
        level === "base"
            ? "10 settimane: Marketing Management e Thinking, Fast and Slow richiedono ~10 giorni/2 settimane ciascuno; gli altri titoli 1 settimana."
            : `${levelBooks.length || "N"} settimane: ritmo di 1 libro a settimana.`;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                <div className="bg-primary py-16 border-b border-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-slate-300 hover:text-white" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Torna alla Home
                            </Link>
                        </Button>

                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className={`h-20 w-20 ${config.bg} ${config.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <Icon className="h-10 w-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Percorso <span className="text-secondary">{config.title}</span></h1>
                                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                                    {config.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                        <Button variant={level === 'base' ? 'default' : 'outline'} asChild>
                            <Link href="/percorsi/base">Percorso Base</Link>
                        </Button>
                        <Button variant={level === 'intermedio' ? 'default' : 'outline'} asChild>
                            <Link href="/percorsi/intermedio">Percorso Intermedio</Link>
                        </Button>
                        <Button variant={level === 'avanzato' ? 'default' : 'outline'} asChild>
                            <Link href="/percorsi/avanzato">Percorso Avanzato</Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto items-start mb-10">
                        <div className="p-6 rounded-xl border bg-card shadow-sm">
                            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Durata e ritmo</p>
                            <p className="text-lg font-bold text-foreground mt-2">{durationText}</p>
                            <p className="text-sm text-muted-foreground mt-2">Impegno medio: 30-45 minuti al giorno.</p>
                            <div className="flex gap-3 mt-4">
                                <Button asChild>
                                    <Link href={firstBook ? `/libri/${firstBook.slug}` : "#programma"}>
                                        Inizia {config.title}
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="#programma">Vedi programma</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl border bg-card shadow-sm">
                            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Alla fine sarai in grado di...</p>
                            <ul className="list-disc ml-5 mt-3 space-y-2 text-sm text-muted-foreground">
                                {(outcomes[level as keyof typeof outcomes] || []).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div id="programma" className="mb-4">
                        <h2 className="text-2xl font-bold text-primary">Programma del percorso</h2>
                        <p className="text-sm text-muted-foreground">Ordina i libri, studia al ritmo suggerito e applica subito.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {levelBooks.length > 0 ? (
                            levelBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                Nessun libro trovato per questo livello al momento.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
