# Application commune Mœuvres — proposition du 17 octobre 2026

## Première livraison

La route `/projet-application` est une maquette interactive autonome. Elle compare l’accueil habitants et les vues de l’équipe, sur ordinateur et téléphone. Elle ne demande aucun identifiant, n’appelle aucune base, ne crée aucune réservation et n’envoie aucun message. Les choix de profil sont des simulations d’affichage ; ils ne constituent pas un mécanisme d’autorisation. Les liens habitants ouvrent les pages publiques actuelles dans un nouvel onglet.

Cette livraison ajoute uniquement cette route et ce document sur une branche de prévisualisation. Elle ne remplace ni l’accueil en production, ni les connexions actuelles.

## Examen des sources

Sources examinées le 17 octobre : `site-mairie-moeuvres` au commit `ca7e6e60b246eeebd02b91125ad6acee5d1f298b` et `gestion-salle-moeuvres` au commit `b333837b797cb27fa7250d26655b8df7c4a85dca`.

- Les deux applications reposent sur Next.js 16, React 19 et Supabase. Les versions de Next.js, du client Supabase et de Lucide diffèrent : il faudra les aligner et vérifier les modules PDF et natifs.
- Le site public utilise des tables municipales et une authentification administrateur dédiée : session serveur, `ADMIN_USER_ID` et fonction `mairie_est_administrateur`.
- La gestion utilise une autre authentification Supabase, la table `profils`, un champ `actif` et les rôles municipaux `administrateur`, `gestionnaire`, `secretariat`, `consultation`, `locataire`.
- L’AFC possède un droit indépendant, `role_association`. Son fournisseur d’interface accorde les outils aux profils actifs avec le rôle associatif `administrateur` ou `president`. Un rôle municipal n’implique pas un accès AFC.
- Le menu du secrétariat propose pré-réservation, calendrier sans détails nominatifs et facturation. Le menu de consultation propose calendrier et facturation. La navigation n’est pas à elle seule une preuve de protection des données : les politiques SQL/RLS déployées restent à contrôler.
- La gestion possède déjà une application Android Capacitor, pointant vers `commune-moeuvres.vercel.app`, ainsi que des notifications natives. Une maquette web ne remplace pas cette application et ne garantit pas encore les fonctions sur téléphone.
- Le calendrier public lit déjà la base de gestion par une fonction ne renvoyant que les dates et l’indisponibilité. Cette liaison doit être conservée.

## Organisation cible

Un site et une application, avec un espace public et un espace équipe. Conserver les données dans leurs deux bases pendant la transition et garder l’application de gestion comme référence des réservations et profils. L’accueil public ne doit pas charger de composants de gestion ni déclencher de demande de notifications.

| Espace | Chemin cible envisagé | Accès |
| --- | --- | --- |
| Commune, informations publiques | `/` et rubriques actuelles | Public |
| Présentation de la salle | `/salle-des-fetes` | Public |
| Tableau de bord équipe | `/equipe` | Profil actif authentifié |
| Gestion salle | `/equipe/salle` | Droits municipaux existants |
| Gestion AFC | `/equipe/afc` | Droit AFC explicite |
| Édition du site | `/equipe/site` | Droit municipal d’édition explicite |

Les chemins définitifs seront fixés avant migration. Les anciens liens de contrats et dossiers devront rester valides ou être redirigés.

## Le point essentiel : une seule connexion

Les deux projets Supabase ont aujourd’hui des identités distinctes. Partager une adresse de site ou copier des cookies ne suffit pas à partager les sessions. Ne pas accepter un jeton d’un projet comme preuve d’identité de l’autre.

Étape proposée : conserver l’authentification de gestion pour l’équipe ; attribuer séparément l’accès d’édition du site. Préparer ensuite un accès serveur aux contenus municipaux, autorisé après vérification de l’identité de gestion et du droit d’édition explicite. Ne jamais publier de clé privilégiée dans le navigateur. La conception exacte de ce pont et ses autorisations SQL doivent être testées avant raccordement. La connexion administrateur mairie reste fonctionnelle jusqu’à validation de ce remplacement.

## Parcours de regroupement

1. Valider la navigation avec cette maquette. Confirmer les droits souhaités, en distinguant rôle municipal, rôle AFC et édition du site.
2. Préparer une copie d’intégration privée à partir de la gestion. Le code de gestion étant privé, ne pas le copier dans le dépôt public du site mairie. Identifier les collisions de routes (`/`, `/associations`, connexions), styles globaux et alias avant import des composants publics.
3. Implémenter la connexion commune et des contrôles serveur et SQL. Tester les accès directs, comptes inactifs, déconnexion, renouvellement de session, interdiction d’accès entre profils et absence de données nominatives publiques. Contrôler les politiques réellement déployées dans les deux bases, et non seulement le code d’interface.
4. Déplacer les modules par étapes en prévisualisation : pages publiques, gestion salle et documents, AFC, puis édition du site. Conserver les réservations, PDF, pièces et chemins des fichiers. Ne lancer aucune migration de base tant que les sauvegardes et retours arrière n’ont pas été vérifiés.
5. Tester sur téléphone et ordinateur : connexion, création d’une pré-réservation, validation gestionnaire, contrat, états des lieux, facturation, remises et dossier AFC. Vérifier aussi le calendrier public contre les réservations et les documents téléchargés.
6. Tester Capacitor, partage de fichiers et notifications sur Android. Définir l’adresse finale, redirections et configuration native ; une mise à jour APK peut être nécessaire si l’origine chargée change.
7. Après validation de la prévisualisation, basculer vers l’adresse finale en conservant les anciennes applications pour le retour arrière. Examiner ensuite l’intérêt réel d’une fusion des bases.

## Limites de l’examen

L’examen porte sur les fichiers et les profils prévus dans le code, pas sur un audit exhaustif de sécurité. Les politiques de base, comptes réellement attribués, secrets et autorisations Vercel n’ont pas été inspectés. Aucun compte, rôle ni paramètre de production n’est modifié par la maquette.
