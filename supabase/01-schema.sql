-- Nouveau site uniquement : aucune suppression des anciennes tables.
-- À exécuter dans le SQL Editor du projet Supabase dédié au site.
begin;
create table if not exists public.mairie_administrateurs_site (
 id boolean primary key default true check (id),
 user_id uuid not null unique references auth.users(id) on delete cascade
);
alter table public.mairie_administrateurs_site enable row level security;
revoke all on public.mairie_administrateurs_site from anon, authenticated;
grant select on public.mairie_administrateurs_site to authenticated;
drop policy if exists mairie_admin_self on public.mairie_administrateurs_site;
create policy mairie_admin_self on public.mairie_administrateurs_site for select to authenticated using (user_id = (select auth.uid()));
create or replace function public.mairie_est_administrateur() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.mairie_administrateurs_site where id = true and user_id = (select auth.uid()));
$$;
revoke all on function public.mairie_est_administrateur() from public;
grant execute on function public.mairie_est_administrateur() to anon, authenticated;
create or replace function public.mairie_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
create table if not exists public.mairie_actualites (
 id uuid primary key default gen_random_uuid(), titre text not null check(char_length(titre) between 3 and 180),
 resume text not null default '' check(char_length(resume) <= 400), contenu text not null check(char_length(contenu) between 1 and 30000),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(statut <> 'publie' or published_at is not null)
);
create index if not exists mairie_actualites_publication on public.mairie_actualites(statut,published_at);
drop trigger if exists mairie_updated on public.mairie_actualites;
create trigger mairie_updated before update on public.mairie_actualites for each row execute function public.mairie_updated_at();
create table if not exists public.mairie_informations_municipales (
 id uuid primary key default gen_random_uuid(), titre text not null check(char_length(titre) between 3 and 180),
 resume text not null default '' check(char_length(resume) <= 400), contenu text not null check(char_length(contenu) between 1 and 30000),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(statut <> 'publie' or published_at is not null), date_debut timestamptz, date_fin timestamptz, lieu text not null default '', check(date_fin is null or (date_debut is not null and date_fin >= date_debut))
);
create index if not exists mairie_informations_municipales_publication on public.mairie_informations_municipales(statut,published_at);
drop trigger if exists mairie_updated on public.mairie_informations_municipales;
create trigger mairie_updated before update on public.mairie_informations_municipales for each row execute function public.mairie_updated_at();
create table if not exists public.mairie_evenements (
 id uuid primary key default gen_random_uuid(), titre text not null check(char_length(titre) between 3 and 180),
 resume text not null default '' check(char_length(resume) <= 400), contenu text not null check(char_length(contenu) between 1 and 30000),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(statut <> 'publie' or published_at is not null), date_debut timestamptz not null, date_fin timestamptz, lieu text not null default '', check(date_fin is null or (date_debut is not null and date_fin >= date_debut))
);
create index if not exists mairie_evenements_publication on public.mairie_evenements(statut,published_at);
drop trigger if exists mairie_updated on public.mairie_evenements;
create trigger mairie_updated before update on public.mairie_evenements for each row execute function public.mairie_updated_at();
create table if not exists public.mairie_documents (
 id uuid primary key default gen_random_uuid(), titre text not null check(char_length(titre) between 3 and 180),
 chemin text not null unique, mime_type text not null, taille integer not null check(taille > 0 and taille <= 10485760),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(),
 check(statut <> 'publie' or published_at is not null)
);
create table if not exists public.mairie_galerie_photos (
 id uuid primary key default gen_random_uuid(), titre text not null check(char_length(titre) between 3 and 180),
 chemin text not null unique, mime_type text not null, taille integer not null check(taille > 0 and taille <= 10485760),
 statut text not null default 'brouillon' check(statut in ('brouillon','publie')),
 published_at timestamptz, created_at timestamptz not null default now(),
 check(statut <> 'publie' or published_at is not null)
);
create table if not exists public.mairie_parametres_site (
 id boolean primary key default true check(id), nom_commune text not null default 'Mœuvres',
 adresse text not null default '59400 Mœuvres', telephone text not null default '', email text not null default '',
 horaires text not null default 'Horaires à renseigner',
 photo_mairie_id uuid references public.mairie_galerie_photos(id) on delete set null
);
insert into public.mairie_parametres_site(id) values(true) on conflict(id) do nothing;
alter table public.mairie_actualites enable row level security;
revoke all on public.mairie_actualites from anon, authenticated;
grant select on public.mairie_actualites to anon;
grant select, insert, update, delete on public.mairie_actualites to authenticated;
drop policy if exists mairie_public_read on public.mairie_actualites;
create policy mairie_public_read on public.mairie_actualites for select to anon, authenticated using (statut = 'publie' and published_at <= now());
drop policy if exists mairie_admin_write on public.mairie_actualites;
create policy mairie_admin_write on public.mairie_actualites for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
alter table public.mairie_informations_municipales enable row level security;
revoke all on public.mairie_informations_municipales from anon, authenticated;
grant select on public.mairie_informations_municipales to anon;
grant select, insert, update, delete on public.mairie_informations_municipales to authenticated;
drop policy if exists mairie_public_read on public.mairie_informations_municipales;
create policy mairie_public_read on public.mairie_informations_municipales for select to anon, authenticated using (statut = 'publie' and published_at <= now() and (date_debut is null or date_debut <= now()) and (date_fin is null or date_fin >= now()));
drop policy if exists mairie_admin_write on public.mairie_informations_municipales;
create policy mairie_admin_write on public.mairie_informations_municipales for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
alter table public.mairie_evenements enable row level security;
revoke all on public.mairie_evenements from anon, authenticated;
grant select on public.mairie_evenements to anon;
grant select, insert, update, delete on public.mairie_evenements to authenticated;
drop policy if exists mairie_public_read on public.mairie_evenements;
create policy mairie_public_read on public.mairie_evenements for select to anon, authenticated using (statut = 'publie' and published_at <= now());
drop policy if exists mairie_admin_write on public.mairie_evenements;
create policy mairie_admin_write on public.mairie_evenements for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
alter table public.mairie_documents enable row level security;
revoke all on public.mairie_documents from anon, authenticated;
grant select on public.mairie_documents to anon;
grant select, insert, update, delete on public.mairie_documents to authenticated;
drop policy if exists mairie_public_read on public.mairie_documents;
create policy mairie_public_read on public.mairie_documents for select to anon, authenticated using (statut = 'publie' and published_at <= now());
drop policy if exists mairie_admin_write on public.mairie_documents;
create policy mairie_admin_write on public.mairie_documents for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
alter table public.mairie_galerie_photos enable row level security;
revoke all on public.mairie_galerie_photos from anon, authenticated;
grant select on public.mairie_galerie_photos to anon;
grant select, insert, update, delete on public.mairie_galerie_photos to authenticated;
drop policy if exists mairie_public_read on public.mairie_galerie_photos;
create policy mairie_public_read on public.mairie_galerie_photos for select to anon, authenticated using (statut = 'publie' and published_at <= now());
drop policy if exists mairie_admin_write on public.mairie_galerie_photos;
create policy mairie_admin_write on public.mairie_galerie_photos for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
alter table public.mairie_parametres_site enable row level security;
revoke all on public.mairie_parametres_site from anon, authenticated;
grant select on public.mairie_parametres_site to anon;
grant select, insert, update, delete on public.mairie_parametres_site to authenticated;
drop policy if exists mairie_public_read on public.mairie_parametres_site;
create policy mairie_public_read on public.mairie_parametres_site for select to anon, authenticated using (true);
drop policy if exists mairie_admin_write on public.mairie_parametres_site;
create policy mairie_admin_write on public.mairie_parametres_site for all to authenticated using ((select public.mairie_est_administrateur())) with check ((select public.mairie_est_administrateur()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('mairie-documents','mairie-documents',false,10485760,array['application/pdf']),
 ('mairie-photos','mairie-photos',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists mairie_storage_admin on storage.objects;
create policy mairie_storage_admin on storage.objects for all to authenticated
 using(bucket_id in ('mairie-documents','mairie-photos') and (select public.mairie_est_administrateur()))
 with check(bucket_id in ('mairie-documents','mairie-photos') and (select public.mairie_est_administrateur()));
drop policy if exists mairie_storage_public on storage.objects;
create policy mairie_storage_public on storage.objects for select to anon,authenticated using (
 (bucket_id='mairie-documents' and exists(select 1 from public.mairie_documents d where d.chemin=name and d.statut='publie' and d.published_at <= now()))
 or (bucket_id='mairie-photos' and exists(select 1 from public.mairie_galerie_photos p where p.chemin=name and p.statut='publie' and p.published_at <= now()))
);
commit;
