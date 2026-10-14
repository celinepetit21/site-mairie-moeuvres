# Vérifications de la livraison

- `npm run build` : réussi (Next.js 16.4.0).
- `npm run typecheck` : réussi, TypeScript strict.
- `npm run test` : 5 tests réussis, dont SQL/RLS exécuté dans un moteur PostgreSQL local (PGlite).
- HTTP sans variables Supabase : accueil et pages publiques répondent en 200 ; routes admin testées redirigées en 307 vers la connexion ; lien de fichier inexistant en 404.
- Aucun compte ni aucune clé Supabase réelle présent dans le projet.
- Aucun ancien projet de Mœuvres modifié, aucune table existante supprimée.

Limites : aucun accès à votre véritable Supabase ou Vercel. La connexion avec votre compte, les imports réels et le déploiement doivent être vérifiés après configuration. La vérification visuelle dans un navigateur n’a pas été réalisée ici (moteur Chromium indisponible) ; les mises en page PC/téléphone sont implémentées par media queries mais nécessitent un contrôle sur vos appareils.
