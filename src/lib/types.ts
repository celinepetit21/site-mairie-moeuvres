export const sections = {
  actualites: { title: 'Actualités', singular: 'actualité', table: 'mairie_actualites' },
  informations: { title: 'Informations municipales', singular: 'information', table: 'mairie_informations_municipales' },
  evenements: { title: 'Agenda', singular: 'événement', table: 'mairie_evenements' },
} as const;
export type Section = keyof typeof sections;
export function isSection(value: string): value is Section { return value in sections && Object.hasOwn(sections, value); }
export type Content = {
 id: string; titre: string; resume: string; contenu: string; statut: 'brouillon' | 'publie';
 published_at: string | null; created_at: string; updated_at: string;
 date_debut?: string | null; date_fin?: string | null; lieu?: string;
};
export type AssetKind = 'documents' | 'photos';
export type Asset = { id: string; titre: string; chemin: string; mime_type: string; taille: number; statut: 'brouillon' | 'publie'; published_at: string | null; created_at: string };
export type Settings = { nom_commune: string; adresse: string; telephone: string; email: string; horaires: string; photo_mairie_id: string | null };
