import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllApps } from "@/apps";
import { AppCard } from "@/components/app/app-card";

export const metadata = {
  title: 'Le nostre App | Pagine Vincenti',
  description: 'Strumenti interattivi per decisioni strategiche basate sui migliori libri di marketing',
};

export default function AppPage() {
  const apps = getAllApps();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-16 border-b border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Le Nostre <span className="text-secondary">App</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Strumenti interattivi per decisioni strategiche. Basati sui migliori libri di marketing.
            </p>
          </div>
        </section>

        {/* Apps Grid */}
        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
