import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EvaluationForm } from "@/components/evaluation/evaluation-form";

export default function ValutazionePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <EvaluationForm />
      </main>
      <Footer />
    </div>
  );
}
