import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TerminiServizioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">TERMINI DI SERVIZIO</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">Ultimo aggiornamento: 08/12/2025</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Accettazione dei Termini</h2>
              <p className="leading-relaxed">
                Utilizzando Pagine Vincenti (il “Servizio”), accetti integralmente questi Termini. Se non sei d’accordo, non utilizzare il Servizio. Ci riserviamo il diritto di aggiornare i Termini in qualsiasi momento, con comunicazione agli utenti registrati.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Descrizione del Servizio</h2>
              <p className="leading-relaxed">Pagine Vincenti è una piattaforma che offre:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>strumenti interattivi basati su framework di business, marketing e management</li>
                <li>generazione di output tramite modelli AI di terze parti</li>
                <li>percorsi educativi e contenuti formativi</li>
                <li>salvataggio progressi e sessioni per utenti registrati</li>
                <li>risorse gratuite e premium</li>
              </ul>
              <p className="leading-relaxed">Il Servizio è in continua evoluzione.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Account Utente</h2>
              <p className="leading-relaxed">Per accedere a specifiche funzionalità può essere richiesto un account. L’utente è responsabile di:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>fornire informazioni accurate</li>
                <li>mantenere segrete le proprie credenziali</li>
                <li>tutte le attività svolte tramite il proprio account</li>
                <li>notificarci eventuali accessi non autorizzati</li>
              </ul>
              <p className="leading-relaxed">È necessario avere almeno 18 anni. Possiamo sospendere o terminare account in caso di violazione dei Termini.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Uso Consentito</h2>
              <p className="leading-relaxed">È consentito:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>utilizzare i tool per scopi personali o professionali legittimi</li>
                <li>scaricare gli output per uso personale o aziendale</li>
                <li>condividere link al Servizio</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Uso Vietato</h2>
              <p className="leading-relaxed">NON è consentito:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>utilizzare il Servizio per attività illegali, diffamatorie o dannose</li>
                <li>generare contenuti che violano leggi, privacy o diritti di terzi</li>
                <li>reverse engineering, copia, modifica o distribuzione del codice</li>
                <li>scraping automatizzato o overload dei server</li>
                <li>aggirare misure di sicurezza o limiti di utilizzo</li>
                <li>utilizzare il Servizio per competere direttamente con noi</li>
                <li>inserire dati personali di terzi senza consenso</li>
                <li>usare il Servizio per creare output professionali spacciandoli come consulenza certificata</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Proprietà Intellettuale</h2>
              <p className="leading-relaxed">
                <strong>Contenuti del Servizio:</strong> Tutti i contenuti, strumenti, design, codice e materiali sono proprietà di Timoteo Pasquali o dei rispettivi licenzianti.
              </p>
              <p className="leading-relaxed">
                <strong>Contenuti inseriti dall’utente:</strong> Rimangono di tua proprietà. Dichiari di avere il diritto di inserirli. Ci concedi una licenza limitata per elaborarli e generare gli output richiesti.
              </p>
              <p className="leading-relaxed">
                <strong>Output generati:</strong> Gli output sono utilizzabili dall’utente, ma: non garantiamo originalità, accuratezza o validità; possono contenere errori derivanti da modelli AI esterni; non costituiscono consulenza professionale; l’utente si assume piena responsabilità del loro uso.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Utilizzo di API AI (OpenAI, Anthropic e altri)</h2>
              <p className="leading-relaxed">Per alcune funzionalità utilizziamo API di terze parti (es. OpenAI, Anthropic). Gli output generati:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>possono essere imprecisi, incompleti o inappropriati</li>
                <li>non devono essere usati come sostituti di valutazioni professionali</li>
                <li>non costituiscono pareri legali, fiscali, finanziari o sanitari</li>
              </ul>
              <p className="leading-relaxed">Non siamo responsabili di eventuali danni derivanti dall’uso degli output AI.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Limitazioni del Servizio</h2>
              <p className="leading-relaxed">
                Il Servizio è fornito “così com’è” e non garantiamo che: sarà sempre disponibile senza errori o interruzioni; gli output siano accurati o adatti a decisioni critiche; i dati salvati vengano mantenuti indefinitamente; il Servizio soddisfi esigenze specifiche. Possiamo modificare, sospendere o interrompere funzioni in qualsiasi momento.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. Rate Limiting e Restrizioni</h2>
              <p className="leading-relaxed">Possiamo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>limitare richieste AI per utenti non registrati</li>
                <li>applicare restrizioni di sicurezza</li>
                <li>sospendere utenti che abusano del Servizio</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. Link Affiliati</h2>
              <p className="leading-relaxed">
                Il Servizio contiene link affiliati (Amazon e altri). Quando clicchi su un link esterno, eventuali cookie vengono gestiti esclusivamente dal sito di destinazione. Non siamo responsabili per prodotti o servizi acquistati tramite link di terze parti.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. Limitazione di Responsabilità</h2>
              <p className="leading-relaxed">Nella massima misura consentita dalla legge:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>escludiamo responsabilità per danni diretti o indiretti</li>
                <li>non rispondiamo per perdite economiche, dati, opportunità o profitti</li>
                <li>la responsabilità massima non supererà €100 o l’importo pagato negli ultimi 12 mesi</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. Indennizzo</h2>
              <p className="leading-relaxed">L’utente accetta di indennizzarci in caso di reclami derivanti da:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>uso improprio del Servizio</li>
                <li>violazione dei Termini</li>
                <li>inserimento di contenuti non autorizzati o dannosi</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. Interruzione dell’Accesso</h2>
              <p className="leading-relaxed">Possiamo sospendere o terminare l’accesso:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>per violazione dei Termini</li>
                <li>per motivi tecnici o sicurezza</li>
                <li>per cessazione del Servizio</li>
              </ul>
              <p className="leading-relaxed">Clausole relative a proprietà intellettuale, limitazione di responsabilità e indennizzo sopravvivono alla chiusura dell’account.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. Legge Applicabile</h2>
              <p className="leading-relaxed">
                Questi Termini sono regolati dalla legge italiana. Forum esclusivo: Foro di La Spezia.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">15. Contatti</h2>
              <p className="leading-relaxed">
                Per domande:<br />
                📧 <strong>info@paginevincenti.it</strong><br />
                <strong>Titolare:</strong> Timoteo Pasquali
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">16. Pagamenti, Contenuti Digitali e Politica di Rimborso</h2>

              <h3 className="text-xl font-semibold">16.1 Modalità di pagamento</h3>
              <p className="leading-relaxed">
                I pagamenti vengono elaborati tramite Stripe. Non trattiamo direttamente dati di carta di credito.
              </p>

              <h3 className="text-xl font-semibold">16.2 Prodotti digitali senza diritto di recesso</h3>
              <p className="leading-relaxed">
                Ai sensi dell’art. 59, comma 1, lett. o) del Codice del Consumo, il diritto di recesso non si applica ai contenuti digitali forniti tramite download o accesso immediato, quando l’esecuzione è iniziata con l’esplicito consenso del consumatore e con l’accettazione della perdita del diritto di recesso.
              </p>
              <p className="leading-relaxed">Pertanto, per:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>PDF</li>
                <li>audio</li>
                <li>checklist</li>
                <li>riassunti</li>
                <li>quiz premium</li>
                <li>materiali scaricabili</li>
                <li>tool interattivi</li>
                <li>app a pagamento</li>
                <li>report generati</li>
                <li>accessi una tantum</li>
              </ul>
              <p className="leading-relaxed">
                👉 Non è previsto alcun rimborso, anche in caso di utilizzo parziale, poiché l’utente riceve immediatamente il contenuto digitale richiesto.
              </p>

              <h3 className="text-xl font-semibold">16.3 Percorsi di apprendimento e programmi strutturati</h3>
              <p className="leading-relaxed">
                L’acquisto di percorsi formativi digitali (intermedio, avanzato, percorsi guidati, ecc.) consente l’accesso immediato ad almeno una parte dei contenuti premium (es. PDF, checklist, audio, quiz, app collegate).
              </p>
              <p className="leading-relaxed">
                Con l’accesso ai primi contenuti, l’utente accetta di iniziare immediatamente la fruizione del servizio digitale e conferma la perdita del diritto di recesso, anche se ulteriori materiali vengono rilasciati progressivamente nel tempo.
              </p>
              <p className="leading-relaxed">Non è previsto rimborso per percorsi formativi digitali acquistati.</p>

              <h3 className="text-xl font-semibold">16.4 Nessuna garanzia di risultati</h3>
              <p className="leading-relaxed">
                Gli output generati da tool e percorsi formativi non garantiscono risultati specifici in ambito professionale, economico o personale.
              </p>

              <h3 className="text-xl font-semibold">16.5 Casi eccezionali</h3>
              <p className="leading-relaxed">
                Eventuali rimborsi possono essere valutati solo in caso di impossibilità tecnica documentata e non risolvibile di accedere al contenuto acquistato.
              </p>
            </section>

            <section className="space-y-4 bg-muted/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold">Riepilogo non vincolante</h2>
              <p className="leading-relaxed">
                Usa il Servizio con buon senso. Gli output AI sono strumenti di supporto, non consulenza professionale. Rispettiamo la tua privacy. Possiamo modificare il Servizio quando necessario.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
