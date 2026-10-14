-- Créez d'abord votre compte dans Supabase > Authentication > Users > Add user.
-- Remplacez l'UUID ci-dessous par l'ID de VOTRE compte (pas son adresse e-mail).
-- Exécutez seulement après 01-schema.sql. Aucun mot de passe n'est stocké ici.
insert into public.mairie_administrateurs_site(id,user_id)
values(true, 'REMPLACER_PAR_UUID_AUTH'::uuid)
on conflict(id) do update set user_id=excluded.user_id;
-- Le même UUID doit être renseigné dans ADMIN_USER_ID sur votre PC et Vercel.
