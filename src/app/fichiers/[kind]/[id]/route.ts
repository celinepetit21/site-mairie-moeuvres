import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/supabase/server';
import { signedAsset } from '@/lib/data';
import { uuid } from '@/lib/validation';
import type { Asset } from '@/lib/types';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{kind:string;id:string}>}){
 const {kind,id}=await params;
 const missing=()=>NextResponse.json({error:'Fichier introuvable'},{status:404,headers:{'Cache-Control':'no-store'}});
 if(!['documents','photos'].includes(kind)||!uuid.safeParse(id).success)return missing();
 const client=publicClient();if(!client)return missing();
 const {data,error}=await client.from(kind==='photos'?'mairie_galerie_photos':'mairie_documents').select('*').eq('id',id).eq('statut','publie').lte('published_at',new Date().toISOString()).maybeSingle();
 if(error||!data)return missing();const url=await signedAsset(data as Asset,kind as 'documents'|'photos');if(!url)return missing();
 const response=NextResponse.redirect(url,307);response.headers.set('Cache-Control','no-store');return response;
}
