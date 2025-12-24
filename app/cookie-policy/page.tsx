import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">🍪 COOKIE POLICY — Versione “NO BANNER”</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Cosa sono i cookie?</h2>
              <p className="leading-relaxed">
                I cookie sono piccoli file salvati nel browser per permettere il corretto funzionamento del sito o per tracciarne l’utilizzo.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Cookie utilizzati da questo sito</h2>

              <h3 className="text-xl font-semibold">A) Cookie tecnici necessari (senza consenso)</h3>
              <p className="leading-relaxed">Il sito utilizza cookie tecnici essenziali per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>riconoscere contenuti sbloccati (<code>pv_free</code>, <code>pv_pro</code>)</li>
                <li>salvare progressi di lettura e studio (<code>pv_progress</code>)</li>
                <li>garantire la sicurezza</li>
                <li>permettere l’accesso a pagine riservate</li>
              </ul>
              <p className="leading-relaxed">
                Questi cookie sono indispensabili per il servizio richiesto dall’utente e non richiedono consenso.
              </p>

              <h3 className="text-xl font-semibold">B) Tecnologie senza cookie per l’analisi</h3>
              <p className="leading-relaxed">Per comprendere come viene utilizzato il sito utilizziamo esclusivamente:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vercel Web Analytics (cookie-less)</li>
                <li>Microsoft Clarity (cookie-less e anonimo)</li>
              </ul>
              <p className="leading-relaxed">
                Questi strumenti non memorizzano cookie, non profilano e non identificano l’utente.
              </p>

              <h3 className="text-xl font-semibold">C) Cookie di terzi (Amazon)</h3>
              <p className="leading-relaxed">
                Il sito include link affiliati Amazon. I cookie eventualmente impostati da Amazon vengono applicati solo dopo che l’utente clicca e visita Amazon.
                Sul nostro sito non vengono installati cookie di affiliazione.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Cookie NON utilizzati</h2>
              <p className="leading-relaxed">Questo sito NON utilizza:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>cookie di marketing</li>
                <li>cookie di profilazione</li>
                <li>cookie analytics invasivi (es. Google Analytics)</li>
                <li>pixel pubblicitari (Facebook, TikTok, ecc.)</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Come gestire i cookie dal browser</h2>
              <p className="leading-relaxed">
                L’utente può rimuovere o bloccare i cookie tecnici tramite le impostazioni del browser, anche se ciò potrebbe compromettere alcune funzionalità del sito.
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Contatti</h2>
              <p className="leading-relaxed">
                Per informazioni o richieste riguardanti la gestione dei cookie:<br />
                📧 <strong>privacy@paginevincenti.it</strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
