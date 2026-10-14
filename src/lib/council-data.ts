import 'server-only';
import { publicClient } from './supabase/server';
import { mayor, deputies, councillors, type CouncilMember } from './council';
import { logSupabaseError } from './supabase/diagnostics';
export async function publicCouncil():Promise<CouncilMember[]> {
 const client=publicClient();
 if(!client)return [{...mayor,group:'maire'},...deputies.map(m=>({...m,group:'adjoints'})),...councillors.map(m=>({...m,group:'conseillers'}))];
 const {data,error}=await client.rpc('mairie_conseil_public');
 if(error){logSupabaseError('council',error);throw new Error('Le conseil municipal est temporairement indisponible. Vérifiez la migration 05.');}
 return (data??[]).map((m:{nom:string;fonction:string;groupe:string;photo_id:string|null;age:number|null})=>({name:m.nom,role:m.fonction,group:m.groupe,age:m.age,photo:m.photo_id?`/fichiers/photos/${m.photo_id}`:undefined}));
}
