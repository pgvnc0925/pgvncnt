# Pagine Vincenti – System Explainer

What this repo is: a Next.js 14 (App Router, TS, Tailwind) marketing/education site that serves MDX book summaries, article content, and tool listings. Access is gated via cookie flags set by a magic-link flow (Supabase OTP) and a placeholder “Pro” flow (Stripe stubs). An admin dashboard writes MDX/assets locally and optionally into Supabase Storage. Most data comes from local content files; no database is required to run locally.

## Stack & Runtime
- Next.js 14 / React 18 / TypeScript, Tailwind (shadcn/ui), lucide icons.
- MDX rendering via `next-mdx-remote/rsc` with `remark-gfm` and `rehype-highlight`.
- Supabase SSR (`@supabase/ssr`) for magic-link auth; optional admin storage via `@supabase/supabase-js`.
- Stripe checkout/webhook handlers are placeholders (no live payment).
- Cookies handle gating (`pv_free`, `pv_pro`, `pv_admin_session`, progress cookies).

## High-Level Architecture
- Content-first: book summaries live in `content/books/*.mdx`; articles in `content/articles/*.mdx|md`. Covers/audio/PDFs live under `public`.
- Render pipeline:
  - `lib/books.ts` and `lib/articles.ts` parse frontmatter + content (gray-matter) and feed routes.
  - Book pages inject CTAs/content via `components/SummaryWithCTA.tsx` and optional frontmatter extras (insights, FAQ, quiz).
  - Article pages render MDX plus related CTAs/FAQ from frontmatter.
- Gating: `middleware.ts` redirects `/pro/*` to `/abbonati` unless `pv_pro`, and `/risorse-base/*` to `/unlock` unless `pv_free` or `pv_pro`.
- Admin: `/admin` (cookie set when `ADMIN_PASSWORD` matches) exposes upload/import flows that write files locally and upsert to Supabase Storage buckets when configured.

## Directory Map (key areas)
- `app/`: Next.js routes and layouts (home, percorsi, libri, risorse, tools, app iframe, unlock/magic-callback, admin, legal pages).
- `components/`: UI (CTA set, cards, layouts, dashboards, admin forms).
- `content/`: Authorable sources (`books/`, `articles/`, `CTA/` text snippets).
- `pv_rag/books/`: RAG-style JSON concept maps (present, not yet consumed).
- `data/`: Static mocks (`tools`, `mock-dashboard`, `mock-books` legacy).
- `lib/`: Parsers/loaders (books, articles), Supabase clients, cookie progress tracker, validation schemas.
- `public/`: Covers, audio, downloads; plus marketing assets.
- `docs/`: Internal dev notes/migration guides/CTA specs.

## Core Flows & Features
- **Home (`app/page.tsx`)**: Hero + two CTA cards (Risorse, App), top-3 books (by rating) using `getAllBooks()`, and a live-feeling dashboard showing library/progress stats sourced from filesystem + cookies.
- **Percorsi (`/percorsi/[level]`)**: Lists books by level (`base|intermedio|avanzato`) from `lib/books`. Base requires `pv_free`/`pv_pro` to access gated resources via middleware; intermedio/avanzato are marked “Prossimamente”.
- **Book pages (`/libri/[slug]`)**:
  - Loads MDX/frontmatter via `getBookWithContent`.
  - Resolves cover (`public/covers/{slug}.jpg|png|jpeg` with fallback) and optional audio (`public/audio/{slug}.{mp3|m4a|wav}`) and PDF (`public/downloads/{slug}.pdf`).
  - Gating: download/audio buttons require `pv_free` or `pv_pro`, else link to `/unlock?next=/libri/{slug}`.
  - Renders summary with `SummaryWithCTA`: either auto-inserts a newsletter CTA ~30% through content or replaces `{{CTA:...}}` markers with components (newsletter, unlock, upgrade-pro, buy-book, tools, download).
  - Supports frontmatter extras: `insightBoxes` (rendered via `InsightBox`), `faqs` (`BookFAQ`), `quiz` (`BookQuiz` interactive client component).
  - Sidebar shows `NextBookCTA` (next book in same level).
  - Tracks views via `/api/track-view` → cookie-based progress in `lib/user-progress`.
