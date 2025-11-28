import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AppPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow flex flex-col">
                <div className="bg-primary py-12 border-b border-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                            Le Nostre <span className="text-secondary">App</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Strumenti avanzati per il tuo marketing, powered by <span className="text-secondary font-semibold">marketing-tools.app</span>
                        </p>
                    </div>
                </div>

                <div className="flex-grow w-full h-[800px] bg-muted/10">
                    <iframe
                        src="https://marketing-tools.app"
                        className="w-full h-full border-0"
                        title="Marketing Tools App"
                    // Fallback content if iframe fails or for accessibility
                    >
                        <div className="flex items-center justify-center h-full">
                            <p>Caricamento strumenti in corso...</p>
                        </div>
                    </iframe>
                </div>
            </main>

            <Footer />
        </div>
    );
}
