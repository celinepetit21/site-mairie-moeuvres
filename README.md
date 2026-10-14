# Site de la mairie de Mœuvres · nouvelle base

Projet indépendant **site-mairie-moeuvres**. Next.js 16.4, TypeScript strict, Tailwind CSS 4, Supabase Auth/Postgres/Storage et hébergement Vercel. Version de travail destinée d’abord à votre usage personnel.

## Installation sur votre ordinateur (Windows)

1. Installez Node.js 22 LTS ou une version récente compatible (minimum Next.js : 20.9).
2. Décompressez l’archive dans un **nouveau dossier** `site-mairie-moeuvres`. Ne la copiez pas dans `gestion-salle-moeuvres`.
3. Ouvrez le terminal dans le dossier qui contient `package.json`.
4. Lancez :

```bat
npm ci
copy .env.example .env.local
```

Ne lancez pas la commande `copy` si votre `.env.local` existe déjà : modifiez-le directement.

## Supabase : base de données

Utilisez le projet Supabase **dédié au site de la mairie**. Ouvrez SQL Editor, puis exécutez le fichier `supabase/01-schema.sql`.

Ce script crée sept nouvelles tables préfixées `mairie_`, leurs politiques RLS, la fonction d’autorisation et deux buckets privés. Il ne supprime ni ne modifie vos anciennes tables `actualites`, `evenements`, etc. Elles ne sont pas utilisées par cette nouvelle version. Il peut être exécuté une seconde fois sans effacer les nouveaux contenus. Aucun contenu fictif n’est inséré.

Tables :

- `mairie_actualites`
- `mairie_informations_municipales`
- `mairie_evenements`
- `mairie_documents`
- `mairie_galerie_photos`
- `mairie_parametres_site`
- `mairie_administrateurs_site`

## Supabase Auth : votre compte unique

1. Dans Supabase, ouvrez **Authentication → Users → Add user → Create new user**.
2. Créez votre compte avec votre propre adresse e-mail et un mot de passe fort. Confirmez le compte avec l’option de confirmation proposée.
3. Copiez l’**UUID / User UID** de ce compte, et non votre adresse e-mail.
4. Ouvrez `supabase/02-administrateur.sql`, remplacez `REMPLACER_PAR_UUID_AUTH` par cet UUID puis exécutez le fichier dans SQL Editor.
5. Dans les paramètres Authentication, désactivez **Allow new users to sign up** et les connexions anonymes. Gardez le fournisseur Email actif. Aucun écran d’inscription publique n’existe dans le site.
6. Dans URL Configuration, renseignez la Site URL (`http://localhost:3000` pendant le développement, puis l’URL Vercel). Aucun fournisseur social ou lien de connexion par e-mail n’est utilisé par cette version.

La table n’accepte qu’un seul compte à la fois. L’administratrice ne peut pas ajouter elle-même d’autres administrateurs via le site ou l’API. Un changement de compte se fait exclusivement via SQL Editor ; actualisez aussi `ADMIN_USER_ID`.

## Variables d’environnement

Dans `.env.local`, complétez :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_REFERENCE.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=VOTRE_CLE_PUBLIQUE
ADMIN_USER_ID=UUID_DE_VOTRE_COMPTE_AUTH
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Récupérez l’URL et la clé **Publishable** dans la connexion / les paramètres API de Supabase. L’ancienne clé `anon` est également acceptée.

**N’utilisez jamais une clé `service_role`, `sb_secret_...` ou le mot de passe de la base.** Le site n’en a pas besoin. `.env.local` est exclu de Git. `ADMIN_USER_ID` reste une variable serveur, sans préfixe `NEXT_PUBLIC`.

`NEXT_PUBLIC_SITE_URL` est réservé à la future configuration des URL et n’est pas utilisé pour la connexion par mot de passe de cette version.

## Démarrage et premières publications

```bat
npm run dev
```

- Accueil : http://localhost:3000
- Connexion : http://localhost:3000/admin/connexion

Après connexion :

1. **Paramètres du site** : renseignez l’adresse exacte, le téléphone, l’e-mail et les horaires de la mairie. Aucun horaire ou numéro de téléphone n’est inventé.
2. **Documents & photos → Photographies** : importez la photographie de la mairie (JPG, PNG ou WebP), puis choisissez « Publié sur le site » et enregistrez.
3. **Paramètres du site** : sélectionnez cette photo comme photographie de l’accueil. Un fond illustré s’affiche tant qu’aucune photo n’est choisie.
4. **Actualités / Informations / Agenda** : créez vos contenus. Le mode initial est « Brouillon » ; choisissez « Publié » pour les rendre visibles.

