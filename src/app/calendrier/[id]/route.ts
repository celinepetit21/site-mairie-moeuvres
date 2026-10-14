import { publicClient } from '@/lib/supabase/server';
import { uuid } from '@/lib/validation';
import { calendarFile } from '@/lib/content-tools';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!uuid.safeParse(id).success)return new Response('Introuvable',{status:404});
 const client=publicClient();if(!client)return new Response('Indisponible',{status:503});
 const {data,error}=await client.from('mairie_evenements').select('id,titre,contenu,lieu,date_debut,date_fin').eq('id',id).eq('statut','publie').lte('published_at',new Date().toISOString()).maybeSingle();
 if(error)return new Response('Indisponible',{status:503});if(!data)return new Response('Introuvable',{status:404});
 return new Response(calendarFile(data),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="moeuvres-${id}.ics"`,'Cache-Control':'no-store'}});
}
