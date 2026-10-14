import 'server-only';
import { councilPortraits } from './council-portraits';
import { publicClient } from './supabase/server';
import { mayor, deputies, councillors, type CouncilMember } from './council';
import { logSupabaseError } from './supabase/diagnostics';
export async function publicCouncil():Promise<CouncilMember[]> {
 const client=publicClient();
 if(!client)return [{...mayor,group:'maire'},...deputies.map(m=>({...m,group:'adjoints'})),...councillors.map(m=>({...m,group:'conseillers'}))];
 const {data,error}=await client.rpc('mairie_conseil_public');
 if(error){logSupabaseError('council',error);throw new Error('Le conseil municipal est temporairement indisponible. Vérifiez la migration 05.');}
 return (data??[]).map((m:{id:string;portrait_source?:string;nom:string;fonction:string;groupe:string;photo_id:string|null;age:number|null;metier?:string;presentation?:string})=>({name:m.nom,role:m.fonction,group:m.groupe,age:m.age,profession:m.metier,presentation:m.presentation,photo:m.portrait_source==='pack'?councilPortraits[m.id]:m.photo_id?`/fichiers/photos/${m.photo_id}`:undefined}));
}
