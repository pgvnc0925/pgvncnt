import Link from "next/link"
import Script from "next/script"

export function Footer() {
  return (
    <footer className="border-t border-secondary/20 bg-primary mt-24 text-slate-300">
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Newsletter form (Brevo) */}
        <div
          style={{
            padding: "36px 0",
            borderBottom: "1px solid #1E293B",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              gap: "48px",
            }}
          >
            <div style={{ flex: 1, textAlign: "right" }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                Rimani aggiornato
              </h4>

              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#CBD5E1",
                }}
              >
                Una mail al mese. Solo concetti utili.
              </p>
            </div>

            <div style={{ flex: 1, textAlign: "left" }}>
              <form
                method="POST"
                id="sib-form"
                data-type="subscription"
                action="https://913762b3.sibforms.com/serve/MUIFAI7Vtq5bQJLJQXnwbOlHbeDK1WLzh2jpZfl9p-1qLbM7u65h57trdpe-3yhyDOWhi6s8O__sC_Tn3zsW_H7hOx_K1BX9_tl-YTn7-Rfwqe_t-LjRvS_IfzQosr0BYPfxbsWTqxKJi5KuSCW-wMgezAQD_y5rxsfvsUg6_AF8zfotUhkJwDiO0SYmEJdC2HANFCXbhi3een9-yg=="
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="email"
                  name="EMAIL"
                  placeholder="La tua email"
                  required
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    background: "#1E293B",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    width: "220px",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: "#D4AF37",
                    color: "#0F172A",
                    whiteSpace: "nowrap",
                  }}
                >
                  Iscriviti
                </button>

                <input type="hidden" name="locale" value="it" />
              </form>

              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "12px", color: "#94A3B8" }}>
                  <input
                    type="checkbox"
                    name="OPT_IN"
                    value="1"
                    required
                    style={{ accentColor: "#D4AF37", marginRight: "6px" }}
                  />
                  No pubblicità, No vendita a terzi, Disiscrizione con un click. Acconsento.
                </label>
              </div>

              <div
                id="sib-captcha"
                className="g-recaptcha"
                data-sitekey="6Lcv-BksAAAAAJYZ1Bl1EpVau0tekxCfzs3DnaU7"
                style={{ marginTop: "8px" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-lg">Pagine <span className="text-secondary">Vincenti</span></h3>
            <p className="text-sm text-slate-400">
              Tools seri per imprenditori seri. Niente fuffa, solo framework testati.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Strumenti</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="hover:text-secondary transition-colors">
                  Tutti i tool
                </Link>
              </li>
              <li>
                <Link href="/tools/decision-validator" className="hover:text-secondary transition-colors">
                  Decision Validator
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Risorse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/libri" className="hover:text-secondary transition-colors">
                  Libri
                </Link>
              </li>
              <li>
                <Link href="/articoli" className="hover:text-secondary transition-colors">
                  Articoli
                </Link>
              </li>
              <li>
                <Link href="/chi-sono" className="hover:text-secondary transition-colors">
                  Chi sono
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termini-servizio" className="hover:text-secondary transition-colors">
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-secondary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary/10 text-center text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} Pagine Vincenti.
            Link affiliati Amazon: quando acquisti tramite i nostri link, riceviamo una piccola commissione senza costi extra per te.
          </p>
          <p className="mt-2">
            Creato da{" "}
            <a
              href="https://timoteopasquali.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline"
            >
              Timoteo Pasquali
            </a>
          </p>
        </div>
      </div>
      <Script id="brevo-captcha-callback" strategy="lazyOnload">
        {`
          function handleCaptchaResponse() {
            var event = new Event('captchaChange');
            var el = document.getElementById('sib-captcha');
            if (el) el.dispatchEvent(event);
          }
          window.REQUIRED_CODE_ERROR_MESSAGE = 'Scegli un prefisso paese';
          window.LOCALE = 'it';
          window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "Le informazioni fornite non sono valide. Controlla il formato del campo e riprova.";
          window.REQUIRED_ERROR_MESSAGE = "Questo campo non può essere lasciato vuoto. ";
          window.GENERIC_INVALID_MESSAGE = "Le informazioni fornite non sono valide. Controlla il formato del campo e riprova.";
          window.translation = { common: { selectedList: '{quantity} lista selezionata', selectedLists: '{quantity} liste selezionate', selectedOption: '{quantity} selezionato', selectedOptions: '{quantity} selezionati' } };
          var AUTOHIDE = Boolean(0);
        `}
      </Script>
      <Script src="https://sibforms.com/forms/end-form/build/main.js" strategy="lazyOnload" />
      <Script src="https://www.google.com/recaptcha/api.js?hl=it" strategy="lazyOnload" />
    </footer>
  )
}
