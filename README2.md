🟦 DOCUMENTO TECNICO COMPLETO PER L’IA DEV – Pagine Vincenti

(Copia-incolla questo nella chat del tuo AI Developer: è strutturato come un PRD + istruzioni operative + file necessari.)

⸻

🧩 Pagine Vincenti – Specifiche Tecniche Implementative (v1.0)

🎯 OBIETTIVO

Implementare il sistema di accesso “FREE Unlock via Magic Link” + “PV Pro via Stripe” su Next.js (App Router), con il minimo numero di file, zero login password, UX fluida e struttura espandibile.

L’obiettivo è:
	•	permettere accesso libero a tutti i riassunti
	•	sbloccare risorse del Percorso Base tramite email verificata
	•	sbloccare percorsi intermedio/avanzato tramite acquisto Stripe
	•	mantenere tutto leggero, scalabile e a costo zero

⸻

🟦 1. TECNOLOGIE DA USARE
	•	Next.js 14 – App Router
	•	Supabase Auth (Magic Link) → email verificata
	•	Supabase Table pv_leads (facoltativa)
	•	Stripe Checkout → sottoscrizione PV Pro
	•	Cookies → gestione permessi (free/pro)
	•	Tailwind → styling
	•	Route handlers (app/api/…) → backend
	•	Edge Middleware → gating opzionale

⸻

🟦 2. ARCHITETTURA GENERALE

📁 Struttura delle directory

/app
  /unlock
  /magic-callback
  /risorse-base
  /pro
  /libri/[slug]
  /abbonati
  /welcome-pro
  /api
     /unlock (DEPRECATO – ora usiamo Supabase)
     /stripe-webhook
     /create-checkout-session
/supabase
  client.ts
/public
  /covers
  /audio
  /maps
  /quiz
  /rag-json
/utils
  cookies.ts


⸻

🟦 3. FUNZIONI CHIAVE

3.1. Sblocco FREE tramite Magic Link

✔ STEP 1: Pagina /unlock

Form email → chiama:

supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: "https://paginevincenti.it/magic-callback" }
})

✔ STEP 2: Email Magic Link

Supabase invia automaticamente email con token.

✔ STEP 3: Pagina /magic-callback

Verifica token → imposta cookie.

File: app/magic-callback/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const { error } = await supabase.auth.verifyOtp({
    token,
    type: "magiclink"
  });

  const res = NextResponse.redirect("/risorse-base");

  res.cookies.set("pv_free", "true", {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 180,
    path: "/"
  });

  return res;
}

Risultato:
	•	email verificata → lead reale
	•	cookie impostato → accesso completo al Percorso Base

⸻

3.2. Gating FREE vs PRO

✔ Cookie FREE

pv_free=true

✔ Cookie PRO

pv_pro=true

✔ Comportamento delle pagine:

/risorse-base
	•	accessibile se pv_free o pv_pro
	•	se nessuno → redirect /unlock

/pro/*
	•	accessibile solo se pv_pro
	•	se no → redirect /abbonati

Riassunti (libri)
	•	SEMPRE accessibili
	•	dentro ci sono bottoni “richiedi risorse” → porta a /unlock

⸻

3.3. Stripe – PV Pro

STEP 1: create-checkout-session

File: /app/api/create-checkout-session/route.ts

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.SITE_URL}/welcome-pro`,
    cancel_url: `${process.env.SITE_URL}/abbonati`,
  });

  return NextResponse.json({ url: session.url });
}

STEP 2: Webhook Stripe (PV Pro → TRUE)

File: /app/api/stripe-webhook/route.ts

export async function POST(req: Request) {
  const event = await getStripeEvent(req);

  if (event.type === "checkout.session.completed") {
    const res = NextResponse.json({ ok: true });

    res.cookies.set("pv_pro", "true", {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ received: true });
}


⸻

3.4. Middleware per gating automatico (opzionale)

File: middleware.ts

export function middleware(req) {
  const url = req.nextUrl.clone();
  const cookies = req.cookies;

  const free = cookies.get("pv_free");
  const pro = cookies.get("pv_pro");

  if (url.pathname.startsWith("/pro") && !pro) {
    url.pathname = "/abbonati";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/risorse-base") && !free && !pro) {
    url.pathname = "/unlock";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


⸻

🟦 4. LOGICA RIASSUNTI, RISORSE E GATING

Tutti i riassunti MDX → liberi

Risorse del Percorso Base (audio, quiz, mappe):
	•	richiedono magic link → cookie free

Risorse Pro (audio avanzati, toolkit avanzati, app RAG):
	•	richiedono cookie pro

Con questa logica, il contenuto SEO rimane tutto indicizzabile, mentre il valore economico è nel materiale “profondo”.

⸻

🟦 5. PANNELLINO SUPER ADMIN

Tu carichi:
	•	summary.mdx
	•	rag.json
	•	image.jpg
	•	audio.mp3

L’app salva i file in cartelle pubbliche:

/public/covers  
/public/audio  
/public/rag-json  
/public/maps  
/public/quiz

Nessuna complicazione.

⸻

🟦 6. TUTTI GLI STATI DEL SISTEMA

User state 0: Nessun cookie → vede solo riassunti
User state 1: pv_free=true → risorse base sbloccate
User state 2: pv_pro=true → tutto sbloccato


⸻

🟦 7. OBIETTIVI DI UX (da implementare)
	•	Gli utenti non devono mai reinserire email
	•	Niente password
	•	Niente user panel complicati
	•	L’esperienza deve sembrare “entrare in un percorso”
	•	L’upgrade Pro deve essere naturale e semplice

⸻

🟩 FINE DOCUMENTO TECNICO