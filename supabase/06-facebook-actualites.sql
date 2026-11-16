-- Ajoute un lien vers la publication Facebook d'origine dans les actualités.
-- Réexécutable : ne modifie aucun contenu existant.
alter table public.mairie_actualites add column if not exists facebook_url text;
