import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PoliticaRimborsoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Politica di Rimborso</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">Ultimo aggiornamento: 08/12/2025</p>

            <section className="space-y-4">
              <p className="leading-relaxed">
                La presente Politica di Rimborso si applica a tutti gli acquisti effettuati su Pagine Vincenti, inclusi:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>contenuti digitali scaricabili (PDF, checklist, audio, riassunti)</li>
                <li>tool e app interattive</li>
                <li>percorsi formativi e materiali premium</li>
                <li>accessi una tantum a funzionalità o contenuti riservati</li>
              </ul>
              <p className="leading-relaxed">
                Il nostro obiettivo è offrire prodotti di alta qualità che generano valore immediato. Per questo motivo i rimborsi non sono previsti, come indicato di seguito.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Contenuti Digitali – Nessun diritto di recesso (art. 59 Codice del Consumo)</h2>
              <p className="leading-relaxed">
                Ai sensi dell’art. 59, comma 1, lettera o) del Codice del Consumo, il diritto di recesso non si applica ai contenuti digitali forniti tramite download o accesso immediato, quando il cliente:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>richiede l’accesso immediato al contenuto</li>
                <li>accetta espressamente di perdere il diritto di recesso</li>
              </ul>
              <p className="leading-relaxed">Tutti i nostri contenuti digitali rientrano in questa categoria.</p>
              <p className="leading-relaxed">Pertanto, non è previsto alcun rimborso per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>PDF</li>
                <li>checklist</li>
                <li>audio ripasso</li>
                <li>quiz premium</li>
                <li>riassunti scaricabili</li>
                <li>materiali bonus</li>
                <li>file o contenuti digitali simili</li>
              </ul>
              <p className="leading-relaxed">
                Una volta ottenuto l’accesso al contenuto digitale, il beneficio è considerato pienamente ricevuto e non è possibile effettuare un rimborso.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Tool, App e Assistenti AI – Nessun rimborso</h2>
              <p className="leading-relaxed">
                I nostri tool e le nostre app forniscono valore immediato: suggerimenti, analisi, output personalizzati, framework operativi.
              </p>
              <p className="leading-relaxed">Dopo anche un solo utilizzo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>il valore è già stato ricevuto</li>
                <li>non è possibile “restituire” l’esperienza o l’analisi ottenuta</li>
              </ul>
              <p className="leading-relaxed">
                Per questo motivo, gli acquisti relativi a tool, app o funzionalità AI non sono rimborsabili.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Percorsi Formativi (Intermedio, Avanzato, Premium)</h2>
              <p className="leading-relaxed">
                Al momento dell’acquisto, il cliente ottiene accesso immediato ad almeno una parte dei materiali premium, come:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>PDF esclusivi</li>
                <li>audio ripasso</li>
                <li>checklist operative</li>
                <li>quiz avanzati</li>
                <li>tool riservati</li>
                <li>materiali introduttivi</li>
              </ul>
              <p className="leading-relaxed">L’attivazione immediata di uno o più contenuti premium comporta:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>l’inizio dell’esecuzione del servizio digitale</li>
                <li>la perdita del diritto di recesso</li>
              </ul>
              <p className="leading-relaxed">
                Anche se ulteriori materiali vengono rilasciati progressivamente nel tempo (es. 1–2 libri a settimana), il consumatore ha già iniziato la fruizione del servizio, quindi:
              </p>
              <p className="leading-relaxed">
                👉 Non è previsto alcun rimborso per i percorsi acquistati. Questo modello è conforme all’art. 59 Codice del Consumo.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Eccezioni (solo in casi tecnici)</h2>
              <p className="leading-relaxed">Un rimborso potrà essere valutato soltanto se:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>il cliente non riesce tecnicamente ad accedere al contenuto acquistato</li>
                <li>il problema è dimostrabile</li>
                <li>il problema non può essere risolto tramite assistenza</li>
              </ul>
              <p className="leading-relaxed">Non sono ammessi rimborsi per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>utilizzo incompleto</li>
                <li>ripensamento</li>
                <li>mancanza di tempo</li>
                <li>aspettative soggettive non soddisfatte</li>
                <li>utilizzo e successiva richiesta di rimborso (“abuso”)</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Contatti</h2>
              <p className="leading-relaxed">
                Per domande o assistenza:<br />
                📧 <strong>info@paginevincenti.it</strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
