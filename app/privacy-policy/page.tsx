import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Introduzione</h2>
              <p className="leading-relaxed">
                Pagine Vincenti ("noi", "nostro") rispetta la tua privacy e si impegna a proteggere
                i tuoi dati personali. Questa Privacy Policy spiega come raccogliamo, utilizziamo e
                proteggiamo le tue informazioni quando utilizzi il nostro sito web paginevincenti.it
                (il "Servizio").
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Dati che raccogliamo</h2>
              <p className="leading-relaxed">Raccogliamo le seguenti categorie di dati:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dati di account:</strong> Email quando crei un account o scarichi contenuti</li>
                <li><strong>Dati di utilizzo:</strong> Informazioni su come utilizzi i nostri strumenti (input, output, timestamp)</li>
                <li><strong>Dati tecnici:</strong> Indirizzo IP, tipo di browser, device, cookie</li>
                <li><strong>Dati analitici:</strong> Pagine visitate, tempo di permanenza, conversioni</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Come utilizziamo i tuoi dati</h2>
              <p className="leading-relaxed">Utilizziamo i tuoi dati per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornire e migliorare i nostri servizi e strumenti</li>
                <li>Salvare le tue sessioni e permetterti di rivisitarle</li>
                <li>Inviare email con contenuti richiesti (PDF, report)</li>
                <li>Comunicazioni di marketing (con tuo consenso esplicito)</li>
                <li>Analisi e statistiche aggregate per migliorare l'esperienza utente</li>
                <li>Prevenzione frodi e sicurezza</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Base giuridica (GDPR)</h2>
              <p className="leading-relaxed">
                Trattiamo i tuoi dati sulla base di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consenso:</strong> Per marketing e cookie non essenziali</li>
                <li><strong>Esecuzione contrattuale:</strong> Per fornire i servizi richiesti</li>
                <li><strong>Interesse legittimo:</strong> Per analisi e miglioramenti del servizio</li>
                <li><strong>Obbligo legale:</strong> Per conformità fiscale e normativa</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Condivisione dei dati</h2>
              <p className="leading-relaxed">
                Non vendiamo mai i tuoi dati. Condividiamo dati solo con:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Provider di servizi:</strong> Supabase (database), Vercel (hosting), Brevo (email)</li>
                <li><strong>Provider AI:</strong> Anthropic per elaborare le richieste degli assistenti AI</li>
                <li><strong>Autorità:</strong> Solo se obbligati per legge</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. I tuoi diritti (GDPR)</h2>
              <p className="leading-relaxed">Hai diritto a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accesso:</strong> Richiedere copia dei tuoi dati</li>
                <li><strong>Rettifica:</strong> Correggere dati inesatti</li>
                <li><strong>Cancellazione:</strong> Richiedere la cancellazione dei tuoi dati ("diritto all'oblio")</li>
                <li><strong>Portabilità:</strong> Ricevere i tuoi dati in formato leggibile</li>
                <li><strong>Opposizione:</strong> Opporti al trattamento per marketing</li>
                <li><strong>Limitazione:</strong> Richiedere limitazione del trattamento</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Per esercitare questi diritti, contattaci all'indirizzo email indicato in fondo.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Cookie</h2>
              <p className="leading-relaxed">
                Utilizziamo cookie essenziali per il funzionamento del sito e cookie analitici
                (con tuo consenso) per migliorare l'esperienza. Per maggiori dettagli consulta
                la nostra <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Sicurezza</h2>
              <p className="leading-relaxed">
                Implementiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati
                (crittografia HTTPS, database protetti con RLS, accesso limitato). Tuttavia, nessuna
                trasmissione via internet è completamente sicura.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. Conservazione dei dati</h2>
              <p className="leading-relaxed">
                Conserviamo i tuoi dati per il tempo necessario a fornire i servizi e rispettare
                obblighi legali. Le sessioni tool vengono conservate per 24 mesi. I dati di marketing
                fino a revoca del consenso.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. Link affiliati Amazon</h2>
              <p className="leading-relaxed">
                Questo sito contiene link affiliati Amazon. Quando clicchi su questi link e acquisti
                prodotti, potremmo ricevere una commissione senza costi aggiuntivi per te. Amazon può
                tracciare i tuoi click attraverso cookie. Consulta la Privacy Policy di Amazon per
                maggiori informazioni.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. Modifiche</h2>
              <p className="leading-relaxed">
                Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le modifiche sostanziali
                verranno comunicate tramite email agli utenti registrati.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. Contatti</h2>
              <p className="leading-relaxed">
                Per domande sulla privacy o per esercitare i tuoi diritti, contattaci a:<br />
                <strong>Email:</strong> privacy@paginevincenti.it<br />
                <strong>Titolare del trattamento:</strong> Timoteo Pasquali
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}