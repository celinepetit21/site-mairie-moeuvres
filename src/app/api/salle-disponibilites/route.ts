import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logSupabaseError } from '@/lib/supabase/diagnostics';
import { supabaseConfig } from '@/lib/supabase/config';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 const month=request.nextUrl.searchParams.get('mois')??'';
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return NextResponse.json({error:'Mois invalide.'},{status:400});
 const [year,m]=month.split('-').map(Number);const debut=month+'-01';const fin=month+'-'+new Date(Date.UTC(year,m,0)).getUTCDate();
 const base=supabaseConfig();const hallURL=process.env.SALLE_SUPABASE_URL?.trim();const hallKey=process.env.SALLE_SUPABASE_PUBLISHABLE_KEY?.trim();
 if(Boolean(hallURL)!==Boolean(hallKey)){console.error('[Mairie salle] Configuration incomplète : fournir les deux variables SALLE_SUPABASE.');return NextResponse.json({error:'Le calendrier est momentanément indisponible.'},{status:503});}
 const url=hallURL||base?.url;const key=hallKey||base?.key;
 if(!url||!key)return NextResponse.json({error:'Le calendrier sera disponible prochainement. Contactez la mairie pour vérifier une date.'},{status:503});
 try{
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store'})}});
  const {data,error}=await client.rpc('mairie_disponibilites_salle',{p_debut:debut,p_fin:fin});
  if(error){logSupabaseError('hall_public_calendar',error);return NextResponse.json({error:'Le calendrier est momentanément indisponible. Contactez la mairie pour vérifier une date.'},{status:503});}
  if(!Array.isArray(data)||data.length!==new Date(Date.UTC(year,m,0)).getUTCDate()||data.some(r=>typeof r.jour!=='string'||!r.jour.startsWith(month+'-')||typeof r.indisponible!=='boolean'))return NextResponse.json({error:'Calendrier indisponible.'},{status:503});
  return NextResponse.json({jours:data.map(r=>({jour:r.jour,indisponible:r.indisponible}))},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Calendrier indisponible. Contactez la mairie.'},{status:503});}
}
