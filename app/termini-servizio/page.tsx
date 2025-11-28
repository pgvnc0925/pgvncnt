import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TerminiServizioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Termini di Servizio</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Accettazione dei Termini</h2>
              <p className="leading-relaxed">
                Utilizzando Pagine Vincenti (il "Servizio"), accetti questi Termini di Servizio.
                Se non accetti questi termini, non utilizzare il Servizio. Ci riserviamo il diritto
                di modificare questi termini in qualsiasi momento.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Descrizione del Servizio</h2>
              <p className="leading-relaxed">
                Pagine Vincenti è una piattaforma che offre strumenti interattivi gratuiti basati
                su framework di management e marketing. Il Servizio include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tool interattivi per decisioni business, marketing e strategia</li>
                <li>Generazione di output e report personalizzati</li>
                <li>Assistenza AI contestuale (limitata per utenti non registrati)</li>
                <li>Salvataggio sessioni per utenti registrati</li>
                <li>Contenuti educativi e riferimenti a libri</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Account Utente</h2>
              <p className="leading-relaxed">
                Per alcune funzionalità è necessario registrarsi. Sei responsabile di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornire informazioni accurate e veritiere</li>
                <li>Mantenere la sicurezza delle tue credenziali</li>
                <li>Tutte le attività svolte con il tuo account</li>
                <li>Notificarci immediatamente in caso di accesso non autorizzato</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Devi avere almeno 18 anni per registrarti.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Uso Consentito</h2>
              <p className="leading-relaxed">Ti è consentito:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizzare i tool per scopi professionali e personali legittimi</li>
                <li>Scaricare output e report per uso personale o aziendale</li>
                <li>Condividere link al Servizio</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Uso Vietato</h2>
              <p className="leading-relaxed">NON ti è consentito:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizzare il Servizio per scopi illegali o non autorizzati</li>
                <li>Copiare, modificare o distribuire il codice sorgente del Servizio</li>
                <li>Effettuare scraping automatizzato o sovraccarico del sistema</li>
                <li>Tentare di aggirare misure di sicurezza o rate limiting</li>
                <li>Rivendere o commercializzare gli output senza attribuzione</li>
                <li>Utilizzare il Servizio per competere direttamente con noi</li>
                <li>Caricare contenuti offensivi, diffamatori o che violano diritti di terzi</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Proprietà Intellettuale</h2>
              <p className="leading-relaxed">
                <strong>Contenuti del Servizio:</strong> Tutti i contenuti, design, loghi, tool,
                codice sorgente e materiali di Pagine Vincenti sono di proprietà di Timoteo Pasquali
                o dei rispettivi licenzianti e sono protetti da copyright e altre leggi sulla
                proprietà intellettuale.
              </p>
              <p className="leading-relaxed mt-4">
                <strong>I tuoi contenuti:</strong> Mantieni la proprietà degli input che inserisci
                nei tool. Garantisci di avere il diritto di utilizzare tali contenuti. Concedendoci
                una licenza limitata per elaborare i tuoi input e generare output.
              </p>
              <p className="leading-relaxed mt-4">
                <strong>Output generati:</strong> Gli output generati dai tool appartengono a te,
                ma riconosciamo che sono basati su framework di terze parti citati nel tool.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Limitazioni del Servizio</h2>
              <p className="leading-relaxed">
                Il Servizio è fornito "così com'è". Non garantiamo che:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Il Servizio sarà sempre disponibile, senza interruzioni o errori</li>
                <li>Gli output siano accurati, completi o adatti alle tue esigenze</li>
                <li>Gli output sostituiscano consulenza professionale</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Gli strumenti sono educativi e di supporto decisionale, ma non sostituiscono
                giudizio professionale, consulenza legale, fiscale o finanziaria.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Rate Limiting e Restrizioni</h2>
              <p className="leading-relaxed">
                Ci riserviamo il diritto di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Limitare il numero di richieste AI per utenti non registrati</li>
                <li>Sospendere o terminare account che violano questi Termini</li>
                <li>Modificare, sospendere o interrompere parti del Servizio in qualsiasi momento</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. Link Affiliati</h2>
              <p className="leading-relaxed">
                Il Servizio contiene link affiliati Amazon e altri partner. Quando acquisti tramite
                questi link, riceviamo una commissione senza costi extra per te. Questo ci aiuta
                a mantenere il Servizio gratuito. Non siamo responsabili per prodotti o servizi
                acquistati tramite link di terze parti.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. Limitazione di Responsabilità</h2>
              <p className="leading-relaxed">
                Nella misura massima consentita dalla legge:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Non siamo responsabili per danni diretti, indiretti, incidentali o consequenziali</li>
                <li>Non siamo responsabili per perdite di profitti, dati o opportunità di business</li>
                <li>La nostra responsabilità totale non supererà €100 o l'importo pagato negli ultimi 12 mesi (se applicabile)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. Indennizzo</h2>
              <p className="leading-relaxed">
                Accetti di indennizzarci da qualsiasi reclamo, danno, perdita o spesa (incluse
                spese legali) derivante da:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tuo uso improprio del Servizio</li>
                <li>Violazione di questi Termini</li>
                <li>Violazione di diritti di terze parti</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. Modifiche e Interruzione</h2>
              <p className="leading-relaxed">
                Ci riserviamo il diritto di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modificare questi Termini in qualsiasi momento (con notifica via email)</li>
                <li>Modificare o interrompere il Servizio (temporaneamente o permanentemente)</li>
                <li>Rifiutare il servizio a chiunque per qualsiasi motivo</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">13. Legge Applicabile</h2>
              <p className="leading-relaxed">
                Questi Termini sono regolati dalla legge italiana. Qualsiasi controversia sarà
                di competenza esclusiva del Foro di [Città], Italia.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">14. Contatti</h2>
              <p className="leading-relaxed">
                Per domande su questi Termini, contattaci a:<br />
                <strong>Email:</strong> info@paginevincenti.it<br />
                <strong>Titolare:</strong> Timoteo Pasquali
              </p>
            </section>

            <section className="space-y-4 bg-muted/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold">Riepilogo (non vincolante)</h2>
              <p className="leading-relaxed">
                In sintesi: usa il Servizio in buona fede per scopi legittimi. Non copiare,
                non abusare del sistema, non rivendere. Gli output sono tuoi, ma non sostituiscono
                consulenza professionale. Il Servizio è gratuito e "as-is". Rispettiamo la tua
                privacy (vedi Privacy Policy). Guadagniamo tramite affiliazioni Amazon.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}