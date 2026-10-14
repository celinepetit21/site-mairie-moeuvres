-- Copier le CONTENU dans Supabase SQL Editor puis Run.
begin;
create table if not exists public.mairie_conseil_municipal (
 id text primary key,
 nom text not null check(char_length(nom) between 1 and 100),
 fonction text not null check(char_length(fonction) between 1 and 100),
 groupe text not null check(groupe in ('maire','adjoints','conseillers')),
 ordre integer not null default 0 check(ordre between 0 and 1000),
 date_naissance date check(date_naissance between date '1900-01-01' and current_date),
 afficher_age boolean not null default false,
 photo_id uuid references public.mairie_galerie_photos(id) on delete set null,
 actif boolean not null default true
);
alter table public.mairie_conseil_municipal enable row level security;
revoke all on public.mairie_conseil_municipal from anon;
grant select,insert,update,delete on public.mairie_conseil_municipal to authenticated;
drop policy if exists mairie_conseil_admin on public.mairie_conseil_municipal;
create policy mairie_conseil_admin on public.mairie_conseil_municipal to authenticated using(public.mairie_est_administrateur()) with check(public.mairie_est_administrateur());
insert into public.mairie_conseil_municipal(id,nom,fonction,groupe,ordre) values
 ('damien','Damien Plataux','Maire','maire',0),
 ('vincent','Vincent Scafuro','1er adjoint','adjoints',1),
 ('julie','Julie Mionnet','2e adjointe','adjoints',2),
 ('rudy','Rudy Petit','3e adjoint','adjoints',3),
 ('marion','Marion Cappelaere','Conseillère municipale','conseillers',4),
 ('marcelle','Marcelle Guillot','Conseillère municipale','conseillers',5),
 ('noemie','Noémie Lefebvre','Conseillère municipale','conseillers',6),
 ('thibault','Thibault Silvain','Conseiller municipal','conseillers',7),
 ('noah','Noah Soufflet','Conseiller municipal','conseillers',8),
 ('antoine','Antoine Terrasse','Conseiller municipal','conseillers',9)
on conflict(id) do nothing;
-- La table et les dates restent privées. Seul l’âge calculé est exposé.
create or replace function public.mairie_conseil_public()
returns table(id text,nom text,fonction text,groupe text,ordre integer,photo_id uuid,age integer)
language sql stable security definer set search_path = '' as $$
 select c.id,c.nom,c.fonction,c.groupe,c.ordre,
 case when p.statut='publie' and p.published_at<=now() then c.photo_id else null end,
 case when c.afficher_age and c.date_naissance is not null then
 extract(year from age((now() at time zone 'Europe/Paris')::date,c.date_naissance))::integer else null end
 from public.mairie_conseil_municipal c left join public.mairie_galerie_photos p on p.id=c.photo_id
 where c.actif order by c.ordre,c.nom;
$$;
revoke all on function public.mairie_conseil_public() from public;
grant execute on function public.mairie_conseil_public() to anon,authenticated;
commit;
