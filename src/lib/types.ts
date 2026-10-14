export const pageCategories = { commune: 'La commune', demarches: 'Démarches', 'vie-pratique': 'Vie pratique', associations: 'Associations' } as const;
export type PageCategory = keyof typeof pageCategories;
export function isPageCategory(value: string): value is PageCategory { return Object.hasOwn(pageCategories,value); }
export const sections = {
  pages: { title: 'Pages & rubriques', singular: 'page', table: 'mairie_pages' },
  actualites: { title: 'Actualités', singular: 'actualité', table: 'mairie_actualites' },
  informations: { title: 'Informations municipales', singular: 'information', table: 'mairie_informations_municipales' },
  evenements: { title: 'Agenda', singular: 'événement', table: 'mairie_evenements' },
} as const;
export type Section = keyof typeof sections;
export function isSection(value: string): value is Section { return value in sections && Object.hasOwn(sections, value); }
export type Content = {
 id: string; titre: string; resume: string; contenu: string; statut: 'brouillon' | 'publie';
 published_at: string | null; created_at: string; updated_at: string;
 association_evenements?: {title:string;date:string;label:string;url?:string;photo_id?:string|null}[]|null; facebook_url?:string|null;helloasso_url?:string|null; categorie?: PageCategory; photo_id?: string | null; document_id?: string | null;
 date_debut?: string | null; date_fin?: string | null; lieu?: string;
};
export type AssetKind = 'documents' | 'photos';
export type Asset = { id: string; titre: string; chemin: string; mime_type: string; taille: number; statut: 'brouillon' | 'publie'; published_at: string | null; created_at: string };
import type { Appearance } from './appearance';
export type Settings = { apparence?: Appearance; nom_commune: string; slogan: string; adresse: string; telephone: string; email: string; horaires: string; photo_mairie_id: string | null };
