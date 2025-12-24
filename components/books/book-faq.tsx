import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface BookFAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function BookFAQ({ faqs }: BookFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        Domande Frequenti
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-3 text-primary">{faq.question}</h3>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