Les heures saisies sont celles de Paris. Les informations municipales peuvent avoir une période de visibilité facultative. Les événements ont un début obligatoire et une fin facultative. L’accueil affiche les prochaines dates ; l’agenda conserve les événements publiés passés.

Les textes sont affichés sans HTML, avec leurs retours à la ligne. Pour supprimer un contenu ou un fichier, saisissez `SUPPRIMER` dans la confirmation. Cette suppression est définitive.

## Documents et stockage

Les buckets `mairie-documents` et `mairie-photos` restent **privés**. Un import est d’abord créé en brouillon. Formats : PDF pour les documents ; JPEG, PNG ou WebP pour les photos. Taille maximale : 10 Mo par fichier. SVG et HTML sont refusés ; le serveur vérifie aussi la signature binaire.

Les visiteurs ont accès uniquement aux fichiers dont la fiche est publiée. La route `/fichiers/...` vérifie la publication puis produit une URL signée valable **60 secondes**. Une URL déjà émise peut rester utilisable jusqu’à son expiration après retrait de la publication. Une copie déjà téléchargée ne peut pas être révoquée. Les liens de prévisualisation dans l’administration durent cinq minutes.

Les imports et la suppression de leurs fiches sont compensés en cas d’échec connu, mais Storage et Postgres ne partagent pas une transaction. En cas d’interruption du serveur pendant un import, vérifiez les éventuels fichiers sans fiche dans le bucket. Aucun nettoyage automatique destructif n’est activé.

## Contrôles et compilation

```bat
npm run test
npm run typecheck
npm run build
npm run start
```

Les tests exécutent le SQL dans PGlite (PostgreSQL), avec des rôles Auth/Storage simulés. Ils vérifient l’absence d’accès public aux brouillons, le refus d’écriture pour un autre compte, l’administratrice unique, l’accès Storage et les dates. Ils ne remplacent pas un essai sur le véritable projet Supabase.

Après configuration réelle, vérifiez : connexion, création d’un brouillon, publication, modification, retrait de publication, suppression, import de PDF/photo et affichage public. Essayez aussi une fenêtre privée : `/admin` doit rediriger vers la connexion. Dans le Table Editor, contrôlez que la table d’administrateurs contient uniquement votre UUID.

## Vercel

1. Créez un dépôt Git **distinct** pour `site-mairie-moeuvres` et ajoutez les fichiers de cette archive. Ne committez pas `.env.local`.
2. Importez ce dépôt dans Vercel avec le preset Next.js.
3. Ajoutez les mêmes variables d’environnement à Vercel (Production et Preview selon votre usage). Remplacez `NEXT_PUBLIC_SITE_URL` par l’URL du déploiement.
4. Dans Supabase, actualisez la Site URL après le déploiement.
5. Redéployez après toute modification des variables d’environnement.

Cette livraison n’effectue aucun déploiement. Pour un usage strictement personnel, restez en local ou activez la protection d’accès du déploiement Vercel disponible dans votre compte. **La connexion /admin protège l’administration ; elle ne protège pas les pages publiques du site.** `noindex` empêche l’indexation demandée aux moteurs mais n’est pas un contrôle d’accès.

Avant l’ouverture officielle : complétez les mentions légales et les informations d’accessibilité, vérifiez les droits des photos et les coordonnées, et adaptez `robots` dans `src/app/layout.tsx` si vous souhaitez une indexation publique.

## Repères des fichiers

- `src/lib/supabase/` : clients serveur/public et configuration.
- `src/proxy.ts` : renouvellement de session sur les routes admin.
- `src/lib/auth.ts` : vérification du compte Auth, de l’UUID serveur et de l’autorisation SQL.
- `src/app/admin/actions.ts` : mutations avec contrôle des droits et validation.
- `src/app/admin/(protected)/` : tableau de bord et gestion des contenus/fichiers/paramètres.
- `src/app/(public)/` : accueil et pages publiques alimentés par Supabase.
- `src/app/globals.css` : design responsive vert sauge, mairie et administration.
- `supabase/` : SQL autonome pour ce nouveau site.
- `tests/` : vérifications du SQL et des validations.

## Sources de référence

- Supabase SSR : https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase Storage/RLS : https://supabase.com/docs/guides/storage/security/access-control
- Next.js 16 Proxy : https://nextjs.org/docs/app/api-reference/file-conventions/proxy