- **Articles (`/approfondimenti`)**: `content/articles/*.mdx|md` with frontmatter (`title`, `description`, `publishedAt`, tags, optional `featuredImage`, `ctaBookSlug`, `relatedBooks|Tools`, `amazonAffiliateLink`, `faq`, custom CTA). Rendered with MDX and multiple CTA blocks (tools, related book, related tools, newsletter).
- **Tools (`/tools`)**: Lists static tool metadata from `data/tools.ts` via `ToolCard`; no per-tool routes yet. `/app` embeds `https://marketing-tools.app` in an iframe as the external toolbox.
- **Unlock flow**:
  - `/unlock` client page calls `supabase.auth.signInWithOtp` with redirect to `/magic-callback?email=...&next=...`; sets temp cookies (`pv_magic_email`, `pv_magic_next`) for fallback.
  - `/magic-callback/route.ts` verifies OTP best-effort, sets `pv_free` cookie (180 days), clears temp cookies, and redirects to `next` (default `/risorse-base`).
- **Pro flow**: `/abbonati` page triggers `/api/create-checkout-session` (returns a fake URL). `/api/pro-success` sets both `pv_pro` and `pv_free` cookies then redirects to `/welcome-pro`. Stripe routes under `/api/stripe/*` and `/api/stripe-webhook` are stubs.
- **Admin (`/admin`)**:
  - Guarded by `ADMIN_PASSWORD` env; sets `pv_admin_session` cookie.
  - Dashboard shows stats from `lib/books`.
  - `/admin/books`: lists books from filesystem with preview links; `/admin/books/new` uses `AddBookForm` + `MdxImporter` to build frontmatter, upload cover/audio/PDF, write `content/books/{slug}.mdx` and `public/{covers|audio|downloads}`; if Supabase is configured, also uploads to buckets (`pv-mdx`, `pv-covers`, `pv-audio`) and creates buckets if missing.
  - `/admin/articles`: lists articles; `/admin/articles/new` uses `AddArticleForm` + `ArticleMdxImporter` to generate MDX into `content/articles`.
- **User progress**: `lib/user-progress` stores viewed/unlocked/quizzes/maps in a cookie (`pv_progress`); `BookViewTracker` posts to `/api/track-view` to mark views.

## Content Formats
- **Book MDX** (`content/books/*.mdx`): frontmatter fields in `types/book.ts` (`title`, `slug`, `author`, `level`, `year`, `pvCategory`, `excerpt/metaDescription`, `tags[]`, `coverImage`, `rating/reviewCount`, `readingTimeFull/system`, `amazonLink`, optional `insightBoxes`, `faqs`, `quiz`). Body is freeform MDX; CTA markers optional.
- **Article MD/MDX** (`content/articles`): frontmatter in `types/article.ts`; body markdown.
- **CTA text snippets** (`content/CTA/*.mdx`): static CTA copy; not currently auto-wired into `SummaryWithCTA` (newsletter/markers are used instead).
- **RAG JSON** (`pv_rag/books/*.json`): structured concept maps (validated by `lib/validation` schemas) intended for future tooling; no runtime consumption today.

## API Routes & Middleware
- `/api/track-view` (POST `{slug}`) → calls `markBookViewed` (cookie progress).
- `/api/create-checkout-session` → returns fake checkout URL from `SITE_URL` fallback.
- `/api/pro-success` → sets `pv_pro` and `pv_free`, redirects to `/welcome-pro`.
- `/api/stripe/checkout`, `/api/stripe/webhook`, `/api/stripe-webhook` → stub responses.
- `middleware.ts` → enforces gating on `/pro/*` and `/risorse-base/*`.

## External Integrations & Env Vars
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for admin uploads); magic-link redirect URLs must be allowed in Supabase auth settings.
- Stripe (stubbed): `STRIPE_PRICE_ID`, `SITE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- Admin: `ADMIN_PASSWORD` required to access `/admin`.
- Footer newsletter: Brevo form endpoint + reCAPTCHA script IDs embedded in `components/layout/footer.tsx`.

## Running & Building
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- No database needed locally; books/articles are read from the filesystem. Ensure `public/covers` and `content/books` exist (created on demand by admin flow).

## Gaps / Notes
- Stripe flows are non-functional placeholders; payments/pro access are cookie-based only.
- Tools listed in `data/tools.ts` have no dynamic generation; RAG JSON is unused.
- Auth components under `auth/components` are unused boilerplate for a fuller Supabase auth flow.
- `content/CTA` snippets exist but CTA injection currently relies on newsletter auto-insert or explicit `{{CTA:...}}` markers.
- `strs` file in root appears unused (`bn` placeholder).
