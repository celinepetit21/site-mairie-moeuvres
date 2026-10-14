import 'server-only';
import { publicClient } from './supabase/server';
import { sections, type Section, type Content, type Asset, type Settings } from './types';
export const defaultSettings: Settings = {nom_commune:'Mœuvres',slogan:'Petit village, grande énergie',adresse:'59400 Mœuvres',telephone:'',email:'',horaires:'Horaires à renseigner',photo_mairie_id:null};
export async function published(section:Section, limit=100): Promise<Content[]> {
 const client=publicClient(); if (!client) return [];
 let query=client.from(sections[section].table).select('*').eq('statut','publie').lte('published_at',new Date().toISOString());
 if(section === 'informations') query=query.or(`date_debut.is.null,date_debut.lte.${new Date().toISOString()}`).or(`date_fin.is.null,date_fin.gte.${new Date().toISOString()}`);
 const {data,error}=await query.order(section==='evenements'?'date_debut':'published_at',{ascending:section==='evenements'}).limit(limit);
 if(error) throw new Error('Les contenus municipaux sont temporairement indisponibles.');
 return (data??[]) as Content[];
}
export async function settings():Promise<Settings> {
 const client=publicClient();if(!client)return defaultSettings;
 const {data,error}=await client.from('mairie_parametres_site').select('nom_commune,slogan,adresse,telephone,email,horaires,photo_mairie_id').eq('id',true).maybeSingle();
 if(error) throw new Error('La configuration du site est indisponible.');
 return data as Settings ?? defaultSettings;
}
export async function publicAssets(kind:'documents'|'photos'):Promise<Asset[]> {
 const client=publicClient();if(!client)return [];
 const {data,error}=await client.from(kind==='documents'?'mairie_documents':'mairie_galerie_photos').select('*').eq('statut','publie').lte('published_at',new Date().toISOString()).order('created_at',{ascending:false});
 if(error) throw new Error('Les fichiers sont temporairement indisponibles.');return (data??[]) as Asset[];
}
export async function signedAsset(asset:Asset,kind:'documents'|'photos') {
 const client=publicClient();if(!client)return null;
 const {data,error}=await client.storage.from(`mairie-${kind}`).createSignedUrl(asset.chemin,60);
 if(error)return null;return data.signedUrl;
}
export function dateLabel(value?:string|null) { return value ? new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)) : ''; }
