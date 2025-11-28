export default function NewsletterMiniCTA() {
  return (
    <div
      style={{
        padding: "16px",
        margin: "32px 0",
        background: "#F5F7FA",
        border: "1px solid #D4AF37",
        borderRadius: "8px",
        color: "#0F172A",
      }}
    >
      <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 600 }}>
        Ricevi altri riassunti come questo?
      </p>

      <form
        method="POST"
        action="https://913762b3.sibforms.com/serve/MUIFAI7Vtq5bQJLJQXnwbOlHbeDK1WLzh2jpZfl9p-1qLbM7u65h57trdpe-3yhyDOWhi6s8O__sC_Tn3zsW_H7hOx_K1BX9_tl-YTn7-Rfwqe_t-LjRvS_IfzQosr0BYPfxbsWTqxKJi5KuSCW-wMgezAQD_y5rxsfvsUg6_AF8zfotUhkJwDiO0SYmEJdC2HANFCXbhi3een9-yg=="
        data-type="subscription"
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <input
          type="email"
          name="EMAIL"
          placeholder="Email"
        required
        style={{
          flex: 1,
          maxWidth: "180px",
          padding: "8px 10px",
          borderRadius: "6px",
          border: "1px solid #E2E8F0",
          background: "#FFFFFF",
          color: "#0F172A",
          fontSize: "13px",
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
          background: "#0F172A",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
          minWidth: "110px",
        }}
      >
        Iscriviti
      </button>

        <input type="hidden" name="locale" value="it" />
      </form>

      <label
        style={{
          fontSize: "11px",
          color: "#64748B",
          display: "block",
          lineHeight: 1.4,
        }}
      >
        <input
          type="checkbox"
          name="OPT_IN"
          required
          style={{ accentColor: "#D4AF37", marginRight: "4px" }}
        />
        Acconsento al trattamento dei dati. Nessuno spam.
      </label>
    </div>
  );
}
