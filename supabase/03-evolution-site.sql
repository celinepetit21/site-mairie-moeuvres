-- Mise à jour V2, à exécuter UNE FOIS avant de déployer les nouveaux fichiers.
-- Réexécutable ; conserve les contenus, comptes, buckets et politiques existants.
begin;
alter table public.mairie_parametres_site add column if not exists slogan text not null default 'Petit village, grande énergie';
create table if not exists public.mairie_pages (
 id uuid primary key default gen_random_uuid(),
 titre text not null check(char_length(titre) between 3 and 180),
 resume text not null default '' check(char_length(resume)<=400),
 contenu text not null check(char_length(contenu) between 1 and 30000),
 categorie text not null default 'commune' check(categorie in ('commune','demarches','vie-pratique','associations')),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 photo_id uuid references public.mairie_galerie_photos(id) on delete set null,
 document_id uuid references public.mairie_documents(id) on delete set null,
 check(statut<>'publie' or published_at is not null)
);
create index if not exists mairie_pages_publication on public.mairie_pages(categorie,statut,published_at);
drop trigger if exists mairie_updated on public.mairie_pages;
create trigger mairie_updated before update on public.mairie_pages for each row execute function public.mairie_updated_at();
alter table public.mairie_pages enable row level security;
revoke all on public.mairie_pages from anon,authenticated;
grant select on public.mairie_pages to anon;
grant select,insert,update,delete on public.mairie_pages to authenticated;
drop policy if exists mairie_public_read on public.mairie_pages;
create policy mairie_public_read on public.mairie_pages for select to anon,authenticated using(statut='publie' and published_at<=now());
drop policy if exists mairie_admin_write on public.mairie_pages;
create policy mairie_admin_write on public.mairie_pages for all to authenticated using((select public.mairie_est_administrateur())) with check((select public.mairie_est_administrateur()));
alter table public.mairie_actualites add column if not exists photo_id uuid references public.mairie_galerie_photos(id) on delete set null;
alter table public.mairie_actualites add column if not exists document_id uuid references public.mairie_documents(id) on delete set null;
alter table public.mairie_informations_municipales add column if not exists photo_id uuid references public.mairie_galerie_photos(id) on delete set null;
alter table public.mairie_informations_municipales add column if not exists document_id uuid references public.mairie_documents(id) on delete set null;
alter table public.mairie_evenements add column if not exists photo_id uuid references public.mairie_galerie_photos(id) on delete set null;
alter table public.mairie_evenements add column if not exists document_id uuid references public.mairie_documents(id) on delete set null;
commit;
