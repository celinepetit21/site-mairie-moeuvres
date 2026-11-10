-- Inscription publique sans lecture des coordonnées ; gestion réservée à l’administrateur.
create table if not exists public.mairie_abonnements (
 id uuid primary key default gen_random_uuid(),
 canal text not null check (canal in ('email','sms')),
 destination text not null check (length(destination) between 5 and 254),
 sujets text[] not null check (cardinality(sujets) between 1 and 4 and sujets <@ array['alertes','informations','festivites','autres']::text[] and array_position(sujets,null) is null),
 consentement_version text not null check (consentement_version = '2026-11-10'),
 created_at timestamptz not null default now(),
 unique(canal,destination),
 check ((canal='email' and destination=lower(btrim(destination)) and destination ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') or (canal='sms' and destination ~ '^\+33[67][0-9]{8}$'))
);
alter table public.mairie_abonnements enable row level security;
revoke all on public.mairie_abonnements from anon, authenticated;
grant insert (canal,destination,sujets,consentement_version) on public.mairie_abonnements to anon,authenticated;
grant select,delete on public.mairie_abonnements to authenticated;
create policy abonnements_inscription on public.mairie_abonnements for insert to anon,authenticated with check (true);
create policy abonnements_admin_lecture on public.mairie_abonnements for select to authenticated using ((select public.mairie_est_administrateur()));
create policy abonnements_admin_suppression on public.mairie_abonnements for delete to authenticated using ((select public.mairie_est_administrateur()));
