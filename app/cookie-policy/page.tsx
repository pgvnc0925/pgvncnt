import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Cosa sono i Cookie</h2>
              <p className="leading-relaxed">
                I cookie sono piccoli file di testo che i siti web salvano sul tuo dispositivo
                (computer, tablet, smartphone) quando li visiti. Permettono al sito di ricordare
                le tue azioni e preferenze nel tempo, migliorando la tua esperienza di navigazione.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Come utilizziamo i Cookie</h2>
              <p className="leading-relaxed">
                Pagine Vincenti utilizza cookie per:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Permettere il funzionamento essenziale del sito (autenticazione, sessioni)</li>
                <li>Ricordare le tue preferenze (tema scuro/chiaro, lingua)</li>
                <li>Analizzare come utilizzi il sito per migliorarlo</li>
                <li>Tracciare conversioni e click su link affiliati</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Tipologie di Cookie che Utilizziamo</h2>

              <div className="space-y-6 mt-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Cookie Strettamente Necessari</h3>
                  <p className="leading-relaxed mb-2">
                    <strong>Base legale:</strong> Interesse legittimo (non richiedono consenso)
                  </p>
                  <p className="leading-relaxed">
                    Essenziali per il funzionamento del sito. Senza questi cookie, parti del
                    servizio non funzionerebbero.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><code>sb-auth-token</code> - Autenticazione Supabase (sessione: durata sessione)</li>
                    <li><code>next-auth.*</code> - Gestione sessione Next.js (sessione)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-secondary pl-6">
                  <h3 className="text-xl font-bold mb-2">Cookie di Preferenze</h3>
                  <p className="leading-relaxed mb-2">
                    <strong>Base legale:</strong> Consenso
                  </p>
                  <p className="leading-relaxed">
                    Permettono al sito di ricordare le tue preferenze.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><code>theme</code> - Preferenza tema chiaro/scuro (persistente: 1 anno)</li>
                    <li><code>cookie-consent</code> - Stato accettazione cookie (persistente: 1 anno)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-secondary pl-6">
                  <h3 className="text-xl font-bold mb-2">Cookie Analitici</h3>
                  <p className="leading-relaxed mb-2">
                    <strong>Base legale:</strong> Consenso
                  </p>
                  <p className="leading-relaxed">
                    Ci aiutano a capire come i visitatori utilizzano il sito, quali pagine sono
                    più visitate, dove si verificano problemi.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><code>_va</code> - Vercel Analytics (persistente: 1 anno)</li>
                    <li>Analytics interni su Supabase (tracciamento eventi lato server)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    I dati analitici sono aggregati e anonimi.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-6">
                  <h3 className="text-xl font-bold mb-2">Cookie di Marketing e Affiliazione</h3>
                  <p className="leading-relaxed mb-2">
                    <strong>Base legale:</strong> Consenso
                  </p>
                  <p className="leading-relaxed">
                    Utilizzati per tracciare click su link affiliati Amazon e altre piattaforme.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Cookie Amazon Associates (impostati da amazon.it)</li>
                    <li><code>affiliate_click_*</code> - Tracciamento interno click affiliati (persistente: 30 giorni)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Quando clicchi su un link affiliato Amazon, Amazon può impostare propri cookie
                    sul tuo dispositivo per tracciare l'acquisto e attribuirci una commissione.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Cookie di Terze Parti</h2>
              <p className="leading-relaxed">
                Alcuni cookie sono impostati da servizi di terze parti:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Amazon:</strong> Cookie per programma affiliazione Amazon Associates
                  <br />
                  <a href="https://www.amazon.it/gp/help/customer/display.html?nodeId=201909010"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary hover:underline text-sm">
                    Cookie Policy Amazon →
                  </a>
                </li>
                <li>
                  <strong>Vercel:</strong> Analytics e performance monitoring
                  <br />
                  <a href="https://vercel.com/legal/privacy-policy"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary hover:underline text-sm">
                    Privacy Policy Vercel →
                  </a>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Come Gestire i Cookie</h2>
              <p className="leading-relaxed">
                Hai diverse opzioni per gestire i cookie:
              </p>

              <div className="bg-muted/30 p-6 rounded-lg space-y-4 mt-4">
                <h3 className="font-bold">Pannello Cookie (Banner)</h3>
                <p className="leading-relaxed">
                  Alla tua prima visita, ti chiediamo il consenso per cookie non essenziali.
                  Puoi accettare tutti, rifiutare o personalizzare le tue preferenze.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg space-y-4 mt-4">
                <h3 className="font-bold">Browser</h3>
                <p className="leading-relaxed">
                  Puoi bloccare o eliminare cookie dalle impostazioni del tuo browser:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-primary hover:underline">Chrome</a></li>
                  <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener" className="text-primary hover:underline">Firefox</a></li>
                  <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-primary hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-primary hover:underline">Edge</a></li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  ⚠️ Attenzione: bloccare tutti i cookie può compromettere la funzionalità del sito.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Durata dei Cookie</h2>
              <p className="leading-relaxed">I cookie hanno diverse durate:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookie di sessione:</strong> Scadono quando chiudi il browser</li>
                <li><strong>Cookie persistenti:</strong> Rimangono sul dispositivo per un periodo specificato (da 30 giorni a 1 anno)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Aggiornamenti</h2>
              <p className="leading-relaxed">
                Questa Cookie Policy può essere aggiornata periodicamente per riflettere
                cambiamenti nel nostro utilizzo dei cookie o requisiti legali. Ti consigliamo
                di rivisistarla regolarmente.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Contatti</h2>
              <p className="leading-relaxed">
                Per domande sui cookie, contattaci a:<br />
                <strong>Email:</strong> privacy@paginevincenti.it<br />
                <strong>Titolare:</strong> Timoteo Pasquali
              </p>
            </section>

            <section className="bg-primary/5 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-bold">📌 Riepilogo Rapido</h2>
              <ul className="space-y-2">
                <li>✅ <strong>Cookie essenziali:</strong> Sempre attivi (necessari per il funzionamento)</li>
                <li>🎨 <strong>Cookie preferenze:</strong> Richiedono consenso (tema, lingua)</li>
                <li>📊 <strong>Cookie analytics:</strong> Richiedono consenso (Vercel Analytics)</li>
                <li>🔗 <strong>Cookie affiliazione:</strong> Richiedono consenso (Amazon Associates)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Puoi modificare le tue preferenze in qualsiasi momento dalle impostazioni del browser
                o contattandoci.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}