import 'server-only';
import { cache } from 'react';
import { defaultAppearance,getAppearance } from './appearance';
import { logSupabaseError } from './supabase/diagnostics';
import { publicClient } from './supabase/server';
import { sections, type Section, type Content, type Asset, type Settings } from './types';
export const defaultSettings: Settings = {nom_commune:'Mœuvres',slogan:'Petit village, grande énergie',adresse:'59400 Mœuvres',telephone:'',email:'',horaires:'Horaires à renseigner',photo_mairie_id:null,apparence:defaultAppearance};
export async function published(section:Section, limit=100): Promise<Content[]> {
 const client=publicClient(); if (!client) return [];
 let query=client.from(sections[section].table).select('*').eq('statut','publie').lte('published_at',new Date().toISOString());
 if(section === 'informations') query=query.or(`date_debut.is.null,date_debut.lte.${new Date().toISOString()}`).or(`date_fin.is.null,date_fin.gte.${new Date().toISOString()}`);
 const sorted = section==='actualites' ? query.order('date_evenement',{ascending:false,nullsFirst:false}).order('published_at',{ascending:false}) : query.order(section==='evenements'?'date_debut':'published_at',{ascending:section==='evenements'});
 const {data,error}=await sorted.limit(limit);
 if(error){logSupabaseError(`contents:${section}`,error);throw new Error('Les contenus municipaux sont temporairement indisponibles.');}
 return (data??[]) as Content[];
}
export const settings=cache(async():Promise<Settings> => {
 const client=publicClient();if(!client)return defaultSettings;
 const {data,error}=await client.from('mairie_parametres_site').select('*').eq('id',true).maybeSingle();
 if(error){logSupabaseError('settings',error);throw new Error('La configuration du site est indisponible.');}
 return data?{...data,apparence:getAppearance(data.apparence)} as Settings:defaultSettings;
});
export async function publicAssets(kind:'documents'|'photos'):Promise<Asset[]> {
 const client=publicClient();if(!client)return [];
 const {data,error}=await client.from(kind==='documents'?'mairie_documents':'mairie_galerie_photos').select('*').eq('statut','publie').lte('published_at',new Date().toISOString()).order('created_at',{ascending:false});
 if(error){logSupabaseError(`assets:${kind}`,error);throw new Error('Les fichiers sont temporairement indisponibles.');}return (data??[]) as Asset[];
}
export async function signedAsset(asset:Asset,kind:'documents'|'photos') {
 const client=publicClient();if(!client)return null;
 const {data,error}=await client.storage.from(`mairie-${kind}`).createSignedUrl(asset.chemin,60);
 if(error)return null;return data.signedUrl;
}
export function dateLabel(value?:string|null) { return value ? new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)) : ''; }

// La date affichée est celle de la manifestation, et jamais celle de sa mise en ligne.
export function newsEventDateLabel(item: Pick<Content, 'date_evenement' | 'date_evenement_fin' | 'periode_evenement'>) {
 if(item.periode_evenement?.trim()) return item.periode_evenement.trim();
 if(!item.date_evenement) return 'Date de l’événement à préciser';
 const format = (day:string) => new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'long',year:'numeric'}).format(new Date(day+'T12:00:00Z'));
 return item.date_evenement_fin ? `Du ${format(item.date_evenement)} au ${format(item.date_evenement_fin)}` : format(item.date_evenement);
}
