# Pagine Vincenti – Technical Overview (2024-12-01)

## What This Project Is
Marketing/education site built with Next.js (App Router) that serves public book summaries and gated resources (base via magic link, pro via Stripe stubs). Static mock data drives lists, while uploaded MDX/Covers/Audio are rendered on book pages. Admin dashboard lets you upload MDX/JSON/assets to disk and Supabase Storage.

## Stack & Key Deps
- Next.js 14 (App Router) / React / TypeScript / Tailwind tokens (globals.css)
- MDX rendering via `next-mdx-remote/rsc` (remark-gfm, rehype-highlight)
- Supabase SSR (`@supabase/ssr`) for magic-link auth and admin DB/storage (service key)
- Stripe flow currently stubbed (no live checkout; cookies set via placeholder route)
- Brevo newsletter forms (footer + inline CTA) + Google reCAPTCHA

## Routing & Pages
- `/` homepage with percorsi cards, live dashboard mock, books preview.
- `/percorsi/[level]` (base/intermedio/avanzato): shows books filtered from `data/mock-books.ts`. Base resources gated by cookies (pv_free/pv_pro).
- `/libri/[slug]`: renders MDX summary (from `content/books/{slug}.mdx`, with fallbacks) inside the classic page layout. Uses cover from `/public/covers/{slug}.jpg|png` and audio from `/public/audio/{slug}.mp3|m4a|wav`. Audio gated by `pv_free/pv_pro`. Summary wrapped in `SummaryWithCTA` to auto-insert mini Brevo CTA ~30% in.
- `/unlock`: magic-link request (Supabase OTP). Redirect target passed via `next` query.
- `/magic-callback`: verifies OTP (best-effort) and sets `pv_free`, redirects to `next`.
- `/risorse-base`: base resources page (gated by middleware).
- `/pro`, `/abbonati`, `/welcome-pro`: Pro area placeholder + subscription page (checkout stub) + post-success page.
- `/admin`: password-gated dashboard to upload assets.

## Middleware & Gating
- `middleware.ts` guards:
  - `/pro/*` → requires `pv_pro`; else redirect `/abbonati`.
  - `/risorse-base/*` → requires `pv_free` or `pv_pro`; else redirect `/unlock?next=...`.
- Book page audio CTA links to `/unlock?next=/libri/{slug}` if not unlocked.

## Auth & Cookies
- Magic link: `/unlock` calls `supabase.auth.signInWithOtp` with redirect to `/magic-callback?email=...&next=...`. Callback sets `pv_free` (secure only in production). Temp cookies (`pv_magic_email`, `pv_magic_next`) help if provider strips params.
- Pro cookie: set only via `/api/pro-success` (stub). Webhook is a placeholder.

## Admin Dashboard
- Path: `/admin` (guarded by `ADMIN_PASSWORD` env; sets `pv_admin_session`).
- Uploads:
  - MDX → `content/books` + Supabase `books` upsert (frontmatter) + Storage bucket `pv-mdx/books/{filename}`.
  - RAG JSON → `public/rag-json` + Storage `pv-rag/rag/{filename}`.
  - Covers → `public/covers` + Storage `pv-covers/covers/{filename}`.
  - Audio → `public/audio` + Storage `pv-audio/audio/{filename}`.
  - Maps → `public/maps` + Storage `pv-maps/maps/{filename}`.
  - Quiz/templates → `public/quiz` + Storage `pv-quiz/quiz/{filename}`.
- Buckets auto-created if missing. Upload status surfaced via query params.

## Content & Assets
- MDX summaries: `content/books/{slug}.mdx` (frontmatter optional: title, author, pvCategory, coverImage, excerpt/metaDescription).
- Mock data: `data/mock-books.ts` (Italian slugs, e.g., `le-22-leggi-del-marketing`), `data/tools.ts`, `data/mock-dashboard.ts`.
- Covers: `/public/covers/{slug}.jpg|png` (fallbacks include Italian/legacy slugs).
- Audio: `/public/audio/{slug}.mp3|m4a|wav` (same fallback logic).

## Newsletter Forms (Brevo)
- Footer form: compact inline form + checkbox + recaptcha; posts to Brevo URL; scripts loaded via `next/script` in `Footer`.
- Inline mini CTA: `components/CTA/NewsletterMiniCTA.tsx` (email, opt-in) auto-inserted by `components/SummaryWithCTA.tsx` at ~30% of summary content.

## Styles & Palette
- Primary/navy: `#0F172A`; Secondary/gold: `#D4AF37`; Background: `#FAFAF9`; Muted text: `#64748B`; Borders: `#E2E8F0`; Accents: info `#3B82F6`, success `#10B981`, warning `#F59E0B`, danger `#EF4444`.
- Article/content classes in `app/globals.css`; footer forms use inline styles matching palette.

## Supabase & Stripe Notes
- Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for admin upserts/storage), `ADMIN_PASSWORD`. Stripe vars exist but flows are stubbed (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`).
- Magic link redirect must be whitelisted in Supabase Auth: add `http://localhost:3000/magic-callback` (and prod equivalent).
- Stripe checkout/webhook currently placeholders; no live payments.

## Removed Boilerplate
Legacy/unused boilerplate files (Stripe/drizzle/auth helpers) were removed to keep builds clean. Pricing/templates directories were deleted. If you need those patterns, re-import from source but ensure deps exist.

## Known Behaviors / Caveats
- Audio/cover resolution tries Italian and legacy slugs; ensure filenames match slugs.
- Local file writes won’t persist on read-only hosts; Supabase Storage is used in addition. If deploying, prefer Storage URLs in your renderers if persistence matters.
- Header no longer shows auth status; gating is cookie-based only.
- Mini CTA insertion is based on child count; very short MDX may place it near the start but never as the last node (capped at `total-1`).

## Quick How-To
- Add a new summary: upload `slug.mdx` via /admin (or place in `content/books`), add cover in `/public/covers`, audio in `/public/audio`. Ensure slug in frontmatter matches route.
- Gate base resources: use magic link (`/unlock`); cookie `pv_free` unlocks audio/base pages.
- Pro gating: cookie `pv_pro` (placeholder flow) unlocks `/pro/*`.
- Run dev: `npm run dev`. Build: `npm run build`.

