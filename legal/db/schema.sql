-- Estensioni utili (in Supabase pgcrypto è già ok)
create extension if not exists "pgcrypto";

-- Documenti legali versionati (TOS, Privacy, DPA)
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null,                 -- 'tos' | 'privacy' | 'dpa'
  version text not null,              -- '1.0.0'
  pdf_url text not null,              -- public o signed
  pdf_sha256 text not null,
  effective_from timestamptz not null default now(),
  archived_at timestamptz
);

create unique index if not exists legal_documents_slug_version_idx
  on public.legal_documents(slug, version) where archived_at is null;

-- Accettazioni degli utenti
create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_slug text not null,
  document_version text not null,
  document_sha256 text not null,
  method text not null,               -- 'scroll+checkbox' | 'otp+checkbox'
  evidence jsonb not null,            -- {scroll:true, dwell_seconds:8, last_page:7}
  ip text,
  user_agent text,
  accepted_at timestamptz not null default now()
);

create index if not exists legal_acceptances_user_idx
  on public.legal_acceptances(user_id, document_slug, document_version);

-- RLS
alter table public.legal_documents enable row level security;
alter table public.legal_acceptances enable row level security;

-- Policy: tutti possono leggere i documenti legali correnti
create policy if not exists legal_docs_read on public.legal_documents
  for select using (true);

-- Policy: l'utente legge SOLO le proprie accettazioni
create policy if not exists legal_accepts_select on public.legal_acceptances
  for select using (auth.uid() = user_id);

-- Policy: inserimento accettazioni solo per se stessi
create policy if not exists legal_accepts_insert on public.legal_acceptances
  for insert with check (auth.uid() = user_id);
