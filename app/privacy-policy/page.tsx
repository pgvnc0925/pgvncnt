import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">🛡️ PRIVACY POLICY — Versione Completa e Aggiornata</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">Ultimo aggiornamento: 08/12/2025</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Introduzione</h2>
              <p className="leading-relaxed">
                Pagine Vincenti (&quot;noi&quot;, &quot;nostro&quot;) rispetta la tua privacy e si impegna a proteggere i tuoi dati personali.
                Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo i dati quando utilizzi il sito paginevincenti.it e i servizi collegati (nel complesso, il &quot;Servizio&quot;).
              </p>
              <p className="leading-relaxed">
                Per qualsiasi richiesta relativa alla privacy, puoi scriverci all’indirizzo: <strong>privacy@paginevincenti.it</strong>.
                <br />
                <strong>Titolare del trattamento:</strong> Timoteo Pasquali.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Dati che raccogliamo</h2>
              <h3 className="text-xl font-semibold">A) Dati forniti volontariamente dall’utente</h3>
              <p className="leading-relaxed">Quando utilizzi il nostro sito o i nostri strumenti, puoi fornirci:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email (per creare un account, scaricare contenuti o iscriversi alla newsletter)</li>
                <li>Nome, cognome, email, telefono (form di contatto o richiesta informazioni)</li>
                <li>Dati aziendali inseriti nelle app (es. settore, fatturato, marginalità, dipendenti, punti di forza/debolezza, concorrenti, obiettivi)</li>
              </ul>
              <p className="leading-relaxed">Tutti questi dati vengono inseriti volontariamente dall’utente.</p>

              <h3 className="text-xl font-semibold">B) Dati tecnici indispensabili</h3>
              <p className="leading-relaxed">Il sito utilizza cookie tecnici HTTPOnly necessari al funzionamento, tra cui:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><code>pv_free</code> → identifica se l’utente ha sbloccato le risorse base</li>
                <li><code>pv_pro</code> → identifica accesso a risorse Pro</li>
                <li><code>pv_progress</code> → memorizza progressi e contenuti già visualizzati</li>
              </ul>
              <ul className="list-disc pl-6 space-y-2">
                <li>non sono accessibili da script esterni</li>
                <li>non tracciano la navigazione</li>
                <li>non vengono usati per finalità di marketing</li>
                <li>sono essenziali per offrire il servizio richiesto</li>
              </ul>

              <h3 className="text-xl font-semibold">C) Dati analitici anonimi (senza cookie)</h3>
              <p className="leading-relaxed">Utilizziamo strumenti privacy-first:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vercel Web Analytics</li>
                <li>Microsoft Clarity</li>
              </ul>
              <p className="leading-relaxed">Questi strumenti raccolgono dati aggregati e anonimi, come:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>pagine visitate</li>
                <li>tempo sulla pagina</li>
                <li>interazioni aggregate con le sezioni del sito</li>
                <li>scroll e pattern di navigazione (solo a livello anonimo)</li>
              </ul>
              <p className="leading-relaxed">Nessuno di questi sistemi utilizza cookie né tecnologie di profilazione.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Come utilizziamo i tuoi dati</h2>
              <p className="leading-relaxed">Utilizziamo i dati raccolti per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>fornire i servizi richiesti dall’utente</li>
                <li>mantenere l’accesso a contenuti sbloccati e progressi personali</li>
                <li>inviare contenuti richiesti (es. PDF, audio, approfondimenti)</li>
                <li>rispondere a richieste inviate tramite form</li>
                <li>migliorare il sito tramite analisi anonime</li>
                <li>garantire sicurezza, prevenzione abusi e corretto funzionamento tecnico</li>
              </ul>
              <p className="leading-relaxed">Eventuali comunicazioni di marketing (newsletter) vengono inviate solo con consenso esplicito.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Base giuridica del trattamento (GDPR)</h2>
              <p className="leading-relaxed">Trattiamo i dati personali in base a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Art. 6.1.b – Esecuzione di contratto:</strong> Per fornire accesso ai servizi richiesti dall’utente (app, aree riservate, progressi).</li>
                <li><strong>Art. 6.1.a – Consenso:</strong> Per iscrizione newsletter o marketing.</li>
                <li><strong>Art. 6.1.f – Legittimo interesse:</strong> Per analisi anonime e miglioramento del Servizio, senza cookie.</li>
                <li><strong>Obblighi di legge:</strong> Per eventuali richieste normative o fiscali.</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Condivisione dei dati</h2>
              <p className="leading-relaxed">Condividiamo dati solo con soggetti che supportano il funzionamento del sito:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vercel (hosting)</li>
                <li>Supabase (database)</li>
                <li>Brevo (email marketing)</li>
                <li>Microsoft Clarity (analisi del comportamento anonimo)</li>
                <li>OpenAI e Anthropic (per alcune elaborazioni nelle app, con dati pseudonimizzati)</li>
              </ul>
              <p className="leading-relaxed">Non vendiamo e non cediamo dati personali a terzi.</p>

              <div className="pt-2">
                <h3 className="text-xl font-semibold">Pagamenti tramite Stripe</h3>
                <p className="leading-relaxed">
                  Per i pagamenti utilizziamo Stripe, un processore di pagamento esterno conforme a PCI-DSS.
                  Quando effettui un pagamento, verrai reindirizzato alle pagine sicure di Stripe.
                  Non memorizziamo né trattiamo dati di carta di credito sul nostro sito.
                  Le informazioni di pagamento sono gestite esclusivamente da Stripe secondo la loro Privacy Policy.
                </p>
              </div>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Elaborazioni tramite API esterne (OpenAI, Anthropic)</h2>
              <p className="leading-relaxed">
                Alcune app del sito inviano i testi inseriti dall’utente ai servizi OpenAI o Anthropic (Claude) per generare output o analisi.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>sono trattati in forma pseudonimizzata</li>
                <li>non vengono utilizzati per profilazione</li>
                <li>non generano cookie o tracker nel browser</li>
                <li>non vengono memorizzati da questi provider per addestramento modelli (conforme alle loro policy business)</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Cookie e tecnologie simili</h2>
              <p className="leading-relaxed">
                Il sito utilizza solo cookie tecnici necessari (come pv_free, pv_pro, pv_progress) per:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>riconoscere l’accesso dell’utente</li>
                <li>mantenere i progressi</li>
                <li>gestire funzionalità essenziali del servizio</li>
              </ul>
              <p className="leading-relaxed">
                Questi cookie non tracciano l’utente, non vengono utilizzati per marketing e non richiedono consenso secondo il GDPR/ePrivacy.
              </p>
              <p className="leading-relaxed">Per analisi anonime utilizziamo strumenti senza cookie:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vercel Analytics</li>
                <li>Microsoft Clarity</li>
              </ul>
              <p className="leading-relaxed">Non utilizziamo cookie di profilazione, remarketing, advertising o analytics invasivi.</p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Sicurezza</h2>
              <p className="leading-relaxed">Applichiamo misure tecniche adeguate:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>connessione HTTPS</li>
                <li>database protetti con accessi limitati</li>
                <li>cookie HTTPOnly e Secure</li>
                <li>regole RLS (Row Level Security)</li>
                <li>autenticazione sicura</li>
              </ul>
              <p className="leading-relaxed">
                Nessun sistema è totalmente immune da rischi, ma adottiamo le migliori pratiche disponibili.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. Conservazione dei dati</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>dati account / progressi: fino a cancellazione dell’utente</li>
                <li>dati inseriti nelle app: massimo 24 mesi</li>
                <li>email newsletter: fino a revoca del consenso</li>
                <li>cookie tecnici: durata variabile (da sessione a 12 mesi)</li>
                <li>log di sicurezza: 90 giorni</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. Link affiliati Amazon</h2>
              <p className="leading-relaxed">
                Il sito utilizza link affiliati Amazon. Eventuali cookie di Amazon sono impostati solo dopo il click e sul dominio Amazon, non su paginevincenti.it.
                Pertanto non richiedono un cookie banner sul nostro sito. Per tali cookie si applica esclusivamente la Privacy Policy di Amazon.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">11. Diritti dell’utente</h2>
              <p className="leading-relaxed">Puoi esercitare i seguenti diritti:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>accesso ai tuoi dati</li>
                <li>rettifica</li>
                <li>cancellazione (“diritto all’oblio”)</li>
                <li>portabilità</li>
                <li>limitazione</li>
                <li>opposizione</li>
                <li>revoca del consenso</li>
              </ul>
              <p className="leading-relaxed">Scrivendo a: <strong>privacy@paginevincenti.it</strong></p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">12. Modifiche alla Privacy Policy</h2>
              <p className="leading-relaxed">
                Ci riserviamo di aggiornare questa informativa. Le modifiche sostanziali verranno comunicate agli utenti registrati via email.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
